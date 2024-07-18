import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SummaryComponent } from '../summary/summary.component';
import { TaxServiceService } from '../../services/TaxCalculate.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SummaryComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  retentionForm!: FormGroup;

  totalIVA: number = 0;


  public fb = inject(FormBuilder)
  public taxCalculationService = inject(TaxServiceService)

  ngOnInit(): void {
    this.retentionForm = this.fb.group({
      nombreResponsable: ['Orlando Rojas', ],
      numeroRetencion: ['598456', ],
      periodoFiscal: ['2024-07', ],
      nombreFiscal: ['ORLANDO ROJAS', ],
      rif: ['V-256274589', ],
      direccionFiscal: ['EL CUJI LAS VERITAS URB. VILLAS CANTEVISTAS CASA N°6 ', ],
      numeroOperacion: ['01', ],
      fechaOperacion: ['', ],
      numeroFactura: ['7555', ],
      operacion: ['', ],
      baseImponible: ['1000', ],
      porcentaje: ['', ],
      retencion: ['', ]
    })

  }


  public periodoFiscal = [
    {
      value: '2024-01',
    },
    {
      value: '2024-02',
    },
    {
      value: '2024-03',
    },
    {
      value: '2024-04',
    },
    {
      value: '2024-05',
    },
    {
      value: '2024-06',
    },
    {
      value: '2024-07',
    },
    {
      value: '2024-08',
    },
    {
      value: '2024-09',
    },
    {
      value: '2024-10',
    },
    {
      value: '2024-11',
    },
    {
      value: '2024-12',
    },
  ];


  onSubmit() {
    if (this.retentionForm.valid) {
      const formValues = this.retentionForm.value;
      this.totalIVA = this.taxCalculationService.calculateIVA(formValues.baseImponible, formValues.porcentaje)
    } else {
      console.error('Formulario inválido');
    }
  }



  public calculateIVA: boolean = true;

  changeTax(event: Event) {
    const input = event.target as HTMLInputElement;
    if( input.value === '1'){
      this.calculateIVA = true;
    }else{
      this.calculateIVA = false;
    }
  }
}
