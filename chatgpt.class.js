require('dotenv').config();

class ChatGPTClass {
  queue = [];
  optionsGPT = { model: "gpt-3.5-turbo-0301" };
  openai = undefined;

  constructor() {
    this.init().then();
  }

  /**
   * Esta función inicializa
   */
  init = async () => {
    // Importa node-fetch de forma dinámica
    const fetch = (await import('node-fetch')).default;
    const { ChatGPTAPI } = await import("chatgpt");

    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      fetch, // Pasa la función fetch importada
    });
  };

  /**
   * Manejador de los mensajes
   * Su función es enviar un mensaje a WhatsApp
   * @param {*} body
   */
  handleMsgChatGPT = async (body) => {
    const interaccionChatGPT = await this.openai.sendMessage(body, {
      conversationId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].conversationId,
      parentMessageId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].id,
    });

    this.queue.push(interaccionChatGPT);
    return interaccionChatGPT;
  };
}

module.exports = ChatGPTClass;
