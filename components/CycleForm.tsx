import React, { useState } from 'react';
import type { Cycle } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CycleFormProps {
  onSubmit: (cycleData: Omit<Cycle, 'id' | 'currentMileage' | 'history' | 'status' | 'fuelAmount' | 'consumption'>) => void;
  onCancel: () => void;
}

const CycleForm: React.FC<CycleFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialMileage, setInitialMileage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !initialMileage) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    onSubmit({
      name,
      startDate,
      initialMileage: parseFloat(initialMileage),
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
        />
        <Input
          label="Data de Início"
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="Quilometragem Inicial (km)"
          id="initialMileage"
          type="number"
          step="0.1"
          min="0"
          value={initialMileage}
          onChange={(e) => setInitialMileage(e.target.value)}
          placeholder="Ex: 50000"
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