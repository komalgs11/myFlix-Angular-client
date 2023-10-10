import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public snackBar: MatSnackBar
  ) {}

  //ngOnInit() is called when Angular is done creating the component.
  ngOnInit(): void {
    this.getMovies();
  }

  //is implemented to fetch the movies from the FetchApiDataService service with the help of getAllMovies()
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  }

  getGenreDialog(genre: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      },
    });
  }

  getDirectorDialog(director: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: director.Name,
        born: director.Born,
        content: director.Bio,
      },
    });
  }

  getSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        title: 'Description',
        content: synopsis,
      },
    });
  }

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('added to favorites', 'ok', {
        duration: 2000,
      });
    });
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'ok', {
        duration: 2000,
      });
    });
  }
}
