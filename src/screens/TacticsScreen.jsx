import React, { useState, useEffect } from 'react';
import { Target, Flag, Plus, Clock, Edit3, Check, X, ChevronDown, ChevronUp, AlertCircle, Circle, CheckCircle, XCircle } from 'lucide-react';
import { COLORS, QUARTERS, MILESTONE_STATUSES } from '../constants';
import { getDaysUntilDeadline, getCurrentQuarter } from '../utils';
import { Modal } from '../components/ui';

// ============================================
// ФОРМА РУБЕЖА
// ============================================
const MilestoneForm = ({ goals, selectedGoalId, quarter, year, onSave, onClose, existingMilestone }) => {
  const [goalId, setGoalId] = useState(existingMilestone?.goalId || selectedGoalId || '');
  const [title, setTitle] = useState(existingMilestone?.title || '');
  const [description, setDescription] = useState(existingMilestone?.description || '');
  const [criteria, setCriteria] = useState(existingMilestone?.criteria || '');
  const [deadline, setDeadline] = useState(existingMilestone?.deadline || '');
  const [notes, setNotes] = useState(existingMilestone?.notes || '');

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const quarterLabel = QUARTERS.find(q => q.id === quarter)?.label || quarter;

  const handleSave = () => {
    if (!title.trim() || !goalId) return;
    onSave({
      id: existingMilestone?.id || `milestone_${Date.now()}`,
      goalId, quarter, year, title, description, criteria,
      deadline: deadline || null, notes,
      status: existingMilestone?.status || 'pending',
      createdAt: existingMilestone?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div>
      <div style={{ padding: '12px 16px', background: `${COLORS.blue}20`, borderRadius: '12px', marginBottom: '20px', border: `1px solid ${COLORS.blue}40` }}>
        <p style={{ fontSize: '13px', color: COLORS.blue }}>Рубеж для {quarterLabel} {year}</p>
      </div>
      
      {/* Выбор цели */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Цель *</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {goals.map((g) => (
            <button key={g.id} onClick={() => setGoalId(g.id)} style={{ padding: '12px 16px', background: goalId === g.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${goalId === g.id ? COLORS.gold : COLORS.border}`, borderRadius: '12px', color: goalId === g.id ? COLORS.gold : COLORS.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{g.icon || '🎯'}</span>
              <span>{g.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название рубежа *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Что нужно достичь к концу квартала?" style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подробности..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Критерий прохождения</label>
        <textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="Как понять, что рубеж пройден?" rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Дедлайн</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Заметки</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Дополнительные заметки..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!title.trim() || !goalId} style={{ flex: 1, padding: '16px', background: (title.trim() && goalId) ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: (title.trim() && goalId) ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: (title.trim() && goalId) ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// ФОРМА ШАГА
// ============================================
const StepForm = ({ milestoneId, quarter, year, onSave, onClose, existingStep }) => {
  const quarterData = QUARTERS.find(q => q.id === quarter);
  const [title, setTitle] = useState(existingStep?.title || '');
  const [description, setDescription] = useState(existingStep?.description || '');
  const [month, setMonth] = useState(existingStep?.month || quarterData?.months[0] || 1);
  const [deadline, setDeadline] = useState(existingStep?.deadline || '');

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: existingStep?.id || `step_${Date.now()}`,
      milestoneId, title, description, month, year,
      deadline: deadline || null,
      status: existingStep?.status || 'pending',
      sortOrder: existingStep?.sortOrder || Date.now(),
      createdAt: existingStep?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название шага *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Что нужно сделать?" style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подробности..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Месяц</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {quarterData?.months.map((m, idx) => (
            <button key={m} onClick={() => setMonth(m)} style={{ flex: 1, padding: '12px', background: month === m ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${month === m ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: month === m ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>
              {quarterData.monthNames[idx]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Дедлайн</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!title.trim()} style={{ flex: 1, padding: '16px', background: title.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: title.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: title.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// КАРТОЧКА РУБЕЖА
// ============================================
const MilestoneCard = ({ milestone, goal, steps, onEdit, onUpdateStatus, onAddStep, onEditStep, onToggleStep }) => {
  const [expanded, setExpanded] = useState(true);
  const status = MILESTONE_STATUSES.find(s => s.id === milestone.status) || MILESTONE_STATUSES[0];
  const StatusIcon = status.icon;
  const daysLeft = getDaysUntilDeadline(milestone.deadline);
  const quarterData = QUARTERS.find(q => q.id === milestone.quarter);
  
  const stepsByMonth = {};
  quarterData?.months.forEach((m, idx) => {
    stepsByMonth[m] = { name: quarterData.monthNames[idx], steps: steps.filter(s => s.month === m).sort((a, b) => a.sortOrder - b.sortOrder) };
  });

  const completedSteps = steps.filter(s => s.status === 'completed').length;

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', border: `1px solid ${status.color}40`, marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: `${status.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Flag style={{ width: '20px', height: '20px', color: status.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text, margin: 0, textAlign: 'left', flex: 1 }}>{milestone.title}</h3>
            {expanded ? <ChevronUp style={{ width: '18px', height: '18px', color: COLORS.textMuted, flexShrink: 0 }} /> : <ChevronDown style={{ width: '18px', height: '18px', color: COLORS.textMuted, flexShrink: 0 }} />}
          </button>
          {/* Метка цели в свёрнутом и развёрнутом виде */}
          {goal && (
            <p style={{ fontSize: '11px', color: COLORS.gold, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '12px' }}>{goal.icon || '🎯'}</span>{goal.title}
            </p>
          )}
        </div>
      </div>

      {/* Свёрнутый вид: только шаги и дедлайн, БЕЗ статуса */}
      {!expanded && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {steps.length > 0 && (
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Шаги: {completedSteps}/{steps.length}</span>
          )}
          {daysLeft !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock style={{ width: '12px', height: '12px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.textMuted }} />
              <span style={{ fontSize: '12px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.textMuted }}>
                {daysLeft < 0 ? `Просрочено ${Math.abs(daysLeft)} дн.` : daysLeft === 0 ? 'Сегодня' : `${daysLeft} дн.`}
              </span>
            </div>
          )}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: '16px' }}>
          {/* Статус */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <StatusIcon style={{ width: '14px', height: '14px', color: status.color }} />
            <span style={{ fontSize: '12px', color: status.color, fontWeight: '500' }}>{status.label}</span>
          </div>
          
          {milestone.description && <p style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.5', marginBottom: '12px' }}>{milestone.description}</p>}
          {milestone.criteria && (
            <div style={{ padding: '10px 12px', background: COLORS.bg, borderRadius: '10px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>Критерий прохождения</p>
              <p style={{ fontSize: '13px', color: COLORS.text }}>{milestone.criteria}</p>
            </div>
          )}
          {daysLeft !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '10px 12px', background: COLORS.bg, borderRadius: '10px' }}>
              <Clock style={{ width: '16px', height: '16px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.textMuted }} />
              <span style={{ fontSize: '13px', color: COLORS.text }}>Дедлайн: </span>
              <span style={{ fontSize: '13px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.gold, fontWeight: '600' }}>{new Date(milestone.deadline).toLocaleDateString('ru-RU')}</span>
            </div>
          )}
          {milestone.notes && (
            <div style={{ padding: '10px 12px', background: COLORS.bg, borderRadius: '10px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>Заметки</p>
              <p style={{ fontSize: '13px', color: COLORS.text }}>{milestone.notes}</p>
            </div>
          )}

          {/* Шаги с названием, описанием и дедлайном */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Шаги</p>
            {quarterData?.months.map((m, idx) => (
              <div key={m} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: COLORS.gold, marginBottom: '6px', fontWeight: '500' }}>{quarterData.monthNames[idx]}</p>
                {stepsByMonth[m].steps.length === 0 ? (
                  <p style={{ fontSize: '12px', color: COLORS.textDark, fontStyle: 'italic', marginBottom: '4px' }}>Нет шагов</p>
                ) : (
                  stepsByMonth[m].steps.map((step) => {
                    const stepDaysLeft = getDaysUntilDeadline(step.deadline);
                    return (
                      <div key={step.id} style={{ padding: '10px 12px', background: COLORS.bg, borderRadius: '10px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <button onClick={() => onToggleStep(step)} style={{ width: '20px', height: '20px', background: step.status === 'completed' ? COLORS.success : 'transparent', border: `2px solid ${step.status === 'completed' ? COLORS.success : step.status === 'failed' ? COLORS.danger : COLORS.textDark}`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}>
                            {step.status === 'completed' && <Check style={{ width: '12px', height: '12px', color: COLORS.bg }} />}
                            {step.status === 'failed' && <X style={{ width: '12px', height: '12px', color: COLORS.danger }} />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <span style={{ fontSize: '14px', color: step.status === 'completed' ? COLORS.textMuted : COLORS.text, fontWeight: '500', textDecoration: step.status === 'completed' ? 'line-through' : 'none' }}>{step.title}</span>
                              <button onClick={() => onEditStep(step)} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                                <Edit3 style={{ width: '14px', height: '14px', color: COLORS.textMuted }} />
                              </button>
                            </div>
                            {step.description && (
                              <p style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '4px', lineHeight: '1.4' }}>{step.description}</p>
                            )}
                            {stepDaysLeft !== null && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                <Clock style={{ width: '12px', height: '12px', color: stepDaysLeft < 0 ? COLORS.danger : stepDaysLeft <= 3 ? COLORS.warning : COLORS.textMuted }} />
                                <span style={{ fontSize: '11px', color: stepDaysLeft < 0 ? COLORS.danger : stepDaysLeft <= 3 ? COLORS.warning : COLORS.textMuted }}>
                                  {stepDaysLeft < 0 ? `Просрочено ${Math.abs(stepDaysLeft)} дн.` : stepDaysLeft === 0 ? 'Сегодня' : `Осталось ${stepDaysLeft} дн.`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ))}
            <button onClick={onAddStep} style={{ width: '100%', padding: '10px', background: COLORS.bg, border: `1px dashed ${COLORS.border}`, borderRadius: '10px', color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Plus style={{ width: '14px', height: '14px' }} />Добавить шаг
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={onEdit} style={{ flex: 1, padding: '10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Edit3 style={{ width: '14px', height: '14px' }} />Изменить
            </button>
            {milestone.status === 'pending' && (
              <>
                <button onClick={() => onUpdateStatus('passed')} style={{ flex: 1, padding: '10px', background: `${COLORS.success}20`, border: `1px solid ${COLORS.success}50`, borderRadius: '10px', color: COLORS.success, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle style={{ width: '14px', height: '14px' }} />Пройден
                </button>
                <button onClick={() => onUpdateStatus('failed')} style={{ flex: 1, padding: '10px', background: `${COLORS.danger}20`, border: `1px solid ${COLORS.danger}50`, borderRadius: '10px', color: COLORS.danger, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <XCircle style={{ width: '14px', height: '14px' }} />Не пройден
                </button>
              </>
            )}
            {milestone.status !== 'pending' && (
              <button onClick={() => onUpdateStatus('pending')} style={{ flex: 1, padding: '10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Circle style={{ width: '14px', height: '14px' }} />В ожидание
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ЭКРАН ТАКТИКИ
// ============================================
export const TacticsScreen = ({ data, saveData }) => {
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [currentMilestoneId, setCurrentMilestoneId] = useState(null);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);

  const currentYear = new Date().getFullYear();
  const activeGoals = data.goals.filter(g => g.status === 'active' && g.year === currentYear);
  const selectedGoal = activeGoals.find(g => g.id === selectedGoalId);
  
  useEffect(() => {
    if (!selectedGoalId && activeGoals.length > 0) setSelectedGoalId(activeGoals[0].id);
  }, [activeGoals, selectedGoalId]);

  const milestone = data.milestones.find(m => m.goalId === selectedGoalId && m.quarter === selectedQuarter && m.year === currentYear);
  const steps = milestone ? data.steps.filter(s => s.milestoneId === milestone.id) : [];

  const handleSaveMilestone = (milestoneData) => {
    const existingIndex = data.milestones.findIndex(m => m.id === milestoneData.id);
    let newMilestones = existingIndex >= 0 ? [...data.milestones] : [...data.milestones, milestoneData];
    if (existingIndex >= 0) newMilestones[existingIndex] = milestoneData;
    saveData({ ...data, milestones: newMilestones });
    setShowMilestoneForm(false); setEditingMilestone(null);
    // Если цель изменилась, обновляем выбранную цель
    if (milestoneData.goalId !== selectedGoalId) {
      setSelectedGoalId(milestoneData.goalId);
    }
  };

  const handleUpdateMilestoneStatus = (milestoneId, status) => {
    saveData({ ...data, milestones: data.milestones.map(m => m.id === milestoneId ? { ...m, status } : m) });
  };

  const handleSaveStep = (stepData) => {
    const existingIndex = data.steps.findIndex(s => s.id === stepData.id);
    let newSteps = existingIndex >= 0 ? [...data.steps] : [...data.steps, stepData];
    if (existingIndex >= 0) newSteps[existingIndex] = stepData;
    saveData({ ...data, steps: newSteps });
    setShowStepForm(false); setEditingStep(null); setCurrentMilestoneId(null);
  };

  const handleToggleStep = (step) => {
    const newStatus = step.status === 'completed' ? 'pending' : 'completed';
    saveData({ ...data, steps: data.steps.map(s => s.id === step.id ? { ...s, status: newStatus } : s) });
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif', marginBottom: '16px' }}>Тактика</h1>
        
        {activeGoals.length > 0 ? (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Цель</p>
            {/* Выпадающий список целей */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowGoalDropdown(!showGoalDropdown)} style={{ width: '100%', padding: '12px 16px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{selectedGoal?.icon || '🎯'}</span>
                  <span>{selectedGoal?.title || 'Выберите цель'}</span>
                </div>
                <ChevronDown style={{ width: '18px', height: '18px', color: COLORS.textMuted, transform: showGoalDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showGoalDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', overflow: 'hidden', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                  {activeGoals.map((g) => (
                    <button key={g.id} onClick={() => { setSelectedGoalId(g.id); setShowGoalDropdown(false); }} style={{ width: '100%', padding: '12px 16px', background: selectedGoalId === g.id ? `${COLORS.gold}15` : 'transparent', border: 'none', borderBottom: `1px solid ${COLORS.border}`, color: selectedGoalId === g.id ? COLORS.gold : COLORS.text, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                      <span style={{ fontSize: '20px' }}>{g.icon || '🎯'}</span>
                      <span>{g.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', background: `${COLORS.warning}15`, borderRadius: '12px', border: `1px solid ${COLORS.warning}30`, marginBottom: '16px' }}>
            <p style={{ color: COLORS.warning, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle style={{ width: '18px', height: '18px' }} />Сначала создайте цель в разделе "Цели"</p>
          </div>
        )}

        {selectedGoalId && (
          <div style={{ display: 'flex', gap: '4px', background: COLORS.bg, padding: '4px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
            {QUARTERS.map((q) => {
              const hasMilestone = data.milestones.some(m => m.goalId === selectedGoalId && m.quarter === q.id && m.year === currentYear);
              return (
                <button key={q.id} onClick={() => setSelectedQuarter(q.id)} style={{ flex: 1, padding: '12px', background: selectedQuarter === q.id ? COLORS.gold : 'transparent', border: 'none', borderRadius: '8px', color: selectedQuarter === q.id ? COLORS.bg : COLORS.textMuted, fontSize: '14px', fontWeight: selectedQuarter === q.id ? '600' : '400', cursor: 'pointer', position: 'relative' }}>
                  {q.label}
                  {hasMilestone && selectedQuarter !== q.id && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: COLORS.gold, borderRadius: '50%' }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {selectedGoalId ? (
          milestone ? (
            <MilestoneCard 
              milestone={milestone} 
              goal={selectedGoal}
              steps={steps} 
              onEdit={() => { setEditingMilestone(milestone); setShowMilestoneForm(true); }} 
              onUpdateStatus={(status) => handleUpdateMilestoneStatus(milestone.id, status)} 
              onAddStep={() => { setCurrentMilestoneId(milestone.id); setEditingStep(null); setShowStepForm(true); }} 
              onEditStep={(step) => { setEditingStep(step); setCurrentMilestoneId(step.milestoneId); setShowStepForm(true); }} 
              onToggleStep={handleToggleStep} 
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Flag style={{ width: '40px', height: '40px', color: COLORS.gold, opacity: 0.5 }} /></div>
              <h3 style={{ color: COLORS.text, fontSize: '18px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Нет рубежа для {QUARTERS.find(q => q.id === selectedQuarter)?.label}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: '14px', marginBottom: '20px' }}>Создайте рубеж для этого квартала</p>
              <button onClick={() => { setEditingMilestone(null); setShowMilestoneForm(true); }} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`, border: 'none', borderRadius: '12px', color: COLORS.bg, fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Plus style={{ width: '18px', height: '18px' }} />Создать рубеж</button>
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Target style={{ width: '40px', height: '40px', color: COLORS.gold, opacity: 0.5 }} /></div>
            <h3 style={{ color: COLORS.text, fontSize: '18px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Выберите цель</h3>
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Чтобы управлять тактикой, выберите цель выше</p>
          </div>
        )}
      </div>

      {selectedGoalId && !milestone && (
        <button onClick={() => { setEditingMilestone(null); setShowMilestoneForm(true); }} style={{ position: 'fixed', right: '20px', bottom: '100px', width: '56px', height: '56px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`, border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${COLORS.gold}40` }}><Plus style={{ width: '24px', height: '24px', color: COLORS.bg }} /></button>
      )}

      <Modal isOpen={showMilestoneForm} onClose={() => { setShowMilestoneForm(false); setEditingMilestone(null); }} title={editingMilestone ? 'Редактировать рубеж' : 'Новый рубеж'}>
        <MilestoneForm 
          goals={activeGoals}
          selectedGoalId={selectedGoalId}
          quarter={selectedQuarter} 
          year={currentYear} 
          existingMilestone={editingMilestone} 
          onSave={handleSaveMilestone} 
          onClose={() => { setShowMilestoneForm(false); setEditingMilestone(null); }} 
        />
      </Modal>

      <Modal isOpen={showStepForm} onClose={() => { setShowStepForm(false); setEditingStep(null); setCurrentMilestoneId(null); }} title={editingStep ? 'Редактировать шаг' : 'Новый шаг'}>
        <StepForm milestoneId={currentMilestoneId} quarter={selectedQuarter} year={currentYear} existingStep={editingStep} onSave={handleSaveStep} onClose={() => { setShowStepForm(false); setEditingStep(null); setCurrentMilestoneId(null); }} />
      </Modal>
    </div>
  );
};
