import React, { useState, useCallback } from 'react';
import type { Cycle, HistoryEvent, User, AuthView } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import CycleForm from './components/CycleForm';
import CycleView from './components/CycleView';
import HomeScreen from './components/HomeScreen';
import { Header } from './components/Header';
import ReportView from './components/ReportView';
import TripView from './components/TripView';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import AuthScreen from './components/AuthView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';

const recalculateCycleStateFromHistory = (initialCycleState: Cycle, updatedHistory: HistoryEvent[]) => {
  const sortedHistory = [...updatedHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let newCurrentMileage = initialCycleState.initialMileage;
  let newFuelAmount = 0;
  
  for(const event of sortedHistory) {
    if (event.type === 'start') continue;
    
    if (event.type === 'checkpoint') {
      newCurrentMileage = event.value;
    } else if (event.type === 'trip') {
      const tripStartMileage = newCurrentMileage;
      newCurrentMileage = tripStartMileage + event.value;
    } else if (event.type === 'refuel') {
      newFuelAmount += event.value;
    }
  }

  const finishEvent = sortedHistory.find(e => e.type === 'finish');
  if (finishEvent) {
    newCurrentMileage = Math.max(newCurrentMileage, finishEvent.value);
  }

  return {
    history: sortedHistory,
    currentMileage: newCurrentMileage,
    fuelAmount: newFuelAmount,
  };
};

const App: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('autonomia-plus-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('autonomia-plus-currentUser', null);
  const [authView, setAuthView] = useState<AuthView>('auth');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [cycles, setCycles] = useLocalStorage<Cycle[]>('autonomia-plus-cycles', []);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [reportCycleId, setReportCycleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isTrackingTrip, setIsTrackingTrip] = useState<boolean>(false);
  const [cycleToDeleteId, setCycleToDeleteId] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<HistoryEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<HistoryEvent | null>(null);
  const [tripToView, setTripToView] = useState<HistoryEvent | null>(null);
  
  const userCycles = currentUser ? cycles.filter(c => c.userId === currentUser.id) : [];

  const activeCycle = userCycles.find(c => c.id === activeCycleId);
  const reportCycle = userCycles.find(c => c.id === reportCycleId);
  const cycleToDelete = userCycles.find(c => c.id === cycleToDeleteId);
  const activeCycles = userCycles.filter(c => c.status === 'active');
  const finishedCycles = userCycles.filter(c => c.status === 'finished');
  
  const isHomeScreen = !isCreating && !activeCycle && !reportCycle && !isTrackingTrip && !tripToView;

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveCycleId(null);
    setReportCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
    setTripToView(null);
    setAuthView('auth');
  };
  
  const handleRegister = (newUser: Omit<User, 'id' | 'confirmed'>): boolean => {
    const usernameExists = users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase());
    if (usernameExists) {
      alert("Nome de usuário já existe.");
      return false;
    }
    const user: User = { ...newUser, id: generateUniqueId(), confirmed: false };
    setUsers([...users, user]);
    setRegistrationSuccess(true);
    setAuthView('login');
    return true;
  };

  const handleLogin = (username: string, password_raw: string): boolean => {
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (user && user.password === password_raw) {
          setCurrentUser(user);
          setRegistrationSuccess(false);
          return true;
      } else {
          return false;
      }
  };

  const handleStartCreation = () => {
    setIsCreating(true);
    setActiveCycleId(null);
    setReportCycleId(null);
    setIsTrackingTrip(false);
    setTripToView(null);
  };
  const handleCancelCreation = () => setIsCreating(false);

  const handleSelectCycle = (id: string) => {
    setActiveCycleId(id);
    setReportCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
    setTripToView(null);
  };
  
  const handleSelectReport = (id: string) => {
    setReportCycleId(id);
    setActiveCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
    setTripToView(null);
  };

  const handleGoHome = useCallback(() => {
    setActiveCycleId(null);
    setReportCycleId(null);
    setIsCreating(false);
    setIsTrackingTrip(false);
    setTripToView(null);
  }, []);

  const handleStartTrip = () => {
    setIsTrackingTrip(true);
  };

  const handleEndTrip = useCallback(() => {
    setIsTrackingTrip(false);
  }, []);

  const handleViewTrip = (event: HistoryEvent) => {
    if (event.type === 'trip') {
      setTripToView(event);
    }
  };

  const handleEndViewTrip = () => {
    setTripToView(null);
  };

  const generateUniqueId = () => new Date().toISOString() + Math.random().toString(36).substring(2, 9);

  const handleCreateCycle = useCallback((cycleData: Omit<Cycle, 'id' | 'userId' | 'currentMileage' | 'history' | 'status' | 'fuelAmount' | 'consumption'>) => {
    if (!currentUser) return;
    const newCycle: Cycle = {
      ...cycleData,
      id: generateUniqueId(),
      userId: currentUser.id,
      currentMileage: cycleData.initialMileage,
      fuelAmount: 0,
      consumption: 0,
      history: [{ id: generateUniqueId(), type: 'start', value: cycleData.initialMileage, date: new Date(cycleData.startDate).toISOString() }],
      status: 'active',
    };
    setCycles(prev => [...prev, newCycle]);
    setIsCreating(false);
    setActiveCycleId(newCycle.id);
  }, [setCycles, currentUser]);

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
        history: [...cycle.history, { id: generateUniqueId(), type: 'checkpoint', value: newMileage, date }],
      };
    });
  }, [activeCycleId, setCycles]);
  
  const handleAddTripCheckpoint = useCallback((distance: number, date: string, routeData: { origin: any, destination: any }) => {
    updateActiveCycle(cycle => {
      const newMileage = cycle.currentMileage + distance;
      return {
        ...cycle,
        currentMileage: newMileage,
        history: [...cycle.history, { 
          id: generateUniqueId(), 
          type: 'trip', 
          value: distance, 
          date,
          origin: routeData.origin,
          destination: routeData.destination,
        }],
      };
    });
  }, [activeCycleId, setCycles]);


  const handleRefuel = useCallback((data: { fuelAdded: number; date: string; pricePerLiter?: number; discount?: number; }) => {
    updateActiveCycle(cycle => ({
      ...cycle,
      fuelAmount: cycle.fuelAmount + data.fuelAdded,
      history: [...cycle.history, { 
        id: generateUniqueId(),
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
      history: [...cycle.history, { id: generateUniqueId(), type: 'consumption', value: newConsumption, date }],
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
              id: generateUniqueId(),
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

  const handleRequestDeleteCycle = (id: string) => {
    setCycleToDeleteId(id);
  };

  const handleCancelDelete = () => {
    setCycleToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (!cycleToDeleteId) return;
    setCycles(prev => prev.filter(c => c.id !== cycleToDeleteId));
    
    if (activeCycleId === cycleToDeleteId) {
      handleGoHome();
    }
    setCycleToDeleteId(null);
  };

  const handleStartEditEvent = (event: HistoryEvent) => {
    setEventToEdit(event);
  };

  const handleCancelEditEvent = () => {
    setEventToEdit(null);
  };

  const handleSaveEditEvent = (updatedEvent: HistoryEvent) => {
    if (!activeCycleId || !eventToEdit) return;

    updateActiveCycle(cycle => {
      const updatedHistory = cycle.history.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      const recalculatedState = recalculateCycleStateFromHistory(cycle, updatedHistory);
      
      return {
        ...cycle,
        ...recalculatedState,
      };
    });

    setEventToEdit(null);
  };

  const handleRequestDeleteEvent = (event: HistoryEvent) => {
    setEventToDelete(event);
  };

  const handleCancelDeleteEvent = () => {
    setEventToDelete(null);
  };

  const handleConfirmDeleteEvent = () => {
    if (!activeCycleId || !eventToDelete) return;
    
    updateActiveCycle(cycle => {
        const updatedHistory = cycle.history.filter(e => e.id !== eventToDelete.id);
        const recalculatedState = recalculateCycleStateFromHistory(cycle, updatedHistory);

        return {
            ...cycle,
            ...recalculatedState,
        };
    });

    setEventToDelete(null);
  };

  if (!currentUser) {
    let authContent;
    switch(authView) {
      case 'login':
        authContent = <LoginView onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} registrationSuccess={registrationSuccess} />;
        break;
      case 'register':
        authContent = <RegisterView onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />;
        break;
      default:
        authContent = <AuthScreen onLoginClick={() => setAuthView('login')} onRegisterClick={() => setAuthView('register')} />;
    }
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#CFCFCF] flex items-center justify-center p-4">
        {authContent}
      </div>
    );
  }

  const renderContent = () => {
    if (isCreating) {
      return <CycleForm onSubmit={handleCreateCycle} onCancel={handleCancelCreation} />;
    }

    if (tripToView) {
        return <TripView onEndTrip={handleEndViewTrip} tripToView={tripToView} />;
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
          onViewTrip={handleViewTrip}
          onStartEditEvent={handleStartEditEvent}
          eventToEdit={eventToEdit}
          onCancelEditEvent={handleCancelEditEvent}
          onSaveEditEvent={handleSaveEditEvent}
          onRequestDeleteEvent={handleRequestDeleteEvent}
        />
      );
    }

    return (
      <HomeScreen
        fullName={currentUser.fullName}
        activeCycles={activeCycles}
        finishedCycles={finishedCycles}
        onNewCycleClick={handleStartCreation}
        onSelectCycle={handleSelectCycle}
        onSelectReport={handleSelectReport}
        onDeleteCycle={handleRequestDeleteCycle}
      />
    );
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#CFCFCF] flex flex-col">
      {isTrackingTrip || tripToView ? null : <Header username={currentUser.username} onLogout={handleLogout} />}
      <main className={`container mx-auto p-4 md:p-6 flex-grow ${isHomeScreen ? 'flex items-center' : ''} ${isTrackingTrip || tripToView ? '!p-0 !max-w-none' : ''}`}>
        {renderContent()}
      </main>
      <Modal isOpen={!!cycleToDelete} onClose={handleCancelDelete} title="Confirmar Exclusão">
        {cycleToDelete && (
          <div className="space-y-4">
            <p>Você tem certeza que deseja excluir o ciclo "{cycleToDelete.name}"?</p>
            <p className="text-sm text-[#888]">Esta ação é permanente e não poderá ser desfeita.</p>
            <div className="pt-2 flex gap-4 flex-col-reverse sm:flex-row">
              <Button variant="secondary" onClick={handleCancelDelete} className="w-full">Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmDelete} className="w-full">Excluir</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!eventToDelete} onClose={handleCancelDeleteEvent} title="Confirmar Exclusão">
        {eventToDelete && (
          <div className="space-y-4">
            <p>Você tem certeza que deseja excluir este evento?</p>
            <p className="text-sm text-[#888]">Esta ação recalculará o estado do ciclo e não poderá ser desfeita.</p>
            <div className="pt-2 flex gap-4 flex-col-reverse sm:flex-row">
              <Button variant="secondary" onClick={handleCancelDeleteEvent} className="w-full">Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmDeleteEvent} className="w-full">Excluir</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;