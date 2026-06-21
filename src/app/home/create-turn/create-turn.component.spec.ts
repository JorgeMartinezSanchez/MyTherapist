import 'jest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CreateTurnComponent } from './create-turn.component';
import { BookingService } from '../../../services/booking/booking';
import { AuthService } from '../../../services/auth/auth.service';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRouter = { navigate: jest.fn() };

const mockBookingService = {
  bookPatient: jest.fn().mockResolvedValue(undefined),
};

const mockAuthService = {
  getCurrentUser: jest.fn().mockReturnValue({ id: 'therapist-123' }),
};

// ─── Suite principal ──────────────────────────────────────────────────────────

describe('CreateTurnComponent', () => {
  let component: CreateTurnComponent;
  let fixture: ComponentFixture<CreateTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateTurnComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router,         useValue: mockRouter         },
        { provide: BookingService, useValue: mockBookingService },
        { provide: AuthService,    useValue: mockAuthService    },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(CreateTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Limpiar llamadas previas entre tests
    jest.clearAllMocks();
  });

  // ── 1. Creación del componente ─────────────────────────────────────────────

  describe('Inicialización', () => {
    it('debería crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería iniciar en el paso 1', () => {
      expect(component.getStep()).toBe(1);
    });

    it('debería iniciar sin fecha seleccionada', () => {
      expect(component.selectedDate).toBeNull();
    });

    it('debería iniciar la hora en 07:30', () => {
      expect(component.displayHour).toBe(7);
      expect(component.displayMinute).toBe(30);
    });

    it('debería iniciar el formulario con campos vacíos', () => {
      const { name, phone, email } = component['patientForm'].controls;
      expect(name.value).toBe('');
      expect(phone.value).toBe('');
      expect(email.value).toBe('');
    });
  });

  // ── 2. Validación de campos del formulario ─────────────────────────────────

  describe('Validación - campo name', () => {
    it('debería ser inválido cuando está vacío', () => {
      component['patientForm'].get('name')!.setValue('');
      expect(component['patientForm'].get('name')!.invalid).toBe(true);
    });

    it('debería ser inválido con caracteres numéricos', () => {
      component['patientForm'].get('name')!.setValue('Juan123');
      expect(component['patientForm'].get('name')!.invalid).toBe(true);
    });

    it('debería ser válido con letras y acentos', () => {
      component['patientForm'].get('name')!.setValue('María José');
      expect(component['patientForm'].get('name')!.valid).toBe(true);
    });
  });

  describe('Validación - campo phone', () => {
    it('debería ser inválido cuando está vacío', () => {
      component['patientForm'].get('phone')!.setValue('');
      expect(component['patientForm'].get('phone')!.invalid).toBe(true);
    });

    it('debería ser inválido con menos de 7 dígitos', () => {
      component['patientForm'].get('phone')!.setValue('12345');
      expect(component['patientForm'].get('phone')!.invalid).toBe(true);
    });

    it('debería ser válido con formato internacional', () => {
      component['patientForm'].get('phone')!.setValue('+59171234567');
      expect(component['patientForm'].get('phone')!.valid).toBe(true);
    });

    it('debería ser válido con 7 dígitos simples', () => {
      component['patientForm'].get('phone')!.setValue('7123456');
      expect(component['patientForm'].get('phone')!.valid).toBe(true);
    });
  });

  describe('Validación - campo email', () => {
    it('debería ser inválido cuando está vacío', () => {
      component['patientForm'].get('email')!.setValue('');
      expect(component['patientForm'].get('email')!.invalid).toBe(true);
    });

    it('debería ser inválido sin @', () => {
      component['patientForm'].get('email')!.setValue('correo-invalido');
      expect(component['patientForm'].get('email')!.invalid).toBe(true);
    });

    it('debería ser válido con formato correcto', () => {
      component['patientForm'].get('email')!.setValue('paciente@gmail.com');
      expect(component['patientForm'].get('email')!.valid).toBe(true);
    });
  });

  // ── 3. Navegación entre pasos ──────────────────────────────────────────────

  describe('nextStep()', () => {
    it('NO debería avanzar al paso 2 si los campos están vacíos', () => {
      component.nextStep();
      expect(component.getStep()).toBe(1);
    });

    it('NO debería avanzar si solo algunos campos son válidos', () => {
      component['patientForm'].get('name')!.setValue('Juan Pérez');
      component['patientForm'].get('phone')!.setValue('71234567');
      // email vacío
      component.nextStep();
      expect(component.getStep()).toBe(1);
    });

    it('debería avanzar al paso 2 cuando todos los campos son válidos', () => {
      component['patientForm'].get('name')!.setValue('Juan Pérez');
      component['patientForm'].get('phone')!.setValue('71234567');
      component['patientForm'].get('email')!.setValue('juan@mail.com');
      component.nextStep();
      expect(component.getStep()).toBe(2);
    });

    it('debería marcar todos los controles como touched al intentar avanzar', () => {
      component.nextStep();
      const touched = ['name', 'phone', 'email'].every(
        c => component['patientForm'].get(c)!.touched
      );
      expect(touched).toBe(true);
    });
  });

  describe('goBack()', () => {
    it('debería regresar al paso 1 desde el paso 2', () => {
      // Avanzar primero
      component['patientForm'].get('name')!.setValue('Juan Pérez');
      component['patientForm'].get('phone')!.setValue('71234567');
      component['patientForm'].get('email')!.setValue('juan@mail.com');
      component.nextStep();
      expect(component.getStep()).toBe(2);

      component.goBack();
      expect(component.getStep()).toBe(1);
    });
  });

  // ── 4. Lógica del calendario ───────────────────────────────────────────────

  describe('Calendario', () => {
    it('debería retornar el nombre del mes actual', () => {
      const meses = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ];
      const expected = meses[component.currentMonth];
      expect(component.getMonthName()).toBe(expected);
    });

    it('prevMonth() debería retroceder al mes anterior', () => {
      component.currentMonth = 5; // Junio
      component.prevMonth();
      expect(component.currentMonth).toBe(4); // Mayo
    });

    it('prevMonth() debería pasar a diciembre del año anterior cuando es enero', () => {
      component.currentMonth = 0;
      component.currentYear  = 2026;
      component.prevMonth();
      expect(component.currentMonth).toBe(11);
      expect(component.currentYear).toBe(2025);
    });

    it('nextMonth() debería avanzar al mes siguiente', () => {
      component.currentMonth = 5; // Junio
      component.nextMonth();
      expect(component.currentMonth).toBe(6); // Julio
    });

    it('nextMonth() debería pasar a enero del año siguiente cuando es diciembre', () => {
      component.currentMonth = 11;
      component.currentYear  = 2025;
      component.nextMonth();
      expect(component.currentMonth).toBe(0);
      expect(component.currentYear).toBe(2026);
    });

    it('getDaysInMonth() debería retornar 31 días para enero', () => {
      component.currentMonth = 0;
      component.currentYear  = 2026;
      expect(component.getDaysInMonth().length).toBe(31);
    });

    it('getDaysInMonth() debería retornar 28 días para febrero 2025 (no bisiesto)', () => {
      component.currentMonth = 1;
      component.currentYear  = 2025;
      expect(component.getDaysInMonth().length).toBe(28);
    });

    it('selectDay() debería ignorar días pasados', () => {
      component.currentMonth = 0;
      component.currentYear  = 2020; // Año pasado
      component.selectDay(1);
      expect(component.selectedDate).toBeNull();
    });

    it('selectDay() debería seleccionar una fecha futura correctamente', () => {
      const futuro = new Date();
      futuro.setDate(futuro.getDate() + 7); // 1 semana en el futuro
      component.currentMonth = futuro.getMonth();
      component.currentYear  = futuro.getFullYear();
      component.selectDay(futuro.getDate());
      expect(component.selectedDate).not.toBeNull();
      expect(component.selectedDate!.getDate()).toBe(futuro.getDate());
    });

    it('isToday() debería retornar true para el día de hoy', () => {
      const today = new Date();
      component.currentMonth = today.getMonth();
      component.currentYear  = today.getFullYear();
      expect(component.isToday(today.getDate())).toBe(true);
    });

    it('isPast() debería retornar true para una fecha pasada', () => {
      component.currentMonth = 0;
      component.currentYear  = 2020;
      expect(component.isPast(1)).toBe(true);
    });
  });

  // ── 5. Lógica del Time Picker ──────────────────────────────────────────────

  describe('Time Picker', () => {
    it('padZero() debería agregar cero a números menores que 10', () => {
      expect(component.padZero(7)).toBe('07');
      expect(component.padZero(0)).toBe('00');
    });

    it('padZero() NO debería agregar cero a números >= 10', () => {
      expect(component.padZero(10)).toBe('10');
      expect(component.padZero(23)).toBe('23');
    });

    it('incrementHour() debería incrementar la hora en 1', () => {
      component.displayHour = 10;
      component.incrementHour();
      expect(component.displayHour).toBe(11);
    });

    it('incrementHour() debería hacer wrap a 0 desde 23', () => {
      component.displayHour = 23;
      component.incrementHour();
      expect(component.displayHour).toBe(0);
    });

    it('decrementHour() debería decrementar la hora en 1', () => {
      component.displayHour = 10;
      component.decrementHour();
      expect(component.displayHour).toBe(9);
    });

    it('decrementHour() debería hacer wrap a 23 desde 0', () => {
      component.displayHour = 0;
      component.decrementHour();
      expect(component.displayHour).toBe(23);
    });

    it('incrementMinute() debería avanzar en saltos de 5', () => {
      component.displayMinute = 30;
      component.incrementMinute();
      expect(component.displayMinute).toBe(35);
    });

    it('incrementMinute() debería hacer wrap a 0 desde 55', () => {
      component.displayMinute = 55;
      component.incrementMinute();
      expect(component.displayMinute).toBe(0);
    });

    it('decrementMinute() debería retroceder en saltos de 5', () => {
      component.displayMinute = 30;
      component.decrementMinute();
      expect(component.displayMinute).toBe(25);
    });

    it('decrementMinute() debería hacer wrap a 55 desde 0', () => {
      component.displayMinute = 0;
      component.decrementMinute();
      expect(component.displayMinute).toBe(55);
    });
  });

  // ── 6. createTurn() ────────────────────────────────────────────────────────

  describe('createTurn()', () => {
    const llenarFormulario = (component: CreateTurnComponent) => {
      component['patientForm'].get('name')!.setValue('Juan Pérez');
      component['patientForm'].get('phone')!.setValue('71234567');
      component['patientForm'].get('email')!.setValue('juan@mail.com');
    };

    const seleccionarFechaFutura = (component: CreateTurnComponent) => {
      const futuro = new Date();
      futuro.setDate(futuro.getDate() + 7);
      component.currentMonth = futuro.getMonth();
      component.currentYear  = futuro.getFullYear();
      component.selectDay(futuro.getDate());
    };

it('debería llamar a bookPatient con los datos correctos', async () => {
      llenarFormulario(component);
      seleccionarFechaFutura(component);
      component.displayHour   = 10;
      component.displayMinute = 30;

      await component.createTurn();

      expect(mockBookingService.bookPatient).toHaveBeenCalledTimes(1);

      const [patientArg, turnArg] = mockBookingService.bookPatient.mock.calls[0];

      expect(patientArg).toEqual({
        full_name:    'Juan Pérez',
        number_phone: '71234567',
        email:        'juan@mail.com',
      });

      expect(turnArg.therapist_id).toBe('therapist-123');
      expect(turnArg.time).toBe('10:30');
    });

    it('debería navegar a /home/today tras crear el turno exitosamente', async () => {
      llenarFormulario(component);
      seleccionarFechaFutura(component);

      await component.createTurn();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/today']);
    });

    it('NO debería llamar a bookPatient si no hay fecha seleccionada', async () => {
      llenarFormulario(component);
      component.selectedDate = null;

      await component.createTurn();

      expect(mockBookingService.bookPatient).not.toHaveBeenCalled();
    });

    it('NO debería navegar si bookPatient lanza un error', async () => {
      llenarFormulario(component);
      seleccionarFechaFutura(component);
      mockBookingService.bookPatient.mockRejectedValueOnce(new Error('DB error'));

      await component.createTurn();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('NO debería llamar a bookPatient si no hay usuario autenticado', async () => {
      llenarFormulario(component);
      seleccionarFechaFutura(component);
      mockAuthService.getCurrentUser.mockReturnValueOnce(null);

      await component.createTurn();

      expect(mockBookingService.bookPatient).not.toHaveBeenCalled();
    });
  });
});
