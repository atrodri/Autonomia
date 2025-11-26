export type HistoryEvent =
  | { id: string; type: 'start' | 'checkpoint' | 'consumption' | 'finish'; value: number; date: string; }
  | { id: string; type: 'refuel'; value: number; date: string; pricePerLiter?: number; discount?: number; }
  | { 
      id: string; 
      type: 'trip'; 
      value: number; 
      date: string; 
      origin?: any;
      destination?: any;
    };


export interface Cycle {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  initialMileage: number;
  currentMileage: number;
  fuelAmount: number;
  consumption: number;
  history: HistoryEvent[];
  status: 'active' | 'finished';
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password; // In a real app, this would be a hash.
  confirmed: boolean;
}

export type AuthView = 'auth' | 'login' | 'register';