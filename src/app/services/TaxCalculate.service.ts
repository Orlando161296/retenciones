import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxServiceService {

   IVA: number = 0.16;
  totalIVA: number = 0;

  calculateIVA(baseImponible: number, porcentaje: number): number {
   this.totalIVA = (baseImponible * this.IVA) * porcentaje ;
    console.log(this.totalIVA);
    return this.totalIVA
  }

  calculateInvoice(baseImponible: number ):number{

    let suma = baseImponible + this.totalIVA;
    console.log(suma);

    return suma
  }


}
