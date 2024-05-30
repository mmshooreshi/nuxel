<template>
  <div>
    <input
      class="h-[40px] w-[220px] rounded-xl bg-[#1F2937] px-4 py-2 text-neutral-200"
      type="password"
      placeholder="OpenAI API Key"
      :value="apiKey"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  apiKey: String,
  onChange: Function
});

const handleInput = (event) => {
  if (props.onChange) {
    props.onChange(event.target.value);
  }
};
</script>
