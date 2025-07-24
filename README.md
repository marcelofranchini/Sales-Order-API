# Sales Order API

API para gerenciamento de pedidos.

## 🚀 Deploy

**URL do Projeto:** https://sales-order-api-production.up.railway.app

### Endpoints de Verificação:
- **Healthcheck:** https://sales-order-api-production.up.railway.app/healthcheck - Verifica conexão com o banco
- **Documentação:** https://sales-order-api-production.up.railway.app/api-docs - Swagger UI 

### Deploy na Railway

O projeto está configurado para deploy automático via GitHub na Railway usando Docker.

**Benefícios do Multi-stage Build:**
- Reduz tamanho da imagem final
- Separa dependências de desenvolvimento e produção
- Otimiza cache do Docker
- Melhora segurança removendo ferramentas de build

## 🛠️ Executando Localmente

### Pré-requisitos
- Node.js 20+
- Yarn
- Docker
  
### Com Yarn (Recomendado)
```bash
.env 
MONGODB_URI=mongodb://localhost:27017/sales
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Executar testes
yarn test:coverage

# Executar build
yarn build

# Executar a versão do build
yarn start
```

### Com Docker
```bash
# Construir e executar com banco
docker-compose up --build

# Ou separadamente:
# 1. Construir primeiro
docker-compose build

# 2. Executar apenas a aplicação (MongoDB já deve estar rodando)
docker-compose up app

# Executar em background
docker-compose up -d --build

# Parar todos os serviços
docker-compose down
```

## 🧪 Testes

O projeto possui cobertura de testes:

### Tipos de Teste
- **Unitários:** Testam componentes isolados
- **Integração:** Testam fluxos completos
- **E2E:** Testam cenários end-to-end

### Cobertura Mínima
- **70%** de cobertura obrigatória
- Verificado pelo Husky no commit
- Relatórios gerados automaticamente

### Executar Testes
```bash
# Todos os testes
yarn test

# Testes com cobertura
yarn test:coverage

# Testes em watch mode
yarn test:watch
```

## 🏗️ Arquitetura

### Princípios de Clean Architecture + SOLID

```
src/
├── domain/          # Regras de negócio
│   ├── entities/    # Entidades do domínio
│   ├── useCases/    # Casos de uso
│   └── repositories/# Interfaces de repositório
├── data/            # Implementações
│   ├── repositories/# Repositórios concretos
│   └── useCases/    # Implementações dos casos de uso
├── presentation/    # Controllers e DTOs
└── infra/          # Configurações externas
    └── db/         # Banco de dados
```
Pontos de melhoria: 
- Separar useCase em serviços
- Alterar algumas tipagens genéricas
## 📋 Regras de Negócio

### Upload de Pedidos
1. **Validação de Arquivo:**
   - Apenas arquivos `.txt`
   - Formato fixo de largura
   - Campos: user_id(10), name(45), order_id(10), product_id(10), value(12), date(8)

2. **Processamento:**
   - Leitura linha por linha
   - Validação de formato
   - Conversão de data (YYYYMMDD → YYYY-MM-DD)
   - Agrupamento por usuário e pedido

3. **Persistência:**
   - Inserção em lotes de 100
   - Tratamento de duplicatas

### Busca de Pedidos
1. **Filtros Disponíveis:**
   - `/`: Por padrão traz todos os dados
   - `user_id`: ID do usuário
   - `order_id`: ID do pedido
   - `start/end`: Período de datas
   - `page`: Paginação
   - `all`: Retorna todos os resultados
   - É possível combinar os filtros

2. **Lógica de Paginação:**
   - Padrão sempre na página 1
   - Limite de 100 itens por página
   - Retorna metadados de paginação

3. **Agregação:**
   - Agrupa por usuário
   - Soma valores por pedido
   - Estrutura hierárquica

## 🛣️ Rotas da API

### Healthcheck
```http
GET /healthcheck
```
**Resposta:**
```json
{
  "status": "OK",
  "db": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "app": "Sales Order API",
  "version": "1.0.0",
  "environment": "development"
}
```

