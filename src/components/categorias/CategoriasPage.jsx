import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Tag } from 'lucide-react';
import {
  getCategorias,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from '../../services/categoriaService';
import { getProdutos } from '../../services/produtoService';
import { useToast } from '../../hooks/useToast';
import CategoriaTable from './CategoriaTable';
import CategoriaFormModal from './CategoriaFormModal';
import ConfirmDialog from '../ui/ConfirmDialog';

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaDeletando, setCategoriaDeletando] = useState(null);

  const toast = useToast();

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const [dadosCategorias, dadosProdutos] = await Promise.all([
        getCategorias(),
        getProdutos(),
      ]);
      setCategorias(dadosCategorias);
      setProdutos(dadosProdutos);
    } catch (error) {
      toast.error('Nao foi possivel carregar os dados. Verifique se a API esta rodando.');
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const produtosPorCategoria = (categoriaId) => {
    return produtos.filter((produto) => produto.categoriaId === categoriaId).length;
  };

  const handleNovo = () => {
    setCategoriaEditando(null);
    setIsFormModalOpen(true);
  };

  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setIsFormModalOpen(true);
  };

  const handleSalvar = async (categoria) => {
    try {
      if (categoriaEditando) {
        await atualizarCategoria(categoria.id, categoria);
        toast.success(`Categoria "${categoria.nome}" atualizada com sucesso!`);
      } else {
        await criarCategoria(categoria);
        toast.success(`Categoria "${categoria.nome}" cadastrada com sucesso!`);
      }
      setIsFormModalOpen(false);
      setCategoriaEditando(null);
      await carregarDados();
    } catch (error) {
      toast.error('Erro ao salvar a categoria.');
      console.error('Erro ao salvar:', error);
    }
  };

  const handleConfirmarDelete = (categoria) => {
    setCategoriaDeletando(categoria);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletar = async () => {
    try {
      await deletarCategoria(categoriaDeletando.id);
      toast.success(`Categoria "${categoriaDeletando.nome}" removida com sucesso!`);
      setIsDeleteDialogOpen(false);
      setCategoriaDeletando(null);
      await carregarDados();
    } catch (error) {
      const mensagem = error.response?.data?.mensagem || 'Erro ao deletar a categoria.';
      toast.error(mensagem);
      setIsDeleteDialogOpen(false);
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Categorias</h1>
            <p className="text-sm text-gray-500">
              {categorias.length}{' '}
              {categorias.length === 1 ? 'categoria cadastrada' : 'categorias cadastradas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={carregarDados}
            title="Recarregar lista"
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleNovo}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
          <span className="ml-3 text-gray-500">Carregando categorias...</span>
        </div>
      ) : (
        <CategoriaTable
          categorias={categorias}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditar={handleEditar}
          onDeletar={handleConfirmarDelete}
          produtosPorCategoria={produtosPorCategoria}
        />
      )}

      <CategoriaFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setCategoriaEditando(null);
        }}
        categoriaEditando={categoriaEditando}
        onSalvar={handleSalvar}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoriaDeletando(null);
        }}
        onConfirm={handleDeletar}
        title="Deletar Categoria"
        message={
          categoriaDeletando
            ? `Tem certeza que deseja excluir a categoria "${categoriaDeletando.nome}"? Categorias com produtos associados nao podem ser deletadas.`
            : ''
        }
      />
    </div>
  );
}

export default CategoriasPage;
