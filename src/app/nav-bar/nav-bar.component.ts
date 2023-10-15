import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * Component for displaying the navigation bar.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  constructor(
    /**
     * Constructor for NavBarComponent.
     *
     * @param router - Angular router service for navigation.
     * @param fetchApiData - Service for fetching data from the API.
     */
    public router: Router,
    public fetchApiData: FetchApiDataService
  ) {}

  /**
   * Logs out the user by removing user and token information from local storage and navigating to the "welcome" page.
   */
  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
