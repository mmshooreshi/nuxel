import { defineEventHandler, readBody, sendStream } from 'h3';
import OpenAI from 'openai';

const OpenAIStream = async ({
  inputLanguage, outputLanguage, inputCode, inputPrompt, json2validate,
  model, apiKey, temperature, signal
}) => {
  console.log('API Key:', apiKey);

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://aisland.co/v1'
  });

  try {
    let example={"language":"python","rawcode":"a = 5\nb = 3\nsum = a + b\na, b = b, a\nprint(f\"Sum: {sum}, After Swap: a={a}, b={b}\")","sections":[{"description":"Define Variables","code":"a = 5\nb = 3"},{"description":"Calculate Sum","code":"sum = a + b"},{"description":"Swap Values","code":"a, b = b, a"},{"description":"Print Result","code":"print(f\"Sum: {sum}, After Swap: a={a}, b={b}\")"}]}
    // example = {}
    const messages = [
      {
        role: 'system',
        content: `Translate the following ${inputLanguage} code to ${outputLanguage}\n\nONLY WRITE PURE CODE WITH NO EXTRA TEXTS. YOUR RESPONSE MUST BE A VALID JSON, like this:  \`\`\`json\n${JSON.stringify(example)}\n\`\`\`. DO NOT ADD ANY OTHER KEYS THAN THESE.`
      },
      {
        role: 'user',
        content: `inputCode: ${inputCode} \n\nuser guidance and request: ${inputPrompt} \n\n`
      }
    ];
    console.log(messages);

    const response = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: 4000,
      messages,
      response_format: {"type": "json_object"},
      stream: true,
    }, { signal });

    if (!response || typeof response[Symbol.asyncIterator] !== 'function') {
      throw new Error('Response body is undefined or not iterable');
    }

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const { choices } = chunk;
          const text = choices[0].delta?.content;
          const finishReason = choices[0].finish_reason;

          if (text) controller.enqueue(text);
          if (finishReason === 'length' || finishReason === 'stop') {
            controller.close();
            break;
          }
        }
      },
    });

    return stream;
  } catch (error) {
    console.error('Error creating OpenAI stream:', error);
    throw error;
  }
};

export default defineEventHandler(async (event) => {
  const abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const {
      inputLanguage, outputLanguage, inputCode, inputPrompt,
      json2validate, model, apiKey, temperature
    } = await readBody(event);

    if (!inputLanguage || !outputLanguage || !inputCode || !model || !apiKey) {
      throw new Error('Missing required parameters');
    }

    console.log('Request received:', {
      inputLanguage, outputLanguage, inputCode, inputPrompt, json2validate, model
    });

    const stream = await OpenAIStream({
      inputLanguage, outputLanguage, inputCode, inputPrompt,
      json2validate, model, apiKey, temperature, signal
    });

    event.node.res.setHeader('Content-Type', 'text/event-stream');
    return sendStream(event, stream);
  } catch (error) {
    console.error('Error in event handler:', error);
    event.node.res.statusCode = 500;
    return 'Error';
  }
});
