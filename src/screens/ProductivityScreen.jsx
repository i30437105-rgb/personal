import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Square, Plus, ChevronLeft, ChevronRight, Star, Settings, Edit3, X, Check, Trash2, BarChart2 } from 'lucide-react';
import { COLORS } from '../constants';
import { Modal } from '../components/ui';

// ============================================
// КОНСТАНТЫ ПРОДУКТИВНОСТИ
// ============================================
const DEFAULT_ACTIVITIES = [
  { id: 'activity_work', name: 'Работа', icon: '💼', color: '#4A90D9', isFavorite: true },
  { id: 'activity_study', name: 'Обучение', icon: '📚', color: '#9B59B6', isFavorite: true },
  { id: 'activity_sport', name: 'Спорт', icon: '🏃', color: '#27AE60', isFavorite: true },
  { id: 'activity_rest', name: 'Отдых', icon: '☕', color: '#E67E22', isFavorite: false },
  { id: 'activity_creative', name: 'Творчество', icon: '🎨', color: '#E91E63', isFavorite: false },
];

const ACTIVITY_ICONS = ['💼', '📚', '🏃', '☕', '🎨', '🎮', '🎵', '✍️', '🧘', '🍳', '🛠️', '💻', '📱', '🎯', '⭐'];
const ACTIVITY_COLORS = ['#4A90D9', '#9B59B6', '#27AE60', '#E67E22', '#E91E63', '#00BCD4', '#FF5722', '#607D8B', '#795548', '#3F51B5'];

