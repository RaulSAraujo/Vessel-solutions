import type { TutorialStep } from "~/composables/useTutorialDriver";

export const suppliersTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-suppliers-header",
    popover: {
      title: "Bem-vindo à página de Fornecedores!",
      description:
        "Gerencie todos os fornecedores de ingredientes. Aqui você pode cadastrar novos fornecedores, editar informações de contato e visualizar todos os fornecedores cadastrados.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de fornecedores. Você pode filtrar por nome, email, telefone e outros critérios para encontrar fornecedores específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de fornecedores, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo fornecedor. Um formulário será aberto onde você pode preencher todas as informações de contato. Certifique-se de cadastrar fornecedores antes de criar cotações.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-form",
    popover: {
      title: "Formulário de Criação de Fornecedor",
      description:
        "Este é o formulário para cadastrar um novo fornecedor. Vamos percorrer cada campo passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-form-name",
    popover: {
      title: "Nome do Fornecedor",
      description:
        "Digite o nome completo ou razão social do fornecedor. Este campo é obrigatório e será usado para identificar o fornecedor no sistema.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-suppliers-form-email",
    popover: {
      title: "E-mail",
      description:
        "Informe o e-mail de contato do fornecedor. Este campo é opcional, mas recomendado para comunicação e envio de informações.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-suppliers-form-phone",
    popover: {
      title: "Telefone",
      description:
        "Informe o número de telefone de contato do fornecedor. O formato será aplicado automaticamente (XX) XXXXX-XXXX. Este campo é opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-suppliers-form-observation",
    popover: {
      title: "Observação",
      description:
        "Adicione informações adicionais sobre o fornecedor, como observações sobre produtos, condições especiais, etc. Este campo é opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-suppliers-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher as informações do fornecedor (pelo menos o nome é obrigatório), clique neste botão para salvar. O fornecedor ficará disponível para ser usado em cotações.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-table",
    popover: {
      title: "Tabela de Fornecedores",
      description:
        "Visualize todos os fornecedores com informações de contato, endereço e detalhes.",
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
    element: "#tutorial-suppliers-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar seus fornecedores.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