### Upload de Pedidos
```http
POST /order/upload
Content-Type: multipart/form-data

file: [arquivo.txt]
```
**Resposta:**
```json
{
  "message": "Arquivo TXT processado e salvo no MongoDB com sucesso",
  "fileName": "pedidos.txt",
  "fileSize": 12345,
  "lines": 1000,
  "data": [
    {
      "user_id": 1,
      "name": "Marcelo",
      "orders": [
        {
          "order_id": 10,
          "total": "150.00",
          "date": "2024-01-15",
          "products": [
            {
              "product_id": 100,
              "value": "50.00"
            },
            {
              "product_id": 101,
              "value": "100.00"
            }
          ]
        },
        {
          "order_id": 11,
          "total": "75.50",
          "date": "2024-01-16",
          "products": [
            {
              "product_id": 102,
              "value": "75.50"
            }
          ]
        }
      ]
    }
  ],
  "savedOrders": 4,
  "skippedOrders": 0
}
```

### Busca de Pedidos
```http
GET /order/search?user_id=1&start=2024-01-01&end=2024-01-31&page=1
```
**Resposta:**
```json
{
  "pagination": {
    "totalPages": 3,
    "currentPage": 1,
    "totalItems": 250,
    "itemsPerPage": 100
  },
  "data": [...]
}
```

### Exemplo de Resposta da API

#### **Upload de Pedidos:**
```json
{
  "message": "Arquivo TXT processado e salvo no MongoDB com sucesso",
  "fileName": "pedidos.txt",
  "fileSize": 12345,
  "lines": 1000,
  "data": [
    {
      "user_id": 1,
      "name": "Marcelo",
      "orders": [
        {
          "order_id": 10,
          "total": "150.00",
          "date": "2024-01-15",
          "products": [
            {
              "product_id": 100,
              "value": "50.00"
            },
            {
              "product_id": 101,
              "value": "100.00"
            }
          ]
        },
        {
          "order_id": 11,
          "total": "75.50",
          "date": "2024-01-16",
          "products": [
            {
              "product_id": 102,
              "value": "75.50"
            }
          ]
        }
      ]
    }
  ],
  "savedOrders": 4,
  "skippedOrders": 0
}
```

#### **Busca de Pedidos:**
```json
[
  {
    "user_id": 1,
    "name": "João Silva",
    "orders": [
      {
        "order_id": 10,
        "total": "150.00",
        "date": "2024-01-15",
        "products": [
          {
            "product_id": 100,
            "value": "50.00"
          },
          {
            "product_id": 101,
            "value": "100.00"
          }
        ]
      }
    ]
  }
]
```

### 📊 Registro no MongoDB

#### **Documento Individual (Collection: orders):**
```json
{
  "_id": ObjectId("65f1234567890abcdef12345"),
  "user_id": 1,
  "name": "Marcelo",
  "order_id": 10,
  "product_id": 100,
  "product_value": "50.00",
  "date": "2024-01-15",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

#### **Índices Criados:**
```javascript
// Índice único para evitar duplicatas
{
  "user_id": 1,
  "name": 1,
  "order_id": 1,
  "product_id": 1,
  "product_value": 1,
  "date": 1
}

