import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodayMenuComponent } from './today-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TodayMenuComponent', () => {
  let component: TodayMenuComponent;
  let fixture: ComponentFixture<TodayMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayMenuComponent],
      providers: [provideHttpClient(), provideAnimations()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(TodayMenuComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});