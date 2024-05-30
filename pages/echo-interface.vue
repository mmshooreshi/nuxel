<template>
    <div class="fixed flex h-full min-h-screen flex-col items-center justify-between bg-[#454953] pb-8 pt-4 px-4 text-neutral-200 sm:px-10 space-y-4 w-full">
      <Head>
        <title>Code Translator</title>
        <meta name="description" content="Use AI to translate code from one language to another." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <div class="flex w-full justify-between items-center space-x-6 mx-0">
        <ModelSelect :model="model" @change="setModel" />
        <APIKeyInput :apiKey="apiKey" @change="handleApiKeyChange" />
        <div class="w-full"></div>
        <TemperatureSelect :temperature="temperature" @change="setTemperature" />
      </div>
  
      <div class="flex w-full justify-between items-center space-x-2 mx-0">
        <button class="w-[140px] cursor-pointer rounded-md px-4 py-2 font-bold"
          :class="loading ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' : 'bg-violet-500 hover:bg-violet-600 active:bg-violet-700'"
          @click="handleButtonClick">
          {{ loading ? 'Cancel' : 'Translate' }}
        </button>
        <div class="text-center text-xs">
          {{ loading ? 'Translating...' : hasTranslated ? 'Output copied to clipboard!' : 'Enter some code and click "Translate"'}}
        </div>
      </div>
  
      <div class="flex w-full max-w-[2200px] flex-col sm:flex-row sm:space-x-4 justify-between">
        <div class="flex min-h-[300px] flex-col justify-center space-y-2 sm:w-2/4">
          <LanguageSelect :language="inputLanguage" @change="setInputLanguage" />
          <TextBlock v-model:text="inputCode" :editable="true" />
        </div>
        <div class="flex min-h-[300px] flex-col justify-center space-y-2 mt-8 sm:mt-0 sm:w-2/4">
          <LanguageSelect :language="outputLanguage" @change="setOutputLanguage" />
          <TextBlockParsed v-model:outputCode="outputCode" :editable="false" />
          <!-- <TextBlock v-model:text="outputCode" :editable="false" /> -->

        </div>
      </div>
  
      <div class="flex w-full justify-center h-28">
        <!-- <OutputCodeDisplay :outputCode="outputCode" /> -->
        <OutputCodeDisplay @click="copySelected"  v-model:outputCode="outputCode" />
        <!-- <button @click="copySelected" class="bg-green-500 text-white text-sm rounded">Copy</button> -->

        <TextBlock v-model:text="inputPrompt" :editable="true" />
      </div>
  
      <div class="relative w-full z-20 transition-all duration-300 rounded-xl" :class="{ 'overflow-hidden': !jsonViewerShown }">
        <button @click="toggleJsonViewer" class="absolute top-1 right-2 px-3 text-white rounded-md bg-black/50 hover:bg-blue-600/50 focus:outline-none z-40">
          {{ jsonViewerShown ? 'Collapse' : 'Expand' }} JSON Viewer
        </button>
        <div class="h-full overflow-auto pt-0 px-0">
          <JsonEditorVue v-model="json2validate" class="jse-theme-dark" />
        </div>
      </div>
  
      <div v-if="jsonViewerShown" class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
        <div class="relative w-full h-full bg-black p-4 fixed -mt-8">
          <button @click="toggleJsonViewer" class="absolute top-4 right-8 p-1 m-2 text-white rounded-md bg-black/50 hover:bg-blue-600/50 focus:outline-none z-40">
            Collapse JSON Viewer
          </button>
          <div class="h-full overflow-auto pt-10 px-4">
            <JsonEditorVue v-model="json2validate" class="jse-theme-dark" />
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
import { ref, onMounted, watch } from 'vue';
import APIKeyInput from '~/components/APIKeyInput.vue';
import LanguageSelect from '~/components/LanguageSelect.vue';
import ModelSelect from '~/components/ModelSelect.vue';
import TextBlock from '~/components/TextBlock.vue';
import TextBlockParsed from '~/components/TextBlockParsed.vue';
import { Vue3JsonEditor } from 'vue3-json-editor'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import OutputCodeDisplay from '~/components/OutputCodeDisplay.vue';


const json2validate = ref({ "foo": "value1", "bar": "value2" })
const inputCode = ref('Enter ECHO here ;D');
const inputPrompt = ref('Write your Input here...')
const outputCode = ref('{"language": "","rawcode": "","sections": [{},{},{}]}');
const inputLanguage = ref('Echo');
const outputLanguage = ref('Python');
const model = ref('gpt-4o');
const temperature = ref(0.7);
const loading = ref(false);
const hasTranslated = ref(false);
const apiKey = ref('');
let abortController = new AbortController();
const jsonViewerShown = ref(false)

