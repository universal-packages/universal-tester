import { ErrorDescriptor } from './TestError.types'

export class TestError extends Error {
  public readonly descriptor: ErrorDescriptor

  public constructor(descriptor: ErrorDescriptor) {
    super('Test error')
    this.descriptor = descriptor
  }
}
