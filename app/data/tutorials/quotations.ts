import type { TutorialStep } from "~/composables/useTutorialDriver";

export const quotationsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-quotations-header",
    popover: {
      title: "Bem-vindo à página de Cotações!",
      description:
        "Gerencie cotações de ingredientes com fornecedores. Esta página permite criar cotações unitárias, comparar preços de diferentes fornecedores e vincular cotações aos ingredientes.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de cotações. Você pode filtrar por fornecedor, ingrediente, preço e outros critérios para encontrar cotações específicas ou comparar preços.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de cotações, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar uma nova cotação. Um formulário será aberto onde você pode cadastrar uma cotação vinculando um fornecedor a um ingrediente. Após criar uma cotação, você pode vinculá-la diretamente a um ingrediente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-form",
    popover: {
      title: "Formulário de Criação de Cotação",
      description:
        "Este é o formulário para cadastrar uma nova cotação unitária. Vamos percorrer cada campo passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-form-supplier",
    popover: {
      title: "Selecionar Fornecedor",
      description:
        "Selecione o fornecedor que está oferecendo esta cotação. O fornecedor deve estar cadastrado no sistema. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-ingredient",
    popover: {
      title: "Selecionar Ingrediente",
      description:
        "Selecione o ingrediente para o qual esta cotação se refere. O ingrediente deve estar cadastrado no sistema. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-price",
    popover: {
      title: "Preço de Compra",
      description:
        "Informe o preço de compra unitário do ingrediente oferecido pelo fornecedor. Este valor será usado para calcular o custo real por unidade base (C.R.U.B) quando a cotação for vinculada ao ingrediente. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-quantity",
    popover: {
      title: "Quantidade",
      description:
        "Informe a quantidade que está sendo cotada. Esta quantidade deve corresponder à unidade de medida selecionada. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-unit",
    popover: {
      title: "Unidade de Medida",
      description:
        "Selecione a unidade de medida da quantidade cotada (ex: litro, quilo, unidade). A unidade deve estar cadastrada no sistema. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-date",
    popover: {
      title: "Data da Cotação",
      description:
        "Selecione a data em que esta cotação foi obtida. Isso ajuda a rastrear a validade e a atualidade das cotações. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-quotations-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher todos os campos obrigatórios (Fornecedor, Ingrediente, Preço, Quantidade, Unidade e Data), clique neste botão para salvar a cotação. Após criar, você pode vinculá-la diretamente a um ingrediente para atualizar seu custo real.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-table",
    popover: {
      title: "Tabela de Cotações",
      description:
        "Visualize todas as cotações cadastradas com informações sobre fornecedores, ingredientes, preços e unidades.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar suas cotações.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

