# Spring Soft Application

This is an Angular-based web application that provides user profile management functionality. The application uses JSON Server to mock the backend API for development purposes.

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)
- Angular CLI (v18.2.x)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd spring-soft
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

You have several options to run the application:

### Development Mode with Mock API

To run the application with the mock API server:

```bash
npm run dev
```

This command will:
- Start the Angular development server on `http://localhost:4200`
- Start the JSON Server mock API on `http://localhost:3000`

### Development Mode (Frontend Only)

To run only the Angular development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Mock API Server Only

To run only the mock API server:

```bash
npm run mock:server
```

The mock API will be available at `http://localhost:3000`

## Testing

### Running Unit Tests

To execute the unit tests:

```bash
npm test
```

This will:
- Launch Karma test runner
- Execute all test cases
- Generate coverage reports

To run tests in watch mode (for development):

```bash
npm test -- --watch
```

### Test Coverage

Coverage reports are generated automatically when running tests. You can find them in:
```
/coverage/spring-soft/index.html
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the application for production
- `npm test` - Executes unit tests
- `npm run mock:server` - Starts the mock API server
- `npm run dev` - Runs both the development server and mock API
- `npm run watch` - Builds the application in watch mode

## Dependencies

- Angular v18.2.0
- Angular Material v18.2.11
- RxJS v7.8.0
- JSON Server (for mock API)
- Jasmine/Karma (for testing)

## Browser Support

The application supports the following browsers:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 4200 is in use, Angular will automatically try to use the next available port
   - If port 3000 is in use, you can modify the mock server port in the `package.json` file

2. **Mock API Connection Issues**
   - Ensure the mock server is running (`npm run mock:server`)
   - Check that the API URL in the environment files matches the mock server port

