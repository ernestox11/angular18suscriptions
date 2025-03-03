import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

/**
 * Service to simulate loading states and network delays in development
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /**
   * Wraps a value with a simulated network delay
   * 
   * @param value Any value to be delayed
   * @param delayMs Milliseconds to delay (default: 500ms)
   * @returns Observable that emits the value after the delay
   */
  public simulateDelay<T>(value: T, delayMs: number = 500): Observable<T> {
    return of(value).pipe(
      delay(delayMs)
    );
  }
  
  /**
   * Creates a Promise that resolves after the specified delay
   * 
   * @param delayMs Milliseconds to delay (default: 500ms)
   * @returns Promise that resolves after the delay
   */
  public async wait(delayMs: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}