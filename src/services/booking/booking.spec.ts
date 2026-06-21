import { TestBed } from '@angular/core/testing';
import { BookingService } from './booking';
import { SupabaseService } from '../supabase/supabase';
import { Patient, Session, SessionWithPatient } from '../../app/interfaces';

describe('BookingService', () => {
  let service: BookingService;
  let mockSupabaseClient: any;
  let mockSupabaseService: any;

  const mockPatient: Patient = {
    id: 'p1b2c3d4-0000-0000-0000-000000000001',
    full_name: 'Ana Perez',
    number_phone: '77712345',
    email: 'ana@test.com',
    created_at: '2025-01-01T00:00:00Z'
  };

  const mockSession: Session = {
    id: 's1b2c3d4-0000-0000-0000-000000000001',
    therapist_id: 't1b2c3d4-0000-0000-0000-000000000001',
    patient_id: mockPatient.id,
    date: '2025-06-20',
    time: '10:00',
    created_at: '2025-01-01T00:00:00Z'
  };

  // Supabase joinea Patient como array según la interface SessionWithPatient
  const mockSessionWithPatient: SessionWithPatient = {
    id: mockSession.id,
    therapist_id: mockSession.therapist_id,
    patient_id: mockSession.patient_id,
    date: mockSession.date,
    time: mockSession.time,
    Patient: [{ full_name: mockPatient.full_name }]
  };

  beforeEach(() => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    mockSupabaseService = { client: mockSupabaseClient };

    TestBed.configureTestingModule({
      providers: [
        BookingService,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return SessionWithPatient[] for a given therapist', async () => {
    mockSupabaseClient.eq.mockResolvedValue({ data: [mockSessionWithPatient], error: null });

    const result = await service.getAllSessions(mockSession.therapist_id);

    expect(result).toEqual([mockSessionWithPatient]);
    // Verifica la estructura de Patient como array (según SessionWithPatient)
    expect(result![0].Patient[0].full_name).toBe('Ana Perez');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('Sessions');
  });

  it('should throw when getAllSessions returns a supabase error', async () => {
    const mockError = { message: 'Query failed', code: '42P01' };
    mockSupabaseClient.eq.mockResolvedValue({ data: null, error: mockError });

    await expect(service.getAllSessions(mockSession.therapist_id)).rejects.toEqual(mockError);
  });

  it('should book a Patient and create a Session with correct data', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockPatient, error: null });
    mockSupabaseClient.insert
      .mockReturnValueOnce(mockSupabaseClient)
      .mockResolvedValueOnce({ error: null });

    await service.bookPatient(
      { full_name: mockPatient.full_name, number_phone: mockPatient.number_phone, email: mockPatient.email },
      { therapist_id: mockSession.therapist_id, date: mockSession.date, time: mockSession.time }
    );

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('Patient');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('Sessions');
    expect(mockSupabaseClient.insert).toHaveBeenCalledTimes(2);
  });

  it('should edit a Session and return updated data', async () => {
    const updatedSession: Partial<Session> = { ...mockSession, date: '2025-06-25', time: '15:00' };
    mockSupabaseClient.select.mockResolvedValue({ data: [updatedSession], error: null });

    const result = await service.editSession(mockSession.id, '2025-06-25', '15:00');

    expect(mockSupabaseClient.update).toHaveBeenCalledWith({ date: '2025-06-25', time: '15:00' });
    expect(result).toEqual([updatedSession]);
  });

  it('should delete a Session by id and return true', async () => {
    mockSupabaseClient.eq.mockResolvedValue({ error: null });

    const result = await service.deleteSession(mockSession.id);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('Sessions');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should throw when deleteSession fails', async () => {
    const mockError = { message: 'Delete failed', code: '23503' };
    mockSupabaseClient.eq.mockResolvedValue({ error: mockError });

    await expect(service.deleteSession(mockSession.id)).rejects.toEqual(mockError);
  });
});