import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Interface para representar a estrutura de um Produto
interface Produto {
  id: number;
  nome: string;
  descricao?: string; // Adicionado para consistência com o backend
  precoVenda: number;
  precoCusto?: number; // Adicionado para consistência com o backend
  estoqueAtual: number;
  estoqueMinimo?: number; // Adicionado para consistência com o backend
  categoria?: string;
  codigoBarras?: string; // 👈 ATENÇÃO AQUI! Adicionado o campo codigoBarras como opcional
  ativo: boolean; // Adicionado para consistência com o backend
}

interface ItemVenda {
  produto: Produto;
  quantidade: number;
  precoUnitarioVenda: number;
  subtotal: number;
}

interface Venda {
  id?: number;
  dataHoraVenda?: string;
  valorTotal: number;
  metodoPagamento: string;
  bandeiraCartao?: string;
  referenciaPagamento?: string;
  statusVenda?: string;
  atendenteResponsavel?: string;
  itens: ItemVenda[];
}

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html', // Caminho corrigido
  styleUrls: ['./vendas.component.css'], // Caminho corrigido
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VendasComponent implements OnInit {
  buscaProduto: string = '';
  produtoEncontrado: Produto | null = null;
  buscaRealizada: boolean = false;
  quantidadeAdicionar: number = 1;

  carrinho: Venda = {
    valorTotal: 0,
    metodoPagamento: '',
    itens: []
  };

  private produtoApiUrl = 'http://localhost:8080/api/produtos';
  private vendaApiUrl = 'http://localhost:8080/api/vendas';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Inicializa o carrinho ou carrega dados se necessário
  }

  // Busca um produto por nome ou código de barras
  buscarProdutoPorNome(): void {
    if (!this.buscaProduto) {
      this.produtoEncontrado = null;
      this.buscaRealizada = false;
      return;
    }

    this.http.get<Produto[]>(this.produtoApiUrl).subscribe(
      data => {
        this.produtoEncontrado = data.find(p =>
          p.nome.toLowerCase().includes(this.buscaProduto.toLowerCase()) ||
          (p.codigoBarras && p.codigoBarras.includes(this.buscaProduto)) // Agora codigoBarras existe na interface
        ) || null;
        this.buscaRealizada = true;
        this.quantidadeAdicionar = 1;
      },
      error => {
        console.error('Erro ao buscar produto:', error);
        this.produtoEncontrado = null;
        this.buscaRealizada = true;
      }
    );
  }

  // Adiciona o produto encontrado ao carrinho
  adicionarAoCarrinho(): void {
    if (this.produtoEncontrado && this.quantidadeAdicionar > 0 && this.quantidadeAdicionar <= this.produtoEncontrado.estoqueAtual) {
      const itemExistente = this.carrinho.itens.find(item => item.produto.id === this.produtoEncontrado?.id);

      if (itemExistente) {
        itemExistente.quantidade += this.quantidadeAdicionar;
        itemExistente.subtotal = itemExistente.precoUnitarioVenda * itemExistente.quantidade;
      } else {
        const novoItem: ItemVenda = {
          produto: this.produtoEncontrado,
          quantidade: this.quantidadeAdicionar,
          precoUnitarioVenda: this.produtoEncontrado.precoVenda,
          subtotal: this.produtoEncontrado.precoVenda * this.quantidadeAdicionar
        };
        this.carrinho.itens.push(novoItem);
      }

      this.atualizarTotalCarrinho();
      this.buscaProduto = '';
      this.produtoEncontrado = null;
      this.buscaRealizada = false;
    } else if (this.quantidadeAdicionar <= 0) {
      alert('A quantidade deve ser maior que zero.');
    } else if (this.produtoEncontrado && this.quantidadeAdicionar > this.produtoEncontrado.estoqueAtual) {
      alert(`Estoque insuficiente. Disponível: ${this.produtoEncontrado.estoqueAtual}`);
    }
  }

  // Remove um item do carrinho
  removerDoCarrinho(produtoId?: number): void {
    if (produtoId === undefined) return;
    this.carrinho.itens = this.carrinho.itens.filter(item => item.produto.id !== produtoId);
    this.atualizarTotalCarrinho();
  }

  // Atualiza o valor total do carrinho
  atualizarTotalCarrinho(): void {
    this.carrinho.valorTotal = this.carrinho.itens.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // Finaliza a venda enviando para a API
  finalizarVenda(): void {
    if (this.carrinho.itens.length === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar a venda.');
      return;
    }
    if (!this.carrinho.metodoPagamento) {
      alert('Selecione o método de pagamento.');
      return;
    }

    const vendaParaEnviar: Venda = {
      valorTotal: this.carrinho.valorTotal,
      metodoPagamento: this.carrinho.metodoPagamento,
      bandeiraCartao: this.carrinho.bandeiraCartao,
      referenciaPagamento: this.carrinho.referenciaPagamento,
      atendenteResponsavel: 'Recepcionista Demo',
      itens: this.carrinho.itens.map(item => ({
        produto: { id: item.produto.id } as Produto,
        quantidade: item.quantidade,
        precoUnitarioVenda: item.precoUnitarioVenda,
        subtotal: item.subtotal
      }))
    };

    this.http.post<Venda>(this.vendaApiUrl, vendaParaEnviar).subscribe(
      response => {
        alert('Venda finalizada com sucesso! ID: ' + response.id);
        this.resetCarrinho();
      },
      error => {
        console.error('Erro ao finalizar venda:', error);
        alert('Erro ao finalizar venda: ' + (error.error.message || 'Verifique o console.'));
      }
    );
  }

  // Reseta o carrinho após a venda
  resetCarrinho(): void {
    this.carrinho = {
      valorTotal: 0,
      metodoPagamento: '',
      itens: []
    };
    this.buscaProduto = '';
    this.produtoEncontrado = null;
    this.buscaRealizada = false;
    this.quantidadeAdicionar = 1;
  }
}
