import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
  onEditar?: (produto: Produto) => void
  onExcluir?: (id: number) => void
  onUploadFoto?: (id: number, arquivo: File) => void | Promise<void>
  onRemoverFoto?: (id: number) => void | Promise<void>
}

function ProdutoList({
  produtos,
  loading,
  onEditar,
  onExcluir,
  onUploadFoto,
  onRemoverFoto
}: Props) {
  // Hooks sempre ANTES dos returns antecipados
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null)

  // Fecha o modal com ESC
  useEffect(() => {
    if (!produtoModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProdutoModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [produtoModal])

  if (loading) return <div className="management-loading">Carregando produtos...</div>
  if (produtos.length === 0) {
    return (
      <div className="management-empty">
        <span className="management-empty-icon" aria-hidden="true">▦</span>
        <strong>Nenhum produto cadastrado</strong>
        <p>Cadastre seu primeiro item usando o formulário.</p>
      </div>
    )
  }

  const handleExcluir = (id: number, e: MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      onExcluir?.(id)
    }
  }

  return (
    <>
      <ul className="management-record-list">
        {produtos.map(p => (
          <li className="management-record" key={p.id}>
            {p.fotoBase64 ? (
              <button
                type="button"
                onClick={() => setProdutoModal(p)}
                aria-label={`Ampliar foto de ${p.nome}`}
                style={{
                  position: 'relative', overflow: 'hidden',
                  width: 44, height: 44, padding: 0, border: 'none',
                  borderRadius: 8, cursor: 'pointer', flexShrink: 0,
                  background: '#f0f0f0'
                }}
              >
                <img
                  src={p.fotoBase64}
                  alt={p.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute', bottom: 2, right: 2,
                    background: 'rgba(0,0,0,0.55)', color: 'white',
                    borderRadius: '50%', width: 16, height: 16, fontSize: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  🔍
                </span>
              </button>
            ) : (
              <span className="management-record-avatar" aria-hidden="true">
                {p.nome.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="management-record-info">
              <strong>{p.nome}</strong>
              <span>Estoque: {p.estoque} unidades</span>
            </div>

            <div className="management-record-trailing">
              <span>{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <span className={`management-status${p.ativo ? '' : ' management-status--inactive'}`}>
                {p.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="management-record-actions">
              {onUploadFoto && (
                <label
                  className="management-action-btn"
                  title={p.fotoBase64 ? 'Trocar foto' : 'Adicionar foto'}
                  style={{ cursor: 'pointer' }}
                >
                  📷
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    hidden
                    onChange={async (e) => {
                      const arquivo = e.target.files?.[0]
                      e.target.value = '' // permite escolher o mesmo arquivo de novo
                      if (!arquivo) return
                      if (arquivo.size > 5 * 1024 * 1024) {
                        alert('Máximo: 5 MB.')
                        return
                      }
                      await onUploadFoto(p.id, arquivo)
                    }}
                  />
                </label>
              )}

              {onRemoverFoto && p.fotoBase64 && (
                <button
                  type="button"
                  className="management-action-btn"
                  onClick={() => onRemoverFoto(p.id)}
                  aria-label={`Remover foto de ${p.nome}`}
                  title="Remover foto"
                >
                  ✕
                </button>
              )}

              {onEditar && (
                <button
                  type="button"
                  className="management-action-btn management-action-btn--edit"
                  onClick={() => onEditar(p)}
                  aria-label={`Editar ${p.nome}`}
                >
                  ✎
                </button>
              )}
              {onExcluir && (
                <button
                  type="button"
                  className="management-action-btn management-action-btn--delete"
                  onClick={(e) => handleExcluir(p.id, e)}
                  aria-label={`Excluir ${p.nome}`}
                >
                  🗑
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {produtoModal?.fotoBase64 && (
        <div
          onClick={() => setProdutoModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto de ${produtoModal.nome}`}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, cursor: 'zoom-out'
          }}
        >
          <img
            src={produtoModal.fotoBase64}
            alt={produtoModal.nome}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }}
          />
        </div>
      )}
    </>
  )
  
}

export default ProdutoList