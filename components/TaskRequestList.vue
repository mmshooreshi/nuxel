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
          <UButton  @click="cancelTask(taskRequest)" class="mr-1" color="red">X</UButton>
          <UButton @click="selectTaskRequest(taskRequest)" class="w-[95%] text-left">
            {{ taskRequest.id }}: {{ truncate(taskRequest.description, 70) }}

          </UButton>

          <TaskRequestDetail v-if="selectedTaskRequest" :taskRequest="selectedTaskRequest" />
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'
import TaskRequestDetail from '~/components/TaskRequestDetail.vue'
import useCentralEventSource from '~/composables/useCentralEventSource'
import axios from 'axios'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const parseJSON = (str, defaultValue = {}) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error('Parsing error:', e)
    return defaultValue
  }
}

const { activeTasks: taskRequests } = useCentralEventSource()
const selectedTaskRequest = ref(null)

const selectTaskRequest = (taskRequest) => {
  if (selectedTaskRequest.value == null){
    selectedTaskRequest.value = taskRequest
  } else{
    selectedTaskRequest.value = null
  }
  
}

const cancelTask = (task) => {
  axios.put(`http://127.0.0.1:3000/api/producer/stream-logs/${task._id}`, { cancel: 'true' })
    .then(response => {
      console.log('Task canceled:', response.data)
    })
    .catch(error => {
      console.error('Error canceling task:', error)
    })
}


const truncate = (input, length) => {
  const string = typeof input === 'string' ? input : JSON.stringify(input)
  return string.length > length ? string.substring(0, length) + '...' : string
}

// Watch for changes in taskRequests and update the selectedTaskRequest
watch(taskRequests, (newTaskRequests) => {
  if (selectedTaskRequest.value && !newTaskRequests.find(tr => tr._id === selectedTaskRequest.value._id)) {
    selectedTaskRequest.value = null
  }
})
</script>

<style scoped>
/* Add any scoped styles here */
</style>
