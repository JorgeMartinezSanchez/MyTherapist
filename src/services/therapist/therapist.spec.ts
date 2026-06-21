import { TestBed } from '@angular/core/testing';
import { TherapistService } from './therapist';
import { SupabaseService } from '../supabase/supabase';
import { Therapist } from '../../app/interfaces';

describe('TherapistService', () => {
  let service: TherapistService;
  let mockSupabaseClient: any;
  let mockSupabaseService: any;

  const mockTherapist: Therapist = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    full_name: 'Dr. Juan Perez',
    email: 'juan@test.com',
    password: 'pass123',
    created_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    mockSupabaseService = { client: mockSupabaseClient };

    TestBed.configureTestingModule({
      providers: [
        TherapistService,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });
    service = TestBed.inject(TherapistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a Therapist with valid credentials', async () => {
    mockSupabaseClient.single.mockResolvedValue({ data: mockTherapist, error: null });

    const result = await service.getTherapist('juan@test.com', 'pass123');

    expect(result).toEqual(mockTherapist);
    expect(result?.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(result?.full_name).toBe('Dr. Juan Perez');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('Therapists');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('email', 'juan@test.com');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('password', 'pass123');
  });

  it('should return null when no therapist matches the credentials', async () => {
    mockSupabaseClient.single.mockResolvedValue({ data: null, error: null });

    const result = await service.getTherapist('noexiste@test.com', 'wrongpass');

    expect(result).toBeNull();
  });

  it('should throw when supabase returns an error', async () => {
    const mockError = { message: 'DB connection error', code: '500' };
    mockSupabaseClient.single.mockResolvedValue({ data: null, error: mockError });

    await expect(service.getTherapist('juan@test.com', 'pass123')).rejects.toEqual(mockError);
  });

  it('should call select with * to retrieve all Therapist fields', async () => {
    mockSupabaseClient.single.mockResolvedValue({ data: mockTherapist, error: null });

    await service.getTherapist('juan@test.com', 'pass123');

    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
  });
});