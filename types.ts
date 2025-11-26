export type HistoryEvent =
  | { id: string; type: 'start' | 'checkpoint' | 'consumption' | 'finish'; value: number; date: string; }
  | { id: string; type: 'refuel'; value: number; date: string; pricePerLiter?: number; discount?: number; }
  | { 
      id: string; 
      type: 'route'; 
      value: number; 
      date: string; 
      origin?: any;
      destination?: any;
    };


export interface Cycle {
  id: string;
  name: string;
  startDate: string;
  initialMileage: number;
  currentMileage: number;
  fuelAmount: number;
  consumption: number;
  history: HistoryEvent[];
  status: 'active' | 'finished';
}

// FIX: Export the 'User' type, which was missing, causing an import error in RegisterView.tsx.
export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
}