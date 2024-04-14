import axios from "axios";
import { CHAT_API_KEY, CHAT_GPT_MODEL, CHAT_API_URL } from "@env";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const context = `
You are a robot that provides SVG image string including the <svg> tag with viewBox="0 0 900 1600" attribute.
- responses only include <path> and <circle>.
- each element fits into the viewBox.
- any <path> the "d" attribute only use M and L commands, always use space, no decimals, replace Z commande with L command pointing to original M command.
- each time a color is provided, use it as the stroke color.

`;

export class ChatGPTService {
  private apiKey: string = CHAT_API_KEY;
  private endpoint: string = CHAT_API_URL;
  private model: string = CHAT_GPT_MODEL;

  async sendMessage(message: string): Promise<string> {
    console.info("====>>> calling", this.endpoint);

    try {
      const response = await axios.post(
        this.endpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: context },
            { role: "user", content: `Create the following svg image:\n\n ${message}` },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error sending message to ChatGPT:", error);
      throw new Error("Failed to send message");
    }
  }
}

export default new ChatGPTService();
