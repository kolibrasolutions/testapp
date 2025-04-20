/**
 * Sistema de Simulação para Treinamento de Balconistas
 * Implementa a funcionalidade de simulação de atendimento com diálogos conversacionais
 */

import simulacoesDB from '../data/simulacoes.js';

class SimuladorSystem {
  constructor() {
    this.simulacoes = { ...simulacoesDB };
    this.simulacaoAtual = null;
    this.passoAtual = null;
    this.historico = [];
    this.respostas = {};
    this.userStats = {
      simulacoesCompletas: 0,
      simulacoesBemSucedidas: 0,
      ticketMedioAumentado: 0,
      categoriaStats: {}
    };
    this.loadUserProgress();
  }

  /**
   * Carrega o progresso do usuário do localStorage
   */
  loadUserProgress() {
    const savedProgress = localStorage.getItem('simulador_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      
      // Carrega estatísticas do usuário
      if (progress.stats) {
        this.userStats = progress.stats;
      }
      
      // Carrega histórico de simulações
      if (progress.historico) {
        this.historico = progress.historico;
      }
    }
  }

  /**
   * Salva o progresso do usuário no localStorage
   */
  saveUserProgress() {
    const progress = {
      stats: this.userStats,
      historico: this.historico
    };
    
    localStorage.setItem('simulador_progress', JSON.stringify(progress));
  }

  /**
   * Inicia uma nova simulação
   * @param {string} simulacaoId - ID da simulação a ser iniciada
   * @returns {Object} - Informações iniciais da simulação
   */
  iniciarSimulacao(simulacaoId) {
    if (!this.simulacoes[simulacaoId]) {
      throw new Error(`Simulação ${simulacaoId} não encontrada`);
    }
    
    this.simulacaoAtual = simulacaoId;
    this.passoAtual = this.simulacoes[simulacaoId].passos[0].id;
    this.respostas = {};
    
    return {
      id: simulacaoId,
      titulo: this.simulacoes[simulacaoId].titulo,
      categoria: this.simulacoes[simulacaoId].categoria,
      publico: this.simulacoes[simulacaoId].publico,
      cenarioInicial: this.simulacoes[simulacaoId].cenarioInicial,
      primeiroPasso: this.getPasso(this.passoAtual)
    };
  }

  /**
   * Obtém informações sobre o passo atual
   * @param {string} passoId - ID do passo
   * @returns {Object} - Informações do passo
   */
  getPasso(passoId) {
    if (!this.simulacaoAtual) {
      throw new Error('Nenhuma simulação em andamento');
    }
    
    const simulacao = this.simulacoes[this.simulacaoAtual];
    const passo = simulacao.passos.find(p => p.id === passoId);
    
    if (!passo) {
      throw new Error(`Passo ${passoId} não encontrado na simulação ${this.simulacaoAtual}`);
    }
    
    return passo;
  }

  /**
   * Registra a resposta do usuário e avança para o próximo passo
   * @param {string} opcaoId - ID da opção escolhida
   * @returns {Object} - Informações do próximo passo
   */
  responder(opcaoId) {
    if (!this.simulacaoAtual || !this.passoAtual) {
      throw new Error('Nenhuma simulação em andamento');
    }
    
    const passo = this.getPasso(this.passoAtual);
    
    if (passo.tipo !== 'pergunta') {
      throw new Error('O passo atual não é uma pergunta');
    }
    
    const opcao = passo.opcoes.find(o => o.id === opcaoId);
    if (!opcao) {
      throw new Error(`Opção ${opcaoId} não encontrada no passo ${this.passoAtual}`);
    }
    
    // Registra a resposta
    this.respostas[this.passoAtual] = {
      opcaoId: opcaoId,
      correto: opcao.correto,
      ticketMedio: opcao.ticketMedio || false
    };
    
    // Avança para o próximo passo
    this.passoAtual = opcao.proximoPasso;
    const proximoPasso = this.getPasso(this.passoAtual);
    
    // Se o próximo passo for um resultado, finaliza a simulação
    if (proximoPasso.tipo === 'resultado') {
      return this.finalizarSimulacao(proximoPasso);
    }
    
    return proximoPasso;
  }

