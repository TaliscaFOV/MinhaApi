export const formatarMoeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// "2026-10-30T00:00:00" → "30/10" (sem new Date → sem bug de fuso!)
export const formatarDiaMes = (iso: string) =>
  `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export const formatarDataHora = (iso: string) => {
  // "2026-10-30T14:30:00" → "30/10/2026 14:30" (sem new Date → sem bug de fuso)
  const [datePart, timePart] = iso.split('T')
  const [y, m, d] = datePart.split('-')
  const [h, min] = timePart?.split(':') ?? ['00', '00']
  return `${d}/${m}/${y} ${h}:${min}`
}