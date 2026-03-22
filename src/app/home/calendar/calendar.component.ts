import { Component, inject, OnInit, ChangeDetectorRef, HostListener, NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BookingService } from '../../../services/booking/booking';
import { AuthService } from '../../../services/auth/auth.service';
import { EventClickArg } from '@fullcalendar/core';
import { EditTurnComponent } from '../edit-turn/edit-turn.component';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, NgIf, EditTurnComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  private sessionService = inject(BookingService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

// 1. Variables para controlar el estado del menú
  showMenu = false;
  menuX = 0;
  menuY = 0;
  selectedSessionId: string = '';

  calendarEvents: any[] = [];

  showEditModal = false;
  selectedDate = '';
  selectedTime = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    locale: 'en',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    // 2. Escuchar el click en los eventos
    eventClick: this.handleEventClick.bind(this),
    events: []
  };

  async ngOnInit(): Promise<void> {
    await this.loadEvents(); // Extraemos la carga a una función para poder reutilizarla al borrar
  }

  async loadEvents() {
    const therapist = this.authService.getCurrentUser();
    if (!therapist) return;

    const sessions = await this.sessionService.getAllSessions(therapist.id);
    if (!sessions) return;

    this.calendarEvents = sessions
      .filter(s => s.Patient != null)
      .map(s => {
        const patientData: any = s.Patient; 
        const fullName = Array.isArray(patientData) ? patientData[0]?.full_name : patientData?.full_name;

        return {
          id: s.id, // <-- ¡VITAL! Pasar el ID de Supabase al calendario
          title: fullName || 'Sin nombre',
          start: `${s.date}T${s.time}`,
          // extendedProps te permite guardar info extra para usarla en "Editar"
          extendedProps: { date: s.date, time: s.time } 
        };
      });

    this.calendarOptions = { ...this.calendarOptions, events: this.calendarEvents };
    this.cdr.detectChanges();
  }

  // 3. Función que se dispara al hacer click en una cita
  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
    clickInfo.jsEvent.stopPropagation(); 
    
    // Capturamos el ID
    this.selectedSessionId = clickInfo.event.id;

    // FullCalendar guarda la fecha entera en 'startStr' (Ej: "2026-03-22T14:30:00-04:00")
    // Usamos split('T') para separar la fecha de la hora
    if (clickInfo.event.startStr) {
      this.selectedDate = clickInfo.event.startStr.split('T')[0]; // Se queda con "2026-03-22"
      this.selectedTime = clickInfo.event.startStr.split('T')[1].substring(0, 5); // Se queda con "14:30"
    }

    this.menuX = clickInfo.jsEvent.clientX;
    this.menuY = clickInfo.jsEvent.clientY;
    this.showMenu = true;
  }

  // 4. Función de borrado llamando a tu servicio
  async onDeleteClick() {
    const confirmDelete = confirm('Are you sure you want to delete this session?');
    if (confirmDelete) {
      try {
        await this.sessionService.deleteSession(this.selectedSessionId);
        this.showMenu = false;
        await this.loadEvents(); // Recargar el calendario después de borrar
      } catch (error) {
        alert('Error deleting the session');
      }
    }
  }

  // 5. Función de edición (para el futuro pop-up)
  onEditClick() {
    this.showMenu = false; // Cerramos el menú pequeñito
    this.showEditModal = true; // Abrimos el Pop-up grande de edición
  }

  // 6. Cerrar el menú si el usuario hace click en cualquier otro lado de la pantalla
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    this.showMenu = false;
  }
  
  preventClose(event: /*Event*/ MouseEvent) {
    event.stopPropagation();
  }

  async handleSaveEdit(event: {id: string, newDate: string, newTime: string}) {
    // ESTE ES EL DETECTOR:
    console.log("¡El Calendario escuchó el evento!", event);

    try {
      // Si el console.log de arriba funciona, esta línea debería llamar a booking.ts
      await this.sessionService.editSession(event.id, event.newDate, event.newTime);
      this.showEditModal = false;
      await this.ngOnInit(); 
    } catch (error) {
      console.error('Error al guardar la edición:', error);
    }
  }
}