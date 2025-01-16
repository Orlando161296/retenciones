export interface Factura {
  numeroFactura: string;
  numeroControl: string;
  baseImponible: number;
  porcentaje: number;
  ivaRate: number;
  fechaFactura: string;
  calculos?: {
    iva: number;
    withheldTax: number;
    totalInvoice: number;
    totalPayable: number;
  };
}
