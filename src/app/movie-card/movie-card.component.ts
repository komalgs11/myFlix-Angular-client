// Import necessary modules and components
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Define a component for displaying movie cards
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  /**
   * ngOnInit() is called when the component is created.
   */
  ngOnInit(): void {
    // Check if a user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      // If not logged in, redirect to the "welcome" page
      this.router.navigate(['welcome']);
      return;
    }
    // Fetch the list of movies
    this.getMovies();
  }

  /**
   * Fetches a list of movies from the API and stores them in the "movies" array.
   *
   * @returns An array of movie data.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response; // Store the retrieved movies in the "movies" array
      //console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens a dialog to display genre information.
   *
   * @param genre - The genre object containing name and description.
   * @returns Displays the genre name and description to the end user.
   */
  getGenreDialog(genre: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      },
    });
  }

  /**
   * Opens a dialog to display director information.
   *
   * @param director - The director object containing name, birthdate, and bio.
   */
  getDirectorDialog(director: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: director.Name,
        born: director.Born,
        content: director.Bio,
      },
    });
  }

  /**
   * Opens a dialog to display movie synopsis.
   *
   * @param synopsis - The movie's description text.
   */
  getSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: 'Description',
        content: synopsis,
      },
    });
  }

  /**
   * Adds a movie to the user's list of favorite movies.
   *
   * @param movieId - The ID of the movie to add to favorites.
   */
  addFavorite(movieId: string): void {
    // Use the FetchApiDataService to send a request to add the movie to favorites
    this.fetchApiData.addFavoriteMovie(movieId).subscribe(() => {
      this.snackBar.open('added to favorites', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * Checks if a movie is in the user's list of favorite movies.
   *
   * @param Id - The ID of the movie to check for in favorites.
   * @returns true if the movie is a favorite; false otherwise.
   */
  isFavorite(Id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(Id);
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   *
   * @param Id - The ID of the movie to remove from favorites.
   */
  removeFavorite(Id: string): void {
    this.fetchApiData.removeFavoriteMovie(Id).subscribe(() => {
      // Use the FetchApiDataService to send a request to remove the movie from favorites
      this.snackBar.open('remove from favorites', 'OK', {
        duration: 2000,
      });
    });
  }
}
