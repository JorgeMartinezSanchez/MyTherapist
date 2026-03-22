import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BookingService } from '../../../services/booking/booking';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  private sessionService = inject(BookingService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // ← Separa los eventos del resto de opciones
  calendarEvents: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    locale: 'en',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: []
  };

  async ngOnInit(): Promise<void> {
    const therapist = this.authService.getCurrentUser();
    if (!therapist) return;

    const sessions = await this.sessionService.getAllSessions(therapist.id);
    if (!sessions) return;

    this.calendarEvents = sessions
      .filter(s => s.Patient != null)
      .map(s => {

        const patientData: any = s.Patient; 

        const fullName = Array.isArray(patientData) 
          ? patientData[0]?.full_name 
          : patientData?.full_name;

        return {
          title: fullName || 'Sin nombre',
          start: `${s.date}T${s.time}`,
        };
      });

    // Fuerza el re-render
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.calendarEvents
    };
    this.cdr.detectChanges();
  }
}