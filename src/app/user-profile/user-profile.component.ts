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
    //get user gets all the users data to display it.
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

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

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
