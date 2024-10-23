import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  /**
   * Calcula el IVA sobre una base imponible en base a una tasa de IVA variable.
   * @param baseImponible Monto sobre el que se calcula el IVA.
   * @param ivaRate Tasa de IVA (por ejemplo, 0.16 para el 16%).
   * @returns El monto de IVA calculado.
   */
  calculateIVA(baseImponible: number, ivaRate: number): number {
    return baseImponible * ivaRate;
  }

  /**
   * Calcula la retención de impuestos sobre una base imponible.
   * @param baseImponible Monto sobre el que se calcula la retención.
   * @param withholdingRate Porcentaje de retención aplicado.
   * @param ivaRate Tasa de IVA (por ejemplo, 0.16 para el 16%).
   * @returns El monto de retención calculado.
   */
  calculateWithheldTax(baseImponible: number, withholdingRate: number, ivaRate: number): number {
    const ivaAmount = this.calculateIVA(baseImponible, ivaRate);
    return ivaAmount * (withholdingRate);
  }

  /**
   * Calcula el total de una factura sumando el IVA a la base imponible.
   * @param baseImponible Monto base de la factura.
   * @param ivaRate Tasa de IVA.
   * @returns El total de la factura con IVA incluido.
   */
  calculateInvoiceTotal(baseImponible: number, ivaRate: number): number {
    const ivaAmount = this.calculateIVA(baseImponible, ivaRate);
    return baseImponible + ivaAmount;
  }

  /**
   * Calcula el total a pagar después de aplicar la retención de impuestos.
   * @param baseImponible Monto base de la factura.
   * @param withholdingRate Porcentaje de retención aplicado.
   * @param ivaRate Tasa de IVA.
   * @returns El total a pagar después de retenciones.
   */
  calculateTotalPayable(baseImponible: number, withholdingRate: number, ivaRate: number): number {
    const invoiceTotal = this.calculateInvoiceTotal(baseImponible, ivaRate);
    const withheldTax = this.calculateWithheldTax(baseImponible, withholdingRate, ivaRate);
    return invoiceTotal - withheldTax;
  }

  /**
   * Calcula el impuesto retenido para ISLR.
   * @param baseImponible - La base imponible sobre la que se calcula el impuesto.
   * @param islrPercentage - El porcentaje de ISLR a aplicar (0.01 o 0.02).
   * @returns El monto de ISLR retenido.
   */
  calculateISLR(baseImponible: number, islrPercentage: number): number {
    return baseImponible * islrPercentage;
  }



}
