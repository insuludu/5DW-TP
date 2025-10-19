'use client';

import React, { useState, useEffect } from "react";

const PASSWORD = "supersecret123";

export default function PasswordPopup({ show = false, onClose = () => {}, onSuccess = () => {} }) {
  const [visible, setVisible] = useState(show);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setVisible(show);
    if (show) {
      setValue("");
      setError("");
      setShake(false);
    }
  }, [show]);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === PASSWORD) {
      setError("");
      onSuccess();
      close();
    } else {
      setError("Mot de passe incorrect");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function close() {
    setVisible(false);
    onClose();
  }

  if (!visible) return null;

  return (
    <div 
      className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3`}
      style={{
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .modal-content-custom {
          animation: slideUp 0.4s ease-out;
          max-width: 450px;
          width: 100%;
        }
        .shake-effect {
          animation: shake 0.4s ease-in-out;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.95;
        }
        .glass-modal {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .lock-icon-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        .input-custom {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 16px;
          transition: all 0.3s;
        }
        .input-custom:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          outline: none;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-weight: 600;
          color: white;
          transition: all 0.2s;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          color: white;
        }
        .btn-gradient:active {
          transform: translateY(0);
        }
        .btn-cancel {
          border: 2px solid #d1d5db;
          border-radius: 12px;
          padding: 14px 24px;
          font-weight: 600;
          background: white;
          transition: all 0.2s;
        }
        .btn-cancel:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 12px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 gradient-bg"
        onClick={close}
        style={{ cursor: 'pointer' }}
      />

      {/* Modal */}
      <div className={`modal-content-custom position-relative ${shake ? 'shake-effect' : ''}`}>
        <div className="glass-modal p-4 p-md-5">
          {/* Lock Icon */}
          <div className="d-flex justify-content-center mb-4">
            <div className="lock-icon-circle">
              <svg 
                width="40" 
                height="40" 
                fill="white" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center fw-bold mb-2" style={{ fontSize: '28px', color: '#1f2937' }}>
            Accès Sécurisé
          </h3>
          <p className="text-center mb-4" style={{ color: '#6b7280', fontSize: '15px' }}>
            Veuillez entrer votre mot de passe pour continuer
          </p>

          {/* Input */}
          <div className="mb-3">
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              autoFocus
              className="form-control input-custom w-100"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="error-box mb-3">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              onClick={close}
              className="btn btn-cancel flex-fill"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-gradient flex-fill"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
