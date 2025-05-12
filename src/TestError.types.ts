export interface ErrorDescriptor {
  message: string
  messageLocals: Record<string, string>
  expected: any
  actual: any
  difference?: string
}
