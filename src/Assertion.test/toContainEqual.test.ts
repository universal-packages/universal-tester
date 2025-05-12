import { Tester } from '../Tester'

export async function toContainEqualTest() {
  const tester = new Tester()

  tester.test('should pass for array containing structurally equal object', () => {
    tester.expect([{ a: 1, b: 2 }, { c: 3 }]).toContainEqual({ a: 1, b: 2 })
  })

  tester.test('should fail for array not containing structurally equal object', () => {
    tester.expect([{ a: 1, b: 3 }, { c: 3 }]).toContainEqual({ a: 1, b: 2 })
  })

  tester.test('should pass for array containing equal primitive', () => {
    tester.expect([1, 2, 3]).toContainEqual(2)
  })

  tester.test('should fail for array not containing equal primitive', () => {
    tester.expect([1, 2, 3]).toContainEqual(4)
  })

  tester.test('should pass for array containing equal nested object', () => {
    tester.expect([{ a: { b: 2 } }, { c: 3 }]).toContainEqual({ a: { b: 2 } })
  })

  tester.test('should fail for array not containing equal nested object', () => {
    tester.expect([{ a: { b: 3 } }, { c: 3 }]).toContainEqual({ a: { b: 2 } })
  })

  tester.test('should fail for non-array value', () => {
    tester.expect('string').toContainEqual('s')
  })

  tester.test('should pass for not.toContainEqual with array not containing equal object', () => {
    tester.expect([{ a: 1, b: 3 }, { c: 3 }]).not.toContainEqual({ a: 1, b: 2 })
  })

  tester.test('should fail for not.toContainEqual with array containing equal object', () => {
    tester.expect([{ a: 1, b: 2 }, { c: 3 }]).not.toContainEqual({ a: 1, b: 2 })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass for array containing structurally equal object',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array not containing structurally equal object',
      error: {
        message: 'Expected {{actual}} to contain an item equal to {{expected}}, but it did not',
        messageLocals: {
          expected: 'Object',
          actual: 'Array'
        },
        expected: { a: 1, b: 2 },
        actual: [{ a: 1, b: 3 }, { c: 3 }]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for array containing equal primitive',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array not containing equal primitive',
      error: {
        message: 'Expected {{actual}} to contain an item equal to {{expected}}, but it did not',
        messageLocals: {
          expected: '4',
          actual: 'Array'
        },
        expected: 4,
        actual: [1, 2, 3]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for array containing equal nested object',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array not containing equal nested object',
      error: {
        message: 'Expected {{actual}} to contain an item equal to {{expected}}, but it did not',
        messageLocals: {
          expected: 'Object',
          actual: 'Array'
        },
        expected: { a: { b: 2 } },
        actual: [{ a: { b: 3 } }, { c: 3 }]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for non-array value',
      error: {
        message: 'Expected an array, but got {{actual}}',
        messageLocals: {
          actual: 'string'
        },
        expected: 'array',
        actual: 'string'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toContainEqual with array not containing equal object',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toContainEqual with array containing equal object',
      error: {
        message: 'Expected {{actual}} not to contain an item equal to {{expected}}, but it did',
        messageLocals: {
          expected: 'Object',
          actual: 'Array'
        },
        expected: { a: 1, b: 2 },
        actual: [{ a: 1, b: 2 }, { c: 3 }]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toContainEqual test failed')
  } else {
    console.log('toContainEqual test passed')
  }
} 
