import { environment } from "src/environments/environment";

 

export const EndPoint = {
    tokenApi: `${environment.ApiPronovel.apiUrl}/auth/generar`,
    regenerarTokenApi: `${environment.ApiPronovel.apiUrl}/auth/regenerar`,
    login: `${environment.ApiPronovel.apiUrl}/pronobel/usuario`,
    categorias: `${environment.ApiPronovel.apiUrl}/pronobel/categorias`,
    productos: `${environment.ApiPronovel.apiUrl}/pronobel/productos`,
    productos2: `${environment.ApiPronovel.apiUrl}/producto/get`,
    productosMongoDB: `${environment.ApiPronovel.apiUrl}/producto/get-productos`,
    ultimasCompras: `${environment.ApiPronovel.apiUrl}/pronobel/productos/ultimas_ventas/(codprod)/(rutcli)`,
    envioPedido: `${environment.ApiPronovel.apiUrl}/pronobel/pedido`,
    clientes: `${environment.ApiPronovel.apiUrl}/pronobel/usuario/clientes/`,
    promociones: `${environment.ApiPronovel.apiUrl}/pronobel/cliente/precios/`,
    savePedido: `${environment.ApiPronovel.apiUrl}/pedido/save-pedido/`,
    updatePedido: `${environment.ApiPronovel.apiUrl}/pedido/update-pedido/`,
    eliminarPedido: `${environment.ApiPronovel.apiUrl}/pedido/delete-pedido/(npedido)/`,
    getPedidosForParams: `${environment.ApiPronovel.apiUrl}/pedido/get-pedidos-by-usr/`

};
