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

  public toBeNull() {
    if (this.expectNot) {
      if (this.value === null)
        throw new TestError({
          message: 'Expected value not to be null, but it was',
          messageLocals: {},
          expected: 'not null',
          actual: null
        })
    } else {
      if (this.value !== null)
        throw new TestError({
          message: 'Expected value to be null, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: null,
          actual: this.value
        })
    }
  }

  public toBeUndefined() {
    if (this.expectNot) {
      if (this.value === undefined)
        throw new TestError({
          message: 'Expected value not to be undefined, but it was',
          messageLocals: {},
          expected: 'not undefined',
          actual: undefined
        })
    } else {
      if (this.value !== undefined)
        throw new TestError({
          message: 'Expected value to be undefined, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: undefined,
          actual: this.value
        })
    }
  }

  public toBeDefined() {
    if (this.expectNot) {
      if (this.value !== undefined)
        throw new TestError({
          message: 'Expected value to be undefined, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: undefined,
          actual: this.value
        })
    } else {
      if (this.value === undefined)
        throw new TestError({
          message: 'Expected value to be defined, but it was undefined',
          messageLocals: {},
          expected: 'defined',
          actual: undefined
        })
    }
  }

  public toBeTruthy() {
    if (this.expectNot) {
      if (this.value)
        throw new TestError({
          message: 'Expected value to be falsy, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: 'falsy',
          actual: this.value
        })
    } else {
      if (!this.value)
        throw new TestError({
          message: 'Expected value to be truthy, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: 'truthy',
          actual: this.value
        })
    }
  }

  public toBeFalsy() {
    if (this.expectNot) {
      if (!this.value)
        throw new TestError({
          message: 'Expected value to be truthy, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: 'truthy',
          actual: this.value
        })
    } else {
      if (this.value)
        throw new TestError({
          message: 'Expected value to be falsy, but got {{actual}}',
          messageLocals: {
            actual: this.getMessageLocalName(this.value)
          },
          expected: 'falsy',
          actual: this.value
        })
    }
  }

  public toContain(item: any) {
    const isString = typeof this.value === 'string'
    const isArray = Array.isArray(this.value)

    if (!isString && !isArray) {
      throw new TestError({
        message: 'Expected a string or array, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'string or array',
        actual: this.value
      })
    }

    const contains = isString
      ? this.value.includes(item)
      : this.value.some((v: any) => v === item)

    if (this.expectNot) {
      if (contains)
        throw new TestError({
          message: 'Expected {{actual}} not to contain {{expected}}, but it did',
          messageLocals: {
            expected: this.getMessageLocalName(item),
            actual: this.getMessageLocalName(this.value)
          },
          expected: item,
          actual: this.value
        })
    } else {
      if (!contains)
        throw new TestError({
          message: 'Expected {{actual}} to contain {{expected}}, but it did not',
          messageLocals: {
            expected: this.getMessageLocalName(item),
            actual: this.getMessageLocalName(this.value)
          },
          expected: item,
          actual: this.value
        })
    }
  }

  public toHaveLength(length: number) {
    if (typeof this.value.length !== 'number') {
      throw new TestError({
        message: 'Expected value to have a length, but it does not',
        messageLocals: {},
        expected: 'value with length property',
        actual: this.value
      })
    }

    if (this.expectNot) {
      if (this.value.length === length)
        throw new TestError({
          message: 'Expected {{actual}} not to have length {{expected}}, but it did',
          messageLocals: {
            expected: String(length),
            actual: this.getMessageLocalName(this.value)
          },
          expected: length,
          actual: this.value.length
        })
    } else {
      if (this.value.length !== length)
        throw new TestError({
          message: 'Expected {{actual}} to have length {{expected}}, but got length {{actualLength}}',
          messageLocals: {
            expected: String(length),
            actual: this.getMessageLocalName(this.value),
            actualLength: String(this.value.length)
          },
          expected: length,
          actual: this.value.length
        })
    }
  }

  public toHaveProperty(path: string, value?: any) {
    const hasValue = arguments.length > 1
    const pathParts = path.split('.')
    let current = this.value
    let propertyExists = true

    for (const part of pathParts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        propertyExists = false
        break
      }
      if (!(part in current)) {
        propertyExists = false
        break
      }
      current = current[part]
    }

    if (this.expectNot) {
      if (!hasValue && propertyExists) {
        throw new TestError({
          message: 'Expected object not to have property {{path}}, but it did',
          messageLocals: {
            path
          },
          expected: `no property ${path}`,
          actual: current
        })
      }
      if (hasValue && propertyExists && this.diff(value, current).same) {
        throw new TestError({
          message: 'Expected property {{path}} not to equal {{expected}}, but it did',
          messageLocals: {
            path,
            expected: this.getMessageLocalName(value)
          },
          expected: value,
          actual: current
        })
      }
    } else {
      if (!propertyExists) {
        throw new TestError({
          message: 'Expected object to have property {{path}}, but it did not',
          messageLocals: {
            path
          },
          expected: `property ${path}`,
          actual: this.value
        })
      }
      if (hasValue && !this.diff(value, current).same) {
        throw new TestError({
          message: 'Expected property {{path}} to equal {{expected}}, but got {{actual}}',
          messageLocals: {
            path,
            expected: this.getMessageLocalName(value),
            actual: this.getMessageLocalName(current)
          },
          expected: value,
          actual: current
        })
      }
    }
  }

  public toBeGreaterThan(number: number) {
    if (typeof this.value !== 'number') {
      throw new TestError({
        message: 'Expected a number, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'number',
        actual: this.value
      })
    }

    if (this.expectNot) {
      if (this.value > number)
        throw new TestError({
          message: 'Expected {{actual}} not to be greater than {{expected}}, but it was',
          messageLocals: {
            expected: String(number),
            actual: String(this.value)
          },
          expected: number,
          actual: this.value
        })
    } else {
      if (this.value <= number)
        throw new TestError({
          message: 'Expected {{actual}} to be greater than {{expected}}, but it was not',
          messageLocals: {
            expected: String(number),
            actual: String(this.value)
          },
          expected: number,
          actual: this.value
        })
    }
  }

  public toBeLessThan(number: number) {
    if (typeof this.value !== 'number') {
      throw new TestError({
        message: 'Expected a number, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'number',
        actual: this.value
      })
    }

    if (this.expectNot) {
      if (this.value < number)
        throw new TestError({
          message: 'Expected {{actual}} not to be less than {{expected}}, but it was',
          messageLocals: {
            expected: String(number),
            actual: String(this.value)
          },
          expected: number,
          actual: this.value
        })
    } else {
      if (this.value >= number)
        throw new TestError({
          message: 'Expected {{actual}} to be less than {{expected}}, but it was not',
          messageLocals: {
            expected: String(number),
            actual: String(this.value)
          },
          expected: number,
          actual: this.value
        })
    }
  }

  public toMatch(regex: RegExp) {
    if (typeof this.value !== 'string') {
      throw new TestError({
        message: 'Expected a string, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'string',
        actual: this.value
      })
    }

    const matches = regex.test(this.value)

    if (this.expectNot) {
      if (matches)
        throw new TestError({
          message: 'Expected {{actual}} not to match {{expected}}, but it did',
          messageLocals: {
            expected: String(regex),
            actual: this.value
          },
          expected: regex,
          actual: this.value
        })
    } else {
      if (!matches)
        throw new TestError({
          message: 'Expected {{actual}} to match {{expected}}, but it did not',
          messageLocals: {
            expected: String(regex),
            actual: this.value
          },
          expected: regex,
          actual: this.value
        })
    }
  }

  public toThrow(expected?: Error | RegExp | string) {
    if (typeof this.value !== 'function') {
      throw new TestError({
        message: 'Expected a function, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'function',
        actual: this.value
      })
    }

    let error: Error | undefined
    try {
      this.value()
    } catch (e) {
      error = e as Error
    }

    if (this.expectNot) {
      if (error) {
        if (!expected) {
          throw new TestError({
            message: 'Expected function not to throw, but it threw {{actual}}',
            messageLocals: {
              actual: error.message
            },
            expected: 'no error',
            actual: error
          })
        }

        let matches = false
        if (expected instanceof RegExp) {
          matches = expected.test(error.message)
        } else if (typeof expected === 'string') {
          matches = error.message.includes(expected)
        } else if (expected instanceof Error) {
          matches = error.message === expected.message
        }

        if (matches) {
          throw new TestError({
            message: 'Expected function not to throw matching error, but it did',
            messageLocals: {},
            expected: expected,
            actual: error
          })
        }
      }
    } else {
      if (!error) {
        throw new TestError({
          message: 'Expected function to throw, but it did not',
          messageLocals: {},
          expected: expected || 'error',
          actual: 'no error'
        })
      }

      if (expected) {
        let matches = false
        if (expected instanceof RegExp) {
          matches = expected.test(error.message)
        } else if (typeof expected === 'string') {
          matches = error.message.includes(expected)
        } else if (expected instanceof Error) {
          matches = error.message === expected.message
        }

        if (!matches) {
          throw new TestError({
            message: 'Expected function to throw matching error, but it threw {{actual}}',
            messageLocals: {
              actual: error.message
            },
            expected: expected,
            actual: error
          })
        }
      }
    }
  }

  public toBeInstanceOf(constructor: Function) {
    if (this.expectNot) {
      if (this.value instanceof constructor)
        throw new TestError({
          message: 'Expected {{actual}} not to be instance of {{expected}}, but it was',
          messageLocals: {
            expected: constructor.name,
            actual: this.getMessageLocalName(this.value)
          },
          expected: constructor.name,
          actual: this.value
        })
    } else {
      if (!(this.value instanceof constructor))
        throw new TestError({
          message: 'Expected {{actual}} to be instance of {{expected}}, but it was not',
          messageLocals: {
            expected: constructor.name,
            actual: this.getMessageLocalName(this.value)
          },
          expected: constructor.name,
          actual: this.value
        })
    }
  }

  public toBeCloseTo(number: number, precision: number = 2) {
    if (typeof this.value !== 'number') {
      throw new TestError({
        message: 'Expected a number, but got {{actual}}',
        messageLocals: {
          actual: this.getMessageLocalName(this.value)
        },
        expected: 'number',
        actual: this.value
      })
    }

    const pow = Math.pow(10, precision)
    const delta = Math.abs(this.value - number)
    const maxDelta = 1 / pow

    if (this.expectNot) {
      if (delta < maxDelta)
        throw new TestError({
          message: 'Expected {{actual}} not to be close to {{expected}} (precision: {{precision}}), but it was',
          messageLocals: {
            expected: String(number),
            actual: String(this.value),
            precision: String(precision)
          },
          expected: number,
          actual: this.value
        })
    } else {
      if (delta >= maxDelta)
        throw new TestError({
          message: 'Expected {{actual}} to be close to {{expected}} (precision: {{precision}}), but it was not',
          messageLocals: {
            expected: String(number),
            actual: String(this.value),
            precision: String(precision)
          },
          expected: number,
          actual: this.value
        })
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
