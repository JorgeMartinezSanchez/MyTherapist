import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase';
import { Session, Patient, SessionWithPatient } from '../../app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private supabase: SupabaseService) {}

  async getAllSessions(therapistId: string): Promise<SessionWithPatient[] | null> {
    const { data, error } = await this.supabase.client
      .from('Sessions')
      .select(`id, date, time, therapist_id, patient_id, Patient(full_name)`)
      .eq('therapist_id', Number(therapistId))
    if (error) throw error;
    return data as SessionWithPatient[];
  }

  async bookPatient(
    patientData: Pick<Patient, 'full_name' | 'number_phone' | 'email'>,
    sessionData: Pick<Session, 'therapist_id' | 'date' | 'time'>
  ) {
    const { data: newPatient, error: patientError } = await this.supabase.client
      .from('Patient')
      .insert(patientData)
      .select()
      .single<Patient>();
    if (patientError) throw patientError;

    const { error: sessionError } = await this.supabase.client
      .from('Sessions')
      .insert({
        therapist_id: sessionData.therapist_id,
        patient_id: newPatient!.id,
        date: sessionData.date,
        time: sessionData.time
      });
    if (sessionError) throw sessionError;
  }

  async editSession(sessionId: string, newDate: string, newTime: string) {
    const { data, error } = await this.supabase.client
      .from('Sessions')
      .update({ date: newDate, time: newTime })
      .eq('id', sessionId)
      .select();

    if (error) {
      console.error('Error al actualizar la sesión:', error);
      throw error; 
    }

    return data;
  }
}
