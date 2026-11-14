import { useState } from 'react'
import { ProdutoService } from '../../services/ProdutoService'

interface Props {
  produtoId:       number
  fotoBase64Atual?: string | null  // data URL atual (do servidor)
  onAtualizar:     () => void      // recarrega o produto no pai
}

function FotoUpload({ produtoId, fotoBase64Atual, onAtualizar }: Props) {
  const [arquivo,    setArquivo]    = useState<File | null>(null)
  const [preview,    setPreview]    = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro,       setErro]       = useState<string | null>(null)

  function handleSelecionar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setArquivo(file)
    setPreview(URL.createObjectURL(file)) // preview local, sem upload
  }

  async function handleSalvar() {
    if (!arquivo) return
    try {
      setCarregando(true); setErro(null)
      await ProdutoService.uploadFoto(produtoId, arquivo)
      setArquivo(null); setPreview(null)
      onAtualizar() // atualiza o pai (recarrega o produto)
    } catch {
      setErro('Erro ao salvar a foto.')
    } finally { setCarregando(false) }
  }

  async function handleRemover() {
    if (!window.confirm('Remover a foto do produto?')) return
    try {
      setCarregando(true)
      await ProdutoService.removerFoto(produtoId)
      onAtualizar()
    } catch {
      setErro('Erro ao remover a foto.')
    } finally { setCarregando(false) }
  }
  const imgSrc = preview ?? fotoBase64Atual ?? null

  return (
    <div style={{ border:'1px solid #e0e0e0',
                  borderRadius:8, padding:16, marginTop:16 }}>
      <h4 style={{ margin:'0 0 12px', color:'#1a3d5c' }}>
        📷 Foto do produto
      </h4>

      {imgSrc && (
        <img src={imgSrc} alt="Foto"
          style={{ width:120, height:120, objectFit:'cover',
                   borderRadius:8, display:'block', marginBottom:12 }} />
      )}

      {erro && <p style={{ color:'#e53935', fontSize:13 }}>{erro}</p>}

      <input type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleSelecionar}
        disabled={carregando} style={{ fontSize:13 }} />

      <div style={{ display:'flex', gap:8, marginTop:10 }}>
        {arquivo && (
          <button onClick={handleSalvar} disabled={carregando}>
            {carregando ? 'Salvando...' : '💾 Salvar foto'}
          </button>
        )}
        {fotoBase64Atual && !arquivo && (
          <button onClick={handleRemover} disabled={carregando}
            style={{ background:'#fdeded', color:'#e53935',
                     border:'1px solid #e53935', borderRadius:6,
                     padding:'4px 12px', cursor:'pointer' }}>
            🗑️ Remover foto
          </button>
        )}
      </div>
    </div>
  )
}
export default FotoUpload