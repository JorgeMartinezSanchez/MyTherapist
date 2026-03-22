import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { BookingService } from '../../../services/booking/booking';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-create-turn',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgFor],
  templateUrl: './create-turn.component.html',
  styleUrl: './create-turn.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateTurnComponent {
  public patientForm: FormGroup;
  private step: number = 1;
  private router: Router = inject(Router);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  // --- Calendar ---
  public readonly weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  public currentMonth: number;
  public currentYear: number;
  public selectedDate: Date | null = null;

  private readonly MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  // --- Time picker ---
  public displayHour: number = 7;
  public displayMinute: number = 30;

  constructor(private fb: FormBuilder) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();

    this.patientForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[\d\s]{7,15}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      hour: ['', [Validators.required]]
    });
  }

  // ── Navigation ──────────────────────────────────────────────

  public getBackToHome(): void {
    this.router.navigate(['/home']);
  }

  public getStep(): number {
    return this.step;
  }

  public nextStep(): void {
    const step1Controls = ['name', 'phone', 'email'];
    step1Controls.forEach(c => this.patientForm.get(c)?.markAsTouched());
    const step1Valid = step1Controls.every(c => this.patientForm.get(c)?.valid);
    if (step1Valid) this.step = 2;
  }

  public goBack(): void {
    this.step = 1;
  }

  // ── Calendar ─────────────────────────────────────────────────

  public getMonthName(): string {
    return this.MONTH_NAMES[this.currentMonth];
  }

  public prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  public nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  /** Returns [1, 2, ..., N] for the days in the current month */
  public getDaysInMonth(): number[] {
    const count = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  /* Returns an array of empty slots before the first day of the month */
  public getLeadingBlanks(): null[] {
    const firstDow = new Date(this.currentYear, this.currentMonth, 1).getDay();
    return Array(firstDow).fill(null);
  }

  public selectDay(day: number): void {
    const candidate = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (candidate < today) return;
    this.selectedDate = candidate;
  }

  public isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate()
      && this.currentMonth === today.getMonth()
      && this.currentYear === today.getFullYear();
  }

  public isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return day === this.selectedDate.getDate()
      && this.currentMonth === this.selectedDate.getMonth()
      && this.currentYear === this.selectedDate.getFullYear();
  }

  public isPast(day: number): boolean {
    const candidate = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return candidate < today;
  }

  // ── Time Picker ───────────────────────────────────────────────

  public padZero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  public incrementHour(): void {
    this.displayHour = (this.displayHour + 1) % 24;
  }

  public decrementHour(): void {
    this.displayHour = (this.displayHour + 23) % 24;
  }

  public incrementMinute(): void {
    this.displayMinute = (this.displayMinute + 5) % 60;
  }

  public decrementMinute(): void {
    this.displayMinute = (this.displayMinute + 55) % 60;
  }

  // ── Submit ────────────────────────────────────────────────────
  public async createTurn(): Promise<void> {
    if (!this.selectedDate) {
      alert('Please select a date.');
      return;
    }

    // Formatear hora y fecha
    const time = `${this.padZero(this.displayHour)}:${this.padZero(this.displayMinute)}`;
    const date = this.selectedDate.toISOString().split('T')[0]; // "2026-03-21"

    // Obtener therapist_id del usuario logueado
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('No authenticated user found.');
      return;
    }

    // Armar los objetos que espera bookPatient
    const patientData = {
      full_name: this.patientForm.get('name')!.value,
      number_phone: this.patientForm.get('phone')!.value,
      email: this.patientForm.get('email')!.value,
    };

    const sessionData = {
      therapist_id: currentUser.id,
      date: date,
      time: time,
    };

    try {
      await this.bookingService.bookPatient(patientData, sessionData);
      this.router.navigate(['/home/today']);
    } catch (error) {
      console.error('Error creating turn:', error);
      alert('Error al crear el turno. Intente nuevamente.');
    }
  }
}