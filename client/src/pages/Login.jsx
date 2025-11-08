import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header text-center">
          <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>AI-SMART</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          {displayError && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <span>{displayError}</span>
            </div>
          )}

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-lg btn-block"
            disabled={isLoading}
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="card-footer" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 'var(--spacing-lg)', justifyContent: 'center' }}>
          <p style={{ marginBottom: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: '600' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
