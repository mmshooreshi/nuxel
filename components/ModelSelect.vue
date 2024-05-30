<template>
    <select
        class="h-[40px] w-[220px] rounded-xl bg-[#1F2937] px-4 py-2 text-neutral-200"
        v-model="selectedModel"
        @change="handleChange"
    >
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="gpt-4o">gpt-4o</option>
        <option value="gpt-4-0125-preview">gpt-4-0125-preview</option>


    </select>
</template>
  
<script setup>
const props = defineProps({
model: String,
onChange: Function
});

const selectedModel = ref(props.model);

const handleChange = () => {
props.onChange(selectedModel.value);
};
</script>