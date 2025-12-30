import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, Calendar, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Edit3, Check, X, Trash2, Target, Flag, AlertCircle, Circle } from 'lucide-react';
import { COLORS } from '../constants';
import { Modal } from '../components/ui';

// ============================================
// КОНСТАНТЫ ДЕЙСТВИЙ
// ============================================
const ACTION_PRIORITIES = [
  { id: 'can_wait', label: 'Может подождать', color: COLORS.textMuted, bg: 'transparent' },
  { id: 'not_important', label: 'Обычная', color: COLORS.textMuted, bg: 'transparent' },
  { id: 'important', label: 'Важная', color: COLORS.yellow, bg: `${COLORS.yellow}20` },
  { id: 'critical', label: 'Критичная', color: COLORS.danger, bg: `${COLORS.danger}20` },
  { id: 'urgent', label: 'Срочная', color: COLORS.red, bg: `${COLORS.red}20` },
];

// ============================================
// УТИЛИТЫ ДАТ
// ============================================
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateDisplay = (date) => {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  
  if (formatDateKey(d) === formatDateKey(today)) return 'Сегодня';
  if (formatDateKey(d) === formatDateKey(tomorrow)) return 'Завтра';
  if (formatDateKey(d) === formatDateKey(yesterday)) return 'Вчера';
  
  const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// ============================================
// ФОРМА ДЕЙСТВИЯ
// ============================================
const ActionForm = ({ steps, spheres, selectedDate, existingAction, onSave, onClose, onDelete }) => {
  const [title, setTitle] = useState(existingAction?.title || '');
  const [description, setDescription] = useState(existingAction?.description || '');
  const [date, setDate] = useState(existingAction?.date || formatDateKey(selectedDate));
  const [time, setTime] = useState(existingAction?.time || '');
  const [priority, setPriority] = useState(existingAction?.priority || 'not_important');
  const [stepId, setStepId] = useState(existingAction?.stepId || '');
  const [sphereId, setSphereId] = useState(existingAction?.sphereId || '');
  const [subtasks, setSubtasks] = useState(existingAction?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [showStepPicker, setShowStepPicker] = useState(false);

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: `subtask_${Date.now()}`, title: newSubtask.trim(), isCompleted: false }]);
    setNewSubtask('');
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: existingAction?.id || `action_${Date.now()}`,
      title, description, date: date || null, time: time || null, priority, stepId: stepId || null, sphereId: sphereId || null, subtasks,
      status: existingAction?.status || 'active',
      sortOrder: existingAction?.sortOrder || Date.now(),
      createdAt: existingAction?.createdAt || new Date().toISOString(),
    });
  };

  // Группируем шаги по целям
  const stepsByGoal = {};
  steps.forEach(step => {
    if (!stepsByGoal[step.goalId]) stepsByGoal[step.goalId] = [];
    stepsByGoal[step.goalId].push(step);
  });

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Что нужно сделать?" style={inputStyle} />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подробности..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Дата</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Время</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Приоритет</label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {ACTION_PRIORITIES.map((p) => (
            <button key={p.id} onClick={() => setPriority(p.id)} style={{ padding: '8px 12px', background: priority === p.id ? p.bg || `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${priority === p.id ? p.color : COLORS.border}`, borderRadius: '8px', color: priority === p.id ? p.color : COLORS.textMuted, fontSize: '12px', cursor: 'pointer' }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Привязка к шагу */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Привязать к шагу (опционально)</label>
        <button onClick={() => setShowStepPicker(!showStepPicker)} style={{ width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: stepId ? COLORS.text : COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{stepId ? steps.find(s => s.id === stepId)?.title || 'Выбрать шаг' : 'Выбрать шаг'}</span>
          <ChevronDown style={{ width: '16px', height: '16px', transform: showStepPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showStepPicker && (
          <div style={{ marginTop: '8px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', maxHeight: '200px', overflowY: 'auto' }}>
            <button onClick={() => { setStepId(''); setShowStepPicker(false); }} style={{ width: '100%', padding: '12px 16px', background: !stepId ? `${COLORS.gold}15` : 'transparent', border: 'none', borderBottom: `1px solid ${COLORS.border}`, color: !stepId ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>Без привязки</button>
            {steps.map((step) => (
              <button key={step.id} onClick={() => { setStepId(step.id); setShowStepPicker(false); }} style={{ width: '100%', padding: '12px 16px', background: stepId === step.id ? `${COLORS.gold}15` : 'transparent', border: 'none', borderBottom: `1px solid ${COLORS.border}`, color: stepId === step.id ? COLORS.gold : COLORS.text, fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                {step.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Подзадачи */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Подзадачи</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subtasks.map((sub) => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: COLORS.bg, borderRadius: '10px' }}>
              <button onClick={() => handleToggleSubtask(sub.id)} style={{ width: '20px', height: '20px', background: sub.isCompleted ? COLORS.success : 'transparent', border: `2px solid ${sub.isCompleted ? COLORS.success : COLORS.textDark}`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                {sub.isCompleted && <Check style={{ width: '12px', height: '12px', color: COLORS.bg }} />}
              </button>
              <span style={{ flex: 1, fontSize: '14px', color: sub.isCompleted ? COLORS.textMuted : COLORS.text, textDecoration: sub.isCompleted ? 'line-through' : 'none' }}>{sub.title}</span>
              <button onClick={() => handleDeleteSubtask(sub.id)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '14px', height: '14px', color: COLORS.textMuted }} /></button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Добавить подзадачу..." onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()} style={{ ...inputStyle, flex: 1, padding: '10px 14px', fontSize: '14px' }} />
            <button onClick={handleAddSubtask} disabled={!newSubtask.trim()} style={{ padding: '10px 16px', background: newSubtask.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '10px', color: newSubtask.trim() ? COLORS.bg : COLORS.textDark, cursor: newSubtask.trim() ? 'pointer' : 'not-allowed' }}><Plus style={{ width: '18px', height: '18px' }} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {existingAction && (
          <button onClick={() => onDelete(existingAction.id)} style={{ padding: '16px', background: `${COLORS.danger}20`, border: `1px solid ${COLORS.danger}50`, borderRadius: '12px', color: COLORS.danger, cursor: 'pointer' }}><Trash2 style={{ width: '18px', height: '18px' }} /></button>
        )}
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!title.trim()} style={{ flex: 1, padding: '16px', background: title.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: title.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: title.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// КАРТОЧКА ДЕЙСТВИЯ
// ============================================
const ActionCard = ({ action, step, onToggle, onEdit }) => {
  const priority = ACTION_PRIORITIES.find(p => p.id === action.priority) || ACTION_PRIORITIES[1];
  const completedSubtasks = action.subtasks?.filter(s => s.isCompleted).length || 0;
  const totalSubtasks = action.subtasks?.length || 0;
  const isCompleted = action.status === 'done';

  return (
    <div style={{ background: isCompleted ? `${COLORS.success}10` : COLORS.bgCard, borderRadius: '12px', padding: '14px', border: `1px solid ${isCompleted ? `${COLORS.success}30` : priority.color !== COLORS.textMuted ? `${priority.color}40` : COLORS.border}`, marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <button onClick={onToggle} style={{ width: '22px', height: '22px', background: isCompleted ? COLORS.success : 'transparent', border: `2px solid ${isCompleted ? COLORS.success : COLORS.textDark}`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}>
          {isCompleted && <Check style={{ width: '14px', height: '14px', color: COLORS.bg }} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }} onClick={onEdit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', color: isCompleted ? COLORS.textMuted : COLORS.text, fontWeight: '500', textDecoration: isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}>{action.title}</span>
            {priority.color !== COLORS.textMuted && (
              <span style={{ fontSize: '10px', padding: '2px 6px', background: priority.bg, color: priority.color, borderRadius: '4px' }}>{priority.label}</span>
            )}
          </div>
          
          {/* Время и связь с шагом */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
            {action.time && (
              <span style={{ fontSize: '12px', color: COLORS.gold, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '12px', height: '12px' }} />{action.time}
              </span>
            )}
            {step && (
              <span style={{ fontSize: '11px', color: COLORS.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flag style={{ width: '10px', height: '10px' }} />{step.title}
              </span>
            )}
            {totalSubtasks > 0 && (
              <span style={{ fontSize: '11px', color: completedSubtasks === totalSubtasks ? COLORS.success : COLORS.textMuted }}>
                Подзадачи: {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>
        </div>
        <button onClick={onEdit} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Edit3 style={{ width: '16px', height: '16px', color: COLORS.textMuted }} />
        </button>
      </div>
    </div>
  );
};

// ============================================
// ЭКРАН ДЕНЬ (ДЕЙСТВИЯ)
// ============================================
export const ActionScreen = ({ data, saveData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  // Инициализация actions если нет
  useEffect(() => {
    if (!data.actions) {
      saveData({ ...data, actions: [] });
    }
  }, [data, saveData]);

  const actions = data.actions || [];
  const steps = data.steps || [];
  const dateKey = formatDateKey(selectedDate);

  // Фильтруем действия на выбранную дату
  const todayActions = actions.filter(a => a.date === dateKey && a.status !== 'cancelled');
  const withTime = todayActions.filter(a => a.time).sort((a, b) => a.time.localeCompare(b.time));
  const withoutTime = todayActions.filter(a => !a.time).sort((a, b) => a.sortOrder - b.sortOrder);

  // Действия без даты
  const undatedActions = actions.filter(a => !a.date && a.status === 'active');

  const handleSaveAction = (actionData) => {
    const existingIndex = actions.findIndex(a => a.id === actionData.id);
    let newActions;
    if (existingIndex >= 0) {
      newActions = [...actions];
      newActions[existingIndex] = { ...actionData, updatedAt: new Date().toISOString() };
    } else {
      newActions = [...actions, actionData];
    }
    saveData({ ...data, actions: newActions });
    setShowForm(false);
    setEditingAction(null);
  };

  const handleToggleAction = (action) => {
    const newStatus = action.status === 'done' ? 'active' : 'done';
    const newActions = actions.map(a => 
      a.id === action.id 
        ? { ...a, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null } 
        : a
    );
    saveData({ ...data, actions: newActions });
  };

  const handleDeleteAction = (actionId) => {
    saveData({ ...data, actions: actions.filter(a => a.id !== actionId) });
    setShowForm(false);
    setEditingAction(null);
  };

  const goToDate = (days) => {
    setSelectedDate(addDays(selectedDate, days));
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      {/* Шапка с датой */}
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={() => goToDate(-1)} style={{ width: '40px', height: '40px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft style={{ width: '20px', height: '20px', color: COLORS.textMuted }} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>{formatDateDisplay(selectedDate)}</h1>
            <button onClick={() => setSelectedDate(new Date())} style={{ background: 'none', border: 'none', color: COLORS.gold, fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}>Сегодня</button>
          </div>
          <button onClick={() => goToDate(1)} style={{ width: '40px', height: '40px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight style={{ width: '20px', height: '20px', color: COLORS.textMuted }} />
          </button>
        </div>

        {/* Статистика дня */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, padding: '12px', background: COLORS.bg, borderRadius: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: COLORS.gold }}>{todayActions.filter(a => a.status === 'done').length}</p>
            <p style={{ fontSize: '11px', color: COLORS.textMuted }}>Выполнено</p>
          </div>
          <div style={{ flex: 1, padding: '12px', background: COLORS.bg, borderRadius: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: COLORS.text }}>{todayActions.filter(a => a.status === 'active').length}</p>
            <p style={{ fontSize: '11px', color: COLORS.textMuted }}>Осталось</p>
          </div>
          {undatedActions.length > 0 && (
            <div style={{ flex: 1, padding: '12px', background: `${COLORS.warning}15`, borderRadius: '10px', textAlign: 'center', border: `1px solid ${COLORS.warning}30` }}>
              <p style={{ fontSize: '20px', fontWeight: '600', color: COLORS.warning }}>{undatedActions.length}</p>
              <p style={{ fontSize: '11px', color: COLORS.textMuted }}>Без даты</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Со временем */}
        {withTime.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock style={{ width: '14px', height: '14px' }} />Запланировано
            </p>
            {withTime.map((action) => (
              <ActionCard 
                key={action.id} 
                action={action} 
                step={steps.find(s => s.id === action.stepId)}
                onToggle={() => handleToggleAction(action)} 
                onEdit={() => { setEditingAction(action); setShowForm(true); }} 
              />
            ))}
          </div>
        )}

        {/* Без времени */}
        {withoutTime.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>Задачи на день</p>
            {withoutTime.map((action) => (
              <ActionCard 
                key={action.id} 
                action={action} 
                step={steps.find(s => s.id === action.stepId)}
                onToggle={() => handleToggleAction(action)} 
                onEdit={() => { setEditingAction(action); setShowForm(true); }} 
              />
            ))}
          </div>
        )}

        {/* Пусто */}
        {todayActions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckSquare style={{ width: '40px', height: '40px', color: COLORS.gold, opacity: 0.5 }} />
            </div>
            <h3 style={{ color: COLORS.text, fontSize: '18px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Нет задач</h3>
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Добавьте задачу на этот день</p>
          </div>
        )}

        {/* Без даты (если есть) */}
        {undatedActions.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', color: COLORS.warning, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle style={{ width: '14px', height: '14px' }} />Без даты
            </p>
            {undatedActions.map((action) => (
              <ActionCard 
                key={action.id} 
                action={action} 
                step={steps.find(s => s.id === action.stepId)}
                onToggle={() => handleToggleAction(action)} 
                onEdit={() => { setEditingAction(action); setShowForm(true); }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => { setEditingAction(null); setShowForm(true); }} style={{ position: 'fixed', right: '20px', bottom: '100px', width: '56px', height: '56px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`, border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${COLORS.gold}40` }}>
        <Plus style={{ width: '24px', height: '24px', color: COLORS.bg }} />
      </button>

      {/* Модалка формы */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingAction(null); }} title={editingAction ? 'Редактировать задачу' : 'Новая задача'}>
        <ActionForm 
          steps={steps} 
          spheres={data.spheres || []} 
          selectedDate={selectedDate} 
          existingAction={editingAction} 
          onSave={handleSaveAction} 
          onClose={() => { setShowForm(false); setEditingAction(null); }} 
          onDelete={handleDeleteAction}
        />
      </Modal>
    </div>
  );
};
