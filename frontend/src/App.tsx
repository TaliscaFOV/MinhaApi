import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ProdutoPage from './pages/ProdutoPage'
import ClientePage from './pages/ClientePage'
import VendaPage from './pages/VendaPage'

function Layout() {
  const { isAuthenticated } = useAuth()
  return (
    <div className={`app-shell${isAuthenticated ? '' : ' app-shell--public'}`}>
      {isAuthenticated && <Sidebar />}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={
            <ProtectedRoute><ProdutoPage /></ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute><ClientePage /></ProtectedRoute>
          } />
          <Route path="/vendas" element={
            <ProtectedRoute><VendaPage /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App