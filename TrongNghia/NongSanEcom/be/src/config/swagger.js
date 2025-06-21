import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NongSan E-commerce API',
      version: '1.0.0',
      description: 'API documentation for NongSan E-commerce application',
      contact: {
        name: 'API Support',
        email: 'support@nongsan.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.nongsan.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff', 'customer'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID',
            },
            name: {
              type: 'string',
              description: 'Product name',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'number',
              description: 'Product price',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Product images URLs',
            },
            category: {
              type: 'string',
              description: 'Product category',
            },
            countInStock: {
              type: 'number',
              description: 'Available stock',
            },
            rating: {
              type: 'number',
              description: 'Average rating',
            },
            numReviews: {
              type: 'number',
              description: 'Number of reviews',
            },
            reviews: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Review',
              },
            },
            unit: {
              type: 'string',
              description: 'Product unit (kg, piece, etc.)',
            },
            origin: {
              type: 'string',
              description: 'Product origin',
            },
            discount: {
              type: 'number',
              description: 'Discount percentage',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Rating (1-5)',
            },
            comment: {
              type: 'string',
              description: 'Review comment',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            orderItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
            shippingAddress: {
              $ref: '#/components/schemas/ShippingAddress',
            },
            paymentMethod: {
              type: 'string',
              description: 'Payment method',
            },
            itemsPrice: {
              type: 'number',
              description: 'Total items price',
            },
            taxPrice: {
              type: 'number',
              description: 'Tax amount',
            },
            shippingPrice: {
              type: 'number',
              description: 'Shipping cost',
            },
            totalPrice: {
              type: 'number',
              description: 'Total order price',
            },
            isPaid: {
              type: 'boolean',
              description: 'Payment status',
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
            },
            isDelivered: {
              type: 'boolean',
              description: 'Delivery status',
            },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status',
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Product name',
            },
            qty: {
              type: 'number',
              description: 'Quantity',
            },
            image: {
              type: 'string',
              description: 'Product image',
            },
            price: {
              type: 'number',
              description: 'Product price',
            },
            product: {
              type: 'string',
              description: 'Product ID',
            },
          },
        },
        ShippingAddress: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Shipping address',
            },
            city: {
              type: 'string',
              description: 'City',
            },
            postalCode: {
              type: 'string',
              description: 'Postal code',
            },
            country: {
              type: 'string',
              description: 'Country',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'object',
              description: 'Validation errors',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options); 