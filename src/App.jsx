import React, { useState } from 'react';
import { COLORS } from './constants';
import { useAppStorage } from './hooks';
import { PinScreen, BottomNav } from './components/navigation';
import { DreamScreen } from './screens/DreamScreen';
import { StrategyScreen } from './screens/StrategyScreen';
import { TacticsScreen } from './screens/TacticsScreen';
import { ActionScreen } from './screens/ActionScreen';
import { ProductivityScreen } from './screens/ProductivityScreen';
import { FinanceScreen } from './screens/FinanceScreen';

export default function App() {
  const { data, saveData, loading } = useAppStorage();
  const [activeTab, setActiveTab] = useState('dream');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (loading || !data) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: COLORS.bg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: `3px solid ${COLORS.gold}`, 
            borderTopColor: 'transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: COLORS.textMuted }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!data.pin) {
    return <PinScreen mode="create" onSetPin={(pin) => { saveData({ ...data, pin }); setIsAuthenticated(true); }} />;
  }
  
  if (!isAuthenticated) {
    return <PinScreen mode="verify" storedPin={data.pin} onSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dream': return <DreamScreen data={data} saveData={saveData} />;
      case 'strategy': return <StrategyScreen data={data} saveData={saveData} />;
      case 'tactics': return <TacticsScreen data={data} saveData={saveData} />;
      case 'action': return <ActionScreen data={data} saveData={saveData} />;
      case 'productivity': return <ProductivityScreen data={data} saveData={saveData} />;
      case 'finance': return <FinanceScreen data={data} saveData={saveData} />;
      default: return <DreamScreen data={data} saveData={saveData} />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh' }}>
      {renderScreen()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
