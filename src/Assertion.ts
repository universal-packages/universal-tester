import { TestError } from './TestError'
import { diff } from './diff'

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
    if (this.expectNot) {
      if (this.value === expected)
        throw new TestError({
          message: `Expected {{expected}} not to be {{actual}}, but it was`,
          messageLocals: {
            expected: this.getMessageLocalName(expected),
            actual: this.getMessageLocalName(this.value)
          },
          expected,
          actual: this.value
        })
    } else {
      if (this.value !== expected)
        throw new TestError({
          message: `Expected {{expected}} but got {{actual}}`,
          messageLocals: {
            expected: this.getMessageLocalName(expected),
            actual: this.getMessageLocalName(this.value)
          },
          expected,
          actual: this.value
        })
    }
  }

  public toEqual(expected: any) {
    const difference = this.diff(expected, this.value)

    if (this.expectNot) {
      if (difference.same) {
        throw new TestError({
          message: 'Expected {{expected}} not to equal {{actual}}, but it did',
          messageLocals: {
            expected: this.getMessageLocalName(expected),
            actual: this.getMessageLocalName(this.value)
          },
          expected,
          actual: this.value,
          difference
        })
      }
    } else {
      if (!difference.same) {
        let message: string = 'Expected {{expected}} to equal {{actual}}'
        let messageLocals: Record<string, string> = {
          expected: this.getMessageLocalName(expected),
          actual: this.getMessageLocalName(this.value)
        }

        if (difference.type === 'object') {
          message = 'Expected objects to be equal, but they were not'
          messageLocals = {}
        }

        if (difference.type === 'array') {
          message = 'Expected arrays to be equal, but they were not'
          messageLocals = {}
        }

        throw new TestError({
          message,
          messageLocals,
          expected,
          actual: this.value,
          difference
        })
      }
    }
  }

  protected diff(expected: any, actual: any) {
    return diff(expected, actual)
  }

  protected getMessageLocalName(value: any) {
    if (Array.isArray(value)) return 'Array'
    if (typeof value === 'object' && value !== null) return 'Object'

    return String(value)
  }
}
