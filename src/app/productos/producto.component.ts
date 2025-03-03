import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, ProductoCompleto, Producto } from './producto.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loading Indicator -->
    <div *ngIf="productoService.cargando()" class="cargando">
      <p>Cargando datos...</p>
    </div>
    
    <!-- Error Message -->
    <div *ngIf="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
    
    <!-- Products List -->
    <div class="productos-lista">
      <h3>Selecciona un producto:</h3>
      <ul>
        <li *ngFor="let producto of productos"
            (click)="cargarDetalles(producto.id)"
            [class.seleccionado]="esProductoSeleccionado(producto.id)">
          {{ producto.nombre }}
        </li>
      </ul>
      <p *ngIf="productos.length === 0 && !productoService.cargando()">
        No hay productos disponibles.
      </p>
      <button (click)="cargarProductos()" [disabled]="productoService.cargando()">
        Cargar Productos
      </button>
    </div>
    
    <!-- Product Details (only shown when data is available) -->
    <ng-container *ngIf="productoCompleto">
      <div class="detalles">
        <h3>Detalles del Producto</h3>
        <div class="ficha">
          <div class="fila">
            <strong>Producto:</strong> {{ productoCompleto.producto.nombre }}
          </div>
          <div class="fila">
            <strong>Categoría:</strong> {{ productoCompleto.categoria.nombre }}
          </div>
          <div class="fila">
            <strong>Descripción:</strong> {{ productoCompleto.detalle.descripcion }}
          </div>
          <div class="fila">
            <strong>Stock:</strong> {{ productoCompleto.detalle.stock }}
          </div>
          <div class="fila">
            <strong>Disponibilidad:</strong> 
            <span [class]="'disponibilidad-' + disponibilidadClass">
              {{ productoCompleto.disponibilidad }}
            </span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .cargando {
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .error {
      padding: 1rem;
      background-color: #ffeeee;
      color: #cc0000;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .productos-lista ul {
      list-style: none;
      padding: 0;
    }
    
    .productos-lista li {
      padding: 0.5rem;
      margin: 0.25rem 0;
      background-color: #f5f5f5;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .productos-lista li:hover {
      background-color: #e0e0e0;
    }
    
    .productos-lista li.seleccionado {
      background-color: #e0f0ff;
      border-left: 3px solid #0066cc;
    }
    
    .detalles {
      margin-top: 2rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
    }
    
    .ficha .fila {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .disponibilidad-alta {
      color: green;
      font-weight: bold;
    }
    
    .disponibilidad-baja {
      color: orange;
      font-weight: bold;
    }
    
    .disponibilidad-agotado {
      color: red;
      font-weight: bold;
    }
  `]
})
export class ProductoDetalleComponent implements OnInit {
  // Service injection
  public readonly productoService = inject(ProductoService);
  
  // Getters for type-safe template access
  
  /**
   * Get the current error message (or null)
   */
  get errorMessage(): string | null {
    return this.productoService.error();
  }
  
  /**
   * Get the list of products (guarantee non-null)
   */
  get productos(): Producto[] {
    return this.productoService.productos();
  }
  
  /**
   * Get the complete product data (or null)
   */
  get productoCompleto(): ProductoCompleto | null {
    return this.productoService.productoCompleto();
  }
  
  /**
   * Get the availability class for CSS
   */
  get disponibilidadClass(): string {
    const disponibilidad = this.productoCompleto?.disponibilidad.toLowerCase();
    return disponibilidad || '';
  }
  
  ngOnInit(): void {
    // Initial load of products
    this.cargarProductos();
  }
  
  /**
   * Load all products from the API
   */
  cargarProductos(): void {
    this.productoService.cargarProductos();
  }
  
  /**
   * Load complete details for a product
   * @param id - Product ID to load
   */
  cargarDetalles(id: number): void {
    // Using async/await approach for cleaner code
    this.productoService.cargarDetallesCompletosAsync(id);
    
    // Alternative approach with nested RxJS
    // this.productoService.cargarDetallesCompletos(id);
  }
  
  /**
   * Check if a product is currently selected
   * @param id - Product ID to check
   * @returns True if the product is selected
   */
  esProductoSeleccionado(id: number): boolean {
    return this.productoService.productoSeleccionado()?.id === id;
  }
}