import axios from 'axios';

const API_URL = 'http://localhost:5151/api/detalhesproduto';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDetalhePorProduto = async (produtoId) => {
  const response = await api.get(`/produto/${produtoId}`);
  return response.data;
};

export const criarDetalhe = async (detalhe) => {
  const response = await api.post('/', detalhe);
  return response.data;
};

export const atualizarDetalhe = async (id, detalhe) => {
  const response = await api.put(`/${id}`, detalhe);
  return response.data;
};

export const deletarDetalhe = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
