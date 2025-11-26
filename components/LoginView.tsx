import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface LoginViewProps {
  onLogin: (username: string, password_raw: string) => boolean;
  onSwitchToRegister: () => void;
  registrationSuccess: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToRegister, registrationSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const loginSuccess = onLogin(username, password);
    if (!loginSuccess) {
      setError("Nome de usuário/senha incorretos.");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-[#FF6B00] mb-6 text-center">Login</h2>
      
      {registrationSuccess && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-300 text-sm rounded-md text-center">
            <p className="font-bold">Registro concluído!</p>
            <p>Por favor, faça login para continuar.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <div className="pt-2 space-y-2">
          <Button type="submit" className="w-full">Entrar</Button>
          <p className="text-center text-sm text-[#888]">
            Não tem uma conta?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-semibold text-[#FF6B00] hover:underline">
              Registre-se
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default LoginView;