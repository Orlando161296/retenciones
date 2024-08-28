import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SummaryComponent } from '../summary/summary.component';
import { TaxService } from '../../services/TaxCalculate.service';
import { PrintService } from '../../services/PrintService.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SummaryComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
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
    value: `2024-${(i + 1).toString().padStart(2, '0')}`,
  }));
  public calculateIVA: boolean = true;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.retentionForm = this.fb.group({
      nombreResponsable: [
       "",
        Validators.required,
      ],
      numeroRetencion: [
        "",
        Validators.required,
      ],
      periodoFiscal: ["", Validators.required],
      nombreFiscal: ["", Validators.required],
      rif: [
        "",
        [Validators.required, Validators.pattern(/^([VEJGC]-\d{8,9})$/)],
      ],
      direccionFiscal: [
        "",
        Validators.required,
      ],
      numeroControl: ["", [Validators.required]],
      fechaOperacion: ['', Validators.required],
      numeroFactura: [
        "",
        [Validators.required, Validators.min(1)],
      ],
      baseImponible: [
        "",
        [Validators.required, Validators.min(0)],
      ],
      porcentaje: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      retencion: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { baseImponible, porcentaje, retencion } = this.retentionForm.value;
    if (this.retentionForm.valid || retencion === "1") {
      this.totalIVA = this.taxCalculationService.calculateIVA(baseImponible);
      this.totalIVAWithhealTax =
        this.taxCalculationService.calculateWithheldTax(
          baseImponible,
          porcentaje
        );

        if( retencion === "2"){
          this.totalIVA = this.taxCalculationService.calculateISLR(baseImponible, porcentaje)
          console.log(this.totalIVA);
        }



      this.totalInvoiced =
        this.taxCalculationService.calculateInvoiceTotal(baseImponible);
      this.totalPayd = this.taxCalculationService.calculateTotalPayable(
        baseImponible,
        porcentaje
      );
      this.showSummary = true;

    } else {
      this.logFormErrors();
    }
  }



  printRetention() {
    const { baseImponible, porcentaje } = this.retentionForm.value;

    if (this.retentionForm.value.retencion === "2") {
      this.printService.createPdfISLR(
        this.retentionForm.value,
        this.taxCalculationService.calculatePercentage(
          baseImponible,
          porcentaje
        )
      );
    } else {
      this.printService.createPdf(
        this.retentionForm.value,
        this.totalInvoiced,
        this.totalPayd,
        this.totalIVA,
        this.totalIVAWithhealTax
      );
    }
  }
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