  /**
   * Avança para o próximo passo em passos informativos
   * @returns {Object} - Informações do próximo passo
   */
  avancarPasso() {
    if (!this.simulacaoAtual || !this.passoAtual) {
      throw new Error('Nenhuma simulação em andamento');
    }
    
    const passo = this.getPasso(this.passoAtual);
    
    if (passo.tipo !== 'informacao') {
      throw new Error('O passo atual não é informativo');
    }
    
    // Avança para o próximo passo
    this.passoAtual = passo.proximoPasso;
    return this.getPasso(this.passoAtual);
  }

  /**
   * Finaliza a simulação atual e registra os resultados
   * @param {Object} resultadoPasso - Passo de resultado
   * @returns {Object} - Resultado da simulação
   */
  finalizarSimulacao(resultadoPasso) {
    if (!this.simulacaoAtual) {
      throw new Error('Nenhuma simulação em andamento');
    }
    
    const simulacao = this.simulacoes[this.simulacaoAtual];
    const resultado = resultadoPasso.resultado;
    
    // Calcula estatísticas da simulação
    const respostasCorretas = Object.values(this.respostas).filter(r => r.correto).length;
    const totalRespostas = Object.keys(this.respostas).length;
    const percentualAcerto = totalRespostas > 0 ? (respostasCorretas / totalRespostas) * 100 : 0;
    const aumentouTicket = Object.values(this.respostas).some(r => r.ticketMedio);
    
    // Atualiza estatísticas do usuário
    this.userStats.simulacoesCompletas++;
    if (resultado.sucesso) {
      this.userStats.simulacoesBemSucedidas++;
    }
    if (aumentouTicket) {
      this.userStats.ticketMedioAumentado++;
    }
    
    // Atualiza estatísticas por categoria
    if (!this.userStats.categoriaStats[simulacao.categoria]) {
      this.userStats.categoriaStats[simulacao.categoria] = {
        total: 0,
        sucesso: 0
      };
    }
    
    this.userStats.categoriaStats[simulacao.categoria].total++;
    if (resultado.sucesso) {
      this.userStats.categoriaStats[simulacao.categoria].sucesso++;
    }
    
    // Registra no histórico
    const historicoItem = {
      id: this.simulacaoAtual,
      data: new Date().toISOString(),
      titulo: simulacao.titulo,
      categoria: simulacao.categoria,
      publico: simulacao.publico,
      sucesso: resultado.sucesso,
      percentualAcerto: percentualAcerto,
      aumentouTicket: aumentouTicket,
      pontos: resultado.pontos
    };
    
    this.historico.unshift(historicoItem); // Adiciona ao início do array
    if (this.historico.length > 50) {
      this.historico.pop(); // Limita o histórico a 50 itens
    }
    
    // Salva o progresso
    this.saveUserProgress();
    
    // Retorna o resultado
    return {
      ...resultadoPasso,
      estatisticas: {
        respostasCorretas,
        totalRespostas,
        percentualAcerto,
        aumentouTicket,
        pontos: resultado.pontos
      }
    };
  }

  /**
   * Obtém estatísticas de desempenho do usuário
   * @returns {Object} - Estatísticas do usuário
   */
  getUserStats() {
    // Calcula taxa de sucesso geral
    const taxaSucesso = this.userStats.simulacoesCompletas > 0 
      ? (this.userStats.simulacoesBemSucedidas / this.userStats.simulacoesCompletas * 100).toFixed(1) 
      : 0;
    
    // Calcula taxa de aumento de ticket médio
    const taxaTicketMedio = this.userStats.simulacoesCompletas > 0 
      ? (this.userStats.ticketMedioAumentado / this.userStats.simulacoesCompletas * 100).toFixed(1) 
      : 0;
    
    // Calcula taxa de sucesso por categoria
    const categoriaTaxaSucesso = {};
    Object.keys(this.userStats.categoriaStats || {}).forEach(categoria => {
      const stats = this.userStats.categoriaStats[categoria];
      categoriaTaxaSucesso[categoria] = stats.total > 0 
        ? (stats.sucesso / stats.total * 100).toFixed(1) 
        : 0;
    });
    
    return {
      simulacoesCompletas: this.userStats.simulacoesCompletas,
      taxaSucesso: taxaSucesso,
      taxaTicketMedio: taxaTicketMedio,
      categoriaTaxaSucesso: categoriaTaxaSucesso,
      historico: this.historico.slice(0, 5) // Retorna apenas os 5 mais recentes
    };
  }

