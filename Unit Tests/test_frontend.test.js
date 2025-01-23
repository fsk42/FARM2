import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../frontend/src/App';
import LoginForm from '../frontend/src/components/LoginForm';

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders main app component', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('Login Component', () => {
  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('handles login submission', async () => {
    render(<LoginForm />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
