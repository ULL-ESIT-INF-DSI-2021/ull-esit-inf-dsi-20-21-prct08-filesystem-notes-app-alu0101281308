import {Comision} from "./Comision_Interface";

/**
 * Clase para calcular la comision de stripe (1%), Este seria un ejemplo de un metodo de pago agregado a futuro.
 */
export class Stripe implements Comision {
    /**
     * Metodo para calcular la comision del metodo de pago Stripe (1%)
     * @param precio Precio del producto
     * @returns Precio + la el resultado de la comision de 1%.
     */
    aplicarComision(precio: number) : number {
      return precio + (precio * 0.01);
    }
  }