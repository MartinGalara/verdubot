require('dotenv').config();
const { google } = require('googleapis');

function authorize() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes:'https://www.googleapis.com/auth/spreadsheets'
    });
    return auth.getClient();
  }


  async function insertDataToSpreadsheet(auth, data) {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
      const response = await sheets.spreadsheets.values.append({
        auth,
        spreadsheetId: process.env.SPREADSHEET_ID,
        range:"Pedidos!A:E",
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [data]
        }
      });
  
        return response.data;
    } catch (error) {
      console.error('Error al obtener datos de la hoja de cálculo:', error);
      throw error;
    }
  }

// Exporta la función getCatalogo que retorna una promesa con los datos en formato JSON
module.exports.newPedido = async function (data) {
    try {
      const auth = await authorize();
      const jsonData = await insertDataToSpreadsheet(auth, data);
      return jsonData;
    } catch (error) {
      console.error('Error al agregar pedido:', error);
      throw error;
    }
  };