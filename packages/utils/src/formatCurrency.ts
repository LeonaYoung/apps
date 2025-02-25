import Decimal from 'decimal.js'
import {toFixed} from './toFixed'

export function formatCurrency(
  value: Decimal | string | number,
  precision = 4
): string {
  const fixedValue = toFixed(
    typeof value === 'string' ? new Decimal(value) : value,
    precision
  )

  const n = fixedValue
  const p = n.indexOf('.')
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m
  )
}
