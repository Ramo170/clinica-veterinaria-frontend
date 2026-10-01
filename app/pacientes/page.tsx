'use client';

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/services/api";

interface Paciente {
    id: number;
    nome: string;
    especie: string;
    raca: string;
    idade: number;
    nomeTutor: string;
    tutorId?: number;
}

interface Tutor {
    id: number;
    nome: string;
}

export default function PacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [tutores, setTutores] = useState<Tutor[]>([]);
    const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '', tutorId: ''});
    const [editandoId, setEditandoId] = useState <number | null>(null)
    const [erro, setErro] = useState('');

    const carregarDados = async () => {
        try{
            const [pacientesData, tutoresData] = await Promise.all([
                fetchApi<Paciente[]>('/pacientes'),
                fetchApi<Tutor[]>('tutores')
            ]);
            setPacientes(pacientesData);
            setTutores(tutoresData);
        } catch (err: unknown) {
            setErro(err instanceof Error ? err.message : 'Erro ao carregar dados');
        }
    };

    useEffect(() => {
        let montado = true;

        Promise.all([
            fetchApi<Paciente[]>('/paciente'),
            fetchApi<Tutor[]>('/tutores')
        ])
            .then(([pacientesData, tutoresData]) =>{
                if (montado) {
                    setPacientes(pacientesData);
                    setTutores(tutoresData);
                }
            })
        .catch((err: unknown) =>{
            if(montado) {
                setErro(err instanceof Error ? err.message : 'Erro ao carregar dados de pacientes');
            }
        });

        return () => {
            montado = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');

        const body = {
          ...form,
          idade: Number(form.idade),
          tutorId: Number(form.tutorId)
        }

        try{
          if (editandoId) {
            await fetchApi<Paciente>(`/paciente/${editandoId}`,{
              method: 'PUT',
              body: JSON.stringify(body),
            });
          }else{
            await fetchApi<Paciente>('/pacientes', {
                method: 'POST',
                body: JSON.stringify(body)
            });
          }
            setForm({nome: '', especie: '', raca: '', idade: '', tutorId: ''});
            setEditandoId(null);
            await carregarDados();
        } catch (err: unknown) {
            setErro(err instanceof Error ? err.message : 'Erro ao cadastrar paciente');
        }
    };

  const handleEditar = (p: Paciente) => {
    setEditandoId(p.id);
    setForm({
      nome: p.nome,
      especie: p.especie,
      raca: p.raca || '',
      idade: p.idade.toString(),
      tutorId: p.tutorId ? p.tutorId.toString() : ''
    });
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;
    try {
      await fetchApi(`/pacientes/${id}`, { method: 'DELETE' });
      await carregarDados();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao excluir paciente');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setForm({ nome: '', especie: '', raca: '', idade: '', tutorId: '' });
  };

    return (
 <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-emerald-100 pb-4">
          <h1 className="text-3xl font-bold text-emerald-800">Gerenciamento de Pacientes</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastre e gerencie os pets atendidos</p>
        </header>

        {erro && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Pet</label>
            <input
              type="text"
              placeholder="Ex: Rex"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Espécie</label>
            <input
              type="text"
              placeholder="Ex: Canina / Felina"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.especie}
              onChange={(e) => setForm({ ...form, especie: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Raça</label>
            <input
              type="text"
              placeholder="Ex: Poodle"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.raca}
              onChange={(e) => setForm({ ...form, raca: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Idade (anos)</label>
            <input
              type="number"
              placeholder="Ex: 3"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.idade}
              onChange={(e) => setForm({ ...form, idade: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tutor Responsável</label>
            <select
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.tutorId}
              onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
              required
            >
              <option value="">Selecione um tutor...</option>
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {editandoId ? "Salvar Alterações" : "Cadastrar Paciente"}
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

        <h2 className="text-xl font-bold mb-4 text-emerald-900">Pacientes Cadastrados</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 font-semibold border-b border-slate-200 text-sm">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Nome</th>
                <th className="p-3.5">Espécie</th>
                <th className="p-3.5">Raça</th>
                <th className="p-3.5">Idade</th>
                <th className="p-3.5">Tutor</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pacientes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-500 font-medium">{p.id}</td>
                  <td className="p-3.5 text-slate-900 font-semibold">{p.nome}</td>
                  <td className="p-3.5 text-slate-700">{p.especie}</td>
                  <td className="p-3.5 text-slate-700">{p.raca || '-'}</td>
                  <td className="p-3.5 text-slate-700">{p.idade} ano(s)</td>
                  <td className="p-3.5 text-slate-700">{p.nomeTutor || '-'}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditar(p)}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(p.id)}
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