export const FullCalendarModule = {
  ngModule: class FullCalendarModuleMock {}
};

export class FullCalendarComponent {
  getApi = jest.fn();
}

export const FullCalendar = FullCalendarComponent;