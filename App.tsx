import React, { useState, useCallback } from 'react';
import type { Cycle } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import CycleForm from './components/CycleForm';
import CycleView from './components/CycleView';
import HomeScreen from './components/HomeScreen';
import { Header } from './components/Header';
import ReportView from './components/ReportView';
import TripView from './components/TripView';

const App: React.FC = () => {
  const [cycles, setCycles] = useLocalStorage<Cycle[]>('autonomia-plus-cycles', []);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [reportCycleId, setReportCycleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isTrackingTrip, setIsTrackingTrip] = useState<boolean>(false);

  const activeCycle = cycles.find(c => c.id === activeCycleId);
  const reportCycle = cycles.find(c => c.id === reportCycleId);
  const activeCycles = cycles.filter(c => c.status === 'active');
  const finishedCycles = cycles.filter(c => c.status === 'finished');
  
  const isHomeScreen = !isCreating && !activeCycle && !reportCycle && !isTrackingTrip;

  const handleStartCreation = () => {
    setIsCreating(true);
    setActiveCycleId(null);
    setReportCycleId(null);
    setIsTrackingTrip(false);
  };
  const handleCancelCreation = () => setIsCreating(false);

  const handleSelectCycle = (id: string) => {
    setActiveCycleId(id);
    setReportCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
  };
  
  const handleSelectReport = (id: string) => {
    setReportCycleId(id);
    setActiveCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
  };

  const handleGoHome = useCallback(() => {
    setActiveCycleId(null);
    setReportCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
  }, []);

  const handleStartTrip = () => {
    setIsTrackingTrip(true);
  };

  const handleEndTrip = useCallback(() => {
    setIsTrackingTrip(false);
  }, []);

  const handleCreateCycle = useCallback((cycleData: Omit<Cycle, 'id' | 'currentMileage' | 'history' | 'status' | 'fuelAmount' | 'consumption'>) => {
    const newCycle: Cycle = {
      ...cycleData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
      currentMileage: cycleData.initialMileage,
      fuelAmount: 0,
      consumption: 0,
      history: [{ type: 'start', value: cycleData.initialMileage, date: new Date(cycleData.startDate).toISOString() }],
      status: 'active',
    };
    setCycles(prev => [...prev, newCycle]);
    setIsCreating(false);
    setActiveCycleId(newCycle.id);
  }, [setCycles]);

  const updateActiveCycle = (updateFn: (cycle: Cycle) => Cycle) => {
    if (!activeCycleId) return;
    setCycles(prevCycles => prevCycles.map(c => (c.id === activeCycleId ? updateFn(c) : c)));
  };

  const handleAddCheckpoint = useCallback((newMileage: number, date: string) => {
    updateActiveCycle(cycle => {
      if (newMileage <= cycle.currentMileage) {
        alert("A nova quilometragem deve ser maior que a atual.");
        return cycle;
      }
      return {
        ...cycle,
        currentMileage: newMileage,
        history: [...cycle.history, { type: 'checkpoint', value: newMileage, date }],
      };
    });
  }, [activeCycleId, setCycles]);
  
  const handleAddTripCheckpoint = useCallback((distance: number, date: string) => {
    updateActiveCycle(cycle => {
      const newMileage = cycle.currentMileage + distance;
      return {
        ...cycle,
        currentMileage: newMileage,
        history: [...cycle.history, { type: 'trip', value: distance, date }],
      };
    });
  }, [activeCycleId, setCycles]);


  const handleRefuel = useCallback((data: { fuelAdded: number; date: string; pricePerLiter?: number; discount?: number; }) => {
    updateActiveCycle(cycle => ({
      ...cycle,
      fuelAmount: cycle.fuelAmount + data.fuelAdded,
      history: [...cycle.history, { 
        type: 'refuel', 
        value: data.fuelAdded, 
        date: data.date, 
        pricePerLiter: data.pricePerLiter, 
        discount: data.discount 
      }],
    }));
  }, [activeCycleId, setCycles]);

  const handleUpdateConsumption = useCallback((newConsumption: number, date: string) => {
    updateActiveCycle(cycle => ({
      ...cycle,
      consumption: newConsumption,
      history: [...cycle.history, { type: 'consumption', value: newConsumption, date }],
    }));
  }, [activeCycleId, setCycles]);

  const handleFinishCycle = useCallback(() => {
    const cycleToFinish = cycles.find(c => c.id === activeCycleId);
    if (!cycleToFinish || cycleToFinish.status === 'finished') return;

    setCycles(prevCycles => prevCycles.map(c => {
      if (c.id === activeCycleId) {
        return {
          ...c,
          status: 'finished' as 'finished',
          history: [
            ...c.history,
            {
              type: 'finish' as 'finish',
              value: c.currentMileage,
              date: new Date().toISOString()
            }
          ]
        };
      }
      return c;
    }));
  }, [activeCycleId, cycles, setCycles]);

  const renderContent = () => {
    if (isCreating) {
      return <CycleForm onSubmit={handleCreateCycle} onCancel={handleCancelCreation} />;
    }
    
    if (isTrackingTrip && activeCycle) {
      return <TripView cycle={activeCycle} onEndTrip={handleEndTrip} onAddCheckpoint={handleAddTripCheckpoint} />;
    }

    if (reportCycle) {
      return <ReportView cycle={reportCycle} onGoBack={handleGoHome} />;
    }

    if (activeCycle) {
      return (
        <CycleView
          cycle={activeCycle}
          onAddCheckpoint={handleAddCheckpoint}
          onRefuel={handleRefuel}
          onUpdateConsumption={handleUpdateConsumption}
          onFinishCycle={handleFinishCycle}
          onGoBack={handleGoHome}
          onStartTrip={handleStartTrip}
        />
      );
    }

    return (
      <HomeScreen
        activeCycles={activeCycles}
        finishedCycles={finishedCycles}
        onNewCycleClick={handleStartCreation}
        onSelectCycle={handleSelectCycle}
        onSelectReport={handleSelectReport}
      />
    );
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#CFCFCF] flex flex-col">
      {!isHomeScreen && <Header />}
      <main className={`container mx-auto p-4 md:p-6 flex-grow ${isHomeScreen ? 'flex items-center' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;