
import React, { useState } from 'react';
import type { Cycle } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CycleFormProps {
  onSubmit: (cycleData: Omit<Cycle, 'id' | 'currentMileage' | 'history' | 'status' | 'fuelAmount' | 'consumption'> & { initialFuel?: number }) => void;
  onCancel: () => void;
}

const formatKilometerInput = (value: string): string => {
  if (!value) return '';
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  return new Intl.NumberFormat('pt-BR').format(parseInt(numericValue, 10));
};

const parseKilometerInput = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  return parseInt(formattedValue.replace(/\./g, ''), 10);
};

// Helper to get local ISO string for datetime-local input
const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

const CycleForm: React.FC<CycleFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(getLocalISOString());
  const [initialMileage, setInitialMileage] = useState('');
  const [initialFuel, setInitialFuel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMileage = parseKilometerInput(initialMileage);
    if (!name || !startDate || isNaN(parsedMileage) || parsedMileage <= 0) {
        alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
        return;
    }
    onSubmit({
      name,
      startDate: new Date(startDate).toISOString(), // Convert back to UTC ISO for storage
      initialMileage: parsedMileage,
      initialFuel: initialFuel ? parseFloat(initialFuel) : undefined,
    });
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-[#FF6B00] mb-6 text-center">Criar Novo Ciclo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do Ciclo"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Viagem para a praia"
          required
        />
        <Input
          label="Data e Hora de Início"
          id="startDate"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="Quilometragem Inicial (km)"
          id="initialMileage"
          type="text"
          inputMode="numeric"
          value={initialMileage}
          onChange={(e) => setInitialMileage(formatKilometerInput(e.target.value))}
          placeholder="Ex: 50.000"
          required
        />
        <Input
          label="Combustível Inicial no Tanque (L, opcional)"
          id="initialFuel"
          type="number"
          step="0.1"
          min="0"
          value={initialFuel}
          onChange={(e) => setInitialFuel(e.target.value)}
          placeholder="Ex: 15.5"
        />
        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
          <Button type="submit" className="w-full">
            Iniciar Ciclo
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CycleForm;
