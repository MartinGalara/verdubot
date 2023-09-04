let pedidos = {}

const addProps = (from,props) => {
    if(pedidos.hasOwnProperty(from)){
      Object.assign(pedidos[from], props);
    }
    else{
        pedidos[from] = {}
      Object.assign(pedidos[from], props);
    }
  }

  const deletePedidosData = (from) => {
    pedidos[from] = {}
  }

  const getProp = (from,prop) => {
    return pedidos[from][prop]
}

module.exports = {addProps,deletePedidosData,getProp}