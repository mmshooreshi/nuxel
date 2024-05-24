<template>
  <UContainer>
    <UCard class="my-2" v-if="taskRequest.job">
      <template #header>
        <div class="-mt-3 h-1">JOB</div>
      </template>
      <div class="h-max">
        <vue-json-pretty :data="taskRequest.job" :deep="1" :showLineNumbers="false" />
      </div>
    </UCard>

    <UCard class="my-2" v-if="taskRequest.description">
      <template #header>
        <div class="-mt-3 h-1">DESCRIPTION</div>
      </template>
      <div class="h-max">
        <vue-json-pretty :data="parseJSON(taskRequest.description)" :deep="1" :showLineNumbers="false" />
      </div>
    </UCard>

    <div class="mt-4">
      <UButton @click="showTerminal">View Stream</UButton>
      <UButton @click="cancelTask" class="ml-2" color="red">Cancel</UButton>
    </div>

    <TerminalOverlay v-if="isTerminalVisible" :taskRequest="taskRequest" @close="isTerminalVisible = false" />
  </UContainer>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import TerminalOverlay from '~/components/TerminalOverlay.vue'
import useCentralEventSource from '~/composables/useCentralEventSource'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const props = defineProps({
  taskRequest: Object
})

const { archivedTasks } = useCentralEventSource()
const isTerminalVisible = ref(false)

const showTerminal = () => {
  isTerminalVisible.value = true
}

const cancelTask = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:3000/api/producer/stream-logs/${props.taskRequest._id}`, { cancel: 'true' })
    console.log('Task canceled:', response.data)
  } catch (error) {
    console.error('Error canceling task:', error)
  }
}

const parseJSON = (str, defaultValue = {}) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error('Parsing error:', e)
    return defaultValue
  }
}

// Watch for changes in archivedTasks to update the taskRequest
watch(archivedTasks, (newArchiveTasks) => {
  const updatedTask = newArchiveTasks.find(task => task._id === props.taskRequest._id)
  if (updatedTask) {
    Object.assign(props.taskRequest, updatedTask)
  }
})
</script>

<style scoped>
/* Add any scoped styles here */
</style>
