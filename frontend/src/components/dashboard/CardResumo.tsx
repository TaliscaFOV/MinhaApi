import { painel } from '../../utils/estilos'
import type { CSSProperties } from 'react'

interface Props {
  titulo: string
  valor: string
  icone: string
  destaque?: boolean   // prop opcional
}

function CardResumo({ titulo, valor, icone, destaque = false }: Props) {
  const baseStyle: CSSProperties = {
    ...painel,
    borderLeft: '6px solid #c8d400',
    background: destaque ? '#1a3d5c' : 'white',
    color: destaque ? 'white' : '#1a3d5c',
  }

  return (
    <div style={baseStyle}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>{icone} {titulo}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>{valor}</div>
    </div>
  )
}
export default CardResumo