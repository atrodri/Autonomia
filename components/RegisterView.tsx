import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import type { User } from '../types';

interface RegisterViewProps {
  onRegister: (newUser: Omit<User, 'id' | 'confirmed'>) => boolean;
  onSwitchToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    const success = onRegister({ fullName, username, email, password });
    if (success) {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return (
        <Card className="w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-[#FF6B00] mb-4">Verifique seu E-mail</h2>
            <p className="text-white mb-6">
                Enviamos um link de confirmação para <strong className="text-[#FF6B00]">{email}</strong>. Por favor, verifique sua caixa de entrada para ativar sua conta.
            </p>
            <Button onClick={onSwitchToLogin} className="w-full">Voltar para Login</Button>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-[#FF6B00] mb-6 text-center">Registrar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome e Sobrenome"
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
        />
        <Input
          label="Nome de Usuário"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          label="E-mail"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirmar Senha"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
          <Button type="button" variant="secondary" onClick={onSwitchToLogin} className="w-full">
            Cancelar
          </Button>
          <Button type="submit" className="w-full">Criar Conta</Button>
        </div>
        <div className="pt-2 text-center text-sm text-[#888]">
            Já tem uma conta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[#FF6B00] hover:underline">
              Faça login
            </button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterView;