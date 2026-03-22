# MyTherapist 🗓️

**MyTherapist** es una aplicación web desarrollada en **Angular** para la gestión de turnos de terapeutas. Permite registrar, visualizar, editar y eliminar sesiones de pacientes desde una interfaz limpia y funcional, con autenticación por terapeuta y persistencia de datos en **Supabase**.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Rol |
|---|---|
| Angular 17+ | Framework frontend (Standalone Components) |
| Angular Material | Componentes UI |
| FullCalendar | Visualización de sesiones en calendario |
| Supabase | Base de datos y backend (PostgreSQL) |
| TypeScript | Lenguaje principal |

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── home/
│   │   ├── calendar/          # Vista de calendario completo
│   │   ├── today-menu/        # Vista del día actual
│   │   ├── create-turn/       # Formulario de creación de turno
│   │   └── edit-turn/         # Modal de edición de turno
│   ├── login/                 # Pantalla de login
│   ├── interfaces.ts          # Interfaces TypeScript (Session, Patient, Therapist)
│   ├── app.routes.ts          # Definición de rutas
│   └── app.config.ts
├── services/
│   ├── auth/                  # AuthService + AuthGuard
│   ├── booking/               # BookingService (CRUD de sesiones)
│   ├── therapist/             # TherapistService
│   └── supabase/              # Cliente Supabase
└── environments/
    └── environment.ts
