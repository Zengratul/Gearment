'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Table, Button, ProgressBar } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../store/authStore';
import { leaveBalanceAPI, leaveRequestAPI, LeaveBalance, LeaveRequest } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    // Give some time for the auth state to load from storage
    const timer = setTimeout(() => {
      setAuthChecked(true);
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = '/login';
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user && isAuthenticated) {
          const [balancesResponse, requestsResponse] = await Promise.all([
            leaveBalanceAPI.getByUserId(),
            user.role === 'manager' 
              ? leaveRequestAPI.getAll() 
              : leaveRequestAPI.getMyLeaveRequests()
          ]);

          setLeaveBalances(balancesResponse.data);
          setRecentRequests(requestsResponse.data.slice(0, 5)); // Get last 5 requests
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAuthenticated]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return <Badge bg={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
  };

  const getLeaveTypeIcon = (type: string) => {
    const icons = {
      annual: '🏖️',
      sick: '🏥',
      personal: '👤',
      maternity: '🤱',
      paternity: '👨‍👶'
    };
    return icons[type as keyof typeof icons] || '📅';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-0 text-dark">Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Leave Balance Cards */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3 text-dark">Leave Balance</h4>
        </Col>
      </Row>
      
      <Row className="mb-4">
        {leaveBalances.map((balance) => (
          <Col key={balance.id} xs={12} sm={6} lg={3} className="mb-3">
            <Card className="h-100 leave-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-2 me-2">{getLeaveTypeIcon(balance.leaveType)}</span>
                  <div>
                    <h6 className="mb-0 text-capitalize">{balance.leaveType} Leave</h6>
                    <small className="text-muted">{balance.year}</small>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Used: {balance.usedDays}</span>
                    <span>Total: {balance.totalDays}</span>
                  </div>
                  <ProgressBar 
                    now={(balance.usedDays / balance.totalDays) * 100} 
                    variant={balance.remainingDays > 0 ? 'success' : 'danger'}
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-primary mb-0">{balance.remainingDays}</h4>
                  <small className="text-muted">Days Remaining</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/leave-requests/new')}
                >
                  📝 Submit Leave Request
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => router.push('/leave-requests')}
                >
                  📋 View All Requests
                </Button>
                {user?.role === 'manager' && (
                  <Button 
                    variant="outline-success" 
                    onClick={() => router.push('/manager/approvals')}
                  >
                    ✅ Manage Approvals
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Leave Requests */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Leave Requests</h5>
                <Button 
                  variant="link" 
                  onClick={() => router.push('/leave-requests')}
                  className="p-0"
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentRequests.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <span className="me-2">{getLeaveTypeIcon(request.leaveType)}</span>
                          {request.leaveType}
                        </td>
                        <td>{formatDate(request.startDate)}</td>
                        <td>{formatDate(request.endDate)}</td>
                        <td>{request.numberOfDays}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>{formatDate(request.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No leave requests found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
} 