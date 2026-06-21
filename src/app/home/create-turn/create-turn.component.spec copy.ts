import 'jest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateTurnComponent } from './create-turn.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('CreateTurnComponent - Form Validation', () => {
  let component: CreateTurnComponent;
  let fixture: ComponentFixture<CreateTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        CreateTurnComponent,
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // PRUEBA 1: Validación de nombre - campo requerido y solo letras
  it('should mark name as invalid when empty or contains numbers', () => {
    const nameControl = component.patientForm.get('name');
    
    // Caso vacío
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.hasError('required')).toBeTruthy();
    
    // Caso con números
    nameControl?.setValue('Juan123');
    expect(nameControl?.hasError('pattern')).toBeTruthy();
    
    // Caso válido
    nameControl?.setValue('Juan Carlos');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('should mark email as invalid when format is incorrect', () => {
    const emailControl = component.patientForm.get('email');
    
    // Email inválido
    emailControl?.setValue('correo-invalido');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Email válido
    emailControl?.setValue('paciente@test.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should not select past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    component.currentYear = yesterday.getFullYear();
    component.currentMonth = yesterday.getMonth();
    const pastDay = yesterday.getDate();
    
    expect(component.isPast(pastDay)).toBeTruthy();
    
    // Seleccionar día pasado no debería cambiar selectedDate
    component.selectDay(pastDay);
    expect(component.selectedDate).toBeNull();
  });

  it('should select a future date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    component.currentYear = tomorrow.getFullYear();
    component.currentMonth = tomorrow.getMonth();
    const futureDay = tomorrow.getDate();
    
    expect(component.isPast(futureDay)).toBeFalsy();
    
    component.selectDay(futureDay);
    expect(component.selectedDate).not.toBeNull();
    expect(component.selectedDate?.getDate()).toBe(futureDay);
  });

  it('should increment hour cyclically (0-23)', () => {
    component.displayHour = 23;
    component.incrementHour();
    expect(component.displayHour).toBe(0);
    
    component.displayHour = 10;
    component.incrementHour();
    expect(component.displayHour).toBe(11);
  });

  it('should increment minutes in steps of 5', () => {
    component.displayMinute = 55;
    component.incrementMinute();
    expect(component.displayMinute).toBe(0);
    
    component.displayMinute = 30;
    component.incrementMinute();
    expect(component.displayMinute).toBe(35);
  });

  it('should initialize date and time from inputs', () => {
    expect(component.selectedDate?.toISOString().split('T')[0]).toBe('2025-06-15');
    expect(component.displayHour).toBe(14);
    expect(component.displayMinute).toBe(30);
  });

  // PRUEBA 8: No permitir seleccionar días pasados
  it('should not allow selecting past days', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    component.currentYear = yesterday.getFullYear();
    component.currentMonth = yesterday.getMonth();
    const pastDay = yesterday.getDate();
    
    expect(component.isPast(pastDay)).toBeTruthy();
    
    component.selectDay(pastDay);
    // selectedDate no debería cambiar si es día pasado
    expect(component.selectedDate?.toISOString().split('T')[0]).not.toBe(
      `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${pastDay}`
    );
  });
});
