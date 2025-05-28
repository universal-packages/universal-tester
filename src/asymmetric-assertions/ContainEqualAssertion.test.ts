import { Tester } from '../Tester'

import { ContainEqualAssertion } from './ContainEqualAssertion'

export async function containEqualAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when array contains structurally equal object', () => {
    const assertion = new ContainEqualAssertion({ a: 1, b: 2 })

    tester.expect(assertion.assert([{ a: 1, b: 2 }, { c: 3 }])).toBe(true)
    tester.expect(assertion.assert([{ c: 3 }, { a: 1, b: 2 }])).toBe(true)
    tester.expect(assertion.assert([{ a: 1, b: 3 }, { c: 3 }])).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
  })

  tester.test('asserts true when array contains equal primitive', () => {
    const assertion = new ContainEqualAssertion(2)

    tester.expect(assertion.assert([1, 2, 3])).toBe(true)
    tester.expect(assertion.assert([2])).toBe(true)
    tester.expect(assertion.assert([1, 3])).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
  })

  tester.test('asserts true when array contains equal nested object', () => {
    const assertion = new ContainEqualAssertion({ a: { b: 2 } })

    tester.expect(assertion.assert([{ a: { b: 2 } }, { c: 3 }])).toBe(true)
    tester.expect(assertion.assert([{ c: 3 }, { a: { b: 2 } }])).toBe(true)
    tester.expect(assertion.assert([{ a: { b: 3 } }, { c: 3 }])).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
  })

  tester.test('returns false for non-array values', () => {
    const assertion = new ContainEqualAssertion('test')

    tester.expect(assertion.assert('test')).toBe(false)
    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result for objects', () => {
      const assertion = new ContainEqualAssertion({ a: 1, b: 2 }, true)

      tester.expect(assertion.assert([{ a: 1, b: 2 }, { c: 3 }])).toBe(false)
      tester.expect(assertion.assert([{ c: 3 }, { a: 1, b: 2 }])).toBe(false)
      tester.expect(assertion.assert([{ a: 1, b: 3 }, { c: 3 }])).toBe(true)
      tester.expect(assertion.assert([])).toBe(true)
    })

    tester.test('inverts the assertion result for primitives', () => {
      const assertion = new ContainEqualAssertion(2, true)

      tester.expect(assertion.assert([1, 2, 3])).toBe(false)
      tester.expect(assertion.assert([2])).toBe(false)
      tester.expect(assertion.assert([1, 3])).toBe(true)
      tester.expect(assertion.assert([])).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
        {
          spec: ['asserts true when array contains structurally equal object'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts true when array contains equal primitive'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts true when array contains equal nested object'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for non-array values'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
        spec: ['when not is passed', 'inverts the assertion result for objects'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'inverts the assertion result for primitives'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Results do not match expected results')
  } else {
    console.log('ContainEqualAssertion test passed')
  }
} 
