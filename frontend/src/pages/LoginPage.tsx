import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/AuthService'

function LoginPage() {
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState<string | null>(null)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Já logado? Não precisa ver o login
  if (isAuthenticated) return <Navigate to="/produtos" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      const resp = await authService.login({ email, senha })
      login(resp)
      navigate('/produtos')
    } catch {
      setErro('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-showcase">
        <div className="login-brand">
          <span className="login-brand-mark">M</span>
          <span>MinhaApp</span>
        </div>
        <div className="login-showcase-copy">
          <span>GESTÃO SIMPLES, NEGÓCIO EM DIA</span>
          <h1>Tudo que sua loja precisa, em um só lugar.</h1>
          <p>Cuide dos produtos, acompanhe suas vendas e mantenha seus clientes por perto.</p>
        </div>
        <span className="login-showcase-footer">Seu negócio, organizado.</span>
        <div className="login-showcase-decoration" aria-hidden="true" />
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <p className="management-eyebrow">BEM-VINDO DE VOLTA</p>
          <h2>Entre na sua conta</h2>
          <p className="login-form-intro">Informe seus dados para acessar o painel de gestão.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            {erro && <p className="login-error" role="alert">{erro}</p>}
            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="username" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" required />
            </div>
            <div className="login-field">
              <label htmlFor="senha">Senha</label>
              <input id="senha" type="password" autoComplete="current-password" value={senha}
                onChange={e => setSenha(e.target.value)} placeholder="Digite sua senha" required />
            </div>
            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
export default LoginPage