import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './component/Sidebar'
import ProdutoPage from './page/ProdutoPage'
import ClientePage from './page/ClientePage'
import VendaPage from './page/VendaPage'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/produtos" replace />} />
            <Route path="/produtos" element={<ProdutoPage />} />
            <Route path="/clientes" element={<ClientePage />} />
            <Route path="/vendas" element={<VendaPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App