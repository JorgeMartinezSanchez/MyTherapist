import 'zone.js';
import 'zone.js/testing';
/// <reference types="jest" />

jest.mock('@fullcalendar/angular', () => ({
  FullCalendarModule: { ngModule: class {} },
  FullCalendarComponent: class {}
}));
jest.mock('@fullcalendar/daygrid', () => ({}));
jest.mock('@fullcalendar/timegrid', () => ({}));
jest.mock('@fullcalendar/interaction', () => ({}));