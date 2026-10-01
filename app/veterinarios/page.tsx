'use client';

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/src/services/api";

interface Veterinario {
  id: number;
  nome: string;
  crmv: string;
  especialidade: string;
  nomeClinica?: string;
  clinicaId?: number;
}

interface Clinica {
  id: number;
  nome: string;
}

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [form, setForm] = useState({ nome: '', crmv: '', especialidade: '', clinicaId: '' });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      const [vetsData, clinicasData] = await Promise.all([
        fetchApi<Veterinario[]>('/veterinarios'),
        fetchApi<Clinica[]>('/clinicas')
      ]);
      setVeterinarios(vetsData);
      setClinicas(clinicasData);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar dados');
    }
  }, []);

  useEffect(() => {
    let montado = true;

    Promise.all([
      fetchApi<Veterinario[]>('/veterinarios'),
      fetchApi<Clinica[]>('/clinicas')
    ])
      .then(([vetsData, clinicasData]) => {
        if (montado) {
          setVeterinarios(vetsData);
          setClinicas(clinicasData);
        }
      })
      .catch((err: unknown) => {
        if (montado) {
          setErro(err instanceof Error ? err.message : 'Erro ao carregar dados de veterinários');
        }
      });

    return () => {
      montado = false;
    };
  }, []);  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    const payload = {
      ...form,
      clinicaId: Number(form.clinicaId)
    };

    try {
      if (editandoId) {
        await fetchApi<Veterinario>(`/veterinarios/${editandoId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi<Veterinario>('/veterinarios', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setForm({ nome: '', crmv: '', especialidade: '', clinicaId: '' });
      setEditandoId(null);
      await carregarDados();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar veterinário');
    }
  };

  const handleEditar = (v: Veterinario) => {
    setEditandoId(v.id);
    setForm({
      nome: v.nome,
      crmv: v.crmv,
      especialidade: v.especialidade || '',
      clinicaId: v.clinicaId ? v.clinicaId.toString() : ''
    });
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este veterinário?")) return;
    try {
      await fetchApi(`/veterinarios/${id}`, { method: 'DELETE' });
      await carregarDados();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao excluir veterinário');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setForm({ nome: '', crmv: '', especialidade: '', clinicaId: '' });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-emerald-100 pb-4">
          <h1 className="text-3xl font-bold text-emerald-800">Gerenciamento de Veterinários</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie a equipe médica e especialidades</p>
        </header>

        {erro && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: Dra. Ana Silva"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">CRMV</label>
            <input
              type="text"
              placeholder="Ex: CRMV-PE 12345"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.crmv}
              onChange={(e) => setForm({ ...form, crmv: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Especialidade</label>
            <input
              type="text"
              placeholder="Ex: Cirurgia"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.especialidade}
              onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Clínica</label>
            <select
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.clinicaId}
              onChange={(e) => setForm({ ...form, clinicaId: e.target.value })}
              required
            >
              <option value="">Selecione uma clínica...</option>
              {clinicas.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {editandoId ? "Salvar Alterações" : "Cadastrar Veterinário"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicao}
                className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-bold mb-4 text-emerald-900">Veterinários Cadastrados</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 font-semibold border-b border-slate-200 text-sm">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Nome</th>
                <th className="p-3.5">CRMV</th>
                <th className="p-3.5">Especialidade</th>
                <th className="p-3.5">Clínica</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {veterinarios.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-500 font-medium">{v.id}</td>
                  <td className="p-3.5 text-slate-900 font-semibold">{v.nome}</td>
                  <td className="p-3.5 text-slate-700">{v.crmv}</td>
                  <td className="p-3.5 text-slate-700">{v.especialidade || '-'}</td>
                  <td className="p-3.5 text-slate-700">{v.nomeClinica || '-'}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditar(v)}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(v.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}