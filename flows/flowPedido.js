const { addKeyword } = require("@bot-whatsapp/bot");
const { readFileSync } = require("fs");
const { join } = require("path");
const delay = (ms) => new Promise((res =>  setTimeout(res, ms)))

const {addProps} = require("../api/auxPedidos")

/**
 * Recuperamos el prompt "TECNICO"
 */
const getPrompt = async () => {
  const pathPrompt = join(process.cwd(), "prompts");
  const text = readFileSync(join(pathPrompt, "01_PEDIDO.txt"), "utf-8");
  return text;
};

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowPedido: (chatgptClass) => {
    return addKeyword(["2","pedir"], {
      sensitive: true,
    })
      .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {

        const jid = ctx.key.remoteJid
        const refProvider = await provider.getInstance()

        await refProvider.presenceSubscribe(jid)
        await delay(500)

        await refProvider.sendPresenceUpdate('composing', jid)

        const data = await getPrompt();

        await chatgptClass.handleMsgChatGPT(data);//Dicinedole actua!!


        const textFromAI = await chatgptClass.handleMsgChatGPT("Hola quiero hacer un pedido"
        );

        setTimeout(() => {
          flowDynamic(textFromAI.text);
        }, 500);
        
      })
      .addAnswer(
        `Aguarde por favor ...`,
        { capture: true },
        async (ctx, { fallBack }) => {
              const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);

              if(!textFromAI.text.includes("INICIO") && !textFromAI.text.includes("FIN")){
                await fallBack(textFromAI.text);
              }
              console.log(textFromAI)
             // addProps(ctx.from,)
        }
      );
  },
};
