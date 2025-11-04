import type { TutorialStep } from "~/composables/useTutorialDriver";

export const drinksTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-drinks-header",
    popover: {
      title: "Bem-vindo à página de Bebidas!",
      description:
        "Gerencie o catálogo completo de bebidas do seu negócio. Aqui você pode cadastrar, editar e visualizar todas as bebidas disponíveis, incluindo seus ingredientes e receitas.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de bebidas. Você pode filtrar por nome, descrição, preço e outros critérios para encontrar bebidas específicas.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de bebidas, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar uma nova bebida. Um formulário será aberto onde você pode cadastrar a bebida com seus ingredientes e receita. Certifique-se de cadastrar os ingredientes necessários antes de criar uma nova bebida.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-form",
    popover: {
      title: "Formulário de Criação de Bebida",
      description:
        "Este é o formulário para cadastrar uma nova receita de bebida. Vamos percorrer cada seção passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-form-name",
    popover: {
      title: "Nome da Bebida",
      description:
        "Digite o nome da bebida ou receita. Este campo é obrigatório e será usado para identificar a bebida no catálogo.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-drinks-form-description",
    popover: {
      title: "Descrição",
      description:
        "Descreva a bebida, incluindo informações sobre preparo, características e outros detalhes relevantes. Este campo é opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-drinks-form-image",
    popover: {
      title: "URL da Imagem",
      description:
        "Cole a URL de uma imagem da bebida para exibir no catálogo. Este campo é opcional, mas recomendado para melhor apresentação visual.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-drinks-form-profit",
    popover: {
      title: "Margem de Lucro",
      description:
        "Ajuste a margem de lucro desejada usando o controle deslizante (0% a 100%). O sistema calculará automaticamente o preço de venda baseado no custo dos ingredientes e nesta margem.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-drinks-form-find-ingredient",
    popover: {
      title: "Buscar Ingrediente",
      description:
        "Use este campo para buscar e adicionar ingredientes à receita. Digite o nome do ingrediente e selecione da lista. Certifique-se de que o ingrediente já esteja cadastrado no sistema antes de adicionar à receita.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-drinks-form-ingredients-table",
    popover: {
      title: "Tabela de Ingredientes",
      description:
        "Aqui você verá todos os ingredientes adicionados à receita. Para cada ingrediente, informe a quantidade e a unidade de medida. O sistema calculará automaticamente o custo unitário. Você pode remover ingredientes clicando no botão de excluir. É necessário adicionar pelo menos um ingrediente antes de salvar.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher o nome da bebida, ajustar a margem de lucro e adicionar pelo menos um ingrediente com quantidade definida, clique neste botão para salvar a receita. O sistema calculará automaticamente o custo total e o preço de venda.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-table",
    popover: {
      title: "Tabela de Bebidas",
      description:
        "Visualize todas as bebidas cadastradas com informações sobre ingredientes, preços e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar suas bebidas.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

