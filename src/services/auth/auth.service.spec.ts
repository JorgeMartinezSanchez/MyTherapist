import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TherapistService } from '../therapist/therapist';
import { Router } from '@angular/router';
import { Therapist } from '../../app/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let mockTherapistService: jest.Mocked<TherapistService>;
  let mockRouter: jest.Mocked<Router>;

  const mockUser: Therapist = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    full_name: 'Dr. Juan Perez',
    email: 'juan@test.com',
    password: 'pass123',
    created_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    localStorage.clear();

    mockTherapistService = { getTherapist: jest.fn() } as any;
    mockRouter = { navigate: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TherapistService, useValue: mockTherapistService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and store Therapist in localStorage', (done) => {
    mockTherapistService.getTherapist.mockResolvedValue(mockUser);

    service.login('juan@test.com', 'pass123').subscribe(success => {
      expect(success).toBe(true);
      expect(service.isLoggedInAsUser()).toBe(true);

      const storedUser = service.getCurrentUser();
      expect(storedUser).toEqual(mockUser);
      expect(storedUser?.full_name).toBe('Dr. Juan Perez');
      expect(storedUser?.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      done();
    });
  });

  it('should return false and not store anything when credentials are wrong', (done) => {
    mockTherapistService.getTherapist.mockResolvedValue(null);

    service.login('wrong@test.com', 'wrongpass').subscribe(success => {
      expect(success).toBe(false);
      expect(service.isLoggedInAsUser()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
      done();
    });
  });

  it('should clear localStorage and navigate to /login on logout', () => {
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('current_user', JSON.stringify(mockUser));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('current_user')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.isLoggedInAsUser()).toBe(false);
  });

  it('should return null from getCurrentUser when no session exists', () => {
    localStorage.clear();

    const result = service.getCurrentUser();

    expect(result).toBeNull();
  });

  it('should restore session from localStorage on service init (page reload)', () => {
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('current_user', JSON.stringify(mockUser));

    const freshService = new (AuthService as any)(mockRouter, mockTherapistService);

    expect(freshService.isLoggedInAsUser()).toBe(true);
    const user: Therapist = freshService.getCurrentUser();
    expect(user.email).toBe('juan@test.com');
    expect(user.full_name).toBe('Dr. Juan Perez');
  });
});