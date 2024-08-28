import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private readonly IVA_RATE: number = 0.16;

  /**
   * Calcula el IVA sobre una base imponible.
   * @param baseImponible Monto sobre el que se calcula el IVA.
   * @returns El monto de IVA calculado.
   */
  calculateIVA(baseImponible: number ): number {
    return baseImponible * this.IVA_RATE;
  }

  calculateISLR(baseImponible: number, percentaje: number){
    return baseImponible * (percentaje/100)
  }

  /**
   *
   * @param baseImponible
   * @param percentaje
   * @returns
   */
  calculatePercentage( baseImponible: number, percentaje: number ){
   return baseImponible * (percentaje/100);
  }

  /**
   * Calcula la retención de impuestos sobre una base imponible.
   * @param baseImponible Monto sobre el que se calcula la retención.
   * @param withholdingRate Porcentaje de retención aplicado.
   * @returns El monto de retención calculado.
   */
  calculateWithheldTax(baseImponible: number, withholdingRate: number): number {
    const ivaAmount = this.calculateIVA(baseImponible);
    return ivaAmount * withholdingRate;
  }

  /**
   * Calcula el total de una factura sumando el IVA a la base imponible.
   * @param baseImponible Monto base de la factura.
   * @returns El total de la factura con IVA incluido.
   */
  calculateInvoiceTotal(baseImponible: number): number {
    const ivaAmount = this.calculateIVA(baseImponible);
    return baseImponible + ivaAmount;
  }

  /**
   * Calcula el total a pagar después de aplicar la retención de impuestos.
   * @param baseImponible Monto base de la factura.
   * @param withholdingRate Porcentaje de retención aplicado.
   * @returns El total a pagar después de retenciones.
   */
  calculateTotalPayable(
    baseImponible: number,
    withholdingRate: number
  ): number {
    const invoiceTotal = this.calculateInvoiceTotal(baseImponible);
    const withheldTax = this.calculateWithheldTax(
      baseImponible,
      withholdingRate
    );
    const totalPayable = invoiceTotal - withheldTax;
    return totalPayable;
  }
}
