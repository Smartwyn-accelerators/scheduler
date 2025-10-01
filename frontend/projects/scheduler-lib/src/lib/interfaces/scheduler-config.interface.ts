import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for the Scheduler Library
 */
export interface SchedulerConfig {
  /**
   * Base API URL for scheduler endpoints
   */
  apiUrl: string;
  
  /**
   * Translation configuration
   */
  translation?: {
    /**
     * Translation keys prefix (e.g., 'SCHEDULER')
     */
    prefix?: string;
    
    /**
     * Whether to use the user's existing translation service
     */
    useExistingTranslation?: boolean;
  };
  
  /**
   * Theme configuration
   */
  theme?: {
    /**
     * Whether to use the user's existing theme
     */
    useExistingTheme?: boolean;
    
    /**
     * Custom CSS custom properties to override
     */
    customProperties?: Record<string, string>;
  };
  
  /**
   * Feature flags
   */
  features?: {
    /**
     * Enable job management features
     */
    jobs?: boolean;
    
    /**
     * Enable trigger management features
     */
    triggers?: boolean;
    
    /**
     * Enable execution history features
     */
    executionHistory?: boolean;
    
    /**
     * Enable executing jobs monitoring
     */
    executingJobs?: boolean;
  };
}

/**
 * Injection token for SchedulerConfig
 */
export const SCHEDULER_CONFIG = new InjectionToken<SchedulerConfig>('SCHEDULER_CONFIG');
