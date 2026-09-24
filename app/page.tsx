'use client';

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/services/api";

interface Clinica {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  endereco: string;
}

export default function Home() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [form, setForm] = useState({ nome: '', cnpj: '', telefone: '', endereco: '' });
  const [erro, setErro] = useState('');

  // Função para recarregar as clínicas após ações de formulário (ex: submit)
  const buscarClinicas = async () => {
    try {
      const data = await fetchApi<Clinica[]>('/clinicas');
      setClinicas(data);
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar clínicas';
      setErro(mensagem);
    }
  };

  // Efeito isolado apenas para a carga inicial da página
  useEffect(() => {
    let montado = true;

    fetchApi<Clinica[]>('/clinicas')
      .then((data) => {
        if (montado) setClinicas(data);
      })
      .catch((err: unknown) => {
        if (montado) {
          const mensagem = err instanceof Error ? err.message : 'Erro ao carregar clínicas';
          setErro(mensagem);
        }
      });

    return () => {
      montado = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    try {
      await fetchApi<Clinica>('/clinicas', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setForm({ nome: '', cnpj: '', telefone: '', endereco: '' });
      await buscarClinicas();
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao cadastrar clínica';
      setErro(mensagem);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clínicas</h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border mb-8 grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome da Clínica"
          className="p-2 border rounded"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="CNPJ"
          className="p-2 border rounded"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          className="p-2 border rounded"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Endereço"
          className="p-2 border rounded"
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
          Cadastrar Clínica
        </button>
      </form>

      {/* Tabela de Listagem */}
      <h2 className="text-xl font-semibold mb-4">Clínicas Cadastradas</h2>
      <table className="w-full border-collapse border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">CNPJ</th>
            <th className="p-2 border">Telefone</th>
          </tr>
        </thead>
        <tbody>
          {clinicas.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{c.nome}</td>
              <td className="p-2 border">{c.cnpj}</td>
              <td className="p-2 border">{c.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}