// Strict type definitions
export interface Producto {
    id: number;
    nombre: string;
    categoriaId: number;
  }
  
  export interface Categoria {
    id: number;
    nombre: string;
  }
  
  export interface Detalle {
    id: number;
    productoId: number;
    descripcion: string;
    stock: number;
  }
  
  export interface ProductoCompleto {
    producto: Producto;
    categoria: Categoria;
    detalle: Detalle;
    disponibilidad: 'Alta' | 'Baja' | 'Agotado';
  }
  
  // API response types for type safety
  export type ApiResponse<T> = T;
  
  import { Injectable, computed, effect, inject, signal } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, catchError, finalize, firstValueFrom, map, switchMap, throwError } from 'rxjs';
  import { LoadingService } from './loading.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class ProductoService {
    private readonly http = inject(HttpClient);
    private readonly loadingService = inject(LoadingService);
    private readonly baseUrl = 'http://localhost:3000';
  
    // ===== STATE SIGNALS =====
    
    /**
     * Loading state signal
     */
    public readonly cargando = signal<boolean>(false);
    
    /**
     * Error state signal
     */
    public readonly error = signal<string | null>(null);
    
    /**
     * Products list signal
     */
    public readonly productos = signal<Producto[]>([]);
    
    /**
     * Currently selected product signal
     */
    public readonly productoSeleccionado = signal<Producto | null>(null);
    
    /**
     * Category data signal
     */
    public readonly categoria = signal<Categoria | null>(null);
    
    /**
     * Product details signal
     */
    public readonly detalleProducto = signal<Detalle | null>(null);
    
    /**
     * Computed signal combining data from multiple sources
     * Only updates when dependencies change
     */
    public readonly productoCompleto = computed<ProductoCompleto | null>(() => {
      const producto = this.productoSeleccionado();
      const categoria = this.categoria();
      const detalle = this.detalleProducto();
      
      if (!producto || !categoria || !detalle) {
        return null;
      }
      
      // Calculate availability based on stock level
      let disponibilidad: 'Alta' | 'Baja' | 'Agotado';
      if (detalle.stock <= 0) {
        disponibilidad = 'Agotado';
      } else if (detalle.stock <= 5) {
        disponibilidad = 'Baja';
      } else {
        disponibilidad = 'Alta';
      }
      
      return {
        producto,
        categoria,
        detalle,
        disponibilidad
      };
    });
    
    constructor() {
      // Effect to log changes to the complete product data (optional)
      effect(() => {
        const datos = this.productoCompleto();
        if (datos) {
          console.log('Complete product data updated:', datos);
        }
      });
    }
    
    /**
     * Makes a GET request with simulated network delay
     * 
     * @param endpoint API endpoint path
     * @returns Observable of the typed response
     */
    private getWithDelay<T>(endpoint: string): Observable<T> {
      return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
        // Simulate network delay
        switchMap(response => this.loadingService.simulateDelay<T>(response)),
        catchError(this.handleError)
      );
    }
    
    /**
     * Loads the initial list of products
     */
    public cargarProductos(): void {
      this.resetState();
      this.cargando.set(true);
      
      this.getWithDelay<Producto[]>('productos')
        .pipe(
          finalize(() => this.cargando.set(false))
        )
        .subscribe({
          next: (productos) => {
            this.productos.set(productos);
          },
          error: (error: string) => {
            this.error.set(error);
          }
        });
    }
    
    /**
     * Loads complete product details through chained API requests
     * @param productoId Product ID to load
     */
    public cargarDetallesCompletos(productoId: number): void {
      this.resetState();
      this.cargando.set(true);
      
      // First request: Get product
      this.getWithDelay<Producto>(`productos/${productoId}`)
        .subscribe({
          next: (producto) => {
            this.productoSeleccionado.set(producto);
            
            // Second request: Get category based on product
            this.getWithDelay<Categoria>(`categorias/${producto.categoriaId}`)
              .subscribe({
                next: (categoria) => {
                  this.categoria.set(categoria);
                  
                  // Third request: Get product details
                  this.getWithDelay<Detalle[]>(`detalles?productoId=${productoId}`)
                    .pipe(
                      finalize(() => this.cargando.set(false))
                    )
                    .subscribe({
                      next: (detalles) => {
                        if (detalles.length > 0) {
                          this.detalleProducto.set(detalles[0]);
                        } else {
                          this.error.set('No se encontraron detalles para este producto');
                        }
                      },
                      error: (error: string) => {
                        this.error.set(error);
                      }
                    });
                },
                error: (error: string) => {
                  this.cargando.set(false);
                  this.error.set(error);
                }
              });
          },
          error: (error: string) => {
            this.cargando.set(false);
            this.error.set(error);
          }
        });
    }
    
    /**
     * Modern version using async/await for chained requests
     * This is cleaner and easier to understand
     * @param productoId Product ID to load
     */
    public async cargarDetallesCompletosAsync(productoId: number): Promise<void> {
      try {
        this.resetState();
        this.cargando.set(true);
        
        // First request: Get product
        const producto = await firstValueFrom(
          this.getWithDelay<Producto>(`productos/${productoId}`)
        );
        this.productoSeleccionado.set(producto);
        
        // Second request: Get category
        const categoria = await firstValueFrom(
          this.getWithDelay<Categoria>(`categorias/${producto.categoriaId}`)
        );
        this.categoria.set(categoria);
        
        // Third request: Get details
        const detalles = await firstValueFrom(
          this.getWithDelay<Detalle[]>(`detalles?productoId=${productoId}`)
        );
        
        if (detalles.length > 0) {
          this.detalleProducto.set(detalles[0]);
        } else {
          this.error.set('No se encontraron detalles para este producto');
        }
      } catch (err) {
        if (err instanceof Error) {
          this.error.set(err.message);
        } else {
          this.error.set('Ocurrió un error desconocido');
        }
      } finally {
        this.cargando.set(false);
      }
    }
    
    /**
     * Centralized error handler
     */
    private handleError = (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = 'Ocurrió un error desconocido';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend error
        errorMessage = `Código: ${error.status}, mensaje: ${error.message}`;
      }
      
      this.error.set(errorMessage);
      return throwError(() => errorMessage);
    };
    
    /**
     * Resets state for a new data load
     */
    private resetState(): void {
      this.error.set(null);
    }
  }