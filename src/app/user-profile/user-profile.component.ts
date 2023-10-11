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
  user: any = '';
  favoriteMovies: any = '';

  @Input() userData = { Username: '', Password: '', Email: '', BirthDate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser(); //get user gets all the users data to display it.
    this.getFavoriteList();
  }

  getFavoriteList(): void {
    this.fetchApiData.getFavoriteMovies().subscribe(
      (favMovieIDs: any) => {
        if (favMovieIDs) {
          this.favoriteMovies = favMovieIDs;
          this.fetchApiData.getAllMovies().subscribe((movies: any) => {
            this.favoriteMovies = movies.filter((movie: any) => {
              return this.favoriteMovies.includes(movie._id);
            });
          });
        } else {
          this.favoriteMovies = 'No favorite movies yet';
        }
      },
      (error) => {
        console.error('Error fetching favorite movies:', error);
      }
    );
  }

  getUser(): void {
    this.fetchApiData.getUser().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.snackBar.open('User has been updated', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Error updating user. Please try again.', 'ok', {
          duration: 2000,
        });
      }
    );
  }

  deleteUserProfile(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.fetchApiData.deleteUser().subscribe(
        () => {
          localStorage.clear();
          this.router.navigate(['welcome']);
          this.snackBar.open('Account Deleted successfully', 'OK', {
            duration: 2000,
          });
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user. Please try again.', 'OK', {
            duration: 2000,
          });
        }
      );
    }
  }
}
