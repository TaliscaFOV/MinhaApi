import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProdutosPage from './pages/ProdutosPage'
import ClientesPage from './pages/ClientesPage'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/produtos" replace />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App