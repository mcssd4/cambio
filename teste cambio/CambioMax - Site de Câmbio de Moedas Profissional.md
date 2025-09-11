# CambioMax - Site de Câmbio de Moedas Profissional

## 📋 Descrição do Projeto

O CambioMax é uma plataforma completa de câmbio de moedas desenvolvida com tecnologias modernas, oferecendo uma experiência profissional e segura para conversão de moedas. O projeto inclui funcionalidades avançadas como sistema de autenticação, painel administrativo, fluxo de transações e design responsivo.

## 🚀 Funcionalidades Principais

### ✅ Calculadora de Câmbio
- Conversão em tempo real entre múltiplas moedas
- Taxas competitivas com transparência total
- Interface intuitiva e responsiva
- Suporte a 7 moedas principais (BRL, USD, EUR, GBP, JPY, CAD, AUD, CHF)

### ✅ Sistema de Autenticação
- Registro de usuários com validação completa
- Login seguro com Firebase Authentication
- Verificação de identidade em múltiplas etapas
- Upload de documentos (RG, CPF, Selfie)

### ✅ Fluxo de Transação Completo
- Confirmação de transação em 3 etapas
- Múltiplos métodos de pagamento (PIX, TED, Cartão)
- Coleta de dados bancários com validação
- Feedback visual de processamento

### ✅ Painel Administrativo
- Acesso restrito para administradores
- Gerenciamento de cadastros pendentes
- Aprovação/rejeição de transações
- Interface organizada com tabs

### ✅ Design Profissional
- Layout moderno e responsivo
- Animações suaves com Framer Motion
- Paleta de cores consistente
- Otimizado para desktop e mobile

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilização
- **Shadcn/UI** - Biblioteca de componentes
- **Framer Motion** - Animações
- **Lucide React** - Ícones

### Backend
- **Firebase** - Backend as a Service
- **Firestore** - Banco de dados NoSQL
- **Firebase Auth** - Autenticação
- **Firebase Storage** - Armazenamento de arquivos

## 📁 Estrutura do Projeto

```
cambio-site/
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── Header.jsx          # Cabeçalho e navegação
│   │   ├── CurrencyCalculator.jsx  # Calculadora principal
│   │   ├── RegisterForm.jsx    # Formulário de cadastro
│   │   ├── RegisterModal.jsx   # Modal de registro
│   │   ├── LoginModal.jsx      # Modal de login
│   │   ├── TransactionModal.jsx # Fluxo de transação
│   │   ├── AdminPanel.jsx      # Painel administrativo
│   │   └── LanguageModal.jsx   # Seleção de idioma
│   ├── lib/
│   │   ├── firebase.js         # Configuração Firebase
│   │   ├── firebaseService.js  # Serviços Firebase
│   │   └── utils.js           # Utilitários
│   ├── App.jsx                # Componente principal
│   ├── App.css               # Estilos globais
│   └── main.jsx              # Ponto de entrada
├── public/                   # Arquivos estáticos
├── package.json             # Dependências
└── README.md               # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou pnpm

### Instalação
```bash
# Navegar para o diretório
cd cambio-site

# Instalar dependências
npm install
# ou
pnpm install

# Executar em desenvolvimento
npm run dev
# ou
pnpm dev
```

### Build para Produção
```bash
# Gerar build otimizado
npm run build
# ou
pnpm build

# Preview do build
npm run preview
# ou
pnpm preview
```

## 🔧 Configuração do Firebase

Para usar o projeto com Firebase real, configure as variáveis no arquivo `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};
```

## 👤 Acesso Administrativo

Para acessar o painel administrativo:
- Email: `admin@cambiomax.com`
- Senha: `admin123`

Ou configure um usuário com `role: 'admin'` no Firestore.

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Segurança

- Autenticação segura com Firebase
- Validação de dados no frontend e backend
- Criptografia de dados sensíveis
- Acesso restrito ao painel administrativo

## 🎨 Design System

### Cores Principais
- **Primary**: `#1e40af` (Azul)
- **Secondary**: `#059669` (Verde)
- **Accent**: `#dc2626` (Vermelho para alertas)

### Tipografia
- **Font Family**: Inter (Google Fonts)
- **Tamanhos**: 12px, 14px, 16px, 18px, 24px, 32px, 48px

## 📈 Funcionalidades Futuras

- [ ] Notificações em tempo real
- [ ] Histórico de transações
- [ ] Chat de suporte integrado
- [ ] API de cotações em tempo real
- [ ] Sistema de KYC avançado
- [ ] Dashboard do usuário
- [ ] Relatórios administrativos

## 🤝 Contribuição

Este projeto foi desenvolvido como uma solução completa de câmbio de moedas. Para contribuições ou melhorias, siga as boas práticas de desenvolvimento React e mantenha a consistência do design system.

## 📄 Licença

Projeto desenvolvido para fins demonstrativos. Todos os direitos reservados.

---

**Desenvolvido com ❤️ usando React, Firebase e Tailwind CSS**

