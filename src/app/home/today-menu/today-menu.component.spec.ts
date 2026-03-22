import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayMenuComponent } from './today-menu.component';

describe('TodayMenuComponent', () => {
  let component: TodayMenuComponent;
  let fixture: ComponentFixture<TodayMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayMenuComponent]
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