  /**
   * Obtém recomendações de simulações baseadas no desempenho
   * @returns {Object} - Recomendações de simulações
   */
  getRecomendacoes() {
    const recomendacoes = {
      categoriasParaMelhorar: [],
      simulacoesRecomendadas: []
    };
    
    // Identifica categorias com baixo desempenho (menos de 70% de sucesso)
    Object.keys(this.userStats.categoriaStats || {}).forEach(categoria => {
      const stats = this.userStats.categoriaStats[categoria];
      const taxaSucesso = stats.total > 0 ? (stats.sucesso / stats.total * 100) : 0;
      
      if (taxaSucesso < 70) {
        recomendacoes.categoriasParaMelhorar.push({
          nome: categoria,
          taxaSucesso: taxaSucesso.toFixed(1)
        });
      }
    });
    
    // Ordena categorias fracas da menor para a maior taxa de sucesso
    recomendacoes.categoriasParaMelhorar.sort((a, b) => a.taxaSucesso - b.taxaSucesso);
    
    // Identifica simulações recomendadas com base nas categorias fracas
    if (recomendacoes.categoriasParaMelhorar.length > 0) {
      const categoriaFraca = recomendacoes.categoriasParaMelhorar[0].nome;
      
      // Encontra simulações da categoria fraca
      const simulacoesDaCategoria = Object.values(this.simulacoes)
        .filter(sim => sim.categoria === categoriaFraca)
        .map(sim => ({
          id: sim.id,
          titulo: sim.titulo,
          categoria: sim.categoria,
          dificuldade: sim.dificuldade
        }));
      
      recomendacoes.simulacoesRecomendadas = simulacoesDaCategoria;
    } else {
      // Se não houver categorias fracas, recomenda simulações não realizadas ou aleatórias
      const simulacoesNaoRealizadas = Object.values(this.simulacoes)
        .filter(sim => !this.historico.some(h => h.id === sim.id))
        .map(sim => ({
          id: sim.id,
          titulo: sim.titulo,
          categoria: sim.categoria,
          dificuldade: sim.dificuldade
        }));
      
      if (simulacoesNaoRealizadas.length > 0) {
        recomendacoes.simulacoesRecomendadas = simulacoesNaoRealizadas.slice(0, 3);
      } else {
        // Se todas as simulações já foram realizadas, recomenda aleatoriamente
        recomendacoes.simulacoesRecomendadas = Object.values(this.simulacoes)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(sim => ({
            id: sim.id,
            titulo: sim.titulo,
            categoria: sim.categoria,
            dificuldade: sim.dificuldade
          }));
      }
    }
    
    return recomendacoes;
  }

  /**
   * Obtém todas as categorias disponíveis
   * @returns {Array} - Lista de categorias únicas
   */
  getCategorias() {
    const categorias = new Set();
    Object.values(this.simulacoes).forEach(sim => {
      categorias.add(sim.categoria);
    });
    return [...categorias];
  }

  /**
   * Obtém todos os públicos disponíveis
   * @returns {Array} - Lista de públicos únicos
   */
  getPublicos() {
    const publicos = new Set();
    Object.values(this.simulacoes).forEach(sim => {
      publicos.add(sim.publico);
    });
    return [...publicos];
  }

  /**
   * Obtém todas as simulações filtradas por categoria e/ou público
   * @param {string} categoria - Categoria para filtrar (opcional)
   * @param {string} publico - Público para filtrar (opcional)
   * @returns {Array} - Lista de simulações filtradas
   */
  getSimulacoes(categoria = null, publico = null) {
    return Object.values(this.simulacoes)
      .filter(sim => {
        const matchesCategoria = !categoria || sim.categoria === categoria;
        const matchesPublico = !publico || sim.publico === publico;
        return matchesCategoria && matchesPublico;
      })
      .map(sim => ({
        id: sim.id,
        titulo: sim.titulo,
        categoria: sim.categoria,
        publico: sim.publico,
        dificuldade: sim.dificuldade
      }));
  }
}

export default SimuladorSystem;
