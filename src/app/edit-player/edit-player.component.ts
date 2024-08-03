import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent {

  allProfilePictures = ['1.png', '2.png', '3.png', '4.png'];


  /**
   * This constructor creates an instance of EditPlayerComponent.
   * @param dialogRef - Reference to the MatDialog containing this component.
   */
  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {
  }


  /**
   * This method closes the dialog.
   */
  onNoClick() {
    this.dialogRef.close();
  }

}
