import { useState } from 'react'
import { ProdutoService } from '../../services/ProdutoService'

interface Props {
  produtoId: number
  fotoBase64Atual?: string | null
  onAtualizar: () => void
}

function FotoUpload({ produtoId, fotoBase64Atual, onAtualizar }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function handleSelecionar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setArquivo(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSalvar() {
    if (!arquivo) return

    try {
      setCarregando(true)
      setErro(null)
      await ProdutoService.uploadFoto(produtoId, arquivo)
      setArquivo(null)
      setPreview(null)
      onAtualizar()
    } catch {
      setErro('Erro ao salvar a foto.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleRemover() {
    if (!window.confirm('Remover a foto do produto?')) return

    try {
      setCarregando(true)
      await ProdutoService.removerFoto(produtoId)
      onAtualizar()
    } catch {
      setErro('Erro ao remover a foto.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="foto-upload">
      <div className="foto-upload__preview">
        <img
          src={preview ?? fotoBase64Atual ?? undefined}
          alt="Foto do produto"
          style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
        />
      </div>

      <input type="file" accept="image/*" onChange={handleSelecionar} />

      {arquivo && (
        <button type="button" onClick={handleSalvar} disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar foto'}
        </button>
      )}

      {fotoBase64Atual && (
        <button type="button" onClick={handleRemover} disabled={carregando}>
          Remover foto
        </button>
      )}

      {erro && <p role="alert">{erro}</p>}
    </div>
  )
}

export default FotoUpload