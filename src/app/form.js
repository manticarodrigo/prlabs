"use client";

import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

async function generateResponse(prompt) {
  const configuration = new Configuration({
    organization: "org-kUlPMn8g8FMJFmV6B1KdUGeU",
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response;
}

export default function Form() {
  const [response, setResponse] = useState(null);
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const prompt = e.target[0].value;
          const response = await generateResponse(prompt);
          setResponse(response.data.choices[0].message.content);
        }}
      >
        <label>
          <span className="block">What&apos;s up?</span>
          <input type="text" placeholder="" className="text-black" />
        </label>
        <button className="block">Submit</button>
      </form>
      {response && (
        <div className="mt-2">
          <h2 className="text-2xl font-bold">Response</h2>
          <p>{response}</p>
        </div>
      )}
    </>
  );
}
