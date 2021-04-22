/**
 * Interfaz para calcular la comision de cada metodo de pago.
 */
export interface Comision {
    aplicarComision(precio: number): number;
  }