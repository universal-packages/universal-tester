export interface ErrorDescriptor {
  message: string
  expected: any
  actual: any
  difference?: string
}
