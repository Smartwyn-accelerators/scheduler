# ConfirmationDialogComponent Usage Example

## Basic Usage

```typescript
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData, ConfirmationType } from './confirmation-dialog.component';

export class YourComponent {
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog() {
  const config: MatDialogConfig<ConfirmationDialogData> = {
    data: {
      heading: 'Confirm Action',
      content: 'Are you sure you want to proceed with this action?',
      type: ConfirmationType.Confirm,
      action: {
        cancelText: 'Cancel',
        saveText: 'Confirm'
      }
    }
  };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed');
        // Handle confirmation
      } else {
        console.log('User cancelled');
        // Handle cancellation
      }
    });
  }
}
```

## Delete Confirmation Example

```typescript
openDeleteConfirmation(item: any) {
  const config: MatDialogConfig<ConfirmationDialogData> = {
    data: {
      heading: 'Delete Item',
      content: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      type: ConfirmationType.Delete,
      action: {
        cancelText: 'Cancel',
        saveText: 'Delete'
      }
    }
  };

  const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.deleteItem(item);
    }
  });
}
```

## Simple Confirmation

```typescript
openSimpleConfirmation() {
  const config: MatDialogConfig<ConfirmationDialogData> = {
    data: {
      heading: 'Save Changes',
      content: 'Do you want to save your changes?',
      action: {
        cancelText: 'Discard',
        saveText: 'Save'
      }
    }
  };

  const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.saveChanges();
    } else {
      this.discardChanges();
    }
  });
}
```

## Features

- ✅ **Angular 20 Signals** - Modern reactive state management
- ✅ **Standalone Component** - No module dependencies required
- ✅ **Warning Icon Support** - Always shows warning with red-bordered design
- ✅ **Type Safety** - Strong TypeScript interfaces
- ✅ **Accessibility** - ARIA labels and keyboard navigation
- ✅ **Clean Modern Design** - Matches the exact design from the reference images
- ✅ **Flexible Configuration** - Customizable text and behavior
- ✅ **Material Design 3** - Uses proper Material Design colors and spacing
