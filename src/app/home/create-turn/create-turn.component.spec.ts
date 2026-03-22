import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTurnComponent } from './create-turn.component';

describe('CreateTurnComponent', () => {
  let component: CreateTurnComponent;
  let fixture: ComponentFixture<CreateTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTurnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
