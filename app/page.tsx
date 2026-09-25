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

  const buscarClinicas = async () => {
    try {
      const data = await fetchApi<Clinica[]>('/clinicas');
      setClinicas(data);
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar clínicas';
      setErro(mensagem);
    }
  };


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
      <h1 className="text-2xl font-bold mb-6 text-white">Gerenciamento de Clínicas</h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Clínica</label>
          <input
            type="text"
            placeholder="Ex: Clínica Vet Cuidar"
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <input
            type="text"
            placeholder="00.000.000/0000-00"
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="text"
            placeholder="(87) 99999-9999"
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            type="text"
            placeholder="Rua, Número, Bairro"
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          className="col-span-2 bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 transition-colors mt-2"
        >
          Cadastrar Clínica
        </button>
      </form>

      {/* Tabela de Listagem */}
      <h2 className="text-xl font-semibold mb-4 text-white">Clínicas Cadastradas</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-900 font-bold border-b border-gray-300">
              <th className="p-3 border-r border-gray-300">ID</th>
              <th className="p-3 border-r border-gray-300">Nome</th>
              <th className="p-3 border-r border-gray-300">CNPJ</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">Endereço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {clinicas.map((c) => (
              <tr key={c.id} className="hover:bg-gray-800 transition-colors">
                <td className="p-3 border-r border-gray-700 text-gray-200 font-medium">{c.id}</td>
                <td className="p-3 border-r border-gray-700 text-gray-200">{c.nome}</td>
                <td className="p-3 border-r border-gray-700 text-gray-200">{c.cnpj}</td>
                <td className="p-3 border-r border-gray-700 text-gray-200">{c.telefone}</td>
                <td className="p-3 text-gray-200">{c.endereco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}