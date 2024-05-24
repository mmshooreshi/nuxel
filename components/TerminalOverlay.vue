<template>
  <div class="overlay">
    <div class="terminal">
      <h3>Stream Output for {{ taskRequest.model }}: {{ taskRequest.id }}</h3>
      <pre>{{ streamContent }}</pre>
      <UButton @click="close" class="mt-2">Close</UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, defineEmits } from 'vue'
import useCentralEventSource from '~/composables/useCentralEventSource'

const props = defineProps({
  taskRequest: Object
})
const emit = defineEmits(['close'])

const streamContent = ref('')
const { filterDataById, activeTasks } = useCentralEventSource()

const close = () => {
  emit('close')
}

watchEffect(() => {
  const filteredData = filterDataById(props.taskRequest.id)
  streamContent.value = filteredData.map(event => `${event.description || ''}\n`).join('')
})
</script>

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
