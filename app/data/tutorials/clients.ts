import type { TutorialStep } from "~/composables/useTutorialDriver";

export const clientsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-clients-header",
    popover: {
      title: "Bem-vindo à página de Clientes!",
      description:
        "Aqui você pode gerenciar todos os seus clientes. Esta página permite visualizar, criar, editar e excluir clientes cadastrados no sistema.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de clientes. Você pode filtrar por nome, email, cidade, estado e outros critérios para encontrar clientes específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de clientes, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo cliente. Um formulário será aberto onde você pode preencher todas as informações do cliente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-form",
    popover: {
      title: "Formulário de Criação de Cliente",
      description:
        "Este é o formulário para cadastrar um novo cliente. Vamos percorrer cada campo passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-form-name",
    popover: {
      title: "Nome Completo",
      description:
        "Digite o nome completo do cliente. Este campo é obrigatório e será usado para identificar o cliente no sistema.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-email",
    popover: {
      title: "E-mail",
      description:
        "Informe o e-mail de contato do cliente. Este campo é obrigatório e será usado para comunicação e envio de informações.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-document",
    popover: {
      title: "CPF/CNPJ",
      description:
        "Digite o CPF (para pessoa física) ou CNPJ (para pessoa jurídica) do cliente. O sistema aplicará a máscara automaticamente. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-phone",
    popover: {
      title: "Telefone",
      description:
        "Informe o número de telefone principal do cliente. O formato será aplicado automaticamente (XX) XXXXX-XXXX. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-phone-optional",
    popover: {
      title: "Telefone Opcional",
      description:
        "Informe um telefone adicional para contato, se houver. Este campo é opcional e pode ser deixado em branco.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-zipcode",
    popover: {
      title: "CEP",
      description:
        "Digite o CEP do endereço do cliente. Ao preencher, o sistema buscará automaticamente e preencherá os campos de Cidade, Estado, Bairro e Rua. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-city",
    popover: {
      title: "Cidade",
      description:
        "A cidade será preenchida automaticamente quando você informar o CEP. Caso necessário, você pode editar manualmente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-state",
    popover: {
      title: "Estado (UF)",
      description:
        "O estado será preenchido automaticamente quando você informar o CEP. Caso necessário, você pode editar manualmente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-neighborhood",
    popover: {
      title: "Bairro",
      description:
        "O bairro será preenchido automaticamente quando você informar o CEP. Caso necessário, você pode editar manualmente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-street",
    popover: {
      title: "Rua",
      description:
        "A rua será preenchida automaticamente quando você informar o CEP. Caso necessário, você pode editar manualmente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-number",
    popover: {
      title: "Número",
      description:
        "Informe o número do endereço do cliente. Este campo é obrigatório e deve ser preenchido manualmente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-additional-info",
    popover: {
      title: "Complemento",
      description:
        "Informe informações adicionais do endereço, como apartamento, bloco, andar, etc. Este campo é opcional e pode ser deixado em branco.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-clients-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher todos os campos obrigatórios (Nome, E-mail, CPF/CNPJ, Telefone e CEP), clique neste botão para salvar o novo cliente. O sistema validará os dados antes de criar o registro.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-table",
    popover: {
      title: "Tabela de Clientes",
      description:
        "Visualize todos os seus clientes em uma tabela organizada. Você pode ordenar e buscar clientes específicos.",
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
    element: "#tutorial-clients-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar seus clientes.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

