<template>
    <select
        class="w-full rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
        v-model="selectedLanguage"
        @change="handleChange"
    >
        <option v-for="language in languages" :key="language.value" :value="language.value">
        {{ language.label }}
        </option>
    </select>
</template>

<script setup>
const props = defineProps({
language: String,
onChange: Function
});

const selectedLanguage = ref(props.language);

const languages = [
{ value: 'Inception1', label: 'Inception1' },    
{ value: 'Inception2', label: 'Inception2' },    
{ value: 'Inception3', label: 'Inception3' },
{ value: 'Echo', label: 'Echo' },
{ value: 'JavaScript', label: 'JavaScript' },
{ value: 'TypeScript', label: 'TypeScript' },
{ value: 'Python', label: 'Python' },
{ value: 'TSX', label: 'TSX' },
{ value: 'JSX', label: 'JSX' },
{ value: 'Vue', label: 'Vue' },
{ value: 'Go', label: 'Go' },
{ value: 'C', label: 'C' },
{ value: 'C++', label: 'C++' },
{ value: 'Java', label: 'Java' },
{ value: 'C#', label: 'C#' },
// { value: 'Pascal', label: 'Pascal' },
// { value: 'Visual Basic .NET', label: 'Visual Basic .NET' },
{ value: 'SQL', label: 'SQL' },
{ value: 'Assembly Language', label: 'Assembly Language' },
{ value: 'PHP', label: 'PHP' },
{ value: 'Ruby', label: 'Ruby' },
{ value: 'Swift', label: 'Swift' },
// { value: 'SwiftUI', label: 'SwiftUI' },
{ value: 'Kotlin', label: 'Kotlin' },
// { value: 'R', label: 'R' },
// { value: 'Objective-C', label: 'Objective-C' },
// { value: 'Perl', label: 'Perl' },
// { value: 'SAS', label: 'SAS' },
// { value: 'Scala', label: 'Scala' },
// { value: 'Dart', label: 'Dart' },
// { value: 'Rust', label: 'Rust' },
// { value: 'Haskell', label: 'Haskell' },
// { value: 'Lua', label: 'Lua' },
// { value: 'Groovy', label: 'Groovy' },
// { value: 'Elixir', label: 'Elixir' },
// { value: 'Clojure', label: 'Clojure' },
// { value: 'Lisp', label: 'Lisp' },
// { value: 'Julia', label: 'Julia' },
// { value: 'Matlab', label: 'Matlab' },
// { value: 'Fortran', label: 'Fortran' },
// { value: 'COBOL', label: 'COBOL' },
{ value: 'Bash', label: 'Bash' },
{ value: 'Powershell', label: 'Powershell' },
// { value: 'PL/SQL', label: 'PL/SQL' },
{ value: 'CSS', label: 'CSS' },
// { value: 'Racket', label: 'Racket' },
{ value: 'HTML', label: 'HTML' },
{ value: 'NoSQL', label: 'NoSQL' },
{ value: 'Natural Language', label: 'Natural Language' },
{ value: 'CoffeeScript', label: 'CoffeeScript' },
];

const handleChange = () => {
props.onChange(selectedLanguage.value);
};
</script>