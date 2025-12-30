import React, { useState } from 'react';
import { Target, Moon, Plus, Trophy, X, Check, ChevronDown, ChevronUp, Clock, Edit3, Archive, Award, AlertCircle, Lightbulb } from 'lucide-react';
import { COLORS, GOAL_ICONS, GOAL_PRIORITIES, CRITERIA_TYPES, NUMERIC_TYPES, SORT_OPTIONS } from '../constants';
import { sortGoals, calculateGoalProgress, getDaysUntilDeadline } from '../utils';
import { Modal, ProgressBar, ImageUploader } from '../components/ui';

// ============================================
// КАРТОЧКА ЦЕЛИ (РАЗВОРАЧИВАЮЩАЯСЯ)
// ============================================
const GoalCard = ({ goal, dream, criteria, onUpdateCriteria, onEdit, onArchive, onAchieve, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingActual, setEditingActual] = useState(null);
  const [newActualValue, setNewActualValue] = useState('');
  
  const progress = calculateGoalProgress(goal, criteria);
  const priority = GOAL_PRIORITIES.find(p => p.id === goal.priority) || GOAL_PRIORITIES[0];
  const goalCriteria = criteria.filter(c => c.goalId === goal.id);
  const daysLeft = getDaysUntilDeadline(goal.deadline);
  
  const getBorderColor = () => {
    if (goal.priority === 'strategic_focus') return `${COLORS.red}60`;
    if (goal.priority === 'important') return `${COLORS.yellow}60`;
    return COLORS.border;
  };

  const getProgressColor = () => {
    if (goal.priority === 'strategic_focus') return COLORS.red;
    if (goal.priority === 'important') return COLORS.yellow;
    return COLORS.gold;
  };

  const handleToggleCriteria = (c) => {
    onUpdateCriteria({ ...c, isCompleted: !c.isCompleted });
  };

  const handleUpdateActual = (c) => {
    onUpdateCriteria({ ...c, actualValue: Number(newActualValue) || 0 });
    setEditingActual(null);
    setNewActualValue('');
  };
  
  return (
    <div style={{
      background: goal.priority === 'strategic_focus' ? `${COLORS.redSoft}30` : goal.priority === 'important' ? `${COLORS.yellowSoft}30` : COLORS.bgCard,
      borderRadius: '16px',
      padding: '16px',
      border: `1px solid ${getBorderColor()}`,
    }}>
      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: COLORS.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
          {goal.icon || '🎯'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button onClick={() => { const newExpanded = !expanded; setExpanded(newExpanded); if (onExpand) onExpand(newExpanded ? goal.id : null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, textAlign: 'left', flex: 1 }}>{goal.title}</h3>
            {expanded ? <ChevronUp style={{ width: '18px', height: '18px', color: COLORS.textMuted, flexShrink: 0 }} /> : <ChevronDown style={{ width: '18px', height: '18px', color: COLORS.textMuted, flexShrink: 0 }} />}
          </button>
          {dream && <p style={{ fontSize: '11px', color: COLORS.gold, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Moon style={{ width: '10px', height: '10px' }} />{dream.title}</p>}
        </div>
        {priority.hasIcon && (
          <Lightbulb style={{ width: '18px', height: '18px', color: priority.color, fill: priority.iconFilled ? priority.color : 'none', flexShrink: 0 }} />
        )}
      </div>

      {/* Свёрнутый вид: прогресс и дедлайн */}
      {!expanded && (
        <div style={{ marginTop: '12px' }}>
          <ProgressBar value={progress} height={6} color={getProgressColor()} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: COLORS.textMuted }}>Прогресс: <span style={{ color: getProgressColor(), fontWeight: '600' }}>{progress}%</span></span>
            {daysLeft !== null && (
              <span style={{ fontSize: '11px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.textMuted }}>
                Осталось: {daysLeft < 0 ? `просрочено ${Math.abs(daysLeft)} дн.` : daysLeft === 0 ? 'сегодня' : `${daysLeft} дн.`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Развёрнутый вид */}
      {expanded && (
        <div style={{ marginTop: '16px' }}>
          {/* Описание */}
          {goal.description && (
            <p style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.5', marginBottom: '16px' }}>{goal.description}</p>
          )}
          
          {/* Прогресс */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Прогресс</span>
              <span style={{ fontSize: '14px', color: getProgressColor(), fontWeight: '600' }}>{progress}%</span>
            </div>
            <ProgressBar value={progress} height={8} color={getProgressColor()} />
          </div>

          {/* Дедлайн */}
          {daysLeft !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 12px', background: COLORS.bg, borderRadius: '10px' }}>
              <Clock style={{ width: '16px', height: '16px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.textMuted }} />
              <span style={{ fontSize: '13px', color: COLORS.text }}>Осталось: </span>
              <span style={{ fontSize: '13px', color: daysLeft < 0 ? COLORS.danger : daysLeft <= 7 ? COLORS.warning : COLORS.gold, fontWeight: '600' }}>
                {daysLeft < 0 ? `просрочено ${Math.abs(daysLeft)} дн.` : daysLeft === 0 ? 'сегодня' : `${daysLeft} дн.`}
              </span>
            </div>
          )}
          
          {/* Критерии (компактно) */}
          {goalCriteria.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Критерии</p>
              {goalCriteria.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: COLORS.bg, borderRadius: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: COLORS.text, flex: 1 }}>{c.name}</span>
                  {c.type === 'numeric' ? (
                    editingActual === c.id ? (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input type="number" value={newActualValue} onChange={(e) => setNewActualValue(e.target.value)} style={{ width: '60px', padding: '4px 8px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: COLORS.text, fontSize: '12px' }} autoFocus />
                        <button onClick={() => handleUpdateActual(c)} style={{ padding: '4px 8px', background: COLORS.gold, border: 'none', borderRadius: '6px', color: COLORS.bg, fontSize: '11px', cursor: 'pointer' }}>OK</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingActual(c.id); setNewActualValue(String(c.actualValue || '')); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <span style={{ fontSize: '13px', color: COLORS.gold, fontWeight: '500' }}>{c.actualValue || 0}/{c.targetValue} {c.unit}</span>
                      </button>
                    )
                  ) : (
                    <button onClick={() => handleToggleCriteria(c)} style={{ width: '20px', height: '20px', background: c.isCompleted ? COLORS.success : 'transparent', border: `2px solid ${c.isCompleted ? COLORS.success : COLORS.textDark}`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {c.isCompleted && <Check style={{ width: '12px', height: '12px', color: COLORS.bg }} />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Награда */}
          {(goal.rewardText || goal.rewardImage) && (
            <div style={{ marginBottom: '16px', padding: '12px', background: COLORS.bg, borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><Award style={{ width: '12px', height: '12px' }} />Награда</p>
              {goal.rewardImage && <img src={goal.rewardImage} alt="Reward" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
              {goal.rewardText && <p style={{ fontSize: '13px', color: COLORS.text }}>{goal.rewardText}</p>}
            </div>
          )}

          {/* Кнопки действий */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onEdit} style={{ flex: 1, padding: '10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.text, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Edit3 style={{ width: '14px', height: '14px' }} />Изменить
            </button>
            <button onClick={onAchieve} style={{ flex: 1, padding: '10px', background: `${COLORS.success}20`, border: `1px solid ${COLORS.success}50`, borderRadius: '10px', color: COLORS.success, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Trophy style={{ width: '14px', height: '14px' }} />Достигнута
            </button>
            <button onClick={onArchive} style={{ padding: '10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.textMuted, cursor: 'pointer' }}>
              <Archive style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ФОРМА КРИТЕРИЯ
// ============================================
const CriteriaForm = ({ onSave, onClose, existingCriteria }) => {
  const [type, setType] = useState(existingCriteria?.type || 'numeric');
  const [name, setName] = useState(existingCriteria?.name || '');
  const [numericType, setNumericType] = useState(existingCriteria?.numericType || 'count');
  const [customUnit, setCustomUnit] = useState(existingCriteria?.unit || '');
  const [targetValue, setTargetValue] = useState(existingCriteria?.targetValue || '');

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const selectedNumeric = NUMERIC_TYPES.find(n => n.id === numericType);
  const unit = numericType === 'custom' ? customUnit : selectedNumeric?.unit || '';

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: existingCriteria?.id || `criteria_${Date.now()}`,
      type, name,
      numericType: type === 'numeric' ? numericType : null,
      unit: type === 'numeric' ? unit : null,
      targetValue: type === 'numeric' ? Number(targetValue) || 0 : null,
      actualValue: existingCriteria?.actualValue || 0,
      isCompleted: existingCriteria?.isCompleted || false,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Тип критерия</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CRITERIA_TYPES.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} style={{ padding: '12px 16px', background: type === t.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${type === t.id ? COLORS.gold : COLORS.border}`, borderRadius: '12px', color: type === t.id ? COLORS.gold : COLORS.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontWeight: '600' }}>{t.label}</span><span style={{ color: COLORS.textMuted, marginLeft: '8px', fontSize: '12px' }}>— {t.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Название</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Выручка, Вес, Книг прочитано" style={inputStyle} />
      </div>
      {type === 'numeric' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Единица измерения</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {NUMERIC_TYPES.map((n) => (
                <button key={n.id} onClick={() => setNumericType(n.id)} style={{ padding: '10px 14px', background: numericType === n.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${numericType === n.id ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: numericType === n.id ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>
                  {n.label} {n.unit && `(${n.unit})`}
                </button>
              ))}
            </div>
            {numericType === 'custom' && <input type="text" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="Своя единица" style={{ ...inputStyle, marginTop: '12px' }} />}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Целевое значение</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="0" style={{ ...inputStyle, flex: 1 }} />
              {unit && <span style={{ color: COLORS.textMuted, fontSize: '14px' }}>{unit}</span>}
            </div>
          </div>
        </>
      )}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{ flex: 1, padding: '16px', background: name.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: name.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: name.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// ФОРМА СОЗДАНИЯ ЦЕЛИ
// ============================================
const GoalForm = ({ dreams, criteria: allCriteria, onSave, onClose, existingGoal }) => {
  const [title, setTitle] = useState(existingGoal?.title || '');
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [icon, setIcon] = useState(existingGoal?.icon || '🎯');
  const [dreamId, setDreamId] = useState(existingGoal?.dreamId || dreams[0]?.id || '');
  const [priority, setPriority] = useState(existingGoal?.priority || 'none');
  const [deadline, setDeadline] = useState(existingGoal?.deadline || '');
  const [rewardText, setRewardText] = useState(existingGoal?.rewardText || '');
  const [rewardImage, setRewardImage] = useState(existingGoal?.rewardImage || null);
  const [criteria, setCriteria] = useState(existingGoal ? allCriteria.filter(c => c.goalId === existingGoal.id) : []);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState({ dream: false, measurable: false, realistic: false });

  const activeDreams = dreams.filter(d => d.status === 'active' && d.type === 'dream');
  const currentYear = new Date().getFullYear();
  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSubmit = () => {
    if (!title.trim() || !dreamId) return;
    if (!existingGoal) { setShowChecklist(true); return; }
    saveGoal();
  };

  const saveGoal = () => {
    const goalId = existingGoal?.id || `goal_${Date.now()}`;
    const goal = { id: goalId, title, description, icon, dreamId, year: currentYear, priority, deadline: deadline || null, rewardText: rewardText || null, rewardImage: rewardImage || null, status: 'active', createdAt: existingGoal?.createdAt || new Date().toISOString() };
    const goalCriteria = criteria.map(c => ({ ...c, goalId }));
    onSave(goal, goalCriteria);
  };

  const handleSaveCriteria = (newCriteria) => {
    if (editingCriteria) setCriteria(criteria.map(c => c.id === editingCriteria.id ? newCriteria : c));
    else setCriteria([...criteria, newCriteria]);
    setShowCriteriaForm(false); setEditingCriteria(null);
  };

  const handleDeleteCriteria = (id) => setCriteria(criteria.filter(c => c.id !== id));

  // Чек-лист с названием и описанием
  if (showChecklist) {
    const allChecked = checklist.dream && checklist.measurable && checklist.realistic;
    return (
      <div>
        <div style={{ padding: '16px', background: `${COLORS.gold}10`, borderRadius: '12px', marginBottom: '20px', border: `1px solid ${COLORS.gold}30` }}>
          <p style={{ fontSize: '12px', color: COLORS.goldDark, marginBottom: '8px' }}>Проверяем цель:</p>
          <p style={{ fontSize: '18px', color: COLORS.gold, fontWeight: '600', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>{icon} {title}</p>
          {description && <p style={{ fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.5' }}>{description}</p>}
        </div>
        <p style={{ color: COLORS.textMuted, marginBottom: '20px', fontSize: '14px' }}>Убедитесь, что цель соответствует критериям:</p>
        {[{ key: 'dream', label: 'Приближает к мечте?' }, { key: 'measurable', label: 'Есть измеримые показатели?' }, { key: 'realistic', label: 'Цель реалистична?' }].map((item) => (
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
          <button onClick={saveGoal} disabled={!allChecked} style={{ flex: 1, padding: '16px', background: allChecked ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: allChecked ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: allChecked ? 'pointer' : 'not-allowed' }}>Создать</button>
        </div>
      </div>
    );
  }

  if (showCriteriaForm) return <CriteriaForm existingCriteria={editingCriteria} onSave={handleSaveCriteria} onClose={() => { setShowCriteriaForm(false); setEditingCriteria(null); }} />;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Иконка</label>
        <button onClick={() => setShowIconPicker(!showIconPicker)} style={{ width: '64px', height: '64px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '16px', fontSize: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
        {showIconPicker && (
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: COLORS.bg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
            {GOAL_ICONS.map((i) => (
              <button key={i} onClick={() => { setIcon(i); setShowIconPicker(false); }} style={{ width: '44px', height: '44px', background: icon === i ? `${COLORS.gold}20` : 'transparent', border: `1px solid ${icon === i ? COLORS.gold : 'transparent'}`, borderRadius: '10px', fontSize: '24px', cursor: 'pointer' }}>{i}</button>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заработать 1 млн рублей" style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подробности цели..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Связанная мечта *</label>
        {activeDreams.length === 0 ? (
          <div style={{ padding: '16px', background: `${COLORS.danger}15`, borderRadius: '12px', border: `1px solid ${COLORS.danger}30` }}>
            <p style={{ color: COLORS.danger, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle style={{ width: '16px', height: '16px' }} />Сначала создайте мечту</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeDreams.map((d) => (
              <button key={d.id} onClick={() => setDreamId(d.id)} style={{ padding: '12px 16px', background: dreamId === d.id ? `${COLORS.gold}15` : COLORS.bg, border: `1px solid ${dreamId === d.id ? COLORS.gold : COLORS.border}`, borderRadius: '12px', color: dreamId === d.id ? COLORS.gold : COLORS.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}><Moon style={{ width: '16px', height: '16px' }} />{d.title}</button>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Приоритет</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {GOAL_PRIORITIES.map((p) => (
            <button key={p.id} onClick={() => setPriority(p.id)} style={{ flex: 1, padding: '12px 8px', background: priority === p.id ? `${p.id === 'strategic_focus' ? COLORS.redSoft : p.id === 'important' ? COLORS.yellowSoft : COLORS.bgCard}` : COLORS.bg, border: `1px solid ${priority === p.id ? p.color : COLORS.border}`, borderRadius: '10px', color: priority === p.id ? p.color : COLORS.textMuted, fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {p.hasIcon && <Lightbulb style={{ width: '16px', height: '16px', fill: p.iconFilled ? p.color : 'none' }} />}
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Дедлайн</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Критерии измеримости (до 3)</label>
        {criteria.map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: COLORS.bg, borderRadius: '12px', marginBottom: '8px', border: `1px solid ${COLORS.border}` }}>
            <div>
              <p style={{ color: COLORS.text, fontSize: '14px', fontWeight: '500' }}>{c.name}</p>
              <p style={{ color: COLORS.textMuted, fontSize: '12px' }}>{c.type === 'numeric' ? `${c.targetValue} ${c.unit}` : 'Текст + чекбокс'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setEditingCriteria(c); setShowCriteriaForm(true); }} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit3 style={{ width: '16px', height: '16px', color: COLORS.textMuted }} /></button>
              <button onClick={() => handleDeleteCriteria(c.id)} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}><X style={{ width: '16px', height: '16px', color: COLORS.danger }} /></button>
            </div>
          </div>
        ))}
        {criteria.length < 3 && (
          <button onClick={() => setShowCriteriaForm(true)} style={{ width: '100%', padding: '14px', background: COLORS.bg, border: `2px dashed ${COLORS.border}`, borderRadius: '12px', color: COLORS.textMuted, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Plus style={{ width: '18px', height: '18px' }} />Добавить критерий</button>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Награда за достижение</label>
        <input type="text" value={rewardText} onChange={(e) => setRewardText(e.target.value)} placeholder="Поездка на море, новый гаджет..." style={{ ...inputStyle, marginBottom: '12px' }} />
        <ImageUploader value={rewardImage} onChange={setRewardImage} />
      </div>
      <button onClick={handleSubmit} disabled={!title.trim() || !dreamId || activeDreams.length === 0} style={{ width: '100%', padding: '16px', background: (title.trim() && dreamId) ? `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)` : COLORS.bgCard, border: 'none', borderRadius: '12px', color: (title.trim() && dreamId) ? COLORS.bg : COLORS.textDark, fontSize: '16px', fontWeight: '600', cursor: (title.trim() && dreamId) ? 'pointer' : 'not-allowed', marginTop: '12px' }}>{existingGoal ? 'Сохранить' : 'Далее'}</button>
    </div>
  );
};

// ============================================
// ЗАЛ СЛАВЫ ЦЕЛЕЙ
// ============================================
const GoalHallOfFame = ({ goals, dreams, onClose }) => {
  const achievedGoals = goals.filter(g => g.status === 'achieved');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: COLORS.gold, fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', gap: '12px' }}><Trophy style={{ width: '28px', height: '28px' }} />Зал славы</h2>
          <button onClick={onClose} style={{ width: '40px', height: '40px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px', color: COLORS.text }} /></button>
        </div>
        {achievedGoals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Trophy style={{ width: '48px', height: '48px', color: COLORS.textDark, marginBottom: '16px' }} />
            <p style={{ color: COLORS.textMuted, fontSize: '15px' }}>Здесь будут ваши достигнутые цели</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {achievedGoals.map((goal) => {
              const dream = dreams.find(d => d.id === goal.dreamId);
              return (
                <div key={goal.id} style={{ background: COLORS.bgCard, borderRadius: '16px', padding: '16px', border: `1px solid ${COLORS.gold}30` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{goal.icon || '🎯'}</div>
                    <div>
                      <h3 style={{ color: COLORS.text, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{goal.title}</h3>
                      {dream && <p style={{ color: COLORS.gold, fontSize: '12px' }}>{dream.title}</p>}
                      {goal.achievedAt && <p style={{ color: COLORS.textMuted, fontSize: '11px', marginTop: '4px' }}>Достигнута {new Date(goal.achievedAt).toLocaleDateString('ru-RU')}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// ЭКРАН ЦЕЛЕЙ
// ============================================
export const StrategyScreen = ({ data, saveData }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [filterDreamId, setFilterDreamId] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [expandedGoalId, setExpandedGoalId] = useState(null);

  const currentYear = new Date().getFullYear();
  const activeGoals = data.goals.filter(g => g.status === 'active' && g.year === currentYear);
  const filteredGoals = filterDreamId === 'all' ? activeGoals : activeGoals.filter(g => g.dreamId === filterDreamId);
  const sortedGoals = sortGoals(filteredGoals, sortBy, data.dreams);
  const activeDreams = data.dreams.filter(d => d.status === 'active' && d.type === 'dream');

  const handleSaveGoal = (goal, goalCriteria) => {
    const existingIndex = data.goals.findIndex(g => g.id === goal.id);
    let newGoals;
    if (existingIndex >= 0) { newGoals = [...data.goals]; newGoals[existingIndex] = goal; }
    else newGoals = [...data.goals, goal];
    const otherCriteria = data.goalCriteria.filter(c => c.goalId !== goal.id);
    saveData({ ...data, goals: newGoals, goalCriteria: [...otherCriteria, ...goalCriteria] });
    setShowForm(false); setEditingGoal(null);
  };

  const handleUpdateCriteria = (updatedCriteria) => {
    const newCriteria = data.goalCriteria.map(c => c.id === updatedCriteria.id ? updatedCriteria : c);
    saveData({ ...data, goalCriteria: newCriteria });
  };

  const handleArchive = (goal) => saveData({ ...data, goals: data.goals.map(g => g.id === goal.id ? { ...g, status: 'archived' } : g) });
  const handleAchieve = (goal) => saveData({ ...data, goals: data.goals.map(g => g.id === goal.id ? { ...g, status: 'achieved', achievedAt: new Date().toISOString() } : g) });

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>Цели {currentYear}</h1>
          <button onClick={() => setShowHallOfFame(true)} style={{ width: '40px', height: '40px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trophy style={{ width: '18px', height: '18px', color: COLORS.gold }} /></button>
        </div>
        
        {/* Сортировка */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{ padding: '8px 14px', background: sortBy === opt.id ? `${COLORS.gold}20` : COLORS.bgCard, border: `1px solid ${sortBy === opt.id ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: sortBy === opt.id ? COLORS.gold : COLORS.textMuted, fontSize: '12px', cursor: 'pointer' }}>{opt.label}</button>
          ))}
        </div>
        
        {/* Фильтр по мечте */}
        {activeDreams.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            <button onClick={() => setFilterDreamId('all')} style={{ padding: '8px 16px', background: filterDreamId === 'all' ? `${COLORS.gold}20` : COLORS.bgCard, border: `1px solid ${filterDreamId === 'all' ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: filterDreamId === 'all' ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Все</button>
            {activeDreams.map((d) => (
              <button key={d.id} onClick={() => setFilterDreamId(d.id)} style={{ padding: '8px 16px', background: filterDreamId === d.id ? `${COLORS.gold}20` : COLORS.bgCard, border: `1px solid ${filterDreamId === d.id ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: filterDreamId === d.id ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}><Moon style={{ width: '12px', height: '12px' }} />{d.title}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {sortedGoals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Target style={{ width: '40px', height: '40px', color: COLORS.gold, opacity: 0.5 }} /></div>
            <h3 style={{ color: COLORS.text, fontSize: '18px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Нет целей</h3>
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>{activeDreams.length === 0 ? 'Сначала создайте мечту' : 'Добавьте свою первую цель'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                dream={data.dreams.find(d => d.id === goal.dreamId)} 
                criteria={data.goalCriteria} 
                onUpdateCriteria={handleUpdateCriteria} 
                onEdit={() => handleEditGoal(goal)}
                onArchive={() => handleArchive(goal)}
                onAchieve={() => handleAchieve(goal)}
                onExpand={setExpandedGoalId}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB скрывается когда есть развёрнутая цель */}
      {!expandedGoalId && (
        <button onClick={() => setShowForm(true)} disabled={activeDreams.length === 0} style={{ position: 'fixed', right: '20px', bottom: '100px', width: '56px', height: '56px', background: activeDreams.length > 0 ? `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)` : COLORS.bgCard, border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: activeDreams.length > 0 ? 'pointer' : 'not-allowed', boxShadow: activeDreams.length > 0 ? `0 8px 24px ${COLORS.gold}40` : 'none', opacity: activeDreams.length > 0 ? 1 : 0.5 }}>
          <Plus style={{ width: '24px', height: '24px', color: activeDreams.length > 0 ? COLORS.bg : COLORS.textDark }} />
        </button>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingGoal(null); }} title={editingGoal ? 'Редактировать цель' : 'Новая цель'}>
        <GoalForm dreams={data.dreams} criteria={data.goalCriteria} existingGoal={editingGoal} onSave={handleSaveGoal} onClose={() => { setShowForm(false); setEditingGoal(null); }} />
      </Modal>

      {showHallOfFame && <GoalHallOfFame goals={data.goals} dreams={data.dreams} onClose={() => setShowHallOfFame(false)} />}
    </div>
  );
};
