require('dotenv').config();
const { google } = require('googleapis');

function authorize() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes:'https://www.googleapis.com/auth/spreadsheets'
    });
    return auth.getClient();
  }


  async function getDataFromSpreadsheet(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
      const response = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.SPREADSHEET_ID,
        range:"Catalogo"
      });

      const nuevoArray = transformarArrayDeArrays(response.data.values)
  
        return nuevoArray;
    } catch (error) {
      console.error('Error al obtener datos de la hoja de cálculo:', error);
      throw error;
    }
  }

  function transformarArrayDeArrays(arrayDeArrays) {
    const headers = ['producto', 'precio', 'unidMedida', 'ofertar', 'stock'];
    const resultado = arrayDeArrays.map((fila) => {
      const objeto = {};
      headers.forEach((encabezado, indice) => {
        objeto[encabezado] = fila[indice];
      });
      return objeto;
    });
    resultado.shift()
    return resultado;
  }

  function productosDisponibles(productos) {
    const resultado = productos
    .filter((producto) => producto.stock === 'si') // Filtra solo los productos con stock 'si'
    .map((producto) => {
      const { producto: nombre, precio, unidMedida } = producto;
      return `${nombre} $ ${precio} x ${unidMedida}`;
    })
    .join('\n'); // Une los productos con saltos de línea

  return resultado;
  }

// Exporta la función getCatalogo que retorna una promesa con los datos en formato JSON
module.exports.getCatalogo = async function () {
    try {
      const auth = await authorize();
      const jsonData = await getDataFromSpreadsheet(auth);
      const productos = productosDisponibles(jsonData)
      return productos;
    } catch (error) {
      console.error('Error al obtener el catálogo:', error);
      throw error;
    }
  };
