import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-gradient-to-r from-red-500 to-orange-500 text-white  p-4">
      <div class="flex justify-center items-center">
        <h1 class="text-xl">Cecosesola - Retenciones</h1>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
