import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';
import { Therapist } from '../interfaces';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private rt = inject(Router);

  public CreateTurn(): void{
    this.rt.navigate(['/home/new-turn']);
  }

  public logoutFromPage(): void{
    this.authService.logout();
  }

  get UserCredentials(): [string, string] {
    const full_name = this.authService.getCurrentUser()!.full_name;
    const parts = full_name.trim().split(' ');
    return [parts[0] ?? '', parts[1] ?? ''];
  }
}
