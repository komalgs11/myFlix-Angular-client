import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying a movie description dialog.
 */

@Component({
  selector: 'app-movie-description',
  templateUrl: './movie-description.component.html',
  styleUrls: ['./movie-description.component.scss'],
})
export class MovieDescriptionComponent implements OnInit {
  constructor(
    /**
     * Injects data from the movie-card API call to pass to the HTML template.
     *
     * @param data - An object containing title, born, and content for the movie description.
     */
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      born: string;
      content: string;
    }
  ) {}
  ngOnInit(): void {}
}
