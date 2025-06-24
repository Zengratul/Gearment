'use client';

import { ReactNode } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isManager = user?.role === 'manager';

  // Don't render layout if user is not available (still loading)
  if (!user) {
    return <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <div className="min-vh-100 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand href="/dashboard">
            📋 Leave Management System
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard" className="text-white fw-semibold nav-link-hover">Dashboard</Nav.Link>
              <Nav.Link href="/leave-requests" className="text-white fw-semibold nav-link-hover">My Requests</Nav.Link>
              {isManager && (
                <Nav.Link href="/manager/approvals" className="text-white fw-semibold nav-link-hover">Approvals</Nav.Link>
              )}
            </Nav>
            
            <Nav className="ms-auto">
              <Nav.Item className="d-flex align-items-center me-3">
                <span className="text-light">
                  Welcome, {user.firstName} {user.lastName}
                </span>
                <span className={`badge ms-2 ${isManager ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                  {isManager ? '👨‍💼 Manager' : '💼 Employee'}
                </span>
              </Nav.Item>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="p-0">
        {children}
      </Container>
    </div>
  );
} 