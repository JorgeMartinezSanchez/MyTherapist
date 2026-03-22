import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SessionWithPatient } from '../../../app/interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BookingService } from '../../../services/booking/booking';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-today-menu',
  imports: [FullCalendarModule],
  templateUrl: './today-menu.component.html',
  styleUrl: './today-menu.component.css'
})
export class TodayMenuComponent implements OnInit {
  private sessionService = inject(BookingService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  calendarEvents: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridDay',
    locale: 'en',
    headerToolbar: {
      left: '',
      center: 'title',
      right: ''
    },
    views: {
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric' }
      }
    },
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

    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.calendarEvents
    };
    this.cdr.detectChanges();
  }
}