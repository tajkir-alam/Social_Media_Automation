import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/onboarding');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header text-center">
          <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>AI-SMART</h1>
          <p className="text-muted">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          {displayError && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <span>{displayError}</span>
            </div>
          )}

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </div>

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
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)', marginBottom: 0 }}>
              At least 6 characters
            </p>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="card-footer" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 'var(--spacing-lg)', justifyContent: 'center' }}>
          <p style={{ marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: '600' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
