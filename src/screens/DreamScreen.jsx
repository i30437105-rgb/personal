import React, { useState } from 'react';
import { Star, Moon, Sparkles, Plus, Settings, Trophy, ZoomIn, X, Edit3, Check, ChevronRight, Calendar, Archive, Trash2 } from 'lucide-react';
import { COLORS, SPHERE_ICONS_LIST } from '../constants';
import { getSphereIcon, sortDreams } from '../utils';
import { Modal, CardBack, AllSeeingEye, ImageUploader } from '../components/ui';

// ============================================
// УПРАВЛЕНИЕ СФЕРАМИ
// ============================================
const SphereManager = ({ spheres, dreams, onSave, onClose }) => {
  const [editingSphere, setEditingSphere] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIconId, setEditIconId] = useState('star');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  const hasDream = (sphereId) => dreams.some(d => d.sphereId === sphereId && d.status === 'active');

  const handleEdit = (sphere) => {
    setEditingSphere(sphere);
    setEditName(sphere.name);
    setEditIconId(sphere.iconId || 'star');
    setShowIconPicker(false);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    const updated = spheres.map(s => s.id === editingSphere.id ? { ...s, name: editName.trim(), iconId: editIconId } : s);
    onSave(updated);
    setEditingSphere(null);
  };

  const handleDelete = (sphereId) => {
    if (hasDream(sphereId)) return;
    const updated = spheres.filter(s => s.id !== sphereId);
    onSave(updated);
  };

  const handleAddNew = () => {
    if (!editName.trim()) return;
    const newSphere = { id: `sphere_${Date.now()}`, name: editName.trim(), iconId: editIconId, isDefault: false, sortOrder: spheres.length + 1 };
    onSave([...spheres, newSphere]);
    setShowAddNew(false); setEditName(''); setEditIconId('star');
  };

  const inputStyle = { width: '100%', padding: '12px 14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.text, fontSize: '15px', outline: 'none' };

  if (editingSphere || showAddNew) {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Иконка</label>
          <button onClick={() => setShowIconPicker(!showIconPicker)} style={{ width: '56px', height: '56px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.createElement(getSphereIcon(editIconId), { style: { width: '24px', height: '24px', color: COLORS.gold } })}
          </button>
          {showIconPicker && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: COLORS.bg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
              {SPHERE_ICONS_LIST.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => { setEditIconId(item.id); setShowIconPicker(false); }} style={{ width: '44px', height: '44px', background: editIconId === item.id ? `${COLORS.gold}20` : 'transparent', border: `1px solid ${editIconId === item.id ? COLORS.gold : 'transparent'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: '20px', height: '20px', color: editIconId === item.id ? COLORS.gold : COLORS.textMuted }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Название</label>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Название сферы" style={inputStyle} autoFocus />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setEditingSphere(null); setShowAddNew(false); setEditName(''); }} style={{ flex: 1, padding: '14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
          <button onClick={editingSphere ? handleSaveEdit : handleAddNew} disabled={!editName.trim()} style={{ flex: 1, padding: '14px', background: editName.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: editName.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: editName.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {spheres.map((sphere) => {
        const Icon = getSphereIcon(sphere.iconId);
        const hasActiveDream = hasDream(sphere.id);
        return (
          <div key={sphere.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: COLORS.bg, borderRadius: '12px', marginBottom: '8px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon style={{ width: '20px', height: '20px', color: COLORS.gold }} />
              <span style={{ color: COLORS.text, fontSize: '15px' }}>{sphere.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(sphere)} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit3 style={{ width: '16px', height: '16px', color: COLORS.textMuted }} /></button>
              <button onClick={() => handleDelete(sphere.id)} disabled={hasActiveDream} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: hasActiveDream ? 'not-allowed' : 'pointer', opacity: hasActiveDream ? 0.3 : 1 }}><Trash2 style={{ width: '16px', height: '16px', color: hasActiveDream ? COLORS.textDark : COLORS.danger }} /></button>
            </div>
          </div>
        );
      })}
      <button onClick={() => { setShowAddNew(true); setEditName(''); setEditIconId('star'); }} style={{ width: '100%', padding: '14px', background: COLORS.bg, border: `2px dashed ${COLORS.border}`, borderRadius: '12px', color: COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}><Plus style={{ width: '18px', height: '18px' }} />Добавить сферу</button>
    </div>
  );
};

// ============================================
// КАРТОЧКА МЕЧТЫ
// ============================================
const DreamCard = ({ dream, sphere, onClick, onFlip, isFlipped, isFocused, isLeading }) => {
  const isPrayer = dream.type === 'prayer';
  return (
    <div onClick={() => onFlip(dream.id)} style={{ perspective: '1000px', cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '140%', transformStyle: 'preserve-3d', transition: 'transform 0.6s ease', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', border: `1px solid ${isLeading ? COLORS.gold : isFocused ? COLORS.gold + '60' : COLORS.border}`, boxShadow: isLeading ? `0 8px 32px ${COLORS.gold}30` : `0 4px 20px rgba(0,0,0,0.4)` }}>
          <CardBack isPrayer={isPrayer} title={dream.title} sphereName={sphere?.name || (isPrayer ? 'Аффирмация' : '')} createdAt={dream.createdAt} />
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: dream.coverImage ? `url(${dream.coverImage}) center/cover` : `linear-gradient(135deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`, border: `1px solid ${COLORS.border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)' }} />
          <button onClick={(e) => { e.stopPropagation(); onClick(dream); }} style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', background: `${COLORS.bg}cc`, border: `1px solid ${COLORS.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
            <ZoomIn style={{ width: '18px', height: '18px', color: COLORS.gold }} />
          </button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px', zIndex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '8px', fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{dream.title}</h3>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dream.description || dream.prayerText || ''}</p>
          </div>
        </div>
      </div>
      {isFocused && !isFlipped && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', zIndex: 20, pointerEvents: 'none' }}>
          <AllSeeingEye size={20} color={COLORS.gold} filled={true} />
          {isLeading && <Star style={{ width: '18px', height: '18px', color: COLORS.gold, fill: COLORS.gold, filter: `drop-shadow(0 0 4px ${COLORS.gold})` }} />}
        </div>
      )}
    </div>
  );
};

// ============================================
// ФОРМА СОЗДАНИЯ МЕЧТЫ
// ============================================
const DreamForm = ({ spheres, onSave, onClose, existingDream }) => {
  const [type, setType] = useState(existingDream?.type || 'dream');
  const [title, setTitle] = useState(existingDream?.title || '');
  const [description, setDescription] = useState(existingDream?.description || '');
  const [sphereId, setSphereId] = useState(existingDream?.sphereId || spheres[0]?.id);
  const [periodType, setPeriodType] = useState(existingDream?.periodType || 'years');
  const [periodYears, setPeriodYears] = useState(existingDream?.periodYears || 3);
  const [periodDate, setPeriodDate] = useState(existingDream?.periodDate || '');
  const [prayerText, setPrayerText] = useState(existingDream?.prayerText || '');
  const [coverImage, setCoverImage] = useState(existingDream?.coverImage || null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState({ excites: false, clear: false, values: false });

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (type === 'dream' && !existingDream) { setShowChecklist(true); return; }
    saveDream();
  };

  const saveDream = () => {
    onSave({
      id: existingDream?.id || `dream_${Date.now()}`,
      type, title,
      description: type === 'dream' ? description : '',
      sphereId: type === 'dream' ? sphereId : null,
      periodType: type === 'dream' ? periodType : null,
      periodYears: periodType === 'years' ? periodYears : null,
      periodDate: periodType === 'date' ? periodDate : null,
      prayerText: type === 'prayer' ? prayerText : null,
      coverImage,
      isFocused: existingDream?.isFocused || false,
      isLeading: existingDream?.isLeading || false,
      status: 'active',
      createdAt: existingDream?.createdAt || new Date().toISOString(),
      sortOrder: existingDream?.sortOrder,
    });
  };

  // Чек-лист с названием и описанием
  if (showChecklist) {
    const allChecked = checklist.excites && checklist.clear && checklist.values;
    return (
      <div>
        <div style={{ padding: '16px', background: `${COLORS.gold}10`, borderRadius: '12px', marginBottom: '20px', border: `1px solid ${COLORS.gold}30` }}>
          <p style={{ fontSize: '12px', color: COLORS.goldDark, marginBottom: '8px' }}>Проверяем мечту:</p>
          <p style={{ fontSize: '18px', color: COLORS.gold, fontWeight: '600', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>{title}</p>
          {description && <p style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.5' }}>{description}</p>}
        </div>
        <p style={{ color: COLORS.textMuted, marginBottom: '20px', fontSize: '14px' }}>Убедитесь, что ваша мечта соответствует критериям:</p>
        {[{ key: 'excites', label: 'Зажигает и возбуждает?' }, { key: 'clear', label: 'Возникает ясный образ?' }, { key: 'values', label: 'Соответствует ценностям?' }].map((item) => (
          <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: checklist[item.key] ? `${COLORS.gold}10` : COLORS.bg, borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', border: `1px solid ${checklist[item.key] ? COLORS.gold : COLORS.border}` }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${checklist[item.key] ? COLORS.gold : COLORS.textDark}`, background: checklist[item.key] ? COLORS.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {checklist[item.key] && <Check style={{ width: '14px', height: '14px', color: COLORS.bg }} />}
            </div>
            <input type="checkbox" checked={checklist[item.key]} onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })} style={{ display: 'none' }} />
            <span style={{ color: COLORS.text, fontSize: '15px' }}>{item.label}</span>
          </label>
        ))}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => setShowChecklist(false)} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Назад</button>
          <button onClick={saveDream} disabled={!allChecked} style={{ flex: 1, padding: '16px', background: allChecked ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: allChecked ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: allChecked ? 'pointer' : 'not-allowed' }}>Создать</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Тип</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[{ id: 'dream', label: 'Мечта', icon: Moon }, { id: 'prayer', label: 'Аффирмация', icon: Sparkles }].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setType(t.id)} style={{ flex: 1, padding: '14px', background: type === t.id ? (t.id === 'prayer' ? `${COLORS.prayer}20` : `${COLORS.gold}15`) : COLORS.bg, border: `1px solid ${type === t.id ? (t.id === 'prayer' ? COLORS.prayer : COLORS.gold) : COLORS.border}`, borderRadius: '12px', color: type === t.id ? (t.id === 'prayer' ? COLORS.prayerLight : COLORS.gold) : COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Icon style={{ width: '18px', height: '18px' }} />{t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === 'dream' ? 'Финансовая свобода' : 'Благодарность миру'} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>{type === 'prayer' ? 'Текст аффирмации' : 'Описание'}</label>
        <textarea value={type === 'prayer' ? prayerText : description} onChange={(e) => type === 'prayer' ? setPrayerText(e.target.value) : setDescription(e.target.value)} placeholder={type === 'dream' ? 'Опишите вашу мечту...' : 'Текст аффирмации...'} rows={3} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <ImageUploader value={coverImage} onChange={setCoverImage} label="Обложка" />
      </div>
      {type === 'dream' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Сфера жизни</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {spheres.map((s) => {
                const Icon = getSphereIcon(s.iconId);
                return (
                  <button key={s.id} onClick={() => setSphereId(s.id)} style={{ padding: '10px 14px', background: sphereId === s.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${sphereId === s.id ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: sphereId === s.id ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon style={{ width: '14px', height: '14px' }} />{s.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Срок достижения</label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {[{ id: 'years', label: 'Через N лет' }, { id: 'date', label: 'К дате' }].map((p) => (
                <button key={p.id} onClick={() => setPeriodType(p.id)} style={{ flex: 1, padding: '12px', background: periodType === p.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${periodType === p.id ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: periodType === p.id ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>{p.label}</button>
              ))}
            </div>
            {periodType === 'years' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="range" min="1" max="15" value={periodYears} onChange={(e) => setPeriodYears(Number(e.target.value))} style={{ flex: 1, accentColor: COLORS.gold }} />
                <span style={{ color: COLORS.gold, fontWeight: '600', minWidth: '70px' }}>{periodYears} {periodYears === 1 ? 'год' : periodYears < 5 ? 'года' : 'лет'}</span>
              </div>
            ) : (
              <input type="date" value={periodDate} onChange={(e) => setPeriodDate(e.target.value)} style={inputStyle} />
            )}
          </div>
        </>
      )}
      <button onClick={handleSubmit} disabled={!title.trim()} style={{ width: '100%', padding: '16px', background: title.trim() ? `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)` : COLORS.bgCard, border: 'none', borderRadius: '12px', color: title.trim() ? COLORS.bg : COLORS.textDark, fontSize: '16px', fontWeight: '600', cursor: title.trim() ? 'pointer' : 'not-allowed', marginTop: '12px' }}>
        {existingDream ? 'Сохранить' : type === 'dream' ? 'Далее' : 'Создать'}
      </button>
    </div>
  );
};

// ============================================
// ДЕТАЛЬНЫЙ ПРОСМОТР МЕЧТЫ
// ============================================
const DreamDetail = ({ dream, sphere, onClose, onEdit, onToggleFocus, onSetLeading, onArchive, onAchieve, isFocused, isLeading }) => {
  const isPrayer = dream.type === 'prayer';
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '140%', borderRadius: '20px', overflow: 'hidden', background: dream.coverImage ? `url(${dream.coverImage}) center/cover` : `linear-gradient(135deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`, border: `2px solid ${isLeading ? COLORS.gold : COLORS.border}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 100%)' }} />
          {isFocused && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
              <AllSeeingEye size={24} color={COLORS.gold} filled={true} />
              {isLeading && <Star style={{ width: '22px', height: '22px', color: COLORS.gold, fill: COLORS.gold, filter: `drop-shadow(0 0 6px ${COLORS.gold})` }} />}
            </div>
          )}
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '40px', height: '40px', background: `${COLORS.bg}cc`, border: `1px solid ${COLORS.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
            <X style={{ width: '20px', height: '20px', color: COLORS.text }} />
          </button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px', zIndex: 1 }}>
            {sphere && <p style={{ fontSize: '11px', color: COLORS.goldDark, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{sphere.name}</p>}
            {isPrayer && <p style={{ fontSize: '11px', color: COLORS.prayerLight, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Аффирмация</p>}
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: COLORS.text, marginBottom: '12px', fontFamily: 'Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{dream.title}</h2>
            <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: '1.6', marginBottom: '16px' }}>{dream.description || dream.prayerText || 'Без описания'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar style={{ width: '14px', height: '14px', color: COLORS.textDark }} />
                <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{formatDate(dream.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={onEdit} style={{ padding: '14px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Edit3 style={{ width: '18px', height: '18px' }} />Редактировать</button>
          {dream.type === 'dream' && (
            <>
              <button onClick={onToggleFocus} style={{ padding: '14px', background: isFocused ? `${COLORS.gold}15` : COLORS.bgCard, border: `1px solid ${isFocused ? COLORS.gold : COLORS.border}`, borderRadius: '12px', color: isFocused ? COLORS.gold : COLORS.text, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><AllSeeingEye size={18} color={isFocused ? COLORS.gold : COLORS.text} />{isFocused ? 'Убрать из фокуса' : 'В фокус'}</button>
              {isFocused && !isLeading && (
                <button onClick={onSetLeading} style={{ padding: '14px', background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}`, borderRadius: '12px', color: COLORS.gold, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Star style={{ width: '18px', height: '18px', fill: COLORS.gold }} />Сделать ведущей</button>
              )}
              <button onClick={onAchieve} style={{ padding: '14px', background: `${COLORS.success}15`, border: `1px solid ${COLORS.success}`, borderRadius: '12px', color: COLORS.success, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Trophy style={{ width: '18px', height: '18px' }} />Мечта достигнута!</button>
            </>
          )}
          <button onClick={onArchive} style={{ padding: '14px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.textMuted, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Archive style={{ width: '18px', height: '18px' }} />В архив</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ЭКРАН МЕЧТЫ
// ============================================
export const DreamScreen = ({ data, saveData }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [editingDream, setEditingDream] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [showFocusSelect, setShowFocusSelect] = useState(false);
  const [pendingFocusDream, setPendingFocusDream] = useState(null);
  const [showSphereManager, setShowSphereManager] = useState(false);

  const activeDreams = data.dreams.filter(d => d.status === 'active');
  const sortedDreams = sortDreams(activeDreams);
  const focusedDreams = activeDreams.filter(d => d.isFocused);

  const handleFlip = (dreamId) => setFlippedCards(prev => ({ ...prev, [dreamId]: !prev[dreamId] }));

  const handleSaveDream = (dream) => {
    const existingIndex = data.dreams.findIndex(d => d.id === dream.id);
    let newDreams;
    if (existingIndex >= 0) { newDreams = [...data.dreams]; newDreams[existingIndex] = dream; }
    else { dream.sortOrder = Math.max(0, ...data.dreams.map(d => d.sortOrder || 0)) + 1; newDreams = [...data.dreams, dream]; }
    saveData({ ...data, dreams: newDreams });
    setShowForm(false); setEditingDream(null);
  };

  const handleSaveSpheres = (spheres) => saveData({ ...data, spheres });

  const handleToggleFocus = (dream) => {
    if (dream.isFocused) {
      saveData({ ...data, dreams: data.dreams.map(d => d.id === dream.id ? { ...d, isFocused: false, isLeading: false } : d) });
    } else {
      if (focusedDreams.length >= 3) { setPendingFocusDream(dream); setShowFocusSelect(true); }
      else saveData({ ...data, dreams: data.dreams.map(d => d.id === dream.id ? { ...d, isFocused: true, isLeading: focusedDreams.length === 0 } : d) });
    }
    setSelectedDream(null);
  };

  const handleSetLeading = (dream) => { saveData({ ...data, dreams: data.dreams.map(d => ({ ...d, isLeading: d.id === dream.id })) }); setSelectedDream(null); };
  const handleReplaceFocus = (oldDream) => { saveData({ ...data, dreams: data.dreams.map(d => { if (d.id === oldDream.id) return { ...d, isFocused: false, isLeading: false }; if (d.id === pendingFocusDream.id) return { ...d, isFocused: true, isLeading: oldDream.isLeading }; return d; })}); setShowFocusSelect(false); setPendingFocusDream(null); };
  const handleArchive = (dream) => { saveData({ ...data, dreams: data.dreams.map(d => d.id === dream.id ? { ...d, status: 'archived', isFocused: false, isLeading: false } : d) }); setSelectedDream(null); };
  const handleAchieve = (dream) => { saveData({ ...data, dreams: data.dreams.map(d => d.id === dream.id ? { ...d, status: 'achieved', achievedAt: new Date().toISOString(), isFocused: false, isLeading: false } : d) }); setSelectedDream(null); };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>Мои Мечты</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowSphereManager(true)} style={{ width: '40px', height: '40px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Settings style={{ width: '18px', height: '18px', color: COLORS.textMuted }} />
            </button>
            <button style={{ width: '40px', height: '40px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trophy style={{ width: '18px', height: '18px', color: COLORS.gold }} />
            </button>
          </div>
        </div>
        {focusedDreams.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><AllSeeingEye size={14} color={COLORS.textMuted} />В фокусе</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {focusedDreams.map((d) => (
                <div key={d.id} style={{ padding: '8px 14px', background: d.isLeading ? `${COLORS.gold}20` : COLORS.bgCard, border: `1px solid ${d.isLeading ? COLORS.gold : COLORS.border}`, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {d.isLeading && <Star style={{ width: '12px', height: '12px', color: COLORS.gold, fill: COLORS.gold }} />}
                  <span style={{ fontSize: '12px', color: d.isLeading ? COLORS.gold : COLORS.text }}>{d.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {sortedDreams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Moon style={{ width: '40px', height: '40px', color: COLORS.gold, opacity: 0.5 }} /></div>
            <h3 style={{ color: COLORS.text, fontSize: '18px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Колода пуста</h3>
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Добавьте свою первую мечту</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {sortedDreams.map((dream) => (
              <DreamCard key={dream.id} dream={dream} sphere={data.spheres.find(s => s.id === dream.sphereId)} isFocused={dream.isFocused} isLeading={dream.isLeading} isFlipped={flippedCards[dream.id] || false} onFlip={handleFlip} onClick={(d) => setSelectedDream(d)} />
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowForm(true)} style={{ position: 'fixed', right: '20px', bottom: '100px', width: '56px', height: '56px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`, border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${COLORS.gold}40` }}>
        <Plus style={{ width: '24px', height: '24px', color: COLORS.bg }} />
      </button>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingDream(null); }} title={editingDream ? 'Редактировать' : 'Новая мечта'}>
        <DreamForm spheres={data.spheres} existingDream={editingDream} onSave={handleSaveDream} onClose={() => { setShowForm(false); setEditingDream(null); }} />
      </Modal>

      <Modal isOpen={showSphereManager} onClose={() => setShowSphereManager(false)} title="Сферы жизни">
        <SphereManager spheres={data.spheres} dreams={data.dreams} onSave={handleSaveSpheres} onClose={() => setShowSphereManager(false)} />
      </Modal>

      {selectedDream && (
        <DreamDetail dream={selectedDream} sphere={data.spheres.find(s => s.id === selectedDream.sphereId)} isFocused={selectedDream.isFocused} isLeading={selectedDream.isLeading} onClose={() => setSelectedDream(null)} onEdit={() => { setEditingDream(selectedDream); setSelectedDream(null); setShowForm(true); }} onToggleFocus={() => handleToggleFocus(selectedDream)} onSetLeading={() => handleSetLeading(selectedDream)} onArchive={() => handleArchive(selectedDream)} onAchieve={() => handleAchieve(selectedDream)} />
      )}

      <Modal isOpen={showFocusSelect} onClose={() => { setShowFocusSelect(false); setPendingFocusDream(null); }} title="Выберите мечту для замены">
        <p style={{ color: COLORS.textMuted, marginBottom: '20px', fontSize: '14px' }}>У вас уже 3 мечты в фокусе. Какую заменить?</p>
        {focusedDreams.map((d) => (
          <button key={d.id} onClick={() => handleReplaceFocus(d)} style={{ width: '100%', padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{d.isLeading && <Star style={{ width: '16px', height: '16px', color: COLORS.gold, fill: COLORS.gold }} />}{d.title}</span>
            <ChevronRight style={{ width: '18px', height: '18px', color: COLORS.textMuted }} />
          </button>
        ))}
      </Modal>
    </div>
  );
};
