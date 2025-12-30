import React, { useRef } from 'react';
import { X, Upload, Edit3 } from 'lucide-react';
import { COLORS } from '../constants';

// ============================================
// МОДАЛЬНОЕ ОКНО
// ============================================
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', maxHeight: '85vh', background: COLORS.bgCard, borderRadius: '24px 24px 0 0', border: `1px solid ${COLORS.border}`, borderBottom: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><X style={{ width: '20px', height: '20px', color: COLORS.textMuted }} /></button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

// ============================================
// ПРОГРЕСС-БАР
// ============================================
export const ProgressBar = ({ value, color = COLORS.gold, height = 8 }) => (
  <div style={{ width: '100%', height: `${height}px`, background: COLORS.bg, borderRadius: `${height / 2}px`, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%', background: `linear-gradient(90deg, ${color}80 0%, ${color} 100%)`, borderRadius: `${height / 2}px`, transition: 'width 0.3s ease' }} />
  </div>
);

// ============================================
// ЗАГРУЗКА ИЗОБРАЖЕНИЯ
// ============================================
export const ImageUploader = ({ value, onChange, label }) => {
  const inputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      {value ? (
        <div style={{ position: 'relative' }}>
          <img src={value} alt="Cover" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: `1px solid ${COLORS.border}` }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '8px' }}>
            <button onClick={() => inputRef.current?.click()} style={{ padding: '8px', background: `${COLORS.bg}cc`, border: `1px solid ${COLORS.border}`, borderRadius: '8px', cursor: 'pointer' }}><Edit3 style={{ width: '16px', height: '16px', color: COLORS.text }} /></button>
            <button onClick={() => onChange(null)} style={{ padding: '8px', background: `${COLORS.bg}cc`, border: `1px solid ${COLORS.border}`, borderRadius: '8px', cursor: 'pointer' }}><X style={{ width: '16px', height: '16px', color: COLORS.danger }} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} style={{ width: '100%', padding: '24px 16px', background: COLORS.bg, border: `2px dashed ${COLORS.border}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Upload style={{ width: '24px', height: '24px', color: COLORS.textMuted }} />
          <span style={{ color: COLORS.textMuted, fontSize: '14px' }}>Загрузить</span>
        </button>
      )}
    </div>
  );
};

// ============================================
// SVG РУБАШКА КАРТЫ
// ============================================
export const CardBack = ({ isPrayer = false, title = '', sphereName = '', createdAt = '' }) => {
  const mainColor = isPrayer ? COLORS.prayer : COLORS.gold;
  const lightColor = isPrayer ? COLORS.prayerLight : COLORS.goldLight;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id={`glow-${isPrayer ? 'prayer' : 'dream'}`} cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor={mainColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={mainColor} stopOpacity="0" />
          </radialGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>
        <rect width="200" height="280" fill={COLORS.bg} />
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={Math.random() * 200} cy={Math.random() * 280} r={Math.random() * 2 + 0.5} fill={mainColor} opacity={Math.random() * 0.5 + 0.1} />
        ))}
        <ellipse cx="100" cy="100" rx="80" ry="60" fill={`url(#glow-${isPrayer ? 'prayer' : 'dream'})`} />
        <g transform="translate(100, 90)">
          <circle r="45" fill="none" stroke={mainColor} strokeWidth="1" opacity="0.3" filter="url(#blur)" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * Math.PI / 180;
            const innerR = 50;
            const outerR = 65 + Math.random() * 15;
            return <line key={i} x1={Math.cos(angle) * innerR} y1={Math.sin(angle) * innerR} x2={Math.cos(angle) * outerR} y2={Math.sin(angle) * outerR} stroke={mainColor} strokeWidth={0.5 + Math.random()} opacity={0.4 + Math.random() * 0.4} />;
          })}
          <path d="M -30 -20 A 40 40 0 1 1 -30 50 A 30 30 0 1 0 -30 -20" fill={mainColor} opacity="0.9" />
          <path d="M -28 -15 A 35 35 0 1 1 -28 45 A 27 27 0 1 0 -28 -15" fill={lightColor} opacity="0.3" />
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 30;
            return <circle key={`splash-${i}`} cx={Math.cos(angle) * dist} cy={Math.sin(angle) * dist} r={1 + Math.random() * 2} fill={mainColor} opacity={0.3 + Math.random() * 0.5} />;
          })}
        </g>
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 60 + i * 12;
          const height = 40 + Math.random() * 80;
          return <line key={`drip-${i}`} x1={x} y1={160} x2={x} y2={160 + height} stroke={mainColor} strokeWidth={0.5} opacity={0.2 + Math.random() * 0.3} />;
        })}
        <rect x="8" y="8" width="184" height="264" fill="none" stroke={mainColor} strokeWidth="0.5" opacity="0.3" rx="8" />
      </svg>
      <div style={{ position: 'absolute', bottom: '35px', left: '12px', right: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: mainColor, marginBottom: '4px', fontFamily: 'Georgia, serif', textShadow: `0 0 10px ${mainColor}60`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        {sphereName && <p style={{ fontSize: '10px', color: isPrayer ? COLORS.prayerLight : COLORS.goldDark, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>{sphereName}</p>}
      </div>
      <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: isPrayer ? COLORS.prayerLight : COLORS.gold, opacity: 0.9 }}>{formatDate(createdAt)}</div>
    </div>
  );
};

// ============================================
// ИКОНКА ВСЕВИДЯЩЕГО ОКА
// ============================================
export const AllSeeingEye = ({ size = 24, color = COLORS.gold, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke={color} strokeWidth="1.5" fill={filled ? `${color}20` : 'none'} />
    <circle cx="12" cy="12.5" r="3.5" stroke={color} strokeWidth="1.5" fill={filled ? color : 'none'} />
    <path d="M12 2V4M8 3L9 4.5M16 3L15 4.5" stroke={color} strokeWidth="1" opacity="0.6" />
  </svg>
);
