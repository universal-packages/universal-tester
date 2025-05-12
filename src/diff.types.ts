export type DiffResult = SameDiffResult | DifferentDiffResult | AddedDiffResult | RemovedDiffResult | ObjectDiffResult | ArrayDiffResult | CircularRefDiffResult

export interface SameDiffResult {
  type: 'same'
  value: any
}

export interface DifferentDiffResult {
  type: 'different'
  expected: any
  actual: any
}

export interface AddedDiffResult {
  type: 'added'
  value: any
}

export interface RemovedDiffResult {
  type: 'removed'
  value: any
}

export interface ObjectDiffResult {
  type: 'object'
  keys: Record<string, DiffResult>
}

export interface ArrayDiffResult {
  type: 'array'
  items: DiffResult[]
}

export interface CircularRefDiffResult {
  type: 'circular'
  path: string
  same: boolean
}
