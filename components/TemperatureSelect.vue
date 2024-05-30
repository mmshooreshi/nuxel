<template>
    <input
      type="range"
      min="0"
      max="2"
      step="0.1"
      class="slider"
      v-model="temperature"
      @input="handleChange"
    />
    <div class="font-bold  min-w-6 overflow-visible">
        {{ temperature }}
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    temperature: Number, // Pass the initial temperature value
    onChange: Function, // Function to handle temperature change
  });
  
  const emit = defineEmits(['update:temperature']);
  
  const temperature = ref(props.temperature);
  
  const handleChange = () => {
    emit('update:temperature', parseFloat(temperature.value));
    props.onChange(parseFloat(temperature.value));
  };
  </script>
  
  <style scoped>
  .slider {
    -webkit-appearance: none;
    width: 150px;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }
  
  .slider:hover {
    opacity: 1;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  </style>
  