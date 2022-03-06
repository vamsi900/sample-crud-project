import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.sass'],
})
export class EditDialogComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditDialogComponent>
  ) {
    this.formData();
  }

  ngOnInit(): void {
    // console.log(this.data);
  }

  formData() {
    this.myForm = new FormGroup({
      name: new FormControl(this.data?.name, [Validators.required]),
      email: new FormControl(this.data?.email, [
        Validators.pattern(
          '[A-Za-z0-9._%+-]{3,}@[a-zA-Z0-9]{3,}([.]{1}[a-zA-Z]{3,3})'
        ),
        Validators.required,
      ]),
      salary: new FormControl(this.data?.salary, [Validators.required]),
    });
  }

  submitDialog() {
    this.dialogRef.close(this.myForm.value);
  }

  closeDialog() {
    this.dialogRef.close('close');
  }
}
