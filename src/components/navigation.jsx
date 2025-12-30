import React, { useState, useEffect } from 'react';
import { Moon, Target, Flag, CheckSquare, Clock, Wallet, Lock, Delete } from 'lucide-react';
import { COLORS } from '../constants';

// ============================================
// PIN-ЭКРАН
// ============================================
export const PinScreen = ({ mode, onSuccess, onSetPin, storedPin }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(mode === 'create' ? 'enter' : 'verify');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  useEffect(() => {
    if (locked && lockTime > 0) {
      const timer = setTimeout(() => setLockTime(lockTime - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (locked && lockTime === 0) { setLocked(false); setAttempts(0); }
  }, [locked, lockTime]);

  const handleDigit = (digit) => {
    if (locked) return;
    setError('');
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (mode === 'create' && step === 'enter') {
            setConfirmPin(newPin); setPin(''); setStep('confirm');
          } else if (mode === 'create' && step === 'confirm') {
            if (newPin === confirmPin) onSetPin(newPin);
            else { setError('PIN-коды не совпадают'); setPin(''); setConfirmPin(''); setStep('enter'); }
          } else {
            if (newPin === storedPin) onSuccess();
            else {
              const newAttempts = attempts + 1;
              setAttempts(newAttempts); setPin('');
              if (newAttempts >= 5) { setLocked(true); setLockTime(30); setError('Слишком много попыток'); }
              else setError('Неверный PIN-код');
            }
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => { if (pin.length > 0) setPin(pin.slice(0, -1)); };
  const getTitle = () => {
    if (locked) return 'Заблокировано';
    if (mode === 'create') return step === 'enter' ? 'Создайте PIN-код' : 'Повторите PIN-код';
    return 'Введите PIN-код';
  };

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at top, #1a1510 0%, ${COLORS.bg} 50%, #05030a 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(40px)' }} />
      <div style={{ marginBottom: '40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '80px', height: '80px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 50%, ${COLORS.goldLight} 100%)`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 10px 40px ${COLORS.gold}40` }}>
          <Lock style={{ width: '36px', height: '36px', color: COLORS.bg }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: COLORS.text, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{getTitle()}</h1>
        {locked && <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Подождите {lockTime} сек.</p>}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', background: i < pin.length ? COLORS.gold : 'transparent', border: `2px solid ${i < pin.length ? COLORS.gold : COLORS.textDark}`, transition: 'all 0.2s ease', boxShadow: i < pin.length ? `0 0 15px ${COLORS.gold}60` : 'none' }} />
        ))}
      </div>
      {error && <p style={{ color: COLORS.danger, marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((digit, i) => (
          <button key={i} onClick={() => { if (digit === 'del') handleDelete(); else if (digit !== null) handleDigit(String(digit)); }} disabled={locked || digit === null} style={{ width: '80px', height: '80px', borderRadius: '20px', border: 'none', fontSize: '28px', fontWeight: '500', fontFamily: 'Georgia, serif', cursor: digit === null ? 'default' : locked ? 'not-allowed' : 'pointer', background: digit === null ? 'transparent' : digit === 'del' ? COLORS.bgCard : `linear-gradient(145deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`, color: digit === 'del' ? COLORS.textMuted : COLORS.text, opacity: locked ? 0.5 : 1, border: digit === null ? 'none' : `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {digit === 'del' ? <Delete style={{ width: '24px', height: '24px' }} /> : digit}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// НИЖНЯЯ НАВИГАЦИЯ
// ============================================
export const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dream', icon: Moon, label: 'Мечты' },
    { id: 'strategy', icon: Target, label: 'Цели' },
    { id: 'tactics', icon: Flag, label: 'Тактика' },
    { id: 'action', icon: CheckSquare, label: 'День' },
    { id: 'productivity', icon: Clock, label: 'Время' },
    { id: 'finance', icon: Wallet, label: 'Финансы' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: `linear-gradient(to top, ${COLORS.bg} 0%, ${COLORS.bg}f0 100%)`, borderTop: `1px solid ${COLORS.border}`, padding: '8px 4px 20px', backdropFilter: 'blur(20px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icon style={{ width: '22px', height: '22px', color: isActive ? COLORS.gold : COLORS.textDark, strokeWidth: isActive ? 2.5 : 1.5, filter: isActive ? `drop-shadow(0 0 8px ${COLORS.gold}60)` : 'none' }} />
              <span style={{ fontSize: '10px', marginTop: '4px', color: isActive ? COLORS.gold : COLORS.textDark, fontWeight: isActive ? '600' : '400' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
