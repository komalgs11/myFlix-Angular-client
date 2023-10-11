import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mymoviesflix-415489b92353.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http

  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError)); //.pipe used to combine multiple functions into a single function.
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the get all movies endpoint
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
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    let parsedUser = JSON.parse(`${user}`);
    const id = parsedUser._id;
    return this.http
      .get(apiUrl + 'users/' + id, {
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
  addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    let parsedUser = JSON.parse(`${user}`);
    const id = parsedUser._id;

    return this.http
      .post(
        apiUrl + 'users/' + id + '/movies/' + movieID,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the Delete favorite movie endpoint
  deleteFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    let parsedUser = JSON.parse(`${user}`);
    const id = parsedUser._id;

    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + 'users/' + id + '/movies/' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get user by name details endpoint
  getUser(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let parsedUser = JSON.parse(`${user}`);
    const id = parsedUser._id;
    return this.http
      .get(apiUrl + 'users/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the edit user endpoint
  editUser(userData: any | null): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user._id;
    const token = localStorage.getItem('token');
    console.log('userData:', userData);
    return this.http
      .put(apiUrl + 'users/' + id, userData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the Delete user endpoint
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user._id;
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
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
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
