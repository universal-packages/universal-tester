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
    if (this.expectNot) {
      if (this.value === expected)
        throw new TestError({
          message: `Expected ${this.value} to not be ${expected}, but it was`,
          expected,
          actual: this.value
        })
    } else {
      if (this.value !== expected)
        throw new TestError({
          message: `Expected ${expected} but got ${this.value}`,
          expected,
          actual: this.value
        })
    }
  }
}
