<template>
    <div class="relative w-full h-full top-2" ref="container">
      <textarea
        ref="textareaRef"
        class="w-full h-full bg-[#1A1B26] text-[#d1d5db] font-mono text-[15px] p-4 pr-3 resize-none overflow-hidden rounded-lg transition duration-300 ease-in-out outline-0 hover:outline-1 outline-white outline-none hover:bg-[#282a36] hover:text-white hover:outline-[#3bff80] overflow-y-auto"
        :value="text"
        @input="handleInput"
        :readonly="!editable"
        :class="{ 'cursor-pointer': !editable }"
      />

      <!-- Full-screen toggle button -->
      <button
        @click="toggleFullscreen"
        class="absolute top-2 right-2 p-2 text-white bg-gray-900 rounded-md focus:outline-teal hover:outline hover:outline-white focus:bg-teal-800"
        :class="{ 'bg-teal-800': fullscreen }"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <!-- Copy to clipboard button -->
      <button
        @click="copyToClipboard"
        class="absolute top-2 right-12 text-white bg-gray-900 rounded-md focus:outline-teal hover:outline hover:outline-white focus:bg-teal-800"
        :class="{ 'bg-teal-800': showCopyMessage }"
      >
      <div
        ref="copyMessage"
        v-if="showCopyMessage"
        class="text-white text-center rounded h-4 m-2 mt-1 mb-3 animate-fade-out"
      >
        Copied!
      </div>
        <img v-else src="/copy.svg" alt="Copy" class="h-4 w-4 m-2 stroke-cyan-500" />
      </button>
      <!-- Full-screen modal -->
      <div
        v-if="fullscreen"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
        @click.self="toggleFullscreen"
        @keydown.escape="toggleFullscreen"
      >
        <div class="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div class="relative w-screen h-screen p-20" @click="handleClickOutside">
            <textarea
              ref="textareaRef"
              class="relative w-full h-full bg-[#1A1B26] text-[#d1d5db] font-mono text-[15px] p-4 pr-3 resize-none overflow-hidden rounded-lg transition duration-300 ease-in-out outline-0 hover:outline-1 outline-white outline-none hover:bg-[#282a36] hover:text-white hover:outline-[#3bff80] overflow-y-auto"
              :value="text"
              @input="handleInput"
              :readonly="!editable"
              :class="{ 'cursor-pointer': !editable }"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted } from 'vue';
  
  const textareaRef = ref();
  const props = defineProps({
    text: String,
    editable: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['update:text']);
  const showCopyMessage = ref(false);
  const fullscreen = ref(false);
  const container = ref(null);
  
  const handleInput = (event) => {
    emit('update:text', event.target.value);
  };
  
  const toggleFullscreen = () => {
    fullscreen.value = !fullscreen.value;
  };
  
  const closeModal = () => {
    fullscreen.value = false;
  };
  
  const copyToClipboard = () => {
    if (textareaRef.value) {
      textareaRef.value.select();
      document.execCommand('copy');
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 500);
    }
  };
  
  // Listen for escape key press
  onMounted(() => {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && fullscreen.value) {
        closeModal();
      }
    });
  });
  
  const handleClickOutside = (event) => {
    if (fullscreen.value && event.target !== textareaRef.value) {
      closeModal();
    }
  };
  </script>
  
  <style scoped>
  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .animate-fade-out {
    /* animation: fade-out 0.5s forwards; */
  }
  </style>
  