<template>
<div class="relative">
    <button
    class="absolute right-0 top-0 z-10 rounded bg-[#1A1B26] p-1 text-xs text-white hover:bg-[#2D2E3A] active:bg-[#2D2E3A]"
    @click="copyCode"
    >
    {{ copyText }}
    </button>
    <textarea
    v-model="codeValue"
    :readonly="!editable"
    class="min-h-[500px] w-full bg-[#1A1B26] p-4 text-[15px] text-neutral-200 focus:outline-none"
    style="resize: none"
    @input="updateCode"
    ></textarea>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
code: String,
editable: Boolean,
onChange: Function
});

const codeValue = ref(props.code);
const copyText = ref('Copy');

const copyCode = () => {
navigator.clipboard.writeText(codeValue.value);
copyText.value = 'Copied!';
};

const updateCode = () => {
props.onChange(codeValue.value);
};

watch(copyText, (newValue) => {
if (newValue === 'Copied!') {
    setTimeout(() => {
    copyText.value = 'Copy';
    }, 2000);
}
});
</script>