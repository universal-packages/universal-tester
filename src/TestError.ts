import { ErrorDescriptor } from './TestError.types'

export class TestError extends Error {
  public override readonly message: string
  public readonly messageLocals: Record<string, string>
  public readonly expected: any
  public readonly actual: any
  public readonly difference?: string

  public constructor(descriptor: ErrorDescriptor) {
    super()
    this.message = descriptor.message
    this.messageLocals = descriptor.messageLocals
    this.expected = descriptor.expected
    this.actual = descriptor.actual
    this.difference = descriptor.difference
  }
}
