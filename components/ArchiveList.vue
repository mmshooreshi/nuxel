<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h2>Task Requests</h2>
        </div>
      </template>
      <ul class="list-disc pl-5">

        
        <li v-for="taskRequest in taskRequests" :key="taskRequest._id" class="mb-4">
          {{taskRequest.name}}
          <UButton  @click="cancelTask(taskRequest)" class="mr-1" color="red">X</UButton>
          <UButton @click="toggleTaskRequest(taskRequest)" color="gray" class="w-[95%] text-left">
            {{ taskRequest.id }}: {{ taskRequest.extractedInfo }}
          </UButton>
          <ArchiveDetail v-show="selectedTaskRequest && selectedTaskRequest._id === taskRequest._id" :taskRequest="taskRequest" />
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArchiveDetail from '~/components/ArchiveDetail.vue'
import useCentralEventSource from '~/composables/useCentralEventSource'
import axios from 'axios'

const { archivedTasks: taskRequests, fetchJobById } = useCentralEventSource()
const selectedTaskRequest = ref(null)

const getTimeDifference = (timestamp) => {
  const now = new Date()
  const startTime = new Date(timestamp)
  const differenceInSeconds = Math.floor((now - startTime) / 1000)
  const minutes = Math.floor(differenceInSeconds / 60)
  const seconds = differenceInSeconds % 60
  return `${minutes} minutes and ${seconds} seconds ago`
}

const extractTaskInfo = (task) => {
  const id = task.id
  console.log(task)
  const jobName = task
  const startedAgo = getTimeDifference(task.started_at)
  const status = task.status
  return `${id}: ${jobName}, started ${startedAgo}, status: ${status}`
}

const fetchArchivedTasks = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/query/stream-logs')
    const fetchedTasks = await Promise.all(response.data.data.map(async (item) => {
      const task = {
        _id: item._id,
        id: item.id,
        ...item.attributes
      }
      const jobData = await fetchJobById(item.id)
      if (jobData) {
        task.job = jobData
        task.name = jobData.acts
      }
      return task
    }))

    taskRequests.value = [...fetchedTasks]
  } catch (error) {
    console.error('Error fetching archived tasks:', error)
  }
}


onMounted(fetchArchivedTasks)

const toggleTaskRequest = (taskRequest) => {
  if (selectedTaskRequest.value && selectedTaskRequest.value._id === taskRequest._id) {
    selectedTaskRequest.value = null
  } else {
    selectedTaskRequest.value = taskRequest
  }
}

const cancelTask = async (task) => {
  try {
    const response = await axios.put(`http://127.0.0.1:3000/api/producer/stream-logs/${task._id}`, { cancel: 'true' })
    console.log('Task canceled:', response.data)
    fetchArchivedTasks()
  } catch (error) {
    console.error('Error canceling task:', error)
  }
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>
