import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  public calculateIVA: boolean = false;



  changeTax(){

    this.calculateIVA = true;

    if(this.calculateIVA){
      this.calculateIVA = false;
    }
  }



 }
