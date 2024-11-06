import {Component, inject, model} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatSnackBarLabel, MatSnackBarRef} from '@angular/material/snack-bar';
import {DialogData} from './group-settings.component';
import {CdkTrapFocus} from '@angular/cdk/a11y';

@Component({
  selector: 'group-settings-new-dialog.component',
  templateUrl: 'group-settings-new-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatLabel,
    FormsModule,
    CdkTrapFocus
  ]
})
export class NewGroupDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NewGroupDialogComponent>);
  readonly name = model('');

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'group-settings-edit-dialog.component',
  templateUrl: 'group-settings-edit-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatLabel,
    FormsModule,
    CdkTrapFocus
  ]
})
export class EditGroupDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditGroupDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'group-settings-delete-dialog.component',
  templateUrl: 'group-settings-delete-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatLabel,
    FormsModule,
    CdkTrapFocus
  ]
})
export class DeleteGroupDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteGroupDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'group-settings-snackbar.component',
  templateUrl: 'group-settings-snackbar.component.html',
  standalone: true,
  styles: `
    :host {
      display: flex;
    }
  `,
  imports: [
    MatSnackBarLabel
  ]
})
export class ConfirmationSnackbarComponent {
  readonly snackbarRef = inject(MatSnackBarRef);
}
