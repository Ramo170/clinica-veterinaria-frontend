# Sistema de Gerenciamento Veterinário

Aplicação web desenvolvida em **Next.js** e **TypeScript** para o gerenciamento completo de clínicas veterinárias, médicos veterinários, tutores e pacientes (pets). O sistema conta com interface responsiva estilizada com **Tailwind CSS** e suporte a todas as operações de **CRUD (Cadastrar, Listar, Editar e Excluir)**.

---

## 🚀 Funcionalidades

- **🏥 Gerenciamento de Clínicas**:
  - Cadastro, listagem, edição e remoção de clínicas veterinárias.
  - Campos: Nome, CNPJ, Telefone e Endereço.

- **🩺 Gerenciamento de Veterinários**:
  - Cadastro, listagem, edição e remoção de médicos veterinários.
  - Vinculação direta com a clínica cadastrada.
  - Campos: Nome, CRMV, Especialidade e Clínica Responsável.

- **👤 Gerenciamento de Tutores**:
  - Cadastro, listagem, edição e remoção de tutores (proprietários dos pets).
  - Campos: Nome Completo, CPF, Telefone e E-mail.

- **🐾 Gerenciamento de Pacientes**:
  - Cadastro, listagem, edição e remoção de pacientes (pets).
  - Vinculação direta com o tutor responsável.
  - Campos: Nome do Pet, Espécie, Raça, Idade e Tutor Responsável.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Client Components)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Consumo de API**: Módulo utilitário baseado na `Fetch API` nativa

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend REST API rodando para responder aos endpoints consumidos.

---

## 🔧 Configuração e Instalação

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
   cd seu-repositorio
