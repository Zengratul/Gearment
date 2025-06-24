'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup, Dropdown, Alert } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { leaveRequestAPI, LeaveRequest } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';

export default function LeaveRequestsPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Use appropriate endpoint based on user role
        const response = user?.role === 'manager' 
          ? await leaveRequestAPI.getAll()
          : await leaveRequestAPI.getMyLeaveRequests();
        
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  useEffect(() => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(request => request.leaveType === typeFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    // Handle dropdown events to prevent scroll
    const handleDropdownShow = () => {
      document.body.classList.add('dropdown-open');
    };
    
    const handleDropdownHide = () => {
      document.body.classList.remove('dropdown-open');
    };

    // Add event listeners
    document.addEventListener('show.bs.dropdown', handleDropdownShow);
    document.addEventListener('hide.bs.dropdown', handleDropdownHide);

    return () => {
      // Cleanup
      document.removeEventListener('show.bs.dropdown', handleDropdownShow);
      document.removeEventListener('hide.bs.dropdown', handleDropdownHide);
      document.body.classList.remove('dropdown-open');
    };
  }, []);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await leaveRequestAPI.delete(id);
        setRequests(requests.filter(req => req.id !== id));
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      try {
        await leaveRequestAPI.update(id, { status: 'approved' });
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === id ? { ...req, status: 'approved' } : req
          )
        );
        // Also update filtered requests
        setFilteredRequests(prevFiltered => 
          prevFiltered.map(req => 
            req.id === id ? { ...req, status: 'approved' } : req
          )
        );
      } catch (error) {
        console.error('Error approving request:', error);
      }
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason && window.confirm('Are you sure you want to reject this request?')) {
      try {
        await leaveRequestAPI.update(id, { status: 'rejected', rejectionReason: reason });
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === id ? { ...req, status: 'rejected', rejectionReason: reason } : req
          )
        );
        // Also update filtered requests
        setFilteredRequests(prevFiltered => 
          prevFiltered.map(req => 
            req.id === id ? { ...req, status: 'rejected', rejectionReason: reason } : req
          )
        );
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

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
      <div className="p-4 d-flex flex-column overflow-hidden" style={{ minHeight: 'calc(100vh - 76px)' }}>
        {deleteSuccess && (
          <Alert variant="success" className="mb-3" onClose={() => setDeleteSuccess(false)} dismissible>
            ✅ Leave request deleted successfully!
          </Alert>
        )}
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">
                {user?.role === 'manager' ? 'All Leave Requests' : 'My Leave Requests'}
              </h1>
              <p className="text-muted">
                {user?.role === 'manager' 
                  ? 'Manage all employee leave requests' 
                  : 'View and manage your leave requests'
                }
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => router.push('/leave-requests/new')}
            >
              📝 New Request
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by type or reason..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="annual">Annual</option>
                    <option value="sick">Sick</option>
                    <option value="personal">Personal</option>
                    <option value="maternity">Maternity</option>
                    <option value="paternity">Paternity</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Requests Table */}
        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {user?.role === 'manager' ? 'All Requests' : 'My Requests'} ({filteredRequests.length})
              </h5>
            </div>
          </Card.Header>
          <Card.Body className="flex-grow-1 d-flex flex-column p-0 overflow-hidden">
            {filteredRequests.length > 0 ? (
              <div className="flex-grow-1 overflow-hidden">
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      {user?.role === 'manager' && <th>Employee</th>}
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Applied</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        {user?.role === 'manager' && (
                          <td>
                            <strong>{request.user?.firstName} {request.user?.lastName}</strong>
                            <br />
                            <small className="text-muted">{request.user?.email}</small>
                          </td>
                        )}
                        <td>
                          <span className="me-2">{getLeaveTypeIcon(request.leaveType)}</span>
                          {request.leaveType}
                        </td>
                        <td>{formatDate(request.startDate)}</td>
                        <td>{formatDate(request.endDate)}</td>
                        <td>{request.numberOfDays}</td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }} title={request.reason}>
                            {request.reason}
                          </div>
                        </td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          {/* Only show actions dropdown if there are actions available */}
                          {((user?.role === 'manager' && request.status === 'pending') || 
                            (user?.role !== 'manager' && request.status === 'pending')) ? (
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {user?.role === 'manager' && request.status === 'pending' && (
                                  <>
                                    <Dropdown.Item onClick={() => handleApprove(request.id)}>
                                      ✅ Approve
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleReject(request.id)}>
                                      ❌ Reject
                                    </Dropdown.Item>
                                  </>
                                )}
                                {user?.role !== 'manager' && request.status === 'pending' && (
                                  <Dropdown.Item onClick={() => handleDelete(request.id)}>
                                    🗑️ Delete
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
                <p className="text-muted">No leave requests found.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
} 