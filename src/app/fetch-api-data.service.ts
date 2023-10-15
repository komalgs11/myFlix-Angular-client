import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that provide data for the client app
const apiUrl = 'https://mymoviesflix-415489b92353.herokuapp.com/';

/**
 * This service provides methods for making HTTP requests to the server
 * to perform user-related operations, including user registration, login,
 * profile editing, and more.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http

  constructor(private http: HttpClient) {}

  // Making the API call for the user registration endpoint
  /**
   * Registers a new user by sending their details to the server.
   *
   * @param userDetails - An object containing user registration details.
   * @returns An observable of the registration result.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the user login endpoint
  /**
   * Logs in a user by sending their login details to the server.
   *
   * @param userDetails - An object containing user login details.
   * @returns An observable of the login result.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the get all movies endpoint
  /**
   * Retrieves a list of all available movies from the server.
   *
   * @returns An observable of the list of movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one movie details endpoint
  /**
   * Retrieves details of a specific movie by its title.
   *
   * @param Title - The title of the movie to fetch details for.
   * @returns An observable of the movie details.
   */
  getOneMovie(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + Title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one director details endpoint
  /**
   * Retrieves detailed information about a specific movie director by their name.
   *
   * @param directorName - The name of the director to retrieve.
   * @returns An observable of the director details.
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Director/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one genre details endpoint
  /**
   * Retrieves detailed information about a specific movie genre by its name.
   *
   * @param genreName - The name of the genre to retrieve.
   * @returns An observable of the genre details.
   */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get favorite movies endpoint
  /**
   * Retrieves a list of a user's favorite movies.
   *
   * @returns An observable of the user's favorite movies list.
   */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return this.http
      .get(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.favoriteMovies),
        catchError(this.handleError)
      );
  }

  // Making the api call for the add favorite movie endpoint
  /**
   * Adds a movie to the user's list of favorite movies.
   *
   * @param movieId - The ID of the movie to add to favorites.
   * @returns An observable indicating success or failure.
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.favoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(
        apiUrl + 'users/' + user.Username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text',
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Checks if a movie is in the user's list of favorite movies.
   *
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is a favorite, otherwise false.
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies.includes(movieId);
  }

  // Making the api call for the Delete favorite movie endpoint
  /**
   * Removes a movie from the user's list of favorite movies.
   *
   * @param movieId - The ID of the movie to remove from favorites.
   * @returns An observable indicating success or failure.
   */

  removeFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.favoriteMovies.indexOf(movieId);
    if (index > -1) {
      user.favoriteMovies.splice(index, 1);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return this.http
      .delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get user by name details endpoint
  /**
   * Retrieves user data from local storage.
   *
   * @returns An observable containing user data.
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  // Making the api call for the edit user endpoint
  /**
   * Updates the user's information with new data.
   *
   * @param updateUser - The updated user data.
   * @returns An observable containing the updated user data.
   */
  editUser(updateUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.Username, updateUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the Delete user endpoint
  /**
   * Deletes the user's account and related information.
   *
   * @returns An observable that indicates the successful deletion of the user account.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
