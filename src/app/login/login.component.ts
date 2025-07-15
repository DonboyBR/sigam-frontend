import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html', // Caminho relativo ao login.component.ts
  styleUrls: ['./login.component.css'], // Caminho relativo ao login.component.ts (se você escolheu CSS)
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) { }

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.errorMessage = '';
      this.router.navigate(['/produtos']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos.';
    }
  }
}