// Índices para consultas rápidas
{ "user_id": 1 }
{ "order_id": 1 }
{ "date": 1 }
```

## 🗄️ Banco de Dados

### MongoDB - Escolha Técnica

**Por que MongoDB?**
- **Dados sem relacionamentos:** Pedidos são independentes
- **Consultas rápidas:** Índices otimizados
- **Flexibilidade:** Schema flexivel
- **Escalabilidade:** Horizontal

### MongoDB Atlas (Produção)

**Configuração:**
- **Cluster:** Free Tier (M0)
- **Limitações:** Latência e memória limitadas
- **Região:** Mais próxima dos usuários

**Performance Observada:**
| Cenário | Banco Local | Atlas Free | Atlas Pago |
|---------|-------------|------------|------------|
| 4k linhas | < 1s | 3s | < 1s |
| 60k linhas | 3s | 8s | 2s |

**Otimizações Implementadas:**
- ✅ **Inserção em lotes** (100 registros)
- ✅ **Índices compostos** para consultas rápidas
- ✅ **Tratamento de duplicatas** eficiente

**Recomendações:**
- Para produção com alto volume: Upgrade para instância paga
- Para desenvolvimento: Banco local é suficiente
- Monitoramento: CloudWatch para métricas de performance

### Índices Criados
```javascript
// Índice composto para evitar duplicatas. Somente se todos os campos forem iguais não ira duplicas.
db.orders.createIndex({
  user_id: 1,
  order_id: 1,
  product_id: 1,
  date: 1
}, { unique: true })
```

### Regra de Duplicação
- **Só duplica quando TODOS os campos são iguais**
- user_id + order_id + product_id + date + value
- Garante integridade dos dados

## 🔧 Qualidade de Código

### Lint + Husky
```bash
# Verificação automática no commit
yarn lint          # ESLint
yarn lint:fix        # Ajuste
yarn test:coverage # Cobertura mínima 70%
```

### Hooks do Husky
- **pre-commit:** Lint + Testes
- **commit-msg:** Formato de commit
- **pre-push:** Cobertura de testes

### Formato de Commit
```
type(scope): description

feat(upload): add file validation
fix(search): correct pagination logic
docs(readme): update deployment info
```

## 📊 Métricas de Qualidade

- **Cobertura de Testes:** 70%+
- **Lint Score:** 100%
- **Build Time:** < 2min
- **Deploy Time:** < 5min

## 🚀 Tecnologias

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Banco:** MongoDB
- **ORM:** Mongoose
- **Testes:** Jest
- **Lint:** ESLint + Prettier
- **Deploy:** Railway + Docker
- **CI/CD:** GitHub + Railway

### Limitações do MongoDB Atlas Free
- **Latência:** Maior que banco local
- **Memória:** Limitada para operações grandes
- **Conexões:** Máximo de 500 conexões simultâneas
- **Storage:** 512MB máximo

### Performance em Produção
- **Arquivos pequenos (< 10k linhas):** Performance aceitável
- **Arquivos médios (10k-50k linhas):** Pode demorar 3-8s
- **Arquivos grandes (> 1000k linhas):** Recomenda upgrade do cluster

### Estratégias de Otimização
1. **Processamento em lotes** reduz carga no banco
2. **Índices bem definidos** aceleram consultas


## 🏗️ Arquitetura da API

### Desenho da API
# Sales Order API - Fluxograma

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SALES ORDER API - FLUXOGRAMA                      │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────┐        ┌───────────────────────┐
  │      CLIENTE          │        │    ARQUIVO TXT        │
  └──────────┬────────────┘        └──────────┬────────────┘
             │                                │
             │ POST /order/upload             │
             │ (multipart/form-data)          │
             ├───────────────────────────────►│
             │                                │
┌────────────▼────────────┐                   │
│   VALIDAÇÃO DO ARQUIVO  │                   │
│  ✔ Formato .txt         │                   │
│  ✔ Estrutura das linhas │                   │
│  ✔ Campos obrigatórios  │                   │
└────────────┬────────────┘                   │
             │                                │
             │ Arquivo válido                 │
             │                                │
┌────────────▼────────────┐                   │
│   PROCESSAMENTO         │                   │
│  ✔ Leitura linha a linha│                   │
│  ✔ Conversão de datas   │                   │
│  ✔ Agrupamento:         │                   │
│    user > orders >      │                   │
│    products             │                   │
└────────────┬────────────┘                   │
             │                                │
             │ Dados processados              │
             │                                │
┌────────────▼────────────┐        ┌──────────▼────────────┐
│     PERSISTÊNCIA        │        │     RESPOSTA          │
│  ✔ Inserção em lotes    │        │  ✔ Dados processados  │
│  ✔ Tratamento de        │        │  ✔ Estatísticas       │
│    duplicatas           │        │  ✔ Estrutura hierárq. │
│  ✔ Índices MongoDB      │        └───────────────────────┘
└────────────┬────────────┘
             │
             │
┌────────────▼────────────┐        ┌───────────────────────┐
│     CONSULTA            ◄────────┤     CLIENTE           │
│  ✔ Filtros:             │        │                       │
│    user_id, order_id,   │        │ GET /order/search?    │
│    date range           │        │ Parâmetros:           │
│  ✔ Paginação            │        │ - user_id             │
│  ✔ Agregação de totais  │        │ - order_id            │
│  ✔ Estrutura hierárquica│        │ - start/end date      │
└────────────┬────────────┘        └───────────────────────┘
             │
             │
┌────────────▼────────────┐
│     RESPOSTA            │
│  ✔ Dados agrupados      │
│  ✔ Metadados paginação  │
│  ✔ Totais calculados    │
└─────────────────────────┘
```

## Componentes Principais

```text
           ┌───────────────┐
           │   MONGODB     │
           │  ■ orders     │
           │  ■ índices    │
           └──────┬───────┘
                  │
        ┌─────────▼───────────┐
        │  API (Node/Express) │
        │  ■ Upload           │
        │  ■ Search           │
        │  ■ Healthcheck      │
        └─────────┬───────────┘
                  │
        ┌─────────▼───────────┐
        │  CLIENTE            │
        │  ■ Envia arquivos   │
        │  ■ Consulta dados   │
        └─────────────────────┘
```

## Fluxo de Erros

```text
           ┌───────────────┐
           │  ERRO:        │
           │ ✖ Formato     │
           │ ✖ Validação   │
           └──────┬───────┘
                  │
        ┌─────────▼───────────┐
        │  RESPOSTA DE ERRO   │
        │  ■ Status code      │
        │  ■ Mensagem clara   │
        │  ■ Detalhes         │
        └─────────────────────┘
```



📁 UPLOAD DE ARQUIVOS
├── ✅ Apenas arquivos .txt
├── ✅ Campos: user_id + name + order_id + product_id + value + date
├── ✅ Processamento: todas as linhas → agrupamento em lotes de 100 → inserção no MongoDB
├── ✅ Tratamento de duplicatas
├── ✅ Formato de data: YYYYMMDD → YYYY-MM-DD
└── ✅ Agregação por usuário e pedido

🔍 BUSCA DE PEDIDOS
├── ✅ Filtros: order_id, user_id, start_date, end_date
├── ✅ Paginação: page, limit (100 por página)
├── ✅ Parâmetro "all": retorna todos sem paginação
├── ✅ Agrupamento: usuário → pedidos → produtos
├── ✅ Cálculo de totais por pedido
└── ✅ Resposta estruturada com paginação

🏥 HEALTHCHECK
├── ✅ Status da aplicação
├── ✅ Conexão com MongoDB
├── ✅ Informações de versão
└── ✅ Timestamp da verificação

┌─────────────────────────────────────────────────────────────────────────────┐
│                            TECNOLOGIAS UTILIZADAS                        │
└─────────────────────────────────────────────────────────────────────────────┘

🟢 BACKEND
├── Node.js + TypeScript
├── Express.js (HTTP Server)
├── Mongoose (MongoDB ODM)
├── Multer (File Upload)
├── Swagger UI Express (API Docs)
└── Joi (Validation)

🗄️ BANCO DE DADOS
├── MongoDB Atlas (Produção)
├── MongoDB Local (Desenvolvimento)
├── Índices compostos para performance
└── Tratamento de duplicatas

🧪 TESTES
├── Jest (Framework)
├── Supertest (HTTP Testing)
├── Cobertura mínima: 70%
├── Testes unitários
└── Testes de integração

🔧 QUALIDADE
├── ESLint (Linting)
├── Prettier (Formatação)
├── Husky (Git Hooks)
├── Commitlint (Padrão de commits)
└── TypeScript (Type Safety)

🐳 CONTAINERIZAÇÃO
├── Docker (Multi-stage build)
├── Docker Compose (Local)
└── Railway (Deploy)

📊 MONITORAMENTO
├── Healthcheck endpoint
├── Error handling
├── railway
