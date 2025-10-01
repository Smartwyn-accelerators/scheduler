# Scheduler Theme Usage Guide

This guide explains how to use the unified scheduler theme across all scheduler components. The theme provides CSS custom properties and SCSS mixins that can be used selectively without disturbing existing component styles.

## Importing the Theme

To use the scheduler theme in your component, import it in your component's SCSS file:

```scss
@import '../scheduler-theme.scss';
```

## Available SCSS Mixins

### Container Mixins
- `@include scheduler-container` - Main container with consistent padding and max-width
- `@include scheduler-page-header` - Page header with title and subtitle
- `@include scheduler-card` - Card component with consistent styling

### Table Mixins
- `@include scheduler-table-section` - Table section wrapper
- `@include scheduler-table-container` - Table container with overflow handling
- `@include scheduler-table` - Main table styling
- `@include scheduler-mobile-responsive` - Mobile responsive table transformations

### Form Mixins
- `@include scheduler-filter-section` - Filter section with responsive layout

### State Mixins
- `@include scheduler-loading-container` - Loading state container
- `@include scheduler-empty-state` - Empty state container

## CSS Custom Properties (Variables)

The theme provides CSS custom properties for consistent theming:

### Colors
```scss
--scheduler-primary: #6750a4;
--scheduler-on-primary: #ffffff;
--scheduler-primary-container: #e8def8;
--scheduler-on-primary-container: #21005d;
// ... and more
```

### Spacing
```scss
--scheduler-container-padding: 24px;
--scheduler-container-padding-mobile: 16px;
--scheduler-form-spacing: 16px;
--scheduler-form-spacing-mobile: 12px;
```

### Typography
```scss
--scheduler-font-size-title: 32px;
--scheduler-font-size-title-mobile: 24px;
--scheduler-font-size-subtitle: 16px;
--scheduler-font-weight-normal: 400;
--scheduler-font-weight-medium: 500;
--scheduler-font-weight-semibold: 600;
```

## Usage Examples

### Apply Theme to Component (Required)
```scss
@import '../scheduler-theme.scss';

// Apply scheduler theme to this component
:host {
  @include scheduler-theme-host;
}
```

### Using Mixins (Recommended Approach)
```scss
@import '../scheduler-theme.scss';

// Apply scheduler theme to this component
:host {
  @include scheduler-theme-host;
}

.jobs-container {
  @include scheduler-container;
}

.page-header {
  @include scheduler-page-header;
  
  .page-title {
    @include scheduler-page-title;
  }
}

.jobs-card {
  @include scheduler-card;
}

.jobs-table {
  @include scheduler-table;
}
```

### Using CSS Custom Properties
```scss
@import '../scheduler-theme.scss';

.my-custom-element {
  background-color: var(--scheduler-primary);
  color: var(--scheduler-on-primary);
  padding: var(--scheduler-container-padding);
  border-radius: var(--scheduler-border-radius);
  font-size: var(--scheduler-font-size-body);
}
```

## Component-Specific Customizations

You can still add component-specific styles while using the theme:

```scss
@import '../scheduler-theme.scss';

.jobs-container {
  @include scheduler-container;
  
  // Component-specific customizations
  .jobs-specific-element {
    background-color: var(--scheduler-primary-container);
    border-radius: var(--scheduler-border-radius-small);
  }
}
```

## Responsive Design

The theme includes responsive design patterns:

- Mobile breakpoints at 768px and 600px
- Responsive typography scaling
- Mobile-specific padding and spacing
- Table transformations for mobile devices

## Best Practices

1. **Always import the theme** at the top of your component's SCSS file
2. **Apply the theme to :host** using `@include scheduler-theme-host;`
3. **Use mixins** instead of duplicating styles
4. **Use CSS custom properties** for consistent theming
5. **Add component-specific styles** when needed without conflicts
6. **Test responsive behavior** on different screen sizes
7. **Use mixins selectively** - only include what you need

## Benefits

- **Consistency**: All components share the same visual language
- **Maintainability**: Changes to the theme affect all components
- **Performance**: Reduced CSS bundle size through shared styles
- **Accessibility**: Consistent focus states and color contrast
- **Responsive**: Built-in mobile-first responsive design
