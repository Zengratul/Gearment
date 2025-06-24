'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import { leaveRequestAPI, CreateLeaveRequestDto } from '../../../services/api';

export default function NewLeaveRequestPage() {
  const router = useRouter();

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateLeaveRequestDto>({
    leaveType: 'annual',
    startDate: tomorrow,
    endDate: tomorrow,
    numberOfDays: 1,
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfDays' ? parseInt(value) || 1 : value,
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate + 'T00:00:00');
      const end = new Date(formData.endDate + 'T00:00:00');
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, numberOfDays: diffDays }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate dates before submission
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate + 'T00:00:00');
      const end = new Date(formData.endDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start > end) {
        setError('Start date must be before or equal to end date');
        setLoading(false);
        return;
      }

      if (start < today) {
        setError('Start date cannot be in the past');
        setLoading(false);
        return;
      }
    }

    try {
      // Ensure dates are in proper ISO format
      const submitData = {
        ...formData,
        startDate: formData.startDate + 'T00:00:00.000Z',
        endDate: formData.endDate + 'T00:00:00.000Z',
      };
      
      console.log('Submitting data:', submitData);
      console.log('Current date:', new Date().toISOString());
      console.log('Start date:', new Date(submitData.startDate).toISOString());
      console.log('End date:', new Date(submitData.endDate).toISOString());
      
      await leaveRequestAPI.create(submitData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/leave-requests');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to create leave request. Please try again.';
      setError(errorMessage);
      console.error('Leave request creation error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <div className="mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => router.back()}
            className="mb-3"
          >
            ← Back
          </Button>
          <h1 className="h3 mb-0">New Leave Request</h1>
          <p className="text-muted">Submit a new leave request</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Request Details</h5>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <Alert variant="success">
                    ✅ Leave request submitted successfully! Redirecting to requests page...
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Select
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleInputChange}
                          required
                          disabled={success}
                        >
                          <option value="annual">🏖️ Annual Leave</option>
                          <option value="sick">🏥 Sick Leave</option>
                          <option value="personal">👤 Personal Leave</option>
                          <option value="maternity">🤱 Maternity Leave</option>
                          <option value="paternity">👨‍👶 Paternity Leave</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Days</Form.Label>
                        <Form.Control
                          type="number"
                          name="numberOfDays"
                          value={formData.numberOfDays}
                          onChange={handleInputChange}
                          min="1"
                          max="365"
                          required
                          disabled={success}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          onBlur={calculateDays}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          disabled={success}
                        />
                        <Form.Text className="text-muted">
                          Select a future date for your leave to begin.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          onBlur={calculateDays}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          required
                          disabled={success}
                        />
                        <Form.Text className="text-muted">
                          Select a date after the start date.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Reason for Leave</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Please provide a detailed reason for your leave request..."
                      required
                      disabled={success}
                    />
                    <Form.Text className="text-muted">
                      Be specific about why you need this leave and any relevant details.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2 justify-content-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => router.back()}
                      disabled={loading || success}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading || success}
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
} 