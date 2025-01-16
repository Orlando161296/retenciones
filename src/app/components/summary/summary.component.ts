import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {

  @Input() totalIVA: number = 0;
  @Input() totalInvoiced: number = 0;
  @Input() totalPayd: number = 0;
  @Input() showModal: boolean = false;
  @Output() printRetention = new EventEmitter<void>();
  @Output() closeModalEvent = new EventEmitter<void>();
 /**
   * Closes the modal by setting showModal to false.
   */
 closeModal(): void {
  this.closeModalEvent.emit();
}

/**
 * Emits the printRetention event to the parent component.
 */
onPrintRetention(): void {
  this.printRetention.emit();
}

}
