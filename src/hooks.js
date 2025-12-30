import { useState, useEffect } from 'react';
import { getDefaultData } from './utils';

const STORAGE_KEY = 'planner_v15';

export const useAppStorage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Миграция данных если нужно
          const migrated = migrateData(parsed);
          setData(migrated);
        } else {
          setData(getDefaultData());
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setData(getDefaultData());
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const saveData = (newData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return { data, saveData, loading };
};

// Миграция данных при необходимости
const migrateData = (data) => {
  // Добавляем новые поля если их нет
  if (!data.actions) data.actions = [];
  if (!data.activities) data.activities = [];
  if (!data.sessions) data.sessions = [];
  if (!data.financeCategories) data.financeCategories = [];
  if (!data.funds) data.funds = [];
  if (!data.transactions) data.transactions = [];
  return data;
};
