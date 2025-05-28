import { Tester } from '../Tester'

export async function toBeTest() {
  const tester = new Tester()

  tester.test('should compare two equal numbers', () => {
    tester.expect(10).toBe(10)
  })

  tester.test('should compare two unequal numbers', () => {
    tester.expect(10).toBe(12)
  })

  tester.test('should compare two equal strings', () => {
    tester.expect('hello').toBe('hello')
  })

  tester.test('should compare two unequal strings', () => {
    tester.expect('hello').toBe('world')
  })

  tester.test('should compare two equal booleans', () => {
    tester.expect(true).toBe(true)
  })

  tester.test('should compare two unequal booleans', () => {
    tester.expect(true).toBe(false)
  })

  tester.test('should compare two equal object instances', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = obj1

    tester.expect(obj1).toBe(obj2)
  })

  tester.test('should compare two unequal object instances', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }

    tester.expect(obj1).toBe(obj2)
  })

  tester.test('should compare two equal arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = arr1

    tester.expect(arr1).toBe(arr2)
  })

  tester.test('should compare two unequal arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 4]

    tester.expect(arr1).toBe(arr2)
  })

  tester.test('should assert to not be equal', () => {
    tester.expect(1).not.toBe(2)
  })

  tester.test('should fail to not be equal', () => {
    tester.expect(1).not.toBe(1)
  })

  tester.test('should be able to use asymmetric assertion', () => {
    tester.expect(1).toBe(tester.expectAnything())
    tester.expect(true).toBe(tester.expectAnything())
    tester.expect({ a: 1 }).toBe(tester.expectAnything())
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should compare two equal numbers'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two unequal numbers'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: '12',
          actual: '10'
        },
        expected: 12,
        actual: 10
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two equal strings'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two unequal strings'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: 'world',
          actual: 'hello'
        },
        expected: 'world',
        actual: 'hello'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two equal booleans'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two unequal booleans'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: 'false',
          actual: 'true'
        },
        expected: false,
        actual: true
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two equal object instances'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two unequal object instances'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          a: 1,
          b: 3
        },
        actual: {
          a: 1,
          b: 2
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two equal arrays'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should compare two unequal arrays'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: 'Array',
          actual: 'Array'
        },
        expected: [1, 2, 4],
        actual: [1, 2, 3]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should assert to not be equal'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail to not be equal'],
      error: {
        message: 'Expected {{expected}} not to be {{actual}}, but it was',
        messageLocals: {
          expected: '1',
          actual: '1'
        },
        expected: 1,
        actual: 1
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should be able to use asymmetric assertion'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBe test failed')
  } else {
    console.log('toBe test passed')
  }
}
