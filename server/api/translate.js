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
    const messages = [
      {
        role: 'system',
        content: `Translate the following ${inputLanguage} code to ${outputLanguage}\n\nONLY WRITE PURE CODE WITH NO EXTRA TEXTS. YOUR RESPONSE WILL GO DIRECTLY INTO COMPILER.`
      },
      {
        role: 'user',
        content: `inputCode: ${inputCode} \n\nuser guidance and request: ${inputPrompt} \n\n When your code get rendered it must get compiled into this json: ${JSON.stringify(json2validate)}`
      }
    ];
    console.log(messages);

    const response = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: 4000,
      messages,
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