// ============================================
// УТИЛИТЫ
// ============================================
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatMinutes = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}ч ${m}м`;
  return `${m}м`;
};

const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateDisplay = (date) => {
  const d = new Date(date);
  const today = new Date();
  if (formatDateKey(d) === formatDateKey(today)) return 'Сегодня';
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

// ============================================
// ФОРМА ВИДА ДЕЯТЕЛЬНОСТИ
// ============================================
const ActivityForm = ({ existingActivity, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(existingActivity?.name || '');
  const [icon, setIcon] = useState(existingActivity?.icon || '💼');
  const [color, setColor] = useState(existingActivity?.color || ACTIVITY_COLORS[0]);
  const [isFavorite, setIsFavorite] = useState(existingActivity?.isFavorite || false);
  const [dailyGoal, setDailyGoal] = useState(existingActivity?.dailyGoal || '');

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: existingActivity?.id || `activity_${Date.now()}`,
      name, icon, color, isFavorite,
      dailyGoal: dailyGoal ? parseInt(dailyGoal) : null,
      isArchived: false,
      createdAt: existingActivity?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название деятельности" style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Иконка</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ACTIVITY_ICONS.map((i) => (
            <button key={i} onClick={() => setIcon(i)} style={{ width: '44px', height: '44px', background: icon === i ? `${color}30` : COLORS.bg, border: `2px solid ${icon === i ? color : COLORS.border}`, borderRadius: '10px', fontSize: '20px', cursor: 'pointer' }}>{i}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Цвет</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ACTIVITY_COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} style={{ width: '36px', height: '36px', background: c, border: `3px solid ${color === c ? COLORS.text : 'transparent'}`, borderRadius: '50%', cursor: 'pointer' }} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Цель (минут в день)</label>
        <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} placeholder="Например: 60" style={inputStyle} />
      </div>

      <button onClick={() => setIsFavorite(!isFavorite)} style={{ width: '100%', padding: '14px', background: isFavorite ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${isFavorite ? COLORS.gold : COLORS.border}`, borderRadius: '12px', color: isFavorite ? COLORS.gold : COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        <Star style={{ width: '18px', height: '18px', fill: isFavorite ? COLORS.gold : 'none' }} />В избранном
      </button>

      <div style={{ display: 'flex', gap: '12px' }}>
        {existingActivity && (
          <button onClick={() => onDelete(existingActivity.id)} style={{ padding: '16px', background: `${COLORS.danger}20`, border: `1px solid ${COLORS.danger}50`, borderRadius: '12px', color: COLORS.danger, cursor: 'pointer' }}><Trash2 style={{ width: '18px', height: '18px' }} /></button>
        )}
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{ flex: 1, padding: '16px', background: name.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: name.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: name.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// ЭКРАН ПРОДУКТИВНОСТИ
// ============================================
export const ProductivityScreen = ({ data, saveData }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const timerRef = useRef(null);

  // Инициализация
  useEffect(() => {
    if (!data.activities) {
      saveData({ ...data, activities: DEFAULT_ACTIVITIES, sessions: [] });
    }
  }, [data, saveData]);

  const activities = data.activities || DEFAULT_ACTIVITIES;
  const sessions = data.sessions || [];
  const favoriteActivities = activities.filter(a => a.isFavorite && !a.isArchived);

  // Таймер
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(activeSession.startAt).getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeSession]);

  // Проверяем активную сессию при загрузке
  useEffect(() => {
    const active = sessions.find(s => !s.endAt);
    if (active) {
      setActiveSession(active);
      const elapsed = Math.floor((Date.now() - new Date(active.startAt).getTime()) / 1000);
      setElapsedTime(elapsed);
    }
  }, [sessions]);

  const startSession = (activityId) => {
    // Останавливаем текущую сессию если есть
    let newSessions = [...sessions];
    if (activeSession) {
      newSessions = newSessions.map(s => 
        s.id === activeSession.id 
          ? { ...s, endAt: new Date().toISOString(), durationMinutes: Math.floor(elapsedTime / 60) }
          : s
      );
    }
    
    const newSession = {
      id: `session_${Date.now()}`,
      activityId,
      startAt: new Date().toISOString(),
      endAt: null,
      date: formatDateKey(new Date()),
      durationMinutes: 0,
    };
    
    saveData({ ...data, sessions: [...newSessions, newSession] });
    setActiveSession(newSession);
    setElapsedTime(0);
  };

  const stopSession = () => {
    if (!activeSession) return;
    const durationMinutes = Math.floor(elapsedTime / 60);
    const newSessions = sessions.map(s => 
      s.id === activeSession.id 
        ? { ...s, endAt: new Date().toISOString(), durationMinutes }
        : s
    );
    saveData({ ...data, sessions: newSessions });
    setActiveSession(null);
    setElapsedTime(0);
  };

  const handleSaveActivity = (activity) => {
    const existingIndex = activities.findIndex(a => a.id === activity.id);
    let newActivities;
    if (existingIndex >= 0) {
      newActivities = [...activities];
      newActivities[existingIndex] = activity;
    } else {
      newActivities = [...activities, activity];
    }
    saveData({ ...data, activities: newActivities });
    setShowActivityForm(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activityId) => {
    saveData({ ...data, activities: activities.filter(a => a.id !== activityId) });
    setShowActivityForm(false);
    setEditingActivity(null);
  };

  // Статистика за день
  const dateKey = formatDateKey(selectedDate);
  const daySessions = sessions.filter(s => s.date === dateKey && s.endAt);
  const dayStats = activities.map(a => {
    const activitySessions = daySessions.filter(s => s.activityId === a.id);
    const totalMinutes = activitySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    return { ...a, totalMinutes };
  }).filter(a => a.totalMinutes > 0 || a.isFavorite);

  const totalDayMinutes = daySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const activeActivity = activeSession ? activities.find(a => a.id === activeSession.activityId) : null;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>Время</h1>
          <button onClick={() => { setEditingActivity(null); setShowActivityForm(true); }} style={{ width: '40px', height: '40px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Settings style={{ width: '18px', height: '18px', color: COLORS.textMuted }} />
          </button>
        </div>

        {/* Активный таймер */}
        <div style={{ background: activeSession ? `${activeActivity?.color}20` : COLORS.bg, borderRadius: '20px', padding: '24px', border: `1px solid ${activeSession ? activeActivity?.color : COLORS.border}`, marginBottom: '20px', textAlign: 'center' }}>
          {activeSession ? (
            <>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{activeActivity?.icon}</div>
              <p style={{ fontSize: '14px', color: activeActivity?.color, marginBottom: '12px', fontWeight: '500' }}>{activeActivity?.name}</p>
              <p style={{ fontSize: '48px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace', letterSpacing: '2px' }}>{formatTime(elapsedTime)}</p>
              <button onClick={stopSession} style={{ marginTop: '20px', padding: '14px 32px', background: COLORS.danger, border: 'none', borderRadius: '12px', color: COLORS.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Square style={{ width: '18px', height: '18px', fill: COLORS.text }} />Стоп
              </button>
            </>
          ) : (
            <>
              <Clock style={{ width: '48px', height: '48px', color: COLORS.textDark, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: COLORS.textMuted }}>Выберите вид деятельности</p>
            </>
          )}
        </div>

        {/* Быстрый выбор избранных */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {favoriteActivities.map((a) => (
            <button key={a.id} onClick={() => startSession(a.id)} disabled={activeSession?.activityId === a.id} style={{ minWidth: '70px', padding: '12px', background: activeSession?.activityId === a.id ? `${a.color}30` : COLORS.bg, border: `2px solid ${a.color}`, borderRadius: '14px', cursor: activeSession?.activityId === a.id ? 'default' : 'pointer', opacity: activeSession?.activityId === a.id ? 0.7 : 1 }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{a.icon}</div>
              <p style={{ fontSize: '11px', color: a.color, fontWeight: '500' }}>{a.name}</p>
            </button>
          ))}
          <button onClick={() => setShowAllActivities(true)} style={{ minWidth: '70px', padding: '12px', background: COLORS.bg, border: `1px dashed ${COLORS.border}`, borderRadius: '14px', cursor: 'pointer' }}>
            <Plus style={{ width: '24px', height: '24px', color: COLORS.textMuted, margin: '0 auto 4px' }} />
            <p style={{ fontSize: '11px', color: COLORS.textMuted }}>Ещё</p>
          </button>
        </div>
      </div>

      {/* Статистика дня */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft style={{ width: '20px', height: '20px', color: COLORS.textMuted }} />
          </button>
          <p style={{ fontSize: '16px', color: COLORS.text, fontWeight: '500' }}>{formatDateDisplay(selectedDate)}</p>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronRight style={{ width: '20px', height: '20px', color: COLORS.textMuted }} />
          </button>
        </div>

        {/* Итого */}
        <div style={{ padding: '16px', background: COLORS.bgCard, borderRadius: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted }}>Всего за день</span>
          <span style={{ fontSize: '20px', color: COLORS.gold, fontWeight: '600' }}>{formatMinutes(totalDayMinutes)}</span>
        </div>

        {/* Список активностей */}
        {dayStats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <BarChart2 style={{ width: '48px', height: '48px', color: COLORS.textDark, margin: '0 auto 16px' }} />
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Нет записей за этот день</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayStats.sort((a, b) => b.totalMinutes - a.totalMinutes).map((a) => {
              const progress = a.dailyGoal ? Math.min(100, (a.totalMinutes / a.dailyGoal) * 100) : 0;
              const goalReached = a.dailyGoal && a.totalMinutes >= a.dailyGoal;
              return (
                <div key={a.id} style={{ padding: '14px', background: COLORS.bgCard, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: `${a.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', color: COLORS.text, fontWeight: '500' }}>{a.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '16px', color: a.color, fontWeight: '600' }}>{formatMinutes(a.totalMinutes)}</span>
                        {a.dailyGoal && (
                          <span style={{ fontSize: '12px', color: goalReached ? COLORS.success : COLORS.textMuted }}>/ {formatMinutes(a.dailyGoal)}</span>
                        )}
                      </div>
                    </div>
                    {goalReached && <Check style={{ width: '20px', height: '20px', color: COLORS.success }} />}
                  </div>
                  {a.dailyGoal && (
                    <div style={{ marginTop: '10px', height: '4px', background: COLORS.bg, borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: goalReached ? COLORS.success : a.color, borderRadius: '2px' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Модалка все активности */}
      <Modal isOpen={showAllActivities} onClose={() => setShowAllActivities(false)} title="Виды деятельности">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activities.filter(a => !a.isArchived).map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: COLORS.bg, borderRadius: '12px' }}>
              <button onClick={() => { startSession(a.id); setShowAllActivities(false); }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ width: '44px', height: '44px', background: `${a.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{a.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '15px', color: COLORS.text, fontWeight: '500' }}>{a.name}</p>
                  {a.dailyGoal && <p style={{ fontSize: '12px', color: COLORS.textMuted }}>Цель: {formatMinutes(a.dailyGoal)}</p>}
                </div>
              </button>
              <button onClick={() => { setEditingActivity(a); setShowActivityForm(true); setShowAllActivities(false); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Edit3 style={{ width: '16px', height: '16px', color: COLORS.textMuted }} />
              </button>
            </div>
          ))}
          <button onClick={() => { setEditingActivity(null); setShowActivityForm(true); setShowAllActivities(false); }} style={{ padding: '14px', background: COLORS.bg, border: `1px dashed ${COLORS.border}`, borderRadius: '12px', color: COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Plus style={{ width: '18px', height: '18px' }} />Добавить
          </button>
        </div>
      </Modal>

      {/* Модалка формы */}
      <Modal isOpen={showActivityForm} onClose={() => { setShowActivityForm(false); setEditingActivity(null); }} title={editingActivity ? 'Редактировать' : 'Новый вид'}>
        <ActivityForm existingActivity={editingActivity} onSave={handleSaveActivity} onClose={() => { setShowActivityForm(false); setEditingActivity(null); }} onDelete={handleDeleteActivity} />
      </Modal>
    </div>
  );
};
