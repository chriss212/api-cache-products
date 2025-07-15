

# API Cache Products

A NestJS API that demonstrates caching with Redis for product management.

## Features

- **Product Entity**: Contains `id`, `name`, and `price` fields
- **GET /products**: Returns all products with 30-second Redis caching
- **POST /products**: Creates new products and invalidates cache
- **Redis Integration**: Uses Redis for caching with 30-second TTL

## Requirements

- Node.js
- PostgreSQL
- Redis

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL database:
   - Create a database named `products_db`
   - Update connection details in `src/app.module.ts` if needed

3. Start Redis server:

```bash
redis-server
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:4000`

## API Endpoints

### GET /products

Returns all products. Response is cached for 30 seconds using Redis.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": "29.99"
  }
]
```

### POST /products

Creates a new product and invalidates the cache.

**Request Body:**

```json
{
  "name": "Product Name",
  "price": 29.99
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Product Name",
  "price": "29.99"
}
```

## Cache Behavior

- **GET requests**: Data is cached for 30 seconds in Redis
- **POST requests**: Cache is invalidated to ensure fresh data
- **Cache key**: `products_all`

## Project Structure

```
src/
├── api-cache-error2-src/
│   ├── cache/
│   │   └── cache.service.ts      # Redis cache configuration
│   ├── product/
│   │   ├── product.controller.ts # API endpoints
│   │   ├── product.entity.ts     # Product model
│   │   ├── product.service.ts    # Business logic with caching
│   │   └── product.module.ts     # Module configuration
│   ├── app.module.ts             # Main application module
│   └── main.ts                   # Application entry point
```

## Technologies Used

- **NestJS**: Framework for building scalable server-side applications
- **TypeORM**: Object-Relational Mapping for database operations
- **PostgreSQL**: Primary database
- **Redis**: Caching layer
- **cache-manager-redis-store**: Redis store for cache-manager
