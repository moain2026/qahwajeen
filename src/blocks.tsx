/** Tiny shared helpers: inline icon + prefilled WhatsApp link. */
import { raw } from './icons'
import { BRAND } from './data'

export const Ico = ({ n }: { n: string }) => <span dangerouslySetInnerHTML={{ __html: raw(n) }} />
export const wa = (msg: string) => `${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`
