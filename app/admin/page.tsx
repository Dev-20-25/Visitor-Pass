'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, User, Phone, ClipboardList, Clock, Eye } from 'lucide-react';

interface Visitor {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  reason: string;
  signature: string;
  inTime: string;
}

export default function AdminPanel() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/admin/visitors');
      const data = await res.json();
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch visitors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="bg-decor" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '3rem 1.5rem', zIndex: 10, position: 'relative' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', animation: 'slideIn 0.6s ease-out' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Visitor Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>Monitor company visitors and digital signatures in real-time</p>
          </div>
          <button 
            onClick={fetchVisitors}
            style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s', boxShadow: '0 10px 15px -5px var(--primary-glow)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Refresh Data
          </button>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '10rem', color: 'white' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'white', borderRadius: '50%', margin: '0 auto 1.5rem' }}></div>
            Loading visitors...
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)', overflow: 'hidden', backdropFilter: 'blur(10px)', border: '1px solid white', animation: 'slideIn 0.8s ease-out' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <tr>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>In Time</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Visitor Detail</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Purpose</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', textAlign: 'right' }}>Digital Signature</th>
                </tr>
              </thead>
              <tbody style={{ color: '#334155' }}>
                {visitors.map((visitor) => (
                  <tr key={visitor._id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fcfcfc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.9rem' }}>
                        <Clock size={16} />
                        {new Date(visitor.inTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.1rem', marginBottom: '4px' }}>{visitor.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} /> {visitor.phoneNumber}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {visitor.reason}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedSignature(visitor.signature)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(225, 29, 72, 0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Eye size={18} /> View Sign
                      </button>
                    </td>
                  </tr>
                ))}
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>
                      <ClipboardList size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>No visitors found yet. Data will appear here as soon as someone signs in.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature Modal */}
        {selectedSignature && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedSignature(null)}>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', margin: 'auto', maxWidth: '450px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Verified Digital Signature</h3>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              </div>
              <div style={{ border: '2px solid #f1f5f9', borderRadius: '16px', padding: '1.5rem', backgroundColor: '#fcfcfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedSignature} alt="Signature" style={{ maxWidth: '100%', height: 'auto', filter: 'contrast(1.1)' }} />
              </div>
              <button 
                onClick={() => setSelectedSignature(null)}
                style={{ width: '100%', marginTop: '2rem', padding: '1rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                Close Record
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="footer" style={{ marginTop: 'auto', backgroundColor: 'transparent', borderTop: 'none' }}>
        <div className="footer-content" style={{ opacity: 0.6 }}>
          <span>&copy; Copyright 2026</span>
          <span className="footer-divider">|</span>
          <span>E-Merge tech</span>
          <span className="footer-divider">|</span>
          <span>Admin Dashboard</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes entrance {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
