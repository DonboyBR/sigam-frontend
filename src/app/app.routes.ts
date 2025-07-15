import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { VendasComponent } from './vendas/vendas.component'; // Caminho corrigido

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'vendas', component: VendasComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
