import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { HttpClient } from '@angular/common/http'; // Para fazer requisições HTTP
import { Router } from '@angular/router'; // Para navegação

// Interface para representar a estrutura de um Produto
interface Produto {
  id?: number; // Opcional, pois não existe ao criar um novo produto
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
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'], // ATENÇÃO AQUI: Mudou para .css
  standalone: true,
  imports: [CommonModule, FormsModule] // Importa módulos necessários
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = []; // Lista de produtos para exibir
  produto: Produto = { // Objeto para o formulário de cadastro/edição
    nome: '',
    precoVenda: 0,
    estoqueAtual: 0,
    ativo: true
  };
  editMode = false; // Indica se estamos editando um produto existente

  private apiUrl = 'http://localhost:8080/api/produtos'; // URL da sua API de produtos

  constructor(private http: HttpClient, private router: Router) { } // Injeta HttpClient e Router

  ngOnInit(): void {
    this.carregarProdutos(); // Carrega os produtos ao iniciar o componente
  }

  carregarProdutos(): void {
    this.http.get<Produto[]>(this.apiUrl).subscribe(
      data => {
        this.produtos = data;
      },
      error => {
        console.error('Erro ao carregar produtos:', error);
        // Em uma aplicação real, você mostraria uma mensagem de erro para o usuário
      }
    );
  }

  salvarProduto(): void {
    if (this.editMode) {
      // Atualizar produto existente
      this.http.put<Produto>(`${this.apiUrl}/${this.produto.id}`, this.produto).subscribe(
        data => {
          console.log('Produto atualizado:', data);
          this.resetForm();
          this.carregarProdutos(); // Recarrega a lista
        },
        error => {
          console.error('Erro ao atualizar produto:', error);
        }
      );
    } else {
      // Criar novo produto
      this.http.post<Produto>(this.apiUrl, this.produto).subscribe(
        data => {
          console.log('Produto criado:', data);
          this.resetForm();
          this.carregarProdutos(); // Recarrega a lista
        },
        error => {
          console.error('Erro ao criar produto:', error);
        }
      );
    }
  }

  editarProduto(prod: Produto): void {
    this.produto = { ...prod }; // Copia o produto para o formulário (evita modificar o original diretamente)
    this.editMode = true;
  }

  deletarProduto(id?: number): void {
    if (id === undefined) {
      console.error('ID do produto não pode ser indefinido para exclusão.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este produto?')) { // Use um modal personalizado em produção
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          console.log('Produto excluído com sucesso!');
          this.carregarProdutos(); // Recarrega a lista
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
