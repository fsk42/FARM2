# Unit Tests

This directory contains unit tests for both frontend and backend components of the FARM2 project.

## Backend Tests

To run the backend tests, you need to install the required dependencies first:
```bash
pip install pytest fastapi pytest-asyncio httpx
```

Then run the tests with:
```bash
python -m pytest test_backend.py -v
```

## Frontend Tests

To run the frontend tests, make sure you have all dependencies installed:
```bash
cd ../frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

Then run the tests with:
```bash
npm test
```

## Test Coverage

- Backend tests cover:
  - Root endpoint
  - Login functionality
  - File upload functionality

- Frontend tests cover:
  - Main App component rendering
  - Login form functionality
  - API integration
