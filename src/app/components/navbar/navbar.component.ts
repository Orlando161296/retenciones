import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
  <img
    src="https://precios.cecosesola.coop/images/Logo-Cecosesola-RLH-White.png"
    alt="Logo Feria"
    class="h-10 w-auto"
  />
  <div class="flex flex-grow justify-center">
    <h1 class="text-2xl font-semibold">Cecosesola Retenciones</h1>
  </div>
</nav>
  `,
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
