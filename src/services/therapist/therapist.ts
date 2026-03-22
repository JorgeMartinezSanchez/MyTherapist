import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase';
import { Session, Therapist } from '../../app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TherapistService {
  constructor(private supabase: SupabaseService) {}

  async getTherapist(therapist_email: string, therapist_password: string): Promise<Therapist | null>{
    const { data, error } = await this.supabase.client
      .from('Therapists')
      .select('*')
      .eq('email', therapist_email)
      .eq('password', therapist_password)
      .single<Therapist>()
    if (error) throw error;
    return data;
  }
}
