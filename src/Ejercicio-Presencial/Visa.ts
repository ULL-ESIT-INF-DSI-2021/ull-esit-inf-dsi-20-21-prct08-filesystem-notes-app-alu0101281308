import {Comision} from "./Comision_Interface";

/**
 * Clase para calcular la comision del metodo de pago Visa (6.5%)
 */
export class Visa implements Comision {
    /**
     * Metodo para calcular la comision del metodo de pago Visa (6.5%)
     * @param precio Precio del producto
     * @returns Precio + la el resultado de la comision de 6.5%.
     */
    aplicarComision(precio: number) : number {
      return precio + (precio * 0.065);
    }
  }