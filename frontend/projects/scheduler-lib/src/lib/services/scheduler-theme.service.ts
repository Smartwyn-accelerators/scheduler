import { Injectable, Optional, Renderer2, RendererFactory2, DOCUMENT, inject } from '@angular/core';
import { SCHEDULER_CONFIG, SchedulerConfig } from '../interfaces/scheduler-config.interface';

/**
 * Service for managing scheduler theme integration
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerThemeService {
  private rendererFactory = inject(RendererFactory2);
  private document = inject(DOCUMENT);
  private config = inject(SCHEDULER_CONFIG, { optional: true });
  private renderer: Renderer2;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize the scheduler theme
   * This should be called once in the app initialization
   */
  initializeTheme(): void {
    if (this.config?.theme?.useExistingTheme !== false) {
      this.integrateWithUserTheme();
    }

    if (this.config?.theme?.customProperties) {
      this.applyCustomProperties();
    }
  }

  /**
   * Integrate with user's existing theme
   */
  private integrateWithUserTheme(): void {
    const body = this.document.body;
    
    // Add scheduler theme class to body
    this.renderer.addClass(body, 'sl-scheduler-theme');
    
    // Apply theme to root element if it exists
    const rootElement = this.document.documentElement;
    if (rootElement) {
      this.renderer.addClass(rootElement, 'sl-scheduler-theme');
    }
  }

  /**
   * Apply custom CSS properties
   */
  private applyCustomProperties(): void {
    if (!this.config?.theme?.customProperties) {
      return;
    }

    const rootElement = this.document.documentElement;
    
    Object.entries(this.config.theme.customProperties).forEach(([property, value]) => {
      this.renderer.setStyle(rootElement, `--sl-${property}`, value);
    });
  }

  /**
   * Update a specific theme property
   */
  updateThemeProperty(property: string, value: string): void {
    const rootElement = this.document.documentElement;
    this.renderer.setStyle(rootElement, `--sl-${property}`, value);
  }

  /**
   * Update multiple theme properties
   */
  updateThemeProperties(properties: Record<string, string>): void {
    const rootElement = this.document.documentElement;
    
    Object.entries(properties).forEach(([property, value]) => {
      this.renderer.setStyle(rootElement, `--sl-${property}`, value);
    });
  }

  /**
   * Get current theme property value
   */
  getThemeProperty(property: string): string | null {
    const rootElement = this.document.documentElement;
    const computedStyle = window.getComputedStyle(rootElement);
    return computedStyle.getPropertyValue(`--sl-${property}`).trim();
  }

  /**
   * Remove scheduler theme
   */
  removeTheme(): void {
    const body = this.document.body;
    const rootElement = this.document.documentElement;
    
    this.renderer.removeClass(body, 'sl-scheduler-theme');
    this.renderer.removeClass(rootElement, 'sl-scheduler-theme');
  }
}
