import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { VendasComponent } from './vendas/vendas.component'; // Importa o componente de vendas

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'vendas', component: VendasComponent }, // Define a rota para /vendas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Adicione outras rotas aqui no futuro
];
