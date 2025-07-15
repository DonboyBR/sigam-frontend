import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Interface para representar a estrutura de um Produto
interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCusto?: number;
  estoqueAtual: number;
  estoqueMinimo?: number;
  categoria?: string;
  codigoBarras?: string;
  ativo: boolean;
}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html', // Caminho relativo ao produtos.component.ts
  styleUrls: ['./produtos.component.css'], // Caminho relativo ao produtos.component.ts
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produto: Produto = {
    nome: '',
    precoVenda: 0,
    estoqueAtual: 0,
    ativo: true
  };
  editMode = false;

  private apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.http.get<Produto[]>(this.apiUrl).subscribe(
      data => {
        this.produtos = data;
      },
      error => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  salvarProduto(): void {
    if (this.editMode) {
      this.http.put<Produto>(`${this.apiUrl}/${this.produto.id}`, this.produto).subscribe(
        data => {
          console.log('Produto atualizado:', data);
          this.resetForm();
          this.carregarProdutos();
        },
        error => {
          console.error('Erro ao atualizar produto:', error);
        }
      );
    } else {
      this.http.post<Produto>(this.apiUrl, this.produto).subscribe(
        data => {
          console.log('Produto criado:', data);
          this.resetForm();
          this.carregarProdutos();
        },
        error => {
          console.error('Erro ao criar produto:', error);
        }
      );
    }
  }

  editarProduto(prod: Produto): void {
    this.produto = { ...prod };
    this.editMode = true;
  }

  deletarProduto(id?: number): void {
    if (id === undefined) {
      console.error('ID do produto não pode ser indefinido para exclusão.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          console.log('Produto excluído com sucesso!');
          this.carregarProdutos();
        },
        error => {
          console.error('Erro ao excluir produto:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.produto = {
      nome: '',
      precoVenda: 0,
      estoqueAtual: 0,
      ativo: true
    };
    this.editMode = false;
  }
}
