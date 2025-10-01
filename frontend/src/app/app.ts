import { Component, OnInit, inject, Renderer2, RendererFactory2, DOCUMENT } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './core/services/authentication.service';
import { SchedulerThemeService } from 'scheduler-lib';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authService = inject(AuthenticationService);
  private translate = inject(TranslateService);
  private schedulerThemeService = inject(SchedulerThemeService);
  private rendererFactory = inject(RendererFactory2);
  private document = inject(DOCUMENT);
  private renderer: Renderer2;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    // Initialize translation service
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    
    // Initialize scheduler theme
    this.schedulerThemeService.initializeTheme();
    
    // Manually add scheduler theme class to ensure it's applied
    this.renderer.addClass(this.document.body, 'sl-scheduler-theme');
    this.renderer.addClass(this.document.documentElement, 'sl-scheduler-theme');
    
    this.authService.configure();
  }
}
