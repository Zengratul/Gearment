'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Alert, Toast, ToastContainer } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import { useAuthStore } from '../../../store/authStore';
import { leaveRequestAPI, LeaveRequest, UpdateLeaveRequestDto } from '../../../services/api';
import { useRouter } from 'next/navigation';

export default function ManagerApprovalsPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  const router = useRouter();

  // Handle navigation for non-managers
  useEffect(() => {
    if (user && user.role !== 'manager') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await leaveRequestAPI.getAll();
        // Filter only pending requests for managers
        const pendingRequests = response.data.filter(req => req.status === 'pending');
        console.log('Fetched pending requests:', pendingRequests.length);
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastVariant('success');
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastVariant('danger');
    setShowToast(true);
  };

  const handleAction = (request: LeaveRequest, actionType: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setAction(actionType);
    setRejectionReason('');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;

    setProcessing(true);
    setError('');

    try {
      const updateData: UpdateLeaveRequestDto = {
        status: action,
        ...(action === 'rejected' && rejectionReason && { rejectionReason })
      };

      console.log('Updating request:', selectedRequest.id, 'with data:', updateData);
      
      const response = await leaveRequestAPI.update(selectedRequest.id, updateData);
      console.log('Update response:', response.data);
      
      // Remove the request from the pending list since it's no longer pending
      setRequests(prevRequests => {
        const newRequests = prevRequests.filter(req => req.id !== selectedRequest.id);
        console.log('Updated requests list:', newRequests.length, 'items');
        return newRequests;
      });

      setShowModal(false);
      setSelectedRequest(null);
      
      // Show success toast
      const actionText = action === 'approved' ? 'approved' : 'rejected';
      showSuccessToast(`Leave request has been ${actionText} successfully!`);
      
    } catch (err: unknown) {
      console.error('Error updating request:', err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to update request. Please try again.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Redirect if not a manager
  if (user?.role !== 'manager') {
    return null;
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
        <h1 className="h3 mb-0">Leave Request Approvals</h1>
        <p className="text-muted">Review and manage pending leave requests</p>
      </div>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{requests.length}</h4>
              <p className="mb-0">Pending Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">
                {requests.filter(req => req.leaveType === 'annual').length}
              </h4>
              <p className="mb-0">Annual Leave</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">
                {requests.filter(req => req.leaveType === 'sick').length}
              </h4>
              <p className="mb-0">Sick Leave</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">
                {requests.filter(req => req.leaveType === 'personal').length}
              </h4>
              <p className="mb-0">Personal Leave</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Requests Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Pending Requests ({requests.length})</h5>
        </Card.Header>
        <Card.Body>
          {requests.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.user?.firstName} {request.user?.lastName}</strong>
                      <br />
                      <small className="text-muted">{request.user?.email}</small>
                    </td>
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
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAction(request, 'approved')}
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAction(request, 'rejected')}
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No pending requests to review.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Action Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === 'approved' ? 'Approve' : 'Reject'} Leave Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {selectedRequest && (
            <div className="mb-3">
              <p><strong>Employee:</strong> {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}</p>
              <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
              <p><strong>Duration:</strong> {selectedRequest.numberOfDays} days ({formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)})</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
            </div>
          )}

          {action === 'rejected' && (
            <Form.Group>
              <Form.Label>Rejection Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                required
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant={action === 'approved' ? 'success' : 'danger'}
            onClick={handleConfirmAction}
            disabled={processing || (action === 'rejected' && !rejectionReason.trim())}
          >
            {processing ? 'Processing...' : (action === 'approved' ? 'Approve' : 'Reject')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Layout>
  );
} 