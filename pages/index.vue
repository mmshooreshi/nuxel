<template>
  <div>
    <!-- Buttons for toggling between Task Request and Archive views -->
    <div class="flex justify-around mb-4">
      <button @click="activePane = 'task'" class="p-2 border rounded" :class="{'bg-gray-200': activePane === 'task'}">Task Requests</button>
      <button @click="activePane = 'archive'" class="p-2 border rounded" :class="{'bg-gray-200': activePane === 'archive'}">Archive</button>
    </div>

    <!-- Panes -->
    <div class="flex">
      <TaskRequestList v-if="activePane === 'task'" class="w-full" />
      <ArchiveList v-if="activePane === 'archive'" class="w-full" />
    </div>
  </div>
</template>

<script setup>
import TaskRequestList from '~/components/TaskRequestList.vue'
import ArchiveList from '~/components/ArchiveList.vue'

// State to control which pane is active
const activePane = ref('task') // Default to 'task'
</script>

<style scoped>
/* Scoped styles for the page. Adjust as needed */
button {
  transition: background-color 0.3s;
}
</style>