const toggleJsonViewer = () => {
    jsonViewerShown.value = !jsonViewerShown.value;
}

onMounted(() => {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && jsonViewerShown.value) {
        toggleJsonViewer();
      }
    });
  });


  const copySelected = () => {
      if (!outputCode.value) {
        alert('No sections to copy');
        return;
      }

      try {
        const parsedOutput = JSON.parse(outputCode.value);
        console.log(parsedOutput)
        const selectedSections = parsedOutput.sections.filter(section => section.selected);
        const removedSections = parsedOutput.sections.filter(section => section.removed);

        let textToCopy = '';
        textToCopy += 'This is the code you wrote:\n\`\`\`\n';
        textToCopy += parsedOutput.rawcode+`\n\`\`\`\n\n`

        if (selectedSections.length > 0) {
          textToCopy += '\nSections of the code i liked:\n\`\`\`\n';
          selectedSections.forEach(section => {
            textToCopy += `${section.code}\n`;
          });
          textToCopy += `\`\`\``
        }

        if (removedSections.length > 0) {
          textToCopy += '\nSections of the code i didn\'t like:\n\`\`\`\n';
          removedSections.forEach(section => {
            textToCopy += `${section.code}\n`;
          });
          textToCopy += `\`\`\``
        }

        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            console.log("textToCopy",textToCopy)
            console.log("parsedOutput",parsedOutput)
            console.log("selectedSections",selectedSections)
            console.log("removedSections",removedSections)
            // alert('Copied to clipboard');
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      } catch (error) {
        console.error('Failed to parse outputCode', error);
      }
    };


    const handleTranslate = async () => {
    const maxCodeLength = model.value === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (!apiKey.value) {
        alert('Please enter an API key.');
        return;
    }

    if (inputLanguage.value === outputLanguage.value) {
        alert('Please select different languages.');
        return;
    }

    if (!inputCode.value) {
        alert('Please enter some code.');
        return;
    }

    if (inputCode.value.length > maxCodeLength) {
        alert(`Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.value.length} characters.`);
        return;
    }

    loading.value = true;
    outputCode.value = '';
    abortController = new AbortController();

    const body = {
        inputLanguage: inputLanguage.value,
        outputLanguage: outputLanguage.value,
        inputCode: inputCode.value,
        inputPrompt: inputPrompt.value,
        json2validate: json2validate.value,
        model: model.value,
        apiKey: apiKey.value,
        temperature: temperature.value
    };

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: abortController.signal
        });

        localStorage.setItem('inputCode', inputCode.value);
        localStorage.setItem('inputPrompt', inputPrompt.value);
        localStorage.setItem('json2validate', JSON.stringify(json2validate.value));

        
        

        if (!response.ok) {
            loading.value = false;
            alert('Something went wrong.');
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let code = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);

            code += chunkValue;
            outputCode.value += chunkValue;
        }

        loading.value = false;
        hasTranslated.value = true;
        localStorage.setItem('outputCode', outputCode.value);


        copyToClipboard(code);
    } catch (error) {
        loading.value = false;
        if (error.name === 'AbortError') {
            // alert('Translation cancelled.');
        } else {
            // alert('Something went wrong.');
        }
    }
};

const cancelTranslation = () => {
    if (abortController) {
        abortController.abort();
        loading.value = false;
    }
};

const handleButtonClick = () => {
    if (loading.value) {
        cancelTranslation();
    } else {
        handleTranslate();
    }
};

const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const handleApiKeyChange = (value) => {
    apiKey.value = value;
    localStorage.setItem('apiKey', value);
};

const setModel = (value) => {
    model.value = value;
};

const setTemperature = (value) => {
    temperature.value = value;
};

const setInputLanguage = (value) => {
    inputLanguage.value = value;
};

const setOutputLanguage = (value) => {
    outputLanguage.value = value;
};


onMounted(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedInputCode = localStorage.getItem('inputCode');
    const storedInputPrompt = localStorage.getItem('inputPrompt');
    const storedJson2validate = localStorage.getItem('json2validate');
    
    const storedOutputCode = localStorage.getItem('outputCode');
    console.log(storedInputCode, storedOutputCode)
    if (storedApiKey) {
        apiKey.value = storedApiKey;
    }

    if (storedInputCode) {
        inputCode.value = storedInputCode;
    }

    if (storedInputPrompt) {
        inputPrompt.value = storedInputPrompt;
    }
    if ( storedJson2validate) {
        try{
        json2validate.value = JSON.parse(storedJson2validate);
    } catch {
        localStorage.setItem('json2validate','{ "foo": "value1", "bar": "value2" }')

    }
    }

    if (storedOutputCode) {
        outputCode.value = storedOutputCode;
    }
});

watch(outputLanguage, () => {
    if (hasTranslated.value) {
        handleTranslate();
    }
});
</script>
