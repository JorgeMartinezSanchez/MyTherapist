// supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../app/enviroment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        lock: ((_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => fn()) as never
      }
    });
  }

  get client() { return this.supabase; }
}