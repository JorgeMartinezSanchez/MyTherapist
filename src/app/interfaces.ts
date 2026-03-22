export interface Session {
  id: string;
  therapist_id: string;
  patient_id: string;
  date: string;
  time: string;
  created_at: string;
}

export interface Patient{
  id: string
  full_name: string
  number_phone: string
  email: string
  created_at: string
}

export interface SessionWithPatient {
  id: string;
  therapist_id: string;
  patient_id: string;
  date: string;
  time: string;
  Patient: { full_name: string }[]; //supabase solo lee tablas joineadas como arrays
}

export interface Therapist{
  id: string
  full_name: string
  email: string
  password: string
  created_at: string
}