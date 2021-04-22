import {Comision} from "./Comision_Interface";

/**
 * Clase para calcular la comision del metodo de pago Paypal (3%)
 */
export class Paypal implements Comision {
        /**
     * Metodo para calcular la comision del metodo de pago Paypal (3%)
     * @param precio Precio del producto
     * @returns Precio + la el resultado de la comision de 3%.
     */
    aplicarComision(precio: number) : number {
      return precio + (precio * 0.03)
    }
  }