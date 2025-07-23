# SalesOrder API

API para gerenciamento de pedidos de venda construída com Clean Architecture, DDD e SOLID principles.

## 🏗️ Arquitetura

### Clean Architecture
- **Domain**: Regras de negócio e entidades
- **Infrastructure**: Implementações concretas (MongoDB, etc.)
- **Application**: Casos de uso e orquestração
- **Presentation**: Controllers e rotas

### DDD (Domain-Driven Design)
- **Entities**: Objetos com identidade
- **Value Objects**: Objetos imutáveis
- **Repositories**: Abstração para persistência
- **Services**: Lógica de domínio

### SOLID Principles
- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependências através de abstrações

## 🚀 Configuração

### Pré-requisitos
- Node.js 22.17.1+
- MongoDB
- Yarn

### Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd SalesOrder-API
```

2. Instale as dependências
```bash
yarn install
```

3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

4. Configure o MongoDB
```bash
# Edite o arquivo .env com sua conexão MongoDB
MONGO_DB=mongodb://localhost:27017/salesorder_api
```

## 📁 Estrutura do Projeto

```
src/
├── domain/           # Regras de negócio
│   └── repositories/ # Interfaces de repositórios
├── infra/           # Implementações concretas
│   └── db/
│       └── mongoose/ # Conexão MongoDB
├── main/            # Configuração da aplicação
│   ├── config/      # Configurações
│   ├── factories/   # Factories
│   ├── middlewares/ # Middlewares
│   └── server.ts    # Servidor Express
├── presentation/    # Controllers e rotas
└── shared/         # Código compartilhado
    └── config/     # Configurações compartilhadas
```

## 🔧 Conexão MongoDB

### Interface de Abstração
```typescript
// src/domain/repositories/IDatabaseConnection.ts
export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}
```

### Implementação Concreta
```typescript
// src/infra/db/mongoose/MongoConnection.ts
export class MongoConnection implements IDatabaseConnection {
  // Implementação da conexão MongoDB
}
```

### Factory Pattern
```typescript
// src/main/factories/DatabaseConnectionFactory.ts
export class DatabaseConnectionFactory {
  static create(): IDatabaseConnection {
    return new MongoConnection();
  }
}
```

## 🧪 Testes

```bash
# Executar todos os testes
yarn test

# Executar testes em modo watch
yarn test:watch

# Executar testes com coverage
yarn test:coverage
```

## 🛠️ Scripts Disponíveis

- `yarn dev`: Executa em modo desenvolvimento
- `yarn build`: Compila o TypeScript
- `yarn start`: Executa em produção
- `yarn lint`: Executa o linter
- `yarn lint:fix`: Corrige problemas do linter
- `yarn test`: Executa os testes

## 🔍 Health Check

A API possui um endpoint de health check:

```bash
GET /healthcheck
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "app": "SalesOrder API",
  "version": "1.0.0",
  "environment": "development"
}
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `MONGO_DB` | URI de conexão MongoDB | - |
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente de execução | development |
| `APP_NAME` | Nome da aplicação | SalesOrder API |
| `APP_VERSION` | Versão da aplicação | 1.0.0 |

## 🎯 Próximos Passos

- [ ] Implementar entidades de domínio
- [ ] Criar repositórios
- [ ] Implementar casos de uso
- [ ] Criar controllers
- [ ] Adicionar validações
- [ ] Implementar autenticação
- [ ] Adicionar logs estruturados
- [ ] Configurar CI/CD # SalesOrderAPI
