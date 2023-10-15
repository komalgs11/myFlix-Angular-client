import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for displaying the user login form.
 */

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    /**
     * Constructor for UserLoginFormComponent.
     *
     * @param fetchApiData - Service for making API calls for user login.
     * @param dialogRef - Dialog reference for closing the login form modal.
     * @param snackBar - Angular Material snack bar service for notifications.
     * @param router - Angular router service for navigation.
     */

    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Sends user login data to the backend for authentication.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        localStorage.setItem('Username', result.user.Username);
        this.dialogRef.close();
        this.snackBar.open(' User Login successful', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('User Login failed', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
