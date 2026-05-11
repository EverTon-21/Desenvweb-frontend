import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

function CategoriaFormModal({ isOpen, onClose, categoriaEditando, onSalvar }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (categoriaEditando) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNome(categoriaEditando.nome || '');
        setDescricao(categoriaEditando.descricao || '');
      } else {
        setNome('');
        setDescricao('');
      }
    }
  }, [isOpen, categoriaEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoria = { nome, descricao };

    if (categoriaEditando) {
      categoria.id = categoriaEditando.id;
    }

    onSalvar(categoria);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nomeCategoria" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria
          </label>
          <input
            id="nomeCategoria"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Eletronicos"
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="descCategoria" className="block text-sm font-medium text-gray-700 mb-1">
            Descricao <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="descCategoria"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Produtos eletronicos e tecnologia"
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {categoriaEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoriaFormModal;
