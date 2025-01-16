import { Factura } from "./factura.interface";

export interface RetencionFormData {
  nombreResponsable: string;
  numeroRetencion: string;
  periodoFiscal: string;
  nombreFiscal: string;
  rif: string;
  direccionFiscal: string;
  retencion: string;
  facturas: Factura[];
}
