import { useCallback, useEffect, useState } from 'react';
import { FileText, Loader, Save, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { useToast } from '../../hooks/useToast';
import {
  atualizarDetalhe,
  criarDetalhe,
  deletarDetalhe,
  getDetalhePorProduto,
} from '../../services/detalheProdutoService';

function DetalheModal({ isOpen, onClose, produto }) {
  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existe, setExiste] = useState(false);
  const [especificacoes, setEspecificacoes] = useState('');
  const [garantia, setGarantia] = useState('');
  const [paisDeOrigem, setPaisDeOrigem] = useState('');
  const [pesoGramas, setPesoGramas] = useState('');

  const toast = useToast();

  const limparFormulario = () => {
    setDetalhe(null);
    setExiste(false);
    setEspecificacoes('');
    setGarantia('');
    setPaisDeOrigem('');
    setPesoGramas('');
  };

  const preencherFormulario = (data) => {
    setDetalhe(data);
    setExiste(true);
    setEspecificacoes(data.especificacoes || '');
    setGarantia(data.garantia || '');
    setPaisDeOrigem(data.paisDeOrigem || '');
    setPesoGramas(data.pesoGramas?.toString() || '');
  };

  const carregarDetalhe = useCallback(async () => {
    if (!produto) return;

    try {
      setLoading(true);
      const data = await getDetalhePorProduto(produto.id);
      preencherFormulario(data);
    } catch (error) {
      if (error.response?.status === 404) {
        limparFormulario();
        return;
      }

      toast.error('Erro ao carregar detalhes do produto.');
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  }, [produto, toast]);

  useEffect(() => {
    if (isOpen && produto) {
      carregarDetalhe();
    }
  }, [isOpen, produto, carregarDetalhe]);

  const handleSalvar = async (e) => {
    e.preventDefault();

    const dados = {
      especificacoes,
      garantia,
      paisDeOrigem,
      pesoGramas: pesoGramas ? parseFloat(pesoGramas) : null,
      produtoId: produto.id,
    };

    try {
      if (existe && detalhe) {
        await atualizarDetalhe(detalhe.id, { ...dados, id: detalhe.id });
        toast.success('Detalhes atualizados com sucesso!');
      } else {
        await criarDetalhe(dados);
        toast.success('Detalhes cadastrados com sucesso!');
      }

      await carregarDetalhe();
    } catch (error) {
      toast.error('Erro ao salvar os detalhes.');
      console.error('Erro ao salvar detalhes:', error);
    }
  };

  const handleDeletar = async () => {
    if (!detalhe) return;

    try {
      await deletarDetalhe(detalhe.id);
      toast.success('Detalhes removidos com sucesso!');
      limparFormulario();
    } catch (error) {
      toast.error('Erro ao remover os detalhes.');
      console.error('Erro ao remover detalhes:', error);
    }
  };

  if (!produto) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes - ${produto.nome}`} size="lg">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">Carregando detalhes...</span>
        </div>
      ) : (
        <form onSubmit={handleSalvar} className="space-y-4">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              existe ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>
              {existe
                ? 'Este produto ja possui detalhes cadastrados. Edite abaixo.'
                : 'Este produto ainda nao possui detalhes. Preencha abaixo para cadastrar.'}
            </span>
          </div>

          <div>
            <label htmlFor="especificacoes" className="block text-sm font-medium text-gray-700 mb-1">
              Especificacoes Tecnicas
            </label>
            <textarea
              id="especificacoes"
              value={especificacoes}
              onChange={(e) => setEspecificacoes(e.target.value)}
              placeholder="Ex: Processador i7, RAM 16GB, SSD 512GB"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
            />
          </div>

          <div>
            <label htmlFor="garantia" className="block text-sm font-medium text-gray-700 mb-1">
              Garantia
            </label>
            <input
              id="garantia"
              type="text"
              value={garantia}
              onChange={(e) => setGarantia(e.target.value)}
              placeholder="Ex: 1 ano pelo fabricante"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paisDeOrigem" className="block text-sm font-medium text-gray-700 mb-1">
                Pais de Origem
              </label>
              <input
                id="paisDeOrigem"
                type="text"
                value={paisDeOrigem}
                onChange={(e) => setPaisDeOrigem(e.target.value)}
                placeholder="Ex: China"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="pesoGramas" className="block text-sm font-medium text-gray-700 mb-1">
                Peso (gramas)
              </label>
              <input
                id="pesoGramas"
                type="number"
                step="0.1"
                min="0"
                value={pesoGramas}
                onChange={(e) => setPesoGramas(e.target.value)}
                placeholder="Ex: 1850"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            {existe && (
              <button
                type="button"
                onClick={handleDeletar}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remover Detalhes
              </button>
            )}

            <div className="flex-1" />

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Fechar
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {existe ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default DetalheModal;
