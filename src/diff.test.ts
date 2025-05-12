import { Tester } from './Tester'
import { diff } from './diff'

export async function diffTest() {
  console.log('\n--- RUNNING diff TESTS ---')
  const tester = new Tester()

  // Test primitive values
  tester.test('compares same primitive values', () => {
    tester.expect(JSON.stringify(diff(1, 1))).toBe(JSON.stringify({ type: 'same', value: 1, same: true }))
    tester.expect(JSON.stringify(diff('string', 'string'))).toBe(JSON.stringify({ type: 'same', value: 'string', same: true }))
    tester.expect(JSON.stringify(diff(true, true))).toBe(JSON.stringify({ type: 'same', value: true, same: true }))
  })

  tester.test('compares different primitive values', () => {
    tester.expect(JSON.stringify(diff(1, 2))).toBe(JSON.stringify({ type: 'different', expected: 1, actual: 2, same: false }))
    tester.expect(JSON.stringify(diff('str1', 'str2'))).toBe(JSON.stringify({ type: 'different', expected: 'str1', actual: 'str2', same: false }))
    tester.expect(JSON.stringify(diff(true, false))).toBe(JSON.stringify({ type: 'different', expected: true, actual: false, same: false }))
  })

  tester.test('compares undefined and null values', () => {
    tester.expect(JSON.stringify(diff(undefined, 1))).toBe(JSON.stringify({ type: 'different', expected: undefined, actual: 1, same: false }))
    tester.expect(JSON.stringify(diff(1, undefined))).toBe(JSON.stringify({ type: 'different', expected: 1, actual: undefined, same: false }))
    tester.expect(JSON.stringify(diff(null, undefined))).toBe(JSON.stringify({ type: 'different', expected: null, actual: undefined, same: false }))
  })

  tester.test('compares object keys with undefined values vs missing keys', () => {
    // Explicit undefined vs missing key
    const obj1 = { a: 1, b: undefined }
    const obj2 = { a: 1 }

    tester.expect(JSON.stringify(diff(obj1, obj2))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1, same: true },
          b: { type: 'removed', value: undefined, same: false }
        },
        same: false
      })
    )

    // Different from setting to undefined vs removing
    const obj3 = { a: 1, b: 2 }
    const obj4 = { a: 1, b: undefined }

    tester.expect(JSON.stringify(diff(obj3, obj4))).toBe(
      JSON.stringify({
        type: 'object',
        keys: {
          a: { type: 'same', value: 1, same: true },
          b: { type: 'different', expected: 2, actual: undefined, same: false }
        },
        same: false
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
          a: { type: 'same', value: 1, same: true },
          b: { type: 'same', value: 2, same: true }
        },
        same: true
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
          a: { type: 'same', value: 1, same: true },
          b: { type: 'different', expected: 2, actual: 3, same: false }
        },
        same: false
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
          a: { type: 'same', value: 1, same: true },
          b: { type: 'removed', value: 2, same: false },
          c: { type: 'added', value: 2, same: false }
        },
        same: false
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
          a: { type: 'same', value: 1, same: true },
          b: {
            type: 'object',
            keys: {
              c: { type: 'same', value: 2, same: true },
              d: { type: 'different', expected: 3, actual: 4, same: false },
              e: { type: 'added', value: 5, same: false }
            },
            same: false
          }
        },
        same: false
      })
    )
  })

  // Test arrays
  tester.test('compares same arrays', () => {
    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 2, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1, same: true },
          { type: 'same', value: 2, same: true },
          { type: 'same', value: 3, same: true }
        ],
        same: true
      })
    )
  })

  tester.test('compares arrays with different values', () => {
    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 4, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1, same: true },
          { type: 'different', expected: 2, actual: 4, same: false },
          { type: 'same', value: 3, same: true }
        ],
        same: false
      })
    )
  })

  tester.test('compares arrays with different lengths', () => {
    tester.expect(JSON.stringify(diff([1, 2], [1, 2, 3]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1, same: true },
          { type: 'same', value: 2, same: true },
          { type: 'added', value: 3, same: false }
        ],
        same: false
      })
    )

    tester.expect(JSON.stringify(diff([1, 2, 3], [1, 2]))).toBe(
      JSON.stringify({
        type: 'array',
        items: [
          { type: 'same', value: 1, same: true },
          { type: 'same', value: 2, same: true },
          { type: 'removed', value: 3, same: false }
        ],
        same: false
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
              a: { type: 'same', value: 1, same: true }
            },
            same: true
          },
          {
            type: 'object',
            keys: {
              b: { type: 'different', expected: 2, actual: 3, same: false },
              c: { type: 'added', value: 4, same: false }
            },
            same: false
          }
        ],
        same: false
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
            value: 1,
            same: true
          },
          self: {
            type: 'circular',
            path: 'self',
            same: true
          }
        },
        same: true
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
            value: 1,
            same: true
          },
          b: {
            type: 'object',
            keys: {
              c: {
                type: 'same',
                value: 2,
                same: true
              },
              self: {
                type: 'circular',
                path: 'b',
                same: false
              }
            },
            same: false
          }
        },
        same: false
      })
    )
  })

  // Test specifically for the 'same' property in complex structures
  tester.test('correctly determines the same property for nested structures', () => {
    // Same nested objects
    const nestedObj1 = { a: 1, b: { c: 2, d: [1, 2, { e: 3 }] } };
    const nestedObj2 = { a: 1, b: { c: 2, d: [1, 2, { e: 3 }] } };
    const nestedResult = diff(nestedObj1, nestedObj2);
    tester.expect(nestedResult.same).toBe(true);
    
    // Same structure but different in deep nesting
    const nestedObj3 = { a: 1, b: { c: 2, d: [1, 2, { e: 3 }] } };
    const nestedObj4 = { a: 1, b: { c: 2, d: [1, 2, { e: 4 }] } };
    const nestedDiffResult = diff(nestedObj3, nestedObj4);
    tester.expect(nestedDiffResult.same).toBe(false);
    
    // Check if parent is marked as different when a child is different
    const objWithArrays1 = { arr: [1, 2, 3] };
    const objWithArrays2 = { arr: [1, 2, 4] };
    const arrayDiffResult = diff(objWithArrays1, objWithArrays2);
    tester.expect(arrayDiffResult.same).toBe(false);
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
    },
    {
      spec: 'correctly determines the same property for nested structures',
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
