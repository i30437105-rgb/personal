import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, ChevronLeft, ChevronRight, PiggyBank, Edit3, Trash2, X, Check, ChevronDown } from 'lucide-react';
import { COLORS } from '../constants';
import { Modal } from '../components/ui';

// ============================================
// КОНСТАНТЫ ФИНАНСОВ
// ============================================
const DEFAULT_INCOME_CATEGORIES = [
  { id: 'cat_salary', name: 'Зарплата', type: 'income' },
  { id: 'cat_freelance', name: 'Фриланс', type: 'income' },
  { id: 'cat_other_income', name: 'Прочие доходы', type: 'income' },
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'cat_food', name: 'Еда', type: 'expense' },
  { id: 'cat_transport', name: 'Транспорт', type: 'expense' },
  { id: 'cat_housing', name: 'Жильё', type: 'expense' },
  { id: 'cat_entertainment', name: 'Развлечения', type: 'expense' },
  { id: 'cat_other_expense', name: 'Прочее', type: 'expense' },
];

const DEFAULT_FUNDS = [
  { id: 'fund_emergency', name: 'Подушка безопасности', balance: 0, ruleType: 'percent', ruleValue: 10 },
  { id: 'fund_vacation', name: 'Отпуск', balance: 0, ruleType: 'fixed', ruleValue: 5000 },
];

// ============================================
// УТИЛИТЫ
// ============================================
const formatMoney = (amount) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
};

const getMonthName = (month, year) => {
  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  return `${months[month]} ${year}`;
};

