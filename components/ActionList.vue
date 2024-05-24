<template>
  <UContainer>
    <UCard class="mt-4">
      <template #header>
        <h4>Actions</h4>
      </template>
      <ul class="list-disc pl-5">
        <li v-for="action in actions" :key="action.id" class="mb-2">
          {{ action.name }}
          <UButton @click="executeAction(action.id)" class="ml-2">Execute</UButton>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup>
import { defineProps } from 'vue'
import axios from 'axios'

const props = defineProps({
  actions: Array
})

const executeAction = (actionId) => {
  axios.post(`/api/actions/${actionId}/execute`).then(response => {
    console.log('Action executed:', response.data)
  }).catch(error => {
    console.error('Error executing action:', error)
  })
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>
