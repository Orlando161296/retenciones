import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SummaryComponent } from '../summary/summary.component';
import { TaxService } from '../../services/TaxCalculate.service';
import { PrintService } from '../../services/PrintService.service';

interface Factura {
  baseImponible: number;
  porcentaje: number;
  ivaRate: number;
  // Propiedad opcional para almacenar los cálculos
  calculos?: {
    iva: number;
    withheldTax: number;
    totalInvoice: number;
    totalPayable: number;
  };
}

interface RetencionFormData {
  nombreResponsable: string;
  numeroRetencion: string;
  periodoFiscal: string;
  nombreFiscal: string;
  rif: string;
  direccionFiscal: string;
  retencion: string;
  facturas: Factura[];
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SummaryComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  public islrOptions = [
    { label: '1%', value: 0.01 },
    { label: '2%', value: 0.02 },
  ];

  public ivaOptions = [
    { label: '16%', value: 0.16 },
    { label: '8%', value: 0.08 },
  ];

  public ivaRetention = [
    { label: '100%', value: 1 },
    { label: '75%', value: 0.75 },
  ];

  retentionForm!: FormGroup;
  totalIVAWithhealTax: number = 0;
  totalInvoiced: number = 0;
  totalPayd: number = 0;
  showSummary: boolean = false;
  totalIVA: number = 0;

  public fb = inject(FormBuilder);
  public printService = inject(PrintService);
  public taxCalculationService = inject(TaxService);
  public periodoFiscal = Array.from({ length: 12 }, (_, i) => ({
    value: `2025-${(i + 1).toString().padStart(2, '0')}`,
  }));
  public calculateIVA: boolean = true;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.retentionForm = this.fb.group({
      nombreResponsable: ['Orlando Rojas', Validators.required],
      numeroRetencion: [
        '58957',
        [Validators.required, Validators.pattern(/^\d{1,5}$/)],
      ],
      periodoFiscal: ['', Validators.required],
      nombreFiscal: ['CECOSESOLA', Validators.required],
      rif: [
        'J-085030140',
        [Validators.required, Validators.pattern(/^([VEJGC]-\d{8,9})$/)],
      ],
      direccionFiscal: ['EL CUJI LAS VERITAS', Validators.required],

      retencion: ['1', Validators.required],
      facturas: this.fb.array([this.createFacturaGroup()]), // Añadir FormArray para facturas
    });
  }
  private createFacturaGroup(): FormGroup {
    return this.fb.group({
      numeroFactura: ['01', Validators.required], // Control para el número de factura
      numeroControl: ['0001', Validators.required], // Control para el número de control
      baseImponible: [1000, [Validators.required, Validators.min(0)]], // Control para base imponible
      porcentaje: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ], // Control para el porcentaje de retención
      ivaRate: ['', Validators.required], // Control para la tasa de IVA
      fechaFactura: ['', Validators.required], // Nuevo campo de fecha con validación requerida
    });
  }

  get facturas(): FormArray {
    return this.retentionForm.get('facturas') as FormArray;
  }

  addFactura(): void {
    if (this.facturas.length <= 4) {
      this.facturas.push(this.createFacturaGroup());
    } else {
      console.error('Máximo de 4 facturas alcanzado');
    }
  }

  removeFactura(index: number): void {
    if (this.facturas.length > 1) {
      this.facturas.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.retentionForm.valid) {
      const formData: RetencionFormData = this.retentionForm.value;

      // Llamar a los servicios para calcular los valores
      this.calculateTotals(formData);

      // Mostrar los resultados si todo está correcto
      this.showSummary = true;
    } else {
      this.logFormErrors();
    }
  }

  private calculateTotals(formData: RetencionFormData): void {
    let totalIVA = 0;
    let totalWithheldTax = 0;
    let totalInvoice = 0;
    let totalPayable = 0;

    // Recorremos cada factura y realizamos los cálculos
    formData.facturas.forEach((factura, index) => {
      const { baseImponible, porcentaje, ivaRate } = factura;

      // Cálculos individuales por factura
      const facturaIVA = this.taxCalculationService.calculateIVA(
        baseImponible,
        ivaRate
      );
      const facturaWithheldTax =
        this.taxCalculationService.calculateWithheldTax(
          baseImponible,
          porcentaje,
          ivaRate
        );
      const facturaTotalInvoice =
        this.taxCalculationService.calculateInvoiceTotal(
          baseImponible,
          ivaRate
        );
      const facturaTotalPayable =
        this.taxCalculationService.calculateTotalPayable(
          baseImponible,
          porcentaje,
          ivaRate
        );

      // Almacenamos los resultados de los cálculos en el objeto de la factura
      factura.calculos = {
        iva: facturaIVA,
        withheldTax: facturaWithheldTax,
        totalInvoice: facturaTotalInvoice,
        totalPayable: facturaTotalPayable,
      };

      // Sumamos los resultados individuales a los totales generales
      totalIVA += facturaIVA;
      totalWithheldTax += facturaWithheldTax;
      totalInvoice += facturaTotalInvoice;
      totalPayable += facturaTotalPayable;

      // Opción: Imprimir en consola los cálculos individuales de cada factura
      console.log(`Factura ${index + 1}:`, {
        baseImponible,
        ivaRate,
        facturaIVA,
        facturaWithheldTax,
        facturaTotalInvoice,
        facturaTotalPayable,
      });
    });

    // Asignar los valores calculados a las propiedades del componente
    this.totalIVA = totalIVA;
    this.totalIVAWithhealTax = totalWithheldTax;
    this.totalInvoiced = totalInvoice;
    this.totalPayd = totalPayable;

    // Imprimir los datos completos del formulario en la consola
    console.log('Datos del formulario:', formData);

    // Mostrar los totales calculados en la consola
    console.log('Totales Calculados:', {
      totalIVA,
      totalWithheldTax,
      totalInvoice,
      totalPayable,
    });
  }

  printRetention() {
    this.printService.createPdf(this.retentionForm, this.totalPayd);
  }

  // Función para manejar el cambio de selección de retención

  private logFormErrors(): void {
    const formErrors: any = [];
    Object.keys(this.retentionForm.controls).forEach((key) => {
      const controlErrors = this.retentionForm.get(key)?.errors;
      if (controlErrors) {
        formErrors.push({ field: key, errors: controlErrors });
      }
    });

    console.error('Errores en el formulario:', formErrors);
  }
}
