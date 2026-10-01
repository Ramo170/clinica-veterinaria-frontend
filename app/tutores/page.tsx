'use client';

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/src/services/api";

interface Tutor {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
}

export default function TutoresPage() {
    const [ tutores, setTutores] = useState<Tutor[]>([]);
    const [ form, setForm] = useState({nome: '', cpf: '', telefone: '', email: ''});
    const [ editandoId, setEditandoId] = useState<number | null>(null);
    const [erro, setErro] = useState('');

    const buscarTutores = async () => {
        try{
            const data = await fetchApi<Tutor[]>('/tutores');
            setTutores(data);
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao carregar tutores';
            setErro(mensagem);
        }
    };

    useEffect(() => {
        let montado = true;
        fetchApi<Tutor[]>('/tutores')
        .then((data) => { if (montado) setTutores(data); })
        .catch((err: unknown) => {
            if (montado) setErro(err instanceof Error ? err.message : 'Erro ao carregar tutores');
        });
        return () => { montado = false; };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');

        try {
          if (editandoId){
            await fetchApi<Tutor>(`/tutores/${editandoId}`, {
              method: 'PUT',
              body: JSON.stringify(form),
            })
          } else{
            await fetchApi<Tutor>('tutores', {
                method: 'POST',
                body: JSON.stringify(form),
            });
          }

            setForm({ nome: '', cpf: '', telefone: '', email: ''});
            setEditandoId(null);
            await buscarTutores();
        } catch (err: unknown) {
            setErro(err instanceof Error ? err.message : 'Erro ao cadastrar tutor');
        }
    };

    const handleEditar = (tutor: Tutor) => {
      setEditandoId(tutor.id);
      setForm({
        nome: tutor.nome,
        cpf: tutor.cpf,
        telefone: tutor.telefone || '',
        email: tutor.email || ''
      });
    };

    const handleExcluir = async (id: number) => {
      if (!confirm('Tem certeza que deseja deletar este tutor?')) return;
      try {
        await fetchApi(`/tutores/${id}`, {method: 'DELETE'});
        await buscarTutores();
      } catch (err: unknown) {
        setErro(err instanceof Error ? err.message : 'Erro ao deletar tutor')
    }
  };

    const handleCancelarEdicao = () => {
      setEditandoId(null);
      setForm({ nome: '', cpf: '', telefone: '', email: ''});
    };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-emerald-100 pb-4">
          <h1 className="text-3xl font-bold text-emerald-800">Gerenciamento de Tutores</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastre e atualize os tutores dos pacientes</p>
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
              placeholder="Nome do tutor"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
            <input
              type="text"
              placeholder="(87) 99999-9999"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="tutor@email.com"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {editandoId ? "Salvar Alterações" : "Cadastrar Tutor"}
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

        <h2 className="text-xl font-bold mb-4 text-emerald-900">Tutores Cadastrados</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 font-semibold border-b border-slate-200 text-sm">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Nome</th>
                <th className="p-3.5">CPF</th>
                <th className="p-3.5">Telefone</th>
                <th className="p-3.5">E-mail</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tutores.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-500 font-medium">{t.id}</td>
                  <td className="p-3.5 text-slate-900 font-semibold">{t.nome}</td>
                  <td className="p-3.5 text-slate-700">{t.cpf}</td>
                  <td className="p-3.5 text-slate-700">{t.telefone || '-'}</td>
                  <td className="p-3.5 text-slate-700">{t.email || '-'}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditar(t)}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(t.id)}
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