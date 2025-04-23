# UserMnt

## Description
UserMnt is a NestJS application that provides a CRUD interface for managing users (usuarios) with MySQL integration. This project is structured to facilitate easy management of user data through a RESTful API.

## Features
- Create, Read, Update, and Delete (CRUD) operations for usuarios.
- MySQL database integration using TypeORM.
- DTOs for data validation and transfer.
- Modular architecture for scalability and maintainability.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd UserMnt
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Configure the database connection in `ormconfig.json`:
   ```json
   {
     "type": "mysql",
     "host": "localhost",
     "port": 3306,
     "username": "your-username",
     "password": "your-password",
     "database": "your-database",
     "synchronize": true,
     "entities": ["src/**/*.entity{.ts,.js}"]
   }
   ```

## Running the Application

To start the application, run:
```
npm run start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

- **Create Usuario**: `POST /usuarios`
- **Get All Usuarios**: `GET /usuarios`
- **Get Usuario by ID**: `GET /usuarios/:id`
- **Update Usuario**: `PUT /usuarios/:id`
- **Delete Usuario**: `DELETE /usuarios/:id`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.