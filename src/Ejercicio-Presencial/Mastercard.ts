import {Comision} from "./Comision_Interface";

/**
 * Clase del metodo de pago Mastercard que implementa la interfaz comision.
 */
export class Mastercard implements Comision {
    /**
     * Metodo para calcular la comision del metodo de pago Matercard (5%)
     * @param precio Precio del producto
     * @returns Precio + la el resultado de la comision de 5%.
     */
    aplicarComision(precio: number) : number {
      return precio + (precio * 0.05);
    }
  }