// ============================================
// ФОРМА ТРАНЗАКЦИИ
// ============================================
const TransactionForm = ({ categories, funds, existingTransaction, onSave, onClose, onDelete }) => {
  const [type, setType] = useState(existingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(existingTransaction?.amount?.toString() || '');
  const [categoryId, setCategoryId] = useState(existingTransaction?.categoryId || '');
  const [comment, setComment] = useState(existingTransaction?.comment || '');
  const [date, setDate] = useState(existingTransaction?.date || new Date().toISOString().split('T')[0]);
  const [fundId, setFundId] = useState(existingTransaction?.fundId || '');

  const filteredCategories = categories.filter(c => c.type === type);

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSave = () => {
    if (!amount || !categoryId) return;
    onSave({
      id: existingTransaction?.id || `txn_${Date.now()}`,
      type, amount: parseFloat(amount), categoryId, comment, date, fundId: type === 'expense' ? fundId : null,
      createdAt: existingTransaction?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div>
      {/* Тип */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setType('income')} style={{ flex: 1, padding: '14px', background: type === 'income' ? `${COLORS.success}20` : COLORS.bg, border: `1px solid ${type === 'income' ? COLORS.success : COLORS.border}`, borderRadius: '12px', color: type === 'income' ? COLORS.success : COLORS.textMuted, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>Доход</button>
        <button onClick={() => setType('expense')} style={{ flex: 1, padding: '14px', background: type === 'expense' ? `${COLORS.danger}20` : COLORS.bg, border: `1px solid ${type === 'expense' ? COLORS.danger : COLORS.border}`, borderRadius: '12px', color: type === 'expense' ? COLORS.danger : COLORS.textMuted, fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>Расход</button>
      </div>

      {/* Сумма */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Сумма *</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={{ ...inputStyle, fontSize: '24px', textAlign: 'center', fontWeight: '600' }} />
      </div>

      {/* Категория */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Категория *</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filteredCategories.map((c) => (
            <button key={c.id} onClick={() => setCategoryId(c.id)} style={{ padding: '10px 16px', background: categoryId === c.id ? (type === 'income' ? `${COLORS.success}20` : `${COLORS.danger}20`) : COLORS.bg, border: `1px solid ${categoryId === c.id ? (type === 'income' ? COLORS.success : COLORS.danger) : COLORS.border}`, borderRadius: '20px', color: categoryId === c.id ? (type === 'income' ? COLORS.success : COLORS.danger) : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* Дата */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Дата</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
      </div>

      {/* Списание из фонда (для расходов) */}
      {type === 'expense' && funds.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Списать из фонда (опционально)</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setFundId('')} style={{ padding: '10px 16px', background: !fundId ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${!fundId ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: !fundId ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Без фонда</button>
            {funds.map((f) => (
              <button key={f.id} onClick={() => setFundId(f.id)} style={{ padding: '10px 16px', background: fundId === f.id ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${fundId === f.id ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: fundId === f.id ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>{f.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Комментарий */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Комментарий</label>
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Описание операции" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {existingTransaction && (
          <button onClick={() => onDelete(existingTransaction.id)} style={{ padding: '16px', background: `${COLORS.danger}20`, border: `1px solid ${COLORS.danger}50`, borderRadius: '12px', color: COLORS.danger, cursor: 'pointer' }}><Trash2 style={{ width: '18px', height: '18px' }} /></button>
        )}
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!amount || !categoryId} style={{ flex: 1, padding: '16px', background: (amount && categoryId) ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: (amount && categoryId) ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: (amount && categoryId) ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// ФОРМА ФОНДА
// ============================================
const FundForm = ({ existingFund, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(existingFund?.name || '');
  const [ruleType, setRuleType] = useState(existingFund?.ruleType || 'percent');
  const [ruleValue, setRuleValue] = useState(existingFund?.ruleValue?.toString() || '');

  const inputStyle = { width: '100%', padding: '14px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '16px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: existingFund?.id || `fund_${Date.now()}`,
      name, ruleType, ruleValue: ruleValue ? parseFloat(ruleValue) : null,
      balance: existingFund?.balance || 0,
      createdAt: existingFund?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Название *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название фонда" style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Правило пополнения</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button onClick={() => setRuleType('percent')} style={{ flex: 1, padding: '12px', background: ruleType === 'percent' ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${ruleType === 'percent' ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: ruleType === 'percent' ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>% от дохода</button>
          <button onClick={() => setRuleType('fixed')} style={{ flex: 1, padding: '12px', background: ruleType === 'fixed' ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${ruleType === 'fixed' ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: ruleType === 'fixed' ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Фикс. сумма</button>
          <button onClick={() => setRuleType('choice')} style={{ flex: 1, padding: '12px', background: ruleType === 'choice' ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${ruleType === 'choice' ? COLORS.gold : COLORS.border}`, borderRadius: '10px', color: ruleType === 'choice' ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Вручную</button>
        </div>
        {ruleType !== 'choice' && (
          <input type="number" value={ruleValue} onChange={(e) => setRuleValue(e.target.value)} placeholder={ruleType === 'percent' ? 'Процент' : 'Сумма'} style={inputStyle} />
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {existingFund && (
          <button onClick={() => onDelete(existingFund.id)} style={{ padding: '16px', background: `${COLORS.danger}20`, border: `1px solid ${COLORS.danger}50`, borderRadius: '12px', color: COLORS.danger, cursor: 'pointer' }}><Trash2 style={{ width: '18px', height: '18px' }} /></button>
        )}
        <button onClick={onClose} style={{ flex: 1, padding: '16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', color: COLORS.text, fontSize: '15px', cursor: 'pointer' }}>Отмена</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{ flex: 1, padding: '16px', background: name.trim() ? COLORS.gold : COLORS.bgCard, border: 'none', borderRadius: '12px', color: name.trim() ? COLORS.bg : COLORS.textDark, fontSize: '15px', fontWeight: '600', cursor: name.trim() ? 'pointer' : 'not-allowed' }}>Сохранить</button>
      </div>
    </div>
  );
};

// ============================================
// ЭКРАН ФИНАНСОВ
// ============================================
export const FinanceScreen = ({ data, saveData }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFundForm, setShowFundForm] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Инициализация
  useEffect(() => {
    if (!data.financeCategories) {
      saveData({ 
        ...data, 
        financeCategories: [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES],
        funds: DEFAULT_FUNDS,
        transactions: []
      });
    }
  }, [data, saveData]);

  const categories = data.financeCategories || [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];
  const funds = data.funds || DEFAULT_FUNDS;
  const transactions = data.transactions || [];

  // Фильтрация транзакций за месяц
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const totalFundsBalance = funds.reduce((sum, f) => sum + f.balance, 0);

  const handleSaveTransaction = (transaction) => {
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    let newTransactions;
    
    // Обновляем баланс фонда при необходимости
    let newFunds = [...funds];
    
    if (transaction.type === 'income') {
      // Автораспределение по фондам
      newFunds = funds.map(f => {
        let addition = 0;
        if (f.ruleType === 'percent' && f.ruleValue) {
          addition = (transaction.amount * f.ruleValue) / 100;
        } else if (f.ruleType === 'fixed' && f.ruleValue) {
          addition = f.ruleValue;
        }
        return { ...f, balance: f.balance + addition };
      });
    } else if (transaction.fundId) {
      // Списание из фонда
      newFunds = funds.map(f => 
        f.id === transaction.fundId ? { ...f, balance: Math.max(0, f.balance - transaction.amount) } : f
      );
    }

    if (existingIndex >= 0) {
      newTransactions = [...transactions];
      newTransactions[existingIndex] = transaction;
    } else {
      newTransactions = [...transactions, transaction];
    }
    
    saveData({ ...data, transactions: newTransactions, funds: newFunds });
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (transactionId) => {
    saveData({ ...data, transactions: transactions.filter(t => t.id !== transactionId) });
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleSaveFund = (fund) => {
    const existingIndex = funds.findIndex(f => f.id === fund.id);
    let newFunds;
    if (existingIndex >= 0) {
      newFunds = [...funds];
      newFunds[existingIndex] = fund;
    } else {
      newFunds = [...funds, fund];
    }
    saveData({ ...data, funds: newFunds });
    setShowFundForm(false);
    setEditingFund(null);
  };

  const handleDeleteFund = (fundId) => {
    saveData({ ...data, funds: funds.filter(f => f.id !== fundId) });
    setShowFundForm(false);
    setEditingFund(null);
  };

  const navigateMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const filteredTransactions = filterType === 'all' ? monthTransactions : monthTransactions.filter(t => t.type === filterType);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, paddingBottom: '100px' }}>
      <div style={{ padding: '20px', paddingTop: '60px', background: `linear-gradient(to bottom, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)` }}>
        {/* Навигация по месяцам */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={() => navigateMonth(-1)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft style={{ width: '24px', height: '24px', color: COLORS.textMuted }} />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: COLORS.text, fontFamily: 'Georgia, serif' }}>{getMonthName(selectedMonth, selectedYear)}</h1>
          <button onClick={() => navigateMonth(1)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronRight style={{ width: '24px', height: '24px', color: COLORS.textMuted }} />
          </button>
        </div>

        {/* Карточки доходов/расходов */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => { setFilterType('income'); setShowTransactions(true); }} style={{ flex: 1, padding: '16px', background: `${COLORS.success}15`, borderRadius: '16px', border: `1px solid ${COLORS.success}30`, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp style={{ width: '18px', height: '18px', color: COLORS.success }} />
              <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Доходы</span>
            </div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: COLORS.success }}>{formatMoney(totalIncome)}</p>
          </button>
          <button onClick={() => { setFilterType('expense'); setShowTransactions(true); }} style={{ flex: 1, padding: '16px', background: `${COLORS.danger}15`, borderRadius: '16px', border: `1px solid ${COLORS.danger}30`, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingDown style={{ width: '18px', height: '18px', color: COLORS.danger }} />
              <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Расходы</span>
            </div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: COLORS.danger }}>{formatMoney(totalExpense)}</p>
          </button>
        </div>

        {/* Баланс */}
        <div style={{ padding: '16px', background: COLORS.bg, borderRadius: '14px', border: `1px solid ${COLORS.border}`, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: COLORS.textMuted }}>Баланс месяца</span>
            <span style={{ fontSize: '24px', fontWeight: '600', color: balance >= 0 ? COLORS.success : COLORS.danger }}>{formatMoney(balance)}</span>
          </div>
        </div>
      </div>

      {/* Фонды */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text }}>Фонды</h2>
          <button onClick={() => { setEditingFund(null); setShowFundForm(true); }} style={{ padding: '8px 16px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '20px', color: COLORS.textMuted, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus style={{ width: '14px', height: '14px' }} />Добавить
          </button>
        </div>

        {/* Общий баланс фондов */}
        <div style={{ padding: '14px', background: `${COLORS.gold}15`, borderRadius: '12px', border: `1px solid ${COLORS.gold}30`, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PiggyBank style={{ width: '20px', height: '20px', color: COLORS.gold }} />
            <span style={{ fontSize: '14px', color: COLORS.textMuted }}>Всего в фондах</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '600', color: COLORS.gold }}>{formatMoney(totalFundsBalance)}</span>
        </div>

        {/* Список фондов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {funds.map((f) => (
            <div key={f.id} style={{ padding: '14px', background: COLORS.bgCard, borderRadius: '12px', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: COLORS.text, fontWeight: '500' }}>{f.name}</p>
                <p style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>
                  {f.ruleType === 'percent' ? `${f.ruleValue}% от дохода` : f.ruleType === 'fixed' ? `${formatMoney(f.ruleValue)} с дохода` : 'Вручную'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: COLORS.gold }}>{formatMoney(f.balance)}</span>
                <button onClick={() => { setEditingFund(f); setShowFundForm(true); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Edit3 style={{ width: '16px', height: '16px', color: COLORS.textMuted }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Последние операции */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text }}>Последние операции</h2>
            <button onClick={() => { setFilterType('all'); setShowTransactions(true); }} style={{ fontSize: '13px', color: COLORS.gold, background: 'none', border: 'none', cursor: 'pointer' }}>Все →</button>
          </div>
          
          {monthTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Wallet style={{ width: '48px', height: '48px', color: COLORS.textDark, margin: '0 auto 16px' }} />
              <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Нет операций за этот месяц</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {monthTransactions.slice(-5).reverse().map((t) => {
                const category = categories.find(c => c.id === t.categoryId);
                return (
                  <button key={t.id} onClick={() => { setEditingTransaction(t); setShowTransactionForm(true); }} style={{ padding: '12px 14px', background: COLORS.bgCard, borderRadius: '10px', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '14px', color: COLORS.text }}>{category?.name || 'Без категории'}</p>
                      {t.comment && <p style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>{t.comment}</p>}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: t.type === 'income' ? COLORS.success : COLORS.danger }}>
                      {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => { setEditingTransaction(null); setShowTransactionForm(true); }} style={{ position: 'fixed', right: '20px', bottom: '100px', width: '56px', height: '56px', background: `linear-gradient(135deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`, border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${COLORS.gold}40` }}>
        <Plus style={{ width: '24px', height: '24px', color: COLORS.bg }} />
      </button>

      {/* Модалка транзакции */}
      <Modal isOpen={showTransactionForm} onClose={() => { setShowTransactionForm(false); setEditingTransaction(null); }} title={editingTransaction ? 'Редактировать' : 'Новая операция'}>
        <TransactionForm categories={categories} funds={funds} existingTransaction={editingTransaction} onSave={handleSaveTransaction} onClose={() => { setShowTransactionForm(false); setEditingTransaction(null); }} onDelete={handleDeleteTransaction} />
      </Modal>

      {/* Модалка фонда */}
      <Modal isOpen={showFundForm} onClose={() => { setShowFundForm(false); setEditingFund(null); }} title={editingFund ? 'Редактировать фонд' : 'Новый фонд'}>
        <FundForm existingFund={editingFund} onSave={handleSaveFund} onClose={() => { setShowFundForm(false); setEditingFund(null); }} onDelete={handleDeleteFund} />
      </Modal>

      {/* Модалка списка транзакций */}
      <Modal isOpen={showTransactions} onClose={() => setShowTransactions(false)} title="Операции">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => setFilterType('all')} style={{ padding: '8px 16px', background: filterType === 'all' ? `${COLORS.gold}20` : COLORS.bg, border: `1px solid ${filterType === 'all' ? COLORS.gold : COLORS.border}`, borderRadius: '20px', color: filterType === 'all' ? COLORS.gold : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Все</button>
          <button onClick={() => setFilterType('income')} style={{ padding: '8px 16px', background: filterType === 'income' ? `${COLORS.success}20` : COLORS.bg, border: `1px solid ${filterType === 'income' ? COLORS.success : COLORS.border}`, borderRadius: '20px', color: filterType === 'income' ? COLORS.success : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Доходы</button>
          <button onClick={() => setFilterType('expense')} style={{ padding: '8px 16px', background: filterType === 'expense' ? `${COLORS.danger}20` : COLORS.bg, border: `1px solid ${filterType === 'expense' ? COLORS.danger : COLORS.border}`, borderRadius: '20px', color: filterType === 'expense' ? COLORS.danger : COLORS.textMuted, fontSize: '13px', cursor: 'pointer' }}>Расходы</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredTransactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: COLORS.textMuted, padding: '20px' }}>Нет операций</p>
          ) : (
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <button key={t.id} onClick={() => { setEditingTransaction(t); setShowTransactionForm(true); setShowTransactions(false); }} style={{ padding: '12px 14px', background: COLORS.bg, borderRadius: '10px', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '14px', color: COLORS.text }}>{category?.name}</p>
                    <p style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>{new Date(t.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: t.type === 'income' ? COLORS.success : COLORS.danger }}>
                    {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
};
