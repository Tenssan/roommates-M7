# Roommates and Expenses Management

This project is a Node.js application that manages roommates and their expenses. It includes functionalities to add roommates, add expenses, retrieve roommates and expenses, update expenses, and delete expenses. The application also recalculates and updates the balances (`debe` and `recibe`) of the roommates after these operations.

## Prerequisites

- Node.js installed on your machine

## Installation

1. Clone the repository to your local machine

2. Install the required dependencies:

    ```bash
    npm install
    ```

## Usage

1. Navigate to the src/ directory and run the application:

    ```bash
    node server.js
    ```

2. Open your browser and navigate to `http://localhost:3000` to interact with the web interface.

## API Endpoints

### Add a new roommate

- **URL:** `/roommate`
- **Method:** `POST`
- **Success Response:**
  - **Code:** 201
  - **Content:** 
    ```json
    {
      "id": "unique-roommate-id",
      "nombre": "Roommate Name",
      "email": "email@example.com",
      "debe": 0,
      "recibe": 0
    }
    ```

### Retrieve all roommates

- **URL:** `/roommates`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "roommates": [
        {
          "id": "unique-roommate-id",
          "nombre": "Roommate Name",
          "email": "email@example.com",
          "debe": 0,
          "recibe": 0
        }
      ]
    }
    ```

### Add a new expense

- **URL:** `/gasto`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "roommate": "Roommate Name",
    "descripcion": "Expense Description",
    "monto": 1000
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** 
    ```json
    {
      "id": "unique-expense-id",
      "roommate": "Roommate Name",
      "descripcion": "Expense Description",
      "monto": 1000
    }
    ```

### Retrieve all expenses

- **URL:** `/gastos`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "gastos": [
        {
          "id": "unique-expense-id",
          "roommate": "Roommate Name",
          "descripcion": "Expense Description",
          "monto": 1000
        }
      ]
    }
    ```

### Update an expense

- **URL:** `/gasto?id=unique-expense-id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "roommate": "Updated Roommate Name",
    "descripcion": "Updated Expense Description",
    "monto": 1500
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "id": "unique-expense-id",
      "roommate": "Updated Roommate Name",
      "descripcion": "Updated Expense Description",
      "monto": 1500
    }
    ```

### Delete an expense

- **URL:** `/gasto?id=unique-expense-id`
- **Method:** `DELETE`
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "id": "unique-expense-id",
      "roommate": "Roommate Name",
      "descripcion": "Expense Description",
      "monto": 1000
    }
    ```

## Functions

- `addRoommate()`: Adds a new roommate to the list.
- `getRoommates()`: Retrieves all roommates from the list.
- `addExpense(roommate, descripcion, monto)`: Adds a new expense for a roommate and updates the `debe` field.
- `getExpenses()`: Retrieves all expenses from the list.
- `updateExpense(id, roommate, descripcion, monto)`: Updates an expense identified by its `id` and adjusts the `debe` and `recibe` fields accordingly.
- `deleteExpense(id)`: Deletes an expense identified by its `id` and adjusts the `debe` and `recibe` fields accordingly.
