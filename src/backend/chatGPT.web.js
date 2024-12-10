import {fetch} from 'wix-fetch';  // Using Wix's fetch to make HTTP requests
import {webMethod, Permissions} from "wix-web-module";
import {getSecret} from 'wix-secrets-backend'; // For securely storing and accessing API keys

/**
 * Calls OpenAI's ChatGPT-4 API to get a response based on the user's input.
 * @param {string} prompt - The input string from the user to which ChatGPT-4 should respond.
 * @returns {Promise<string>} - The response from ChatGPT-4.
 */
export const getChatGptResponse = webMethod(Permissions.Anyone, async (prompt) => {
    const apiKey = await getSecret("openai_api_key");  // Retrieve your OpenAI API key stored in Wix Secrets
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const body = {
        model: "gpt-4",  // Specify the model, adjust if using a different one
        messages: [{ "role": "user", "content": prompt }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return data.choices ? data.choices[0].message.content : "No response generated.";
    } catch (error) {
        console.error("Failed to fetch response from OpenAI: ", error);
        return `Error: ${error.message}`;
    }
});
