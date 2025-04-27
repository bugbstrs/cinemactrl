import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowingListComponent } from './showing-list.component';

describe('ShowingListComponent', () => {
  let component: ShowingListComponent;
  let fixture: ComponentFixture<ShowingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
