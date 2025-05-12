import { Tester } from './Tester'
import { diff } from './diff'

export async function diffTest() {
  console.log('\n--- RUNNING diff TESTS ---')
  const tester = new Tester()

  // Test primitive values
  tester.test('compares same primitive values', () => {
    tester.expect(JSON.stringify(diff(1, 1))).toBe(JSON.stringify({ type: 'same', value: 1 }))
    tester.expect(JSON.stringify(diff('string', 'string'))).toBe(JSON.stringify({ type: 'same', value: 'string' }))
    tester.expect(JSON.stringify(diff(true, true))).toBe(JSON.stringify({ type: 'same', value: true }))
  })

  tester.test('compares different primitive values', () => {
    tester.expect(JSON.stringify(diff(1, 2))).toBe(JSON.stringify({ type: 'different', expected: 1, actual: 2 }))
    tester.expect(JSON.stringify(diff('str1', 'str2'))).toBe(JSON.stringify({ type: 'different', expected: 'str1', actual: 'str2' }))
    tester.expect(JSON.stringify(diff(true, false))).toBe(JSON.stringify({ type: 'different', expected: true, actual: false }))
  })

  tester.test('compares undefined and null values', () => {
    tester.expect(JSON.stringify(diff(undefined, 1))).toBe(JSON.stringify({ type: 'different', expected: undefined, actual: 1 }))
    tester.expect(JSON.stringify(diff(1, undefined))).toBe(JSON.stringify({ type: 'different', expected: 1, actual: undefined }))
    tester.expect(JSON.stringify(diff(null, undefined))).toBe(JSON.stringify({ type: 'different', expected: null, actual: undefined }))
  })

  tester.test('compares object keys with undefined values vs missing keys', () => {
    // Explicit undefined vs missing key
    const obj1 = { a: 1, b: undefined }
    const obj2 = { a: 1 }

    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: { type: 'removed', value: undefined }
        }
      })
    )

    // Different from setting to undefined vs removing
    const obj3 = { a: 1, b: 2 }
    const obj4 = { a: 1, b: undefined }

    tester.expect(JSON.stringify(diff(obj3, obj4))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: { type: 'different', expected: 2, actual: undefined }
        }
      })
    )
  })

  // Test objects
  tester.test('compares same objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }
    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: { type: 'same', value: 2 }
        }
      })
    )
  })

  tester.test('compares objects with different values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }
    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: { type: 'different', expected: 2, actual: 3 }
        }
      })
    )
  })

  tester.test('compares objects with different keys', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, c: 2 }
    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: { type: 'removed', value: 2 },
          c: { type: 'added', value: 2 }
        }
      })
    )
  })

  tester.test('compares nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { a: 1, b: { c: 2, d: 4, e: 5 } }
    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1 },
          b: {
            type: 'object',
            keys: {
              c: { type: 'same', value: 2 },
              d: { type: 'different', expected: 3, actual: 4 },
              e: { type: 'added', value: 5 }
            }
          }
        }
      })
    )
  })

  // Test arrays
  tester.test('compares same arrays', () => {
    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 2, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1 },
          { type: 'same', value: 2 },
          { type: 'same', value: 3 }
        ]
      })
    )
  })

  tester.test('compares arrays with different values', () => {
    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 4, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1 },
          { type: 'different', expected: 2, actual: 4 },
          { type: 'same', value: 3 }
        ]
      })
    )
  })

  tester.test('compares arrays with different lengths', () => {
    tester.expect(JSON.stringify(diff([1, 2], [1, 2, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1 },
          { type: 'same', value: 2 },
          { type: 'added', value: 3 }
        ]
      })
    )

    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 2]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1 },
          { type: 'same', value: 2 },
          { type: 'removed', value: 3 }
        ]
      })
    )
  })

  tester.test('compares arrays of objects', () => {
    tester.expect(JSON.stringify(diff([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3, c: 4 }]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          {
            type: 'object',
            keys: {
              a: { type: 'same', value: 1 }
            }
          },
          {
            type: 'object',
            keys: {
              b: { type: 'different', expected: 2, actual: 3 },
              c: { type: 'added', value: 4 }
            }
          }
        ]
      })
    )
  })

  // Test circular references
  tester.test('handles circular references', () => {
    const obj1: any = { a: 1 }
    obj1.self = obj1

    const obj2: any = { a: 1 }
    obj2.self = obj2

    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: {
            type: 'same',
            value: 1
          },
          self: {
            type: 'circular',
            path: 'self',
            same: true
          }
        }
      })
    )
  })

  tester.test('handles circular references with different values', () => {
    const obj1: any = { a: 1, b: { c: 2 } }
    obj1.b.self = obj1.b

    const obj2: any = { a: 1, b: { c: 2 } }
    obj2.b.self = obj2

    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: {
            type: 'same',
            value: 1
          },
          b: {
            type: 'object',
            keys: {
              c: {
                type: 'same',
                value: 2
              },
              self: {
                type: 'circular',
                path: 'b',
                same: false
              }
            }
          }
        }
      })
    )
  })

  // Run the tests
  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'compares same primitive values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares different primitive values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares undefined and null values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares object keys with undefined values vs missing keys',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares same objects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares objects with different values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares objects with different keys',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares nested objects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares same arrays',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares arrays with different values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares arrays with different lengths',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'compares arrays of objects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'handles circular references',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'handles circular references with different values',
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Diff test failed')
  } else {
    console.log('Diff test passed')
  }
}
