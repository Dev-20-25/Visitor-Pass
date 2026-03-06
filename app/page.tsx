'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CheckCircle2, Loader2, Eraser, ChevronRight } from 'lucide-react';

type Step = 'welcome' | 'form' | 'success';

export default function VisitorApp() {
  const sigPad = useRef<SignatureCanvas>(null);
  const [step, setStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    reason: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.reason.trim()) errors.reason = 'Reason for visit is required';
    
    if (sigPad.current?.isEmpty()) {
      errors.signature = 'Signature is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearSignature = () => {
    sigPad.current?.clear();
    setValidationErrors({ ...validationErrors, signature: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const signatureData = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');
      
      const response = await fetch('/api/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          signature: signatureData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="welcome-screen">
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="E-Merge tech Logo" 
          className="logo-image"
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
        />
      </div>
      <h2 className="welcome-title">Welcome to E-merge tech</h2>
      <button className="btn-start" onClick={() => setStep('form')}>
        Get Started <ChevronRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle', display: 'inline' }} />
      </button>
    </div>
  );

  const renderForm = () => (
    <div className="card">
      <header className="header">
        <h1>Visitor Pass</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please provide your details for entry</p>
      </header>

      {error && (
        <div style={{ color: 'var(--error)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.85rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            id="name"
            type="text"
            className={validationErrors.name ? 'error' : ''}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
            }}
          />
          {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            id="phone"
            type="tel"
            className={validationErrors.phoneNumber ? 'error' : ''}
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
              if (validationErrors.phoneNumber) setValidationErrors({ ...validationErrors, phoneNumber: '' });
            }}
          />
          {validationErrors.phoneNumber && <span className="error-text">{validationErrors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Optional)</span></label>
          <input
            id="email"
            type="email"
            className={validationErrors.email ? 'error' : ''}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
            }}
          />
          {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Visit <span style={{ color: 'var(--error)' }}>*</span></label>
          <textarea
            id="reason"
            className={validationErrors.reason ? 'error' : ''}
            rows={3}
            value={formData.reason}
            onChange={(e) => {
              setFormData({ ...formData, reason: e.target.value });
              if (validationErrors.reason) setValidationErrors({ ...validationErrors, reason: '' });
            }}
          ></textarea>
          {validationErrors.reason && <span className="error-text">{validationErrors.reason}</span>}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Digital Signature <span style={{ color: 'var(--error)' }}>*</span></label>
            <button type="button" className="btn-clear" onClick={clearSignature}>
              <Eraser size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Clear
            </button>
          </div>
          <div className={`signature-container ${validationErrors.signature ? 'error' : ''}`}>
            <SignatureCanvas
              ref={sigPad}
              penColor="#000"
              canvasProps={{ className: 'signature-pad' }}
              onEnd={() => {
                if (validationErrors.signature) setValidationErrors({ ...validationErrors, signature: '' });
              }}
            />
          </div>
          {validationErrors.signature && <span className="error-text">{validationErrors.signature}</span>}
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <><Loader2 size={18} className="animate-spin" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} /> Processing...</>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="card success-message">
      <div className="success-icon">
        <CheckCircle2 size={40} />
      </div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Form Submitted Successfully!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Thank you for visiting <strong>E-Merge tech</strong>. Your details have been recorded.
      </p>
      <button className="btn-start" onClick={() => window.location.reload()}>
        Close
      </button>
    </div>
  );

  return (
    <div className="main-wrapper">
      <div className="bg-decor" />
      <main className="container">
        {step === 'welcome' && renderWelcome()}
        {step === 'form' && renderForm()}
        {step === 'success' && renderSuccess()}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span>&copy; Copyright 2026</span>
          <span className="footer-divider">|</span>
          <span>E-Merge tech</span>
          <span className="footer-divider">|</span>
          <span>All Rights Reserved</span>
          <span className="footer-divider">|</span>
          <span>Privacy Policy</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
