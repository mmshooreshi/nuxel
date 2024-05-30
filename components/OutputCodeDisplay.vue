<template>
  <div
    class="outline outline-solid outline-teal-800/95 outline-2 output-container w-full h-full absolute z-40 overflow-auto top-0 left-0 bg-teal-800/95 p-4 transition-all duration-[200ms]"
    :class="{ 'relative max-h-6 rounded-xl m-2 p-0 w-16 max-w-16 hover:outline-black': isHidden }"
  >
    <button @click="toggleHere" class="-translate-y-3 -translate-x-2">CLICK</button>
    <div class="flex items-center justify-between code-block cursor-pointer">
      <h2>Language: {{ output.language }}</h2>
      <label class="toggle-label mr-2 mb-2">
        <input type="checkbox" v-model="showDescriptions" class="toggle-checkbox" />
        <span class="toggle-slider"></span>
        Show Descriptions
      </label>
    </div>
    <div class="sections p-4">
      <div
        v-for="(section, index) in output.sections"
        :key="index"
        class="section relative group cursor-pointer p-2 m-1"
        :class="{
          'bg-red-700': section.removed,
          'bg-cyan-900 border-cyan-400 border': !section.removed && section.selected,
          'hover:bg-cyan-900': !section.removed
        }"
      >
        <h4
          @click="selectSection(index)"
          class="absolute top-0 left-0 group-hover:block  bg-cyan-700 text-white rounded-md max-h-6 text-xs px-2 m-1" 
          :class="{ 'hidden': !showDescriptions }"
        >
          {{ section.description }}
        </h4>
        <pre class="pt-4">{{ section.code }}</pre>
        <div class="section-buttons absolute bottom-0 left-0 flex space-x-2 p-2 hidden group-hover:flex">
          <button @click="selectSection(index)" class="bg-blue-500 text-white text-xs px-2 py-1 rounded">Select</button>
          <button @click="removeSection(index)" class="bg-red-500 text-white text-xs px-2 py-1 rounded">Mark as Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const isHidden = ref(false);
const showDescriptions = ref(false);
const output = ref({
  language: '',
  rawcode: '',
  sections: [],
});


// Assuming the outputCode is passed as a prop to this component
const props = defineProps({
  outputCode: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['update:outputCode']);


const toggleHere = () => {
  isHidden.value = !isHidden.value;
  emit('update:outputCode', JSON.stringify(output.value));
};



watch(
  () => props.outputCode,
  (newOutputCode) => {
    if (newOutputCode) {
      try {
        const parsedOutput = JSON.parse(newOutputCode);
        output.value = {
          ...parsedOutput,
          sections: parsedOutput.sections.map(section => ({
            ...section,
            selected: false,
            removed: false
          }))
        };
      } catch (error) {
        // console.error('Failed to parse outputCode', error);
      }
    }
  },
  { immediate: true }
);

const selectSection = (index) => {
  output.value.sections[index].selected = !output.value.sections[index].selected;
  output.value.sections[index].removed = false; // Ensure section is not marked as removed
  // emit('update:outputCode', JSON.stringify(output.value));
};

const removeSection = (index) => {
  output.value.sections[index].removed = !output.value.sections[index].removed;
  output.value.sections[index].selected = false; // Ensure section is not selected
  // emit('update:outputCode', JSON.stringify(output.value));
};
</script>

<style scoped>
.output-container {
  font-family: 'Courier New', Courier, monospace;
}

.code-block {
  background: #1e1e1e;
  color: aquamarine;
  border-color: aquamarine;
  border: 1px solid;
  padding-left: 10px;
  padding-top: 8px;
  border-radius: 8px;
}

.sections .section {
  border-radius: 8px;
  position: relative;
}

h2, h3 {
  margin: 0 0 8px 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-slider {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  position: relative;
  transition: background-color 0.2s;
  margin-right: 8px;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}

.toggle-checkbox:checked + .toggle-slider {
  background-color: rgb(82, 159, 171);
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.section-buttons {
  display: none;
}

.group:hover .section-buttons {
  display: flex;
}
</style>
