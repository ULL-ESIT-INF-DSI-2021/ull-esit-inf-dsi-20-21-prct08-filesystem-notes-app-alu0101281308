import {Comision} from "./Comision_Interface";

/**
 * Clase para la creacion de productos.
 */
export class Producto {

    /**
     * 
     * @param nombre Nombre del producto.
     * @param precio Precio del producto.
     * @param metodo_pago Metodo de pago que se va a usar para pagar. 
     */
    constructor(private nombre: string, private precio: number, private metodo_pago: Comision) {
    }
  
    /**
     * Meotodo que regresa el nombre del producto.
     * @returns Nombre del producto.
     */
    getNombre() : string {
        return this.nombre;
    }

    /**
     * Metodo que cambia el metodo de pago con que se compra el producto.
     * @param metodo_pago Metodo de pago a usar.
     */
    setMetodoPago(metodo_pago: Comision) {
      this.metodo_pago = metodo_pago;
    }
  
    /**
     * Metodo que procede a hacer la compra, calcula la comision y devuelve el total a pagar.
     * @returns Precio final con la comision agregada segun su metodo de pago.
     */
    comprar() : number {
      return this.metodo_pago.aplicarComision(this.precio);
    }
  }