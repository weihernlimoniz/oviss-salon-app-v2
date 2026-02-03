
import React, { useState, useEffect } from 'react';
import { AuthMode } from '../types';
import { SHOP_NAME } from '../constants';

interface LoginScreenProps {
  onLogin: (identifier: string, mode: AuthMode) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isTacSent, setIsTacSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendTac = () => {
    if (!identifier) return;
    setIsTacSent(true);
    setCountdown(30);
    // Mock TAC send
    console.log(`Sending TAC to ${identifier} via ${mode}`);
    alert(`Your 6-digit TAC code is: 123456 (Mock)`);
  };

  const handleVerify = () => {
    if (otp === '123456') {
      onLogin(identifier, mode);
    } else {
      alert('Invalid TAC code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-zinc-100">
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-md">
          <span className="text-3xl font-bold text-amber-500">O</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{SHOP_NAME}</h1>
        <p className="text-zinc-500 text-sm">Elevate your hair game.</p>
      </div>

      <div className="w-full space-y-4">
        <div className="flex bg-zinc-200 rounded-xl p-1 mb-4">
          <button 
            onClick={() => { setMode('phone'); setIsTacSent(false); setOtp(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'phone' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
          >
            Phone
          </button>
          <button 
            onClick={() => { setMode('email'); setIsTacSent(false); setOtp(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'email' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
          >
            Email
          </button>
        </div>

        {!isTacSent ? (
          <div className="space-y-4">
            <input 
              type={mode === 'phone' ? 'tel' : 'email'} 
              placeholder={mode === 'phone' ? 'Phone Number (e.g. 0123456789)' : 'Email Address'}
              className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <button 
              onClick={handleSendTac}
              disabled={!identifier}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/10 transition-all"
            >
              Send TAC
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-sm text-zinc-600 mb-2">
              Enter the 6-digit code sent to <br/>
              <span className="text-zinc-900 font-medium">{identifier}</span>
            </div>
            <input 
              type="text" 
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              className="w-full bg-white border border-zinc-200 rounded-xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <button 
              onClick={handleVerify}
              disabled={otp.length !== 6}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/10 transition-all"
            >
              Verify
            </button>
            <button 
              onClick={handleSendTac}
              disabled={countdown > 0}
              className="w-full text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-2"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-8 text-xs text-zinc-400">
        By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </div>
    </div>
  );
};

export default LoginScreen;