import { TestError } from './TestError'

export class Assertion {
  public readonly value: any

  private expectNot: boolean = false

  public get not() {
    this.expectNot = true
    return this
  }

  public constructor(value: any) {
    this.value = value
  }

  public toBe(expected: any) {
    let expectedLocal: string = String(expected)
    let actualLocal: string = String(this.value)

    if (typeof expected === 'object' && expected !== null) {
      expectedLocal = 'Object'
    }

    if (typeof this.value === 'object' && this.value !== null) {
      actualLocal = 'Object'
    }

    if (Array.isArray(expected)) {
      expectedLocal = 'Array'
    }

    if (Array.isArray(this.value)) {
      actualLocal = 'Array'
    }

    if (this.expectNot) {
      if (this.value === expected)
        throw new TestError({
          message: `Expected {{expected}} not to be {{actual}}, but it was`,
          messageLocals: {
            expected: expectedLocal,
            actual: actualLocal
          },
          expected,
          actual: this.value
        })
    } else {
      if (this.value !== expected)
        throw new TestError({
          message: `Expected {{expected}} but got {{actual}}`,
          messageLocals: {
            expected: expectedLocal,
            actual: actualLocal
          },
          expected,
          actual: this.value
        })
    }
  }

  protected diff(expected: any, actual: any) {
    return this.diff(expected, actual)
  }
}
