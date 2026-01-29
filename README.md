# Vessel — Gestão Inteligente para Coquetelaria

Plataforma completa para gestão de eventos, controle de ingredientes, precificação de drinks e análise de lucratividade para bares, restaurantes e empresas de eventos.

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?logo=vuetify)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase)

## ✨ Funcionalidades principais

- **Gestão de eventos** — Cadastro de clientes, endereços, datas e cálculo automático de demanda de drinks
- **Drinks e receitas** — Criação de drinks com ingredientes e custos
- **Ingredientes** — Controle de preços, unidades e cotações com fornecedores
- **Cotações e orçamentos** — Cotações para eventos e conversão em evento
- **Lista de compras** — Geração automática a partir de eventos e estoque
- **Relatórios** — KPIs, lucratividade, consumo de ingredientes, histórico de cotações
- **Fornecedores** — Cadastro e gestão de fornecedores
- **Perfil** — Dados do usuário, avatar e alteração de senha
- **Assinatura** — Integração com Stripe para planos (mensal/temporário)

---

## 🛠 Tecnologias

- **Frontend:** Nuxt 4, Vue 3, Vuetify 3, Pinia, VeeValidate + Yup
- **Backend:** Nuxt Server (Nitro), API REST
- **Auth e banco:** Supabase (Auth, PostgreSQL)
- **Pagamentos:** Stripe
- **Utilitários:** Day.js, VueUse, Maska, Driver.js (tutoriais)

---

## 📋 Pré-requisitos

- Node.js 18+
- Yarn, pnpm, npm ou bun
- Conta Supabase (para auth e banco)
- Variáveis de ambiente configuradas (veja `.env.example` ou documentação do Nuxt/Supabase)

---

## 🚀 Instalação e execução

### Instalar dependências

```bash
yarn install
# ou: npm install | pnpm install | bun install
```

### Servidor de desenvolvimento

```bash
yarn dev
```

Acesse: **http://localhost:3000** (ou a porta indicada no terminal).

### Build para produção

```bash
yarn build
```

### Preview da build de produção

```bash
yarn preview
```

---

## 📁 Estrutura resumida

```
app/
├── pages/          # Rotas (dashboard, clientes, drinks, eventos, etc.)
├── components/     # Componentes Vue
├── layouts/       # Layouts (default, auth, guest, profile)
├── composables/   # Lógica reutilizável e chamadas de API
├── stores/        # Pinia stores
├── middleware/    # Auth e subscription
server/
├── api/           # Endpoints da API (clientes, drinks, eventos, etc.)
├── utils/         # Supabase, filtros, listas de compras
```

---

## 📄 Documentação

- [Nuxt](https://nuxt.com/docs)
- [Vuetify](https://vuetifyjs.com/)
- [Supabase](https://supabase.com/docs)

---

## Licença

Projeto privado. © 2026 Vessel. Todos os direitos reservados.
