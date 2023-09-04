const { addKeyword } = require("@bot-whatsapp/bot");

const { flowPedido } = require("./flowPedido")

const ChatGPTClass = require("./../chatgpt.class");
const chatGPT = new ChatGPTClass();

const { getCatalogo } = require("../api/catalogo.js")

const flowCatalogo = addKeyword("1", { sensitive: true })
  .addAction(
  async (ctx,{flowDynamic}) => {
    const catalogo = await getCatalogo()
    await flowDynamic(catalogo)
  })
  .addAnswer('Si desea realizar el pedido de su mesa envie "pedir" o para salir envie "salir"',
{
    capture: true
},
async (ctx,{provider,endFlow}) => {

     if(ctx.body === "salir"){
        const prov = provider.getInstance()
        const telefono = ctx.from + '@s.whatsapp.net'
        await prov.sendMessage(telefono,{text: "Escribe frutteto para volver a comenzar."})
        return endFlow()
    } 
},[flowPedido(chatGPT)])

module.exports = flowCatalogo;
