import { Tester } from '../Tester'

export async function toThrowTest() {
  const tester = new Tester()

  tester.test('should pass for function that throws', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow()
  })

  tester.test('should fail for function that does not throw', () => {
    tester
      .expect(() => {
        // Do nothing
      })
      .toThrow()
  })

  tester.test('should pass for function that throws with matching string', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow('test error')
  })

  tester.test('should fail for function that throws with non-matching string', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow('different error')
  })

  tester.test('should pass for function that throws with matching regex', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow(/test/)
  })

  tester.test('should fail for function that throws with non-matching regex', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow(/different/)
  })

  tester.test('should pass for function that throws with matching error', () => {
    const error = new Error('test error')
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow(error)
  })

  tester.test('should fail for function that throws with non-matching error', () => {
    const error = new Error('different error')
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .toThrow(error)
  })

  tester.test('should fail for non-function value', () => {
    tester.expect('string').toThrow()
  })

  tester.test('should pass for not.toThrow with function that does not throw', () => {
    tester
      .expect(() => {
        // Do nothing
      })
      .not.toThrow()
  })

  tester.test('should fail for not.toThrow with function that throws', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .not.toThrow()
  })

  tester.test('should pass for not.toThrow with function that throws non-matching error', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .not.toThrow('different error')
  })

  tester.test('should fail for not.toThrow with function that throws matching error', () => {
    tester
      .expect(() => {
        throw new Error('test error')
      })
      .not.toThrow('test error')
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for function that throws'],
      passed: true
    },
    {
      spec: ['should fail for function that does not throw'],
      error: {
        message: 'Expected function to throw, but it did not',
        messageLocals: {},
        expected: 'error',
        actual: 'no error'
      },
      passed: false
    },
    {
      spec: ['should pass for function that throws with matching string'],
      passed: true
    },
    {
      spec: ['should fail for function that throws with non-matching string'],
      error: {
        message: 'Expected function to throw matching error, but it threw {{actual}}',
        messageLocals: {
          actual: 'test error'
        },
        expected: 'different error',
        actual: new Error('test error')
      },
      passed: false
    },
    {
      spec: ['should pass for function that throws with matching regex'],
      passed: true
    },
    {
      spec: ['should fail for function that throws with non-matching regex'],
      error: {
        message: 'Expected function to throw matching error, but it threw {{actual}}',
        messageLocals: {
          actual: 'test error'
        },
        expected: /different/,
        actual: new Error('test error')
      },
      passed: false
    },
    {
      spec: ['should pass for function that throws with matching error'],
      passed: true
    },
    {
      spec: ['should fail for function that throws with non-matching error'],
      error: {
        message: 'Expected function to throw matching error, but it threw {{actual}}',
        messageLocals: {
          actual: 'test error'
        },
        expected: new Error('different error'),
        actual: new Error('test error')
      },
      passed: false
    },
    {
      spec: ['should fail for non-function value'],
      error: {
        message: 'Expected a function, but got {{actual}}',
        messageLocals: {
          actual: 'string'
        },
        expected: 'function',
        actual: 'string'
      },
      passed: false
    },
    {
      spec: ['should pass for not.toThrow with function that does not throw'],
      passed: true
    },
    {
      spec: ['should fail for not.toThrow with function that throws'],
      error: {
        message: 'Expected function not to throw, but it threw {{actual}}',
        messageLocals: {
          actual: 'test error'
        },
        expected: 'no error',
        actual: new Error('test error')
      },
      passed: false
    },
    {
      spec: ['should pass for not.toThrow with function that throws non-matching error'],
      passed: true
    },
    {
      spec: ['should fail for not.toThrow with function that throws matching error'],
      error: {
        message: 'Expected function not to throw matching error, but it did',
        messageLocals: {},
        expected: 'test error',
        actual: new Error('test error')
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toThrow test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toThrow test failed')
  }
}
