"use client";

import { useState } from 'react';
import { Plus, X, Wrench, Settings, DollarSign } from 'lucide-react';
import { proposeVariation } from '@/app/actions/dispute_arbiter';

export default function VariationForm({ bookingId }: { bookingId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    isPart: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = new FormData();
      submissionData.append('bookingId', bookingId);
      submissionData.append('description', formData.description);
      submissionData.append('amount', formData.amount);
      submissionData.append('photoUrl', 'https://images.unsplash.com/photo-1590424744295-81432f7902ba?auto=format&fit=crop&q=80&w=800'); // Placeholder for now

      await proposeVariation(submissionData);
      setIsOpen(false);
      setFormData({ description: '', amount: '', isPart: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
        <Plus size={18} /> Add
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-primary)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Add Extra Item</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Item Type</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isPart: true })}
                className={formData.isPart ? "btn btn-primary" : "btn btn-secondary"}
                style={{ flex: 1, gap: '0.5rem' }}
              >
                <Settings size={18} /> Physical Part
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isPart: false })}
                className={!formData.isPart ? "btn btn-primary" : "btn btn-secondary"}
                style={{ flex: 1, gap: '0.5rem' }}
              >
                <Wrench size={18} /> Labor Hour
              </button>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {formData.isPart ? "* Parts carry 0% platform commission." : "* Additional labor hours carry standard commission."}
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
            <input 
              className="input-field"
              required
              placeholder="e.g. Front Brake Discs (Pair)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Amount (£)</label>
            <input 
              type="number"
              className="input-field"
              required
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? "Adding..." : "Add to Invoice"}
          </button>
        </form>
      </div>
    </div>
  );
}
