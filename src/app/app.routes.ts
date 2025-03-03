import { Routes } from '@angular/router';
import { ProductoDetalleComponent } from './productos/producto.component';

export const routes: Routes = [
  { path: 'productos', component: ProductoDetalleComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }
];