import { Tester } from '../Tester'

export async function toEqualTest() {
  const tester = new Tester()

  tester.test('should compare two equal numbers', () => {
    tester.expect(10).toEqual(10)
  })

  tester.test('should compare two unequal numbers', () => {
    tester.expect(10).toEqual(12)
  })

  tester.test('should compare two equal strings', () => {
    tester.expect('hello').toEqual('hello')
  })

  tester.test('should compare two unequal strings', () => {
    tester.expect('hello').toEqual('world')
  })

  tester.test('should compare two equal booleans', () => {
    tester.expect(true).toEqual(true)
  })

  tester.test('should compare two unequal booleans', () => {
    tester.expect(true).toEqual(false)
  })

  tester.test('should compare two equal object instances by value', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }

    tester.expect(obj1).toEqual(obj2)
  })

  tester.test('should compare two unequal object instances', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }

    tester.expect(obj1).toEqual(obj2)
  })

  tester.test('should compare two equal arrays by value', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]

    tester.expect(arr1).toEqual(arr2)
  })

  tester.test('should compare two unequal arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 4]

    tester.expect(arr1).toEqual(arr2)
  })

  tester.test('should compare nested objects by value', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { a: 1, b: { c: 2 } }

    tester.expect(obj1).toEqual(obj2)
  })

  tester.test('should compare unequal nested objects', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { a: 1, b: { c: 3 } }

    tester.expect(obj1).toEqual(obj2)
  })

  tester.test('should assert to not equal', () => {
    tester.expect(1).not.toEqual(2)
  })

  tester.test('should fail to not equal', () => {
    tester.expect(1).not.toEqual(1)
  })

  tester.test('should be able to use asymmetric assertions', () => {
    tester.expect({ a: 1 }).toEqual(tester.expectAnything())
    tester.expect(35).toEqual(tester.expectAnything())
    tester.expect(true).toEqual(tester.expectAnything())
    tester.expect({ a: 35, b: 12 }).toEqual({ a: tester.expectAnything(), b: 12 })
    tester.expect({ a: 35, b: { c: 12 } }).toEqual({ a: tester.expectAnything(), b: tester.expectAnything() })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should compare two equal numbers'],
      passed: true
    },
    {
      spec: ['should compare two unequal numbers'],
      error: {
        message: 'Expected {{expected}} to equal {{actual}}',
        messageLocals: {
          expected: '12',
          actual: '10'
        },
        expected: 12,
        actual: 10,
        difference: {
          type: 'different',
          expected: 12,
          actual: 10,
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should compare two equal strings'],
      passed: true
    },
    {
      spec: ['should compare two unequal strings'],
      error: {
        message: 'Expected {{expected}} to equal {{actual}}',
        messageLocals: {
          expected: 'world',
          actual: 'hello'
        },
        expected: 'world',
        actual: 'hello',
        difference: {
          type: 'different',
          expected: 'world',
          actual: 'hello',
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should compare two equal booleans'],
      passed: true
    },
    {
      spec: ['should compare two unequal booleans'],
      error: {
        message: 'Expected {{expected}} to equal {{actual}}',
        messageLocals: {
          expected: 'false',
          actual: 'true'
        },
        expected: false,
        actual: true,
        difference: {
          type: 'different',
          expected: false,
          actual: true,
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should compare two equal object instances by value'],
      passed: true
    },
    {
      spec: ['should compare two unequal object instances'],
      error: {
        message: 'Expected objects to be equal, but they were not',
        messageLocals: {},
        expected: {
          a: 1,
          b: 3
        },
        actual: {
          a: 1,
          b: 2
        },
        difference: {
          type: 'object',
          keys: {
            a: {
              type: 'same',
              value: 1,
              same: true
            },
            b: {
              type: 'different',
              expected: 3,
              actual: 2,
              same: false
            }
          },
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should compare two equal arrays by value'],
      passed: true
    },
    {
      spec: ['should compare two unequal arrays'],
      error: {
        message: 'Expected arrays to be equal, but they were not',
        messageLocals: {},
        expected: [1, 2, 4],
        actual: [1, 2, 3],
        difference: {
          type: 'array',
          items: [
            {
              type: 'same',
              value: 1,
              same: true
            },
            {
              type: 'same',
              value: 2,
              same: true
            },
            {
              type: 'different',
              expected: 4,
              actual: 3,
              same: false
            }
          ],
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should compare nested objects by value'],
      passed: true
    },
    {
      spec: ['should compare unequal nested objects'],
      error: {
        message: 'Expected objects to be equal, but they were not',
        messageLocals: {},
        expected: {
          a: 1,
          b: {
            c: 3
          }
        },
        actual: {
          a: 1,
          b: {
            c: 2
          }
        },
        difference: {
          type: 'object',
          keys: {
            a: {
              type: 'same',
              value: 1,
              same: true
            },
            b: {
              type: 'object',
              keys: {
                c: {
                  type: 'different',
                  expected: 3,
                  actual: 2,
                  same: false
                }
              },
              same: false
            }
          },
          same: false
        }
      },
      passed: false
    },
    {
      spec: ['should assert to not equal'],
      passed: true
    },
    {
      spec: ['should fail to not equal'],
      error: {
        message: 'Expected {{expected}} not to equal {{actual}}, but it did',
        messageLocals: {
          expected: '1',
          actual: '1'
        },
        expected: 1,
        actual: 1,
        difference: {
          type: 'same',
          value: 1,
          same: true
        }
      },
      passed: false
    },
    {
      spec: ['should be able to use asymmetric assertions'],
      passed: true
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toEqual test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toEqual test failed')
  }
}
