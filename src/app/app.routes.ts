import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProdutosComponent } from './produtos/produtos.component'; // Garanta que o caminho aponta para .component

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Adicione outras rotas aqui no futuro
];
