import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, User } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../data/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (
        adminId.trim() === ADMIN_CREDENTIALS.adminId &&
        password === ADMIN_CREDENTIALS.password
      ) {
        setLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setLoading(false);
        setError('Invalid Admin ID or Password. Please verify your credentials.');
      }
    }, 400);
  };

  const handlePrefill = () => {
    setAdminId('admin@123');
    setPassword('admin@123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-[28px] p-6 sm:p-8 shadow-2xl border border-neutral-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-neutral-950" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-neutral-900 mb-1">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-500">
            NATURELYNK SECURITY
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1 mb-1">
          Admin Portal Login
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Authorized personnel access to manage live products and upload verified trust documents.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              Admin ID
            </label>
            <input
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="e.g. admin@123"
              className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-neutral-950"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-neutral-950"
            />
          </div>

          {/* Quick Credential Helper badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="text-[11px] text-neutral-600">
              <span className="font-semibold block text-neutral-800">Demo Credentials:</span>
              <span className="font-mono text-[10px] text-neutral-500">ID: admin@123 | Pass: admin@123</span>
            </div>
            <button
              type="button"
              onClick={handlePrefill}
              className="text-[11px] font-semibold text-neutral-900 hover:text-black bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Fill In
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-semibold py-3 rounded-full text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enter Admin Console</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
