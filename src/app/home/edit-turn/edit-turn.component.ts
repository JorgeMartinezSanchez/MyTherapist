import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-turn',
  imports: [NgFor],
  templateUrl: './edit-turn.component.html',
  styleUrl: './edit-turn.component.css',
})
export class EditTurnComponent implements OnInit {
  @Input() sessionId!: string;
  @Input() currentDate!: string;
  @Input() currentTime!: string; 
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{id: string, newDate: string, newTime: string}>();
  
  public readonly weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  public currentMonth!: number;
  public currentYear!: number;
  public selectedDate: Date | null = null;
  public displayHour: number = 12;
  public displayMinute: number = 0;

  private readonly MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  ngOnInit() {
    if (this.currentDate) {
      this.selectedDate = new Date(this.currentDate + 'T00:00:00');
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
    } else {
      const now = new Date();
      this.currentMonth = now.getMonth();
      this.currentYear = now.getFullYear();
    }

    if (this.currentTime) {
      const parts = this.currentTime.split(':');
      this.displayHour = parseInt(parts[0], 10);
      this.displayMinute = parseInt(parts[1], 10);
    }
  }

  public get monthName(): string { return this.MONTH_NAMES[this.currentMonth]; }
  
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

  public getDaysInMonth(): number[] {
    const daysCount = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  public getLeadingBlanks(): number[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    return Array.from({ length: firstDay }, (_, i) => i);
  }

  public isToday(day: number): boolean {
    const today = new Date();
    return this.currentYear === today.getFullYear() &&
           this.currentMonth === today.getMonth() &&
           day === today.getDate();
  }

  public isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return this.currentYear === this.selectedDate.getFullYear() &&
           this.currentMonth === this.selectedDate.getMonth() &&
           day === this.selectedDate.getDate();
  }

  public isPast(day: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(this.currentYear, this.currentMonth, day);
    return checkDate.getTime() < today.getTime();
  }

  public selectDay(day: number): void {
    if (this.isPast(day)) return; // Evitar seleccionar días pasados
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

  // --- Lógica de Tiempo ---
  public padZero(val: number): string {
    return val < 10 ? '0' + val : val.toString();
  }
  public incrementHour(): void { this.displayHour = (this.displayHour + 1) % 24; }
  public decrementHour(): void { this.displayHour = (this.displayHour + 23) % 24; }
  public incrementMinute(): void { this.displayMinute = (this.displayMinute + 5) % 60; }
  public decrementMinute(): void { this.displayMinute = (this.displayMinute + 55) % 60; }

  cancel(event: Event) {
    event.stopPropagation();
    this.onClose.emit();
  }

  save() {
    if (!this.selectedDate) {
      alert("Please select a date");
      return;
    }

    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    const formattedTime = `${this.padZero(this.displayHour)}:${this.padZero(this.displayMinute)}`;
    
    this.onSave.emit({
      id: this.sessionId,
      newDate: formattedDate,
      newTime: formattedTime
    });
  }
}