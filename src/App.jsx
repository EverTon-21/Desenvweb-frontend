// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProdutosPage from './components/produtos/ProdutosPage';
import CategoriasPage from './components/categorias/CategoriasPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/produtos" replace />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        {/* Leva 3: rota para Detalhes */}
        {/* <Route path="/detalhes" element={<DetalheProdutoPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
