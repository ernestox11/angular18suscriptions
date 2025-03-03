# Angular 18 API Practice Project

A practice environment for mastering API calls in Angular 18 using the modern Signals approach.

## Project Overview

This project demonstrates:

- Chained API requests with proper error handling
- Angular Signals for state management
- TypeScript strict null safety
- Modern async/await patterns

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone or download this repository

2. Install dependencies:

```bash
npm install
```

### Setting Up the Mock API

1. Install JSON Server if needed:

    ```bash
    npm install -g json-server
    ```

2. Create a `db.json` file in the project root:

    ```json
    {
    "productos": [
        { "id": 1, "nombre": "Producto A", "categoriaId": 1 },
        { "id": 2, "nombre": "Producto B", "categoriaId": 2 },
        { "id": 3, "nombre": "Producto C", "categoriaId": 1 }
    ],
    "categorias": [
        { "id": 1, "nombre": "Electrónicos" },
        { "id": 2, "nombre": "Muebles" }
    ],
    "detalles": [
        { "id": 1, "productoId": 1, "descripcion": "Detalles del producto A", "stock": 10 },
        { "id": 2, "productoId": 2, "descripcion": "Detalles del producto B", "stock": 5 },
        { "id": 3, "productoId": 3, "descripcion": "Detalles del producto C", "stock": 15 }
    ]
    }
    ```

3. Start JSON Server:

    ```bash
    json-server db.json
    ```

4. The API will be available at [http://localhost:3000](http://localhost:3000) with these endpoints:
   - GET `/productos` - List all products
   - GET `/productos/1` - Get a specific product
   - GET `/categorias` - List all categories
   - GET `/detalles` - List all details

### Starting the Angular App

```bash
ng serve
```

The app will be available at [http://localhost:4200](http://localhost:4200)

## Project Structure

```text
src/app/
├── productos/
│   ├── loading.service.ts       # Handles loading simulation
│   ├── producto.service.ts      # API calls with signals
│   └── producto.component.ts    # UI component
├── app.routes.ts                # Route configuration
└── app.config.ts                # App configuration with HttpClient
```

## Key Features

- **Chained API Requests**: Demonstrates how to make sequential API calls where each depends on the previous
- **Signals Architecture**: Uses Angular 18's signals for reactive state management
- **Two Implementation Approaches**:
  - Traditional nested subscriptions
  - Modern async/await pattern
- **Type-Safe Interfaces**: Comprehensive TypeScript interfaces for all data models
- **Loading & Error States**: Proper handling of loading indicators and error messages
