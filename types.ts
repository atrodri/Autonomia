export type HistoryEvent =
  | { type: 'start' | 'checkpoint' | 'consumption' | 'finish' | 'trip'; value: number; date: string; }
  | { type: 'refuel'; value: number; date: string; pricePerLiter?: number; discount?: number; };


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