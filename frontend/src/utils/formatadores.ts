export const formatarMoeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// "2026-10-30T00:00:00" → "30/10" (sem new Date → sem bug de fuso!)
export const formatarDiaMes = (iso: string) =>
  `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })