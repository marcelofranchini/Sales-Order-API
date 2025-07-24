export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Sales Order API',
    version: '1.0.0',
    description: 'API para gerenciamento de pedidos de vendas',
    contact: {
      name: 'Marcelo Franchini',
    },
  },
  servers: [
    {
      url: 'https://sales-order-api-production.up.railway.app',
      description: 'Servidor de produção',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento',
    },
  ],
  paths: {
    '/healthcheck': {
      get: {
        summary: 'Verificar status da aplicação',
        description:
          'Endpoint para verificar se a aplicação está funcionando corretamente',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Aplicação funcionando normalmente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthCheckResponse',
                },
                example: {
                  status: 'OK',
                  db: 'OK',
                  timestamp: '2024-01-01T00:00:00.000Z',
                  app: 'SalesOrder API',
                  version: '1.0.0',
                  environment: 'development',
                },
              },
            },
          },
          '503': {
            description: 'Aplicação com problemas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthCheckResponse',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthCheckResponse',
                },
              },
            },
          },
        },
      },
    },
    '/order/upload': {
      post: {
        summary: 'Upload de pedidos via arquivo TXT',
        description:
          'Recebe um arquivo TXT com pedidos e importa para o sistema.',
        tags: ['Orders'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo TXT contendo os pedidos',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Upload realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UploadOrdersResponse',
                },
                example: {
                  message:
                    'Arquivo TXT processado e salvo no MongoDB com sucesso',
                  fileName: 'pedidos.txt',
                  fileSize: 12345,
                  lines: 2,
                  data: [
                    {
                      user_id: 1,
                      name: 'Marcelo',
                      orders: [
                        {
                          order_id: 10,
                          total: '20.00',
                          date: '2024-01-01',
                          products: [
                            {
                              product_id: 100,
                              value: '10.00',
                            },
                            {
                              product_id: 101,
                              value: '10.00',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  savedOrders: 2,
                  skippedOrders: 0,
                },
              },
            },
          },
          '400': {
            description: 'Erro de validação ou formato do arquivo',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  message: 'Apenas arquivos TXT são permitidos',
                },
              },
            },
          },
        },
      },
    },
    '/order/search': {
      get: {
        summary: 'Buscar pedidos',
        description:
          'Busca pedidos por filtros e retorna agrupado por usuário e pedido.',
        tags: ['Orders'],
        parameters: [
          {
            in: 'query',
            name: 'order_id',
            schema: {
              type: 'integer',
            },
            description: 'ID do pedido',
          },
          {
            in: 'query',
            name: 'user_id',
            schema: {
              type: 'integer',
            },
            description: 'ID do usuário',
          },
          {
            in: 'query',
            name: 'start',
            schema: {
              type: 'string',
              format: 'date',
            },
            description: 'Data inicial (YYYY-MM-DD)',
          },
          {
            in: 'query',
            name: 'end',
            schema: {
              type: 'string',
              format: 'date',
            },
            description: 'Data final (YYYY-MM-DD)',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
            },
            description: 'Página da busca (default: 1)',
          },
          {
            in: 'query',
            name: 'all',
            schema: {
              type: 'string',
              enum: ['true', 'false'],
            },
            description: 'Retorna todos os resultados sem paginação',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de pedidos agrupados',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        pagination: {
                          type: 'object',
                          properties: {
                            totalPages: { type: 'integer' },
                            currentPage: { type: 'integer' },
                            totalItems: { type: 'integer' },
                            itemsPerPage: { type: 'integer' },
                          },
                        },
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/UserOrders',
                          },
                        },
                      },
                    },
                    {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/UserOrders',
                      },
                      description: 'Retornado quando all=true (sem paginação)',
                    },
                  ],
                },
                example: [
                  {
                    pagination: {
                      totalPages: 3,
                      currentPage: 1,
                      totalItems: 250,
                      itemsPerPage: 100,
                    },
                  },
                  {
                    user_id: 1,
                    name: 'Marcelo',
                    orders: [
                      {
                        order_id: 10,
                        total: '20.00',
                        date: '2024-01-01',
                        products: [
                          {
                            product_id: 100,
                            value: '10.00',
                          },
                          {
                            product_id: 101,
                            value: '10.00',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
          '400': {
            description: 'Erro de validação dos parâmetros',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  message: 'Parâmetro(s) não permitido(s): foo',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthCheckResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['OK', 'FAIL'],
            description: 'Status geral da aplicação',
          },
          db: {
            type: 'string',
            enum: ['OK', 'FAIL'],
            description: 'Status da conexão com o banco de dados',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp da verificação',
          },
          app: {
            type: 'string',
            description: 'Nome da aplicação',
          },
          version: {
            type: 'string',
            description: 'Versão da aplicação',
          },
          environment: {
            type: 'string',
            description: 'Ambiente de execução',
          },
          error: {
            type: 'string',
            description: 'Mensagem de erro (quando status é FAIL)',
          },
        },
        required: [
          'status',
          'db',
          'timestamp',
          'app',
          'version',
          'environment',
        ],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Mensagem de erro',
          },
        },
        required: ['message'],
      },
      Product: {
        type: 'object',
        properties: {
          product_id: {
            type: 'integer',
          },
          value: {
            type: 'string',
          },
        },
        required: ['product_id', 'value'],
      },
      Order: {
        type: 'object',
        properties: {
          order_id: {
            type: 'integer',
          },
          total: {
            type: 'string',
          },
          date: {
            type: 'string',
          },
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
        },
        required: ['order_id', 'total', 'date', 'products'],
      },
      UserOrders: {
        type: 'object',
        properties: {
          user_id: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
          orders: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Order',
            },
          },
        },
        required: ['user_id', 'name', 'orders'],
      },
      UploadOrdersResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          fileName: {
            type: 'string',
          },
          fileSize: {
            type: 'integer',
          },
          lines: {
            type: 'integer',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserOrders',
            },
          },
          savedOrders: {
            type: 'integer',
          },
          skippedOrders: {
            type: 'integer',
          },
        },
        required: [
          'message',
          'fileName',
          'fileSize',
          'lines',
          'data',
          'savedOrders',
          'skippedOrders',
        ],
      },
    },
  },
  tags: [],
};
