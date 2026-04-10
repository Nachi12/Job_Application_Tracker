import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface LoginFormState {
  email: string;
  password: string;
}

const INITIAL_STATE: LoginFormState = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();

  // 🔥 USE AUTH CONTEXT (IMPORTANT)
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormState>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      pushToast('error', 'All fields are required');
      return;
    }

    setLoading(true);

    try {
      // 🔥 USE CONTEXT LOGIN (NOT apiClient directly)
      await login(form.email, form.password);

      pushToast('success', 'Welcome back!');

      // 🔥 SAFE REDIRECT (no race condition)
      navigate('/applications', { replace: true });

    } catch (error) {
      console.error(error);
      pushToast('error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Login</h1>
          <p className="text-sm text-gray-500">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}