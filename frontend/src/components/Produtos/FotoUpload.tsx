import { useState } from 'react'
import { produtoService } from '../../services/produtoService'

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
      await produtoService.uploadFoto(produtoId, arquivo)
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
      await produtoService.removerFoto(produtoId)
      onAtualizar()
    } catch {
      setErro('Erro ao remover a foto.')
    } finally { setCarregando(false) }
  }