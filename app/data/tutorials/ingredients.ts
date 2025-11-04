import type { TutorialStep } from "~/composables/useTutorialDriver";

export const ingredientsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-ingredients-header",
    popover: {
      title: "Bem-vindo à página de Ingredientes!",
      description:
        "Gerencie todos os ingredientes utilizados nas suas bebidas. Aqui você pode cadastrar novos ingredientes, editar informações, vincular cotações e visualizar o estoque.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de ingredientes. Você pode filtrar por nome, unidade de medida e outros critérios para encontrar ingredientes específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de ingredientes, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo ingrediente. Um formulário será aberto onde você pode cadastrar o ingrediente com suas especificações. Ingredientes são essenciais para criar bebidas.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-form",
    popover: {
      title: "Formulário de Criação de Ingrediente",
      description:
        "Este é o formulário para cadastrar um novo ingrediente. Vamos percorrer cada campo passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-form-name",
    popover: {
      title: "Nome do Ingrediente",
      description:
        "Digite o nome do ingrediente. Este campo é obrigatório e será usado para identificar o ingrediente no sistema e nas receitas de bebidas.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-ingredients-form-unit",
    popover: {
      title: "Unidade de Medida",
      description:
        "Selecione a unidade de medida padrão do ingrediente (ex: litro, quilo, unidade). Esta unidade será usada como base para cálculos de custo. A unidade deve estar cadastrada no sistema. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-ingredients-form-volume",
    popover: {
      title: "Volume da Unidade (ml)",
      description:
        "Informe o volume da unidade de medida em mililitros (ml). Este valor é usado para conversões entre unidades de volume. Este campo é opcional, mas recomendado para ingredientes líquidos.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-ingredients-form-weight",
    popover: {
      title: "Peso da Unidade (g)",
      description:
        "Informe o peso da unidade de medida em gramas (g). Este valor é usado para conversões entre unidades de peso. Este campo é opcional, mas recomendado para ingredientes sólidos.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-ingredients-form-wastage",
    popover: {
      title: "Percentual de Desperdício",
      description:
        "Defina a porcentagem de desperdício esperada para este ingrediente (0% a 100%). Este valor será usado para calcular o custo real considerando perdas durante o preparo. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-ingredients-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher todos os campos obrigatórios (Nome, Unidade e Percentual de Desperdício), clique neste botão para salvar o ingrediente. Após criar, você pode vincular cotações para atualizar o custo real por unidade base (C.R.U.B).",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-table",
    popover: {
      title: "Tabela de Ingredientes",
      description:
        "Visualize todos os ingredientes cadastrados com informações sobre unidades de medida, cotações vinculadas e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-total",
    popover: {
      title: "Total de Registros",
      description:
        "Este chip mostra o total de registros disponíveis na tabela. Ele é atualizado automaticamente conforme os filtros aplicados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-items-per-page",
    popover: {
      title: "Itens por Página",
      description:
        "Use este seletor para escolher quantos itens você deseja visualizar por página. As opções disponíveis são: 10, 25 ou 50 itens. Isso ajuda a navegar melhor em tabelas com muitos registros.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-pagination",
    popover: {
      title: "Paginação",
      description:
        "Use os botões de navegação para percorrer as páginas da tabela. Clique nos números para ir diretamente para uma página específica ou use as setas para avançar/retroceder. A paginação é atualizada automaticamente quando você altera a quantidade de itens por página.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar, Excluir e Selecionar Cotação. Use essas ações para gerenciar seus ingredientes e vincular cotações.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

