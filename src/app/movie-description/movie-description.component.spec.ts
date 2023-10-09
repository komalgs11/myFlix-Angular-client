import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDescriptionComponent } from './movie-description.component';

describe('MovieDescriptionComponent', () => {
  let component: MovieDescriptionComponent;
  let fixture: ComponentFixture<MovieDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieDescriptionComponent]
    });
    fixture = TestBed.createComponent(MovieDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
