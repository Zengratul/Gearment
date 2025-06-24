'use client';

import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { authAPI, LoginRequest } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Auto-fill credentials based on role
  useEffect(() => {
    const demoCredentials = {
      employee: { email: 'test@gmail.com', password: '12345678' },
      manager: { email: 'viet@gmail.com', password: '12345678' },
    };
    
    setFormData(demoCredentials[role]);
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: 'employee' | 'manager') => {
    setRole(value);
    
    // Auto-fill credentials based on role
    const demoCredentials = {
      employee: { email: 'test@gmail.com', password: '12345678' },
      manager: { email: 'viet@gmail.com', password: '12345678' },
    };
    
    setFormData(demoCredentials[value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting login process...');
      console.log('Form data:', formData);
      
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      login(response.data.user, response.data.accessToken);
      console.log('User logged in, state updated');
      
      // Check if cookie was set
      setTimeout(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          try {
            const cookies = document.cookie;
            console.log('Current cookies:', cookies);
            const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth-storage='));
            console.log('Auth cookie found:', authCookie);
            
            if (authCookie) {
              console.log('Cookie set successfully, redirecting to dashboard...');
              window.location.href = '/dashboard';
            } else {
              console.log('Cookie not found, trying again...');
              // Force set cookie manually if needed
              const state = useAuthStore.getState();
              const cookieValue = encodeURIComponent(JSON.stringify({
                state: {
                  user: state.user,
                  accessToken: state.accessToken,
                  isAuthenticated: state.isAuthenticated
                }
              }));
              document.cookie = `auth-storage=${cookieValue}; path=/; max-age=86400; SameSite=Lax`;
              console.log('Manual cookie set, redirecting...');
              window.location.href = '/dashboard';
            }
          } catch (error) {
            console.error('Error handling cookie redirect:', error);
            // Fallback redirect
            window.location.href = '/dashboard';
          }
        }
      }, 500);
      
    } catch (err: unknown) {
      console.error('Login error:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="d-flex justify-content-center">
        <Card className="shadow-lg" style={{ minWidth: '400px', backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
          <Card.Header className="bg-primary text-white text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
            <h3 className="mb-0 fw-bold">Leave Management System</h3>
          </Card.Header>
          <Card.Body className="p-4" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center mb-4">
              <h4 className="text-dark fw-semibold">Login</h4>
              <p className="text-muted">Select your role and enter credentials</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <div className="mb-4 text-center">
                <label className="form-label text-dark fw-semibold">Select Role:</label>
                <ToggleButtonGroup
                  type="radio"
                  name="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="w-100"
                >
                  <ToggleButton
                    id="employee-role"
                    value="employee"
                    variant={role === 'employee' ? 'primary' : 'outline-primary'}
                    className="flex-fill"
                  >
                    👨‍💼 Employee
                  </ToggleButton>
                  <ToggleButton
                    id="manager-role"
                    value="manager"
                    variant={role === 'manager' ? 'primary' : 'outline-primary'}
                    className="flex-fill"
                  >
                    👔 Manager
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="text-dark fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  style={{ backgroundColor: '#ffffff', border: '1px solid #ced4da', color: '#212529' }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-dark fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  style={{ backgroundColor: '#ffffff', border: '1px solid #ced4da', color: '#212529' }}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>

            <div className="mt-4 text-center">
              <small className="text-muted">
                <strong>Demo Credentials:</strong><br />
                Employee: test@gmail.com / 12345678<br />
                Manager: viet@gmail.com / 12345678
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
} 