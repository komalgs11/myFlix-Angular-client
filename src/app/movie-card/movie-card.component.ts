import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  //ngOnInit() is called when Angular is done creating the component.
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteList();
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

  getFavoriteList(): void {
    this.fetchApiData.getFavoriteMovies().subscribe(
      (favMovieIDs: any) => {
        if (favMovieIDs) {
          this.favoriteMovies = favMovieIDs;
        } else {
          this.favoriteMovies = [];
        }
      },
      (error) => {
        console.error('Error fetching favorite movies:', error);
        this.favoriteMovies = [];
      }
    );
  }

  isFavorite(id: string): boolean {
    if (this.favoriteMovies.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  addFavorite(movieID: string): void {
    this.fetchApiData.addFavoriteMovie(movieID).subscribe((response: any) => {
      this.favoriteMovies = response;
      console.log(this.favoriteMovies);

      this.getFavoriteList();
      return this.favoriteMovies;
    });
  }

  removeFavorite(movieID: string): void {
    this.fetchApiData
      .deleteFavoriteMovie(movieID)
      .subscribe((response: any) => {
        this.favoriteMovies = response;
        console.log(this.favoriteMovies);

        this.getFavoriteList();
        return this.favoriteMovies;
      });
  }
}
