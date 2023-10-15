import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

type User = {
  _id?: string;
  Username?: string;
  Password?: string;
  Email?: string;
  favoriteMovies?: [];
};

/**
 * Component for displaying the user profile and managing user data.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User = {};

  @Input() userData = { Username: '', Password: '', Email: '', BirthDate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Get user data to display the user's profile.
    const user = this.getUser();
    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;
    console.log(this.user);
    this.userData = {
      Username: user.Username || '',
      Email: user.Email || '',
      Password: '',
      BirthDate: '',
    };
  }

  /**
   * Retrieves user data from local storage.
   *
   * @returns The user data retrieved from local storage.
   */

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Updates the user's profile data.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((response) => {
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response));
      this.user = response;
      this.snackBar.open('User has been updated', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * Deletes the user's account after confirmation.
   */
  deleteUserProfile(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Account Deleted successfully', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}