```

---

## 🗃️ Modelo de datos

### `Therapist`
| Campo | Tipo |
|---|---|
| `id` | string |
| `full_name` | string |
| `email` | string |
| `password` | string |
| `created_at` | string |

### `Patient`
| Campo | Tipo |
|---|---|
| `id` | string |
| `full_name` | string |
| `number_phone` | string |
| `email` | string |
| `created_at` | string |

### `Session`
| Campo | Tipo |
|---|---|
| `id` | string |
| `therapist_id` | string |
| `patient_id` | string |
| `date` | string |
| `time` | string |
| `created_at` | string |

---

## 📋 Historias de usuario

Las siguientes historias de usuario fueron definidas y priorizadas de mayor a menor importancia por el equipo durante la etapa de planificación.

---

### 🔴 Alta prioridad

---

#### HU-01 — Registrar un turno
> **Como** terapeuta,  
> **quiero** registrar un nuevo turno indicando la fecha, la hora y el nombre del paciente,  
> **para** tener un registro organizado de mis sesiones.

**Criterios de aceptación:**
- El sistema debe permitir ingresar nombre completo, teléfono y email del paciente.
- El sistema debe permitir seleccionar una fecha desde un calendario visual.
- El sistema debe permitir seleccionar una hora mediante un selector de horas y minutos.
- Al confirmar, la sesión debe guardarse y reflejarse en el calendario.

---

#### HU-02 — Impedir turnos duplicados
> **Como** terapeuta,  
> **quiero** que el sistema impida la creación de turnos en un horario ya ocupado,  
> **para** evitar conflictos de agenda.

**Criterios de aceptación:**
- Si ya existe un turno para la misma fecha y hora, el sistema debe rechazar la creación.
- Se debe mostrar un mensaje claro indicando que el horario está ocupado.

---

#### HU-03 — Validar campos obligatorios
> **Como** terapeuta,  
> **quiero** que el sistema valide los campos obligatorios al registrar un turno,  
> **para** asegurar que los datos ingresados estén completos y sean correctos.

**Criterios de aceptación:**
- Los campos nombre, teléfono y email son obligatorios.
- El campo teléfono debe aceptar entre 7 y 15 dígitos numéricos.
- El campo email debe tener formato válido.
- Los errores de validación deben mostrarse en línea, junto a cada campo.

---

#### HU-04 — Alerta al modificar hacia horario ocupado
> **Como** terapeuta,  
> **quiero** recibir una alerta si intento mover un turno a un horario ya ocupado,  
> **para** no sobreescribir una sesión existente por error.

**Criterios de aceptación:**
- Al guardar una edición, el sistema debe verificar que el nuevo horario esté disponible.
- Si está ocupado, debe mostrar un mensaje de advertencia sin guardar los cambios.

---

#### HU-05 — Cancelar un turno existente
> **Como** terapeuta,  
> **quiero** poder cancelar un turno existente,  
> **para** liberar ese horario en caso de que la sesión no se realice.

**Criterios de aceptación:**
- Desde el calendario, al hacer clic sobre un turno, debe aparecer la opción de cancelar.
- El sistema debe pedir confirmación antes de proceder.
- Al confirmar, el turno debe eliminarse del calendario.

---

#### HU-06 — Modificar un turno existente
> **Como** terapeuta,  
> **quiero** poder modificar la fecha y la hora de un turno existente,  
> **para** reprogramar una sesión sin necesidad de eliminarla y crearla nuevamente.

**Criterios de aceptación:**
- Desde el calendario, al hacer clic sobre un turno, debe aparecer la opción de editar.
- El modal de edición debe mostrar la fecha y hora actuales precargadas.
- Al guardar, los cambios deben reflejarse de inmediato en el calendario.

---

### 🟡 Prioridad media

---

#### HU-07 — Buscar turnos por nombre de paciente
> **Como** terapeuta,  
> **quiero** poder buscar turnos filtrando por el nombre del paciente,  
> **para** encontrar rápidamente una sesión específica sin recorrer todo el calendario.

**Criterios de aceptación:**
- El sistema debe ofrecer un campo de búsqueda de texto libre.
- Los resultados deben filtrarse en tiempo real a medida que se escribe.
- Si no hay resultados, se debe mostrar un mensaje informativo.

---

#### HU-08 — Visualizar horarios disponibles y ocupados
> **Como** terapeuta,  
> **quiero** visualizar de forma diferenciada los horarios disponibles y los ocupados,  
> **para** identificar fácilmente mi disponibilidad al agendar una sesión.

**Criterios de aceptación:**
- Los horarios con turno deben mostrarse con un color o indicador distinto al de los disponibles.
- La diferencia visual debe ser clara en la vista de calendario.

---

#### HU-09 — Vista semanal de turnos
> **Como** terapeuta,  
> **quiero** visualizar mis turnos en una vista semanal,  
> **para** tener una perspectiva general de mi agenda de la semana.

**Criterios de aceptación:**
- El calendario debe ofrecer una vista de semana completa (lunes a domingo o domingo a sábado).
- Cada turno debe mostrar al menos el nombre del paciente y el horario.

---

#### HU-10 — Cantidad de turnos por día
> **Como** terapeuta,  
> **quiero** ver cuántos turnos tengo agendados por día,  
> **para** estimar mi carga de trabajo de un vistazo.

**Criterios de aceptación:**
- En la vista de calendario mensual, cada día debe mostrar un indicador con el número de turnos.

---

#### HU-11 — Turnos ordenados cronológicamente
> **Como** terapeuta,  
> **quiero** visualizar mis turnos ordenados de forma cronológica,  
> **para** seguir el flujo natural de mi día sin confusión.

**Criterios de aceptación:**
- Los turnos del día deben listarse de menor a mayor horario.
- El orden debe actualizarse automáticamente al crear o editar un turno.

---

### 🟢 Baja prioridad

---

#### HU-12 — Confirmación visual al guardar un turno
> **Como** terapeuta,  
> **quiero** recibir una confirmación visual cuando guardo un turno exitosamente,  
> **para** tener certeza de que la operación se completó sin errores.

**Criterios de aceptación:**
- Tras guardar, debe mostrarse un mensaje de éxito (ej. snackbar, toast o modal).
- El mensaje debe desaparecer automáticamente después de unos segundos.

---

#### HU-13 — Eliminar definitivamente un turno
> **Como** terapeuta,  
> **quiero** poder eliminar definitivamente un turno,  
> **para** mantener mi calendario limpio y sin registros obsoletos.

**Criterios de aceptación:**
- La acción de eliminar debe estar disponible desde el menú contextual del turno en el calendario.
- El sistema debe solicitar confirmación antes de eliminar.
- Una vez eliminado, el turno no puede recuperarse.

---

#### HU-14 — Exportar lista semanal de turnos
> **Como** terapeuta,  
> **quiero** poder exportar la lista de turnos de la semana,  
> **para** tener un respaldo o compartirlo con quien corresponda.

**Criterios de aceptación:**
- El sistema debe permitir exportar en un formato estándar (PDF o CSV).
- La exportación debe incluir nombre del paciente, fecha y hora de cada sesión.

---

#### HU-15 — Resaltar el día actual en la agenda
> **Como** terapeuta,  
> **quiero** que el día actual esté resaltado visualmente en la agenda,  
> **para** orientarme rápidamente al abrir la aplicación.

**Criterios de aceptación:**
- El día actual debe diferenciarse visualmente del resto (color de fondo, borde, etc.).
- El resaltado debe actualizarse automáticamente cada día.

---

## 🚀 Cómo ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve

# Abrir en el navegador
http://localhost:4200
```

---

## 🔐 Autenticación

El acceso está protegido por un `AuthGuard`. El login se realiza con email y contraseña de terapeuta, verificados contra la tabla `Therapists` en Supabase. La sesión se persiste en `localStorage`.

---

## 👤 Autor

Proyecto académico desarrollado como sistema de gestión de turnos para terapeutas.
