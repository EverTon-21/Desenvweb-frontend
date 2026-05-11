import axios from 'axios';

const API_URL = 'http://localhost:5151/api/categorias';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategorias = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getCategoria = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const criarCategoria = async (categoria) => {
  const response = await api.post('/', categoria);
  return response.data;
};

export const atualizarCategoria = async (id, categoria) => {
  const response = await api.put(`/${id}`, categoria);
  return response.data;
};

export const deletarCategoria = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
