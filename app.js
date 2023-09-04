const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

/**
 * ChatGPT
 */
const ChatGPTClass = require("./chatgpt.class");
const chatGPT = new ChatGPTClass();

/**
 * Flows
 */
const flowCatalogo = require("./flows/flowCatalogo");
const { flowPedido } = require("./flows/flowPedido");

const flowPrincipal = addKeyword(['frutteto'])
    .addAnswer(['🙌 Hola bienvenido a Frutteto','En que puedo ayudarte ?'])
    .addAnswer(['1. Ver catalogo de precios','2. Realizar un pedido'],
    null,
    null,
    [flowCatalogo,flowPedido(chatGPT)]
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
