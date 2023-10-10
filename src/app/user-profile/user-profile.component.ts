import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};

  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', BirthDate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser(); // get user gets all the users data to display it.
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;

      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        this.favoriteMovies = response.filter(
          (movie: { _id: any }) =>
            this.user.favoriteMovies.indexOf(movie._id) >= 0
        );
      });
    });
  }

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('Username', data.Username);

        this.snackBar.open('User has been updated', 'OK', {
          duration: 2000,
        });
        window.location.reload();
      },
      (result) => {
        this.snackBar.open(result, 'ok', {
          duration: 2000,
        });
      }
    );
  }

  deleteUser(): void {
    if (confirm('Are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Account Deleted successfully', 'ok', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        localStorage.clear();
      });
    }
  }
}
