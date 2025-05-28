import { Tester } from '../Tester'

import { ContainAssertion } from './ContainAssertion'

export async function containAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when string contains expected substring', () => {
    const assertion = new ContainAssertion('world')

    tester.expect(assertion.assert('hello world')).toBe(true)
    tester.expect(assertion.assert('world hello')).toBe(true)
    tester.expect(assertion.assert('hello')).toBe(false)
    tester.expect(assertion.assert('')).toBe(false)
  })

  tester.test('asserts true when array contains expected value', () => {
    const assertion = new ContainAssertion(2)

    tester.expect(assertion.assert([1, 2, 3])).toBe(true)
    tester.expect(assertion.assert([2])).toBe(true)
    tester.expect(assertion.assert([1, 3])).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
  })

  tester.test('asserts true when array contains expected object (by reference)', () => {
    const obj = { id: 1 }
    const assertion = new ContainAssertion(obj)

    tester.expect(assertion.assert([obj])).toBe(true)
    
    // Different object with same structure but different reference
    tester.expect(assertion.assert([{ id: 1 }])).toBe(false)
  })

  tester.test('returns false for non-string and non-array values', () => {
    const assertion = new ContainAssertion('test')

    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result for strings', () => {
      const assertion = new ContainAssertion('world', true)

      tester.expect(assertion.assert('hello world')).toBe(false)
      tester.expect(assertion.assert('world hello')).toBe(false)
      tester.expect(assertion.assert('hello')).toBe(true)
      tester.expect(assertion.assert('')).toBe(true)
    })

    tester.test('inverts the assertion result for arrays', () => {
      const assertion = new ContainAssertion(2, true)

      tester.expect(assertion.assert([1, 2, 3])).toBe(false)
      tester.expect(assertion.assert([2])).toBe(false)
      tester.expect(assertion.assert([1, 3])).toBe(true)
      tester.expect(assertion.assert([])).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when string contains expected substring'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts true when array contains expected value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts true when array contains expected object (by reference)'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for non-string and non-array values'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
          spec: ['when not is passed', 'inverts the assertion result for strings'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'inverts the assertion result for arrays'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('ContainAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('ContainAssertion test failed')
  }
} 
