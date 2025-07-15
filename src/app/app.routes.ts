import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProdutosComponent } from './produtos/produtos.component'; // Importa o componente de produtos

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutosComponent }, // Define a rota para /produtos
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Adicione outras rotas aqui no futuro
];
