// Local-only wallet with SWR helpers. Replace with real DB/payments later.

const KEY = "demo_wallet_balance"
const TX_KEY = "demo_wallet_tx" // reserved for future: transaction list

export type WalletTxStatus = "success" | "failed" | "cancelled"
export type WalletTxType = "recharge" | "deduction" | "adjustment"

export type WalletTransaction = {
  id: string
  type: WalletTxType
  amount: number // positive for recharge/adjustment, negative for deduction
  timestamp: number
  status: WalletTxStatus
  meta?: Record<string, any>
}

function readNumber(key: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  const num = raw ? Number(raw) : Number.NaN
  return Number.isFinite(num) ? num : fallback
}

function writeNumber(key: string, value: number) {
  if (typeof window === "undefined") return
  const rounded = Math.max(0, Math.round(value * 100) / 100)
  window.localStorage.setItem(key, String(rounded))
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export async function getWallet(): Promise<number> {
  return readNumber(KEY, 0)
}

export function addFunds(amount: number) {
  const current = readNumber(KEY, 0)
  const next = current + Math.max(0, amount)
  writeNumber(KEY, next)
}

export function deductPerMinute(perSecondCost: number): boolean {
  // return false if insufficient
  const current = readNumber(KEY, 0)
  const next = current - perSecondCost
  if (next < 0) {
    writeNumber(KEY, 0)
    return false
  }
  writeNumber(KEY, next)
  return true
}

export async function getTransactions(): Promise<WalletTransaction[]> {
  return readJSON<WalletTransaction[]>(TX_KEY, [])
}

export function addTransaction(tx: WalletTransaction) {
  const list = readJSON<WalletTransaction[]>(TX_KEY, [])
  list.unshift(tx)
  writeJSON(TX_KEY, list.slice(0, 200)) // keep recent 200
}

function uid(prefix = "tx"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function recordRecharge(amount: number, status: WalletTxStatus, meta?: Record<string, any>) {
  addTransaction({
    id: uid("rzp"),
    type: "recharge",
    amount: Math.max(0, Math.round(amount * 100) / 100),
    timestamp: Date.now(),
    status,
    meta,
  })
}

export function recordDeduction(amount: number, meta?: Record<string, any>) {
  addTransaction({
    id: uid("use"),
    type: "deduction",
    amount: -Math.max(0, Math.round(amount * 100) / 100),
    timestamp: Date.now(),
    status: "success",
    meta,
  })
}
