import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlDashboardComponent } from './url-dashboard.component';

describe('UrlDashboardComponent', () => {
  let component: UrlDashboardComponent;
  let fixture: ComponentFixture<UrlDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
