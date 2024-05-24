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
        <vue-json-pretty :data="taskRequest.description" :deep="1" :showLineNumbers="false" />
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
import ActionList from '~/components/ActionList.vue'
import TerminalOverlay from '~/components/TerminalOverlay.vue'
import useCentralEventSource from '~/composables/useCentralEventSource'
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

const props = defineProps({
  taskRequest: Object
})

console.log(props.taskRequest)

const { activeTasks, archivedTasks } = useCentralEventSource()

const isTerminalVisible = ref(false)

const showTerminal = () => {
  isTerminalVisible.value = true
}

const cancelTask = () => {
  axios.put(`http://127.0.0.1:3000/api/producer/stream-logs/${props.taskRequest._id}`, { cancel: 'true' })
    .then(response => {
      console.log('Task canceled:', response.data)
    })
    .catch(error => {
      console.error('Error canceling task:', error)
    })
    // console.log(props.taskRequest, archivedTasks.value)
    // archivedTasks.value = props.taskRequest.filter(item => item.cancel !== 'true')
}

// Watch for changes in activeTasks to update the taskRequest
watch(activeTasks, (newActiveTasks) => {
  const updatedTask = newActiveTasks.find(task => task._id === props.taskRequest._id)
  if (updatedTask) {
    Object.assign(props.taskRequest, updatedTask)
  }
})
</script>

<style scoped>
/* Add any scoped styles here */
</style>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.terminal {
  background: #000;
  color: #00ff00;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  height: 80%;
  overflow: auto;
}

button {
  margin-top: 10px;
}
</style>
