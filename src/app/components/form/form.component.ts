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
import { RetencionFormData } from '../../interfaces/retencion-form.interface';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SummaryComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  /**
   * Inyección de dependencias para los servicios de FormBuilder, PrintService y TaxService.
   */
  public fb = inject(FormBuilder);
  public printService = inject(PrintService);
  public taxCalculationService = inject(TaxService);

  /**
   * Opciones de retención de ISLR.
   */
  public islrOptions = [
    { label: '1%', value: 0.01 },
    { label: '2%', value: 0.02 },
  ];

  /**
   * Opciones de tasa de IVA.
   */
  public ivaOptions = [
    { label: '16%', value: 0.16 },
    { label: '8%', value: 0.08 },
  ];

  /**
   * Opciones de porcentaje de retención de IVA.
   */
  public ivaRetention = [
    { label: '100%', value: 1 },
    { label: '75%', value: 0.75 },
  ];

  /**
   * Formulario principal de retención.
   */
  retentionForm!: FormGroup;

  /**
   * Propiedades relacionadas con los cálculos y el estado del formulario.
   */
  totalIVAWithhealTax: number = 0;
  totalInvoiced: number = 0;
  totalPayd: number = 0;
  showSummary: boolean = false;
  totalIVA: number = 0;
  showModal: boolean = false;

  /**
   * Opciones de períodos fiscales (2025 - meses del año).
   */
  public periodoFiscal = Array.from({ length: 12 }, (_, i) => ({
    value: `2025-${(i + 1).toString().padStart(2, '0')}`,
  }));

  /**
   * Bandera para indicar si se debe calcular el IVA.
   */
  public calculateIVA: boolean = true;

  /**
   * Inicializa el componente.
   */
  constructor() {}

  /**
   * Hook del ciclo de vida de Angular: se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario de retención.
   */
  private initForm(): void {
    this.retentionForm = this.fb.group({
      nombreResponsable: ['', Validators.required],
      numeroRetencion: [
        '',
        [Validators.required, Validators.pattern(/^\d{1,5}$/)],
      ],
      periodoFiscal: ['', Validators.required],
      nombreFiscal: ['', Validators.required],
      rif: [
        '',
        [Validators.required, Validators.pattern(/^([VEJGC]-\d{8,9})$/)],
      ],
      direccionFiscal: ['', Validators.required],
      retencion: ['', Validators.required],
      facturas: this.fb.array([this.createFacturaGroup()]), // FormArray para las facturas
    });
  }

  /**
   * Crea un grupo de formulario para una factura.
   * @returns FormGroup - Grupo de controles para una factura.
   */
  private createFacturaGroup(): FormGroup {
    return this.fb.group({
      numeroFactura: ['', Validators.required],
      numeroControl: ['', Validators.required],
      baseImponible: [, [Validators.required, Validators.min(0)]],
      porcentaje: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      ivaRate: ['', Validators.required],
      fechaFactura: ['', Validators.required],
    });
  }

  /**
   * Getter para obtener el FormArray de facturas.
   */
  get facturas(): FormArray {
    return this.retentionForm.get('facturas') as FormArray;
  }

  /**
   * Agrega una nueva factura al FormArray.
   * Limita la cantidad máxima a 4 facturas.
   */
  addFactura(): void {
    if (this.facturas.length <= 4) {
      this.facturas.push(this.createFacturaGroup());
    } else {
      console.error('Máximo de 4 facturas alcanzado');
    }
  }

  /**
   * Elimina una factura del FormArray según el índice proporcionado.
   * @param index - Índice de la factura a eliminar.
   */
  removeFactura(index: number): void {
    if (this.facturas.length > 1) {
      this.facturas.removeAt(index);
    }
  }

  /**
   * Maneja el envío del formulario.
   * Valida el formulario y calcula los totales si es válido.
   */
  onSubmit(): void {
    if (this.retentionForm.valid) {
      const formData: RetencionFormData = this.retentionForm.value;

      console.log(this.retentionForm.value);
      this.calculateTotals(formData);

      this.showModal = true; // Muestra el modal al enviar el formulario
    } else {
      this.logFormErrors();
    }
  }

  /**
   * Calcula los totales generales de IVA, impuestos retenidos y montos totales.
   * @param formData - Datos del formulario.
   */
  private calculateTotals(formData: RetencionFormData): void {
    let totalIVA = 0;
    let totalWithheldTax = 0;
    let totalInvoice = 0;
    let totalPayable = 0;

    formData.facturas.forEach((factura, index) => {
      const { baseImponible, porcentaje, ivaRate } = factura;
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

      factura.calculos = {
        iva: facturaIVA,
        withheldTax: facturaWithheldTax,
        totalInvoice: facturaTotalInvoice,
        totalPayable: facturaTotalPayable,
      };

      totalIVA += facturaIVA;
      totalWithheldTax += facturaWithheldTax;
      totalInvoice += facturaTotalInvoice;
      totalPayable += facturaTotalPayable;
    });

    this.totalIVA = totalIVA;
    this.totalIVAWithhealTax = totalWithheldTax;
    this.totalInvoiced = totalInvoice;
    this.totalPayd = totalPayable;
  }

  /**
   * Genera un PDF con los datos del formulario.
   */
  printRetention(): void {
    this.printService.createPdf(this.retentionForm, this.totalPayd);
  }

  /**
   * Registra los errores de validación del formulario en la consola.
   */
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

  /**
   * Cierra el modal de resumen y oculta su estado.
   */
  closeModal(): void {
    this.showModal = false;
  }
}
