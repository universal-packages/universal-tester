import { Tester } from '../Tester'

import { TruthyAssertion } from './TruthyAssertion'

export async function truthyAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true for truthy values', () => {
    const assertion = new TruthyAssertion()

    tester.expect(assertion.assert(true)).toBe(true)
    tester.expect(assertion.assert(1)).toBe(true)
    tester.expect(assertion.assert('hello')).toBe(true)
    tester.expect(assertion.assert([])).toBe(true)
    tester.expect(assertion.assert({})).toBe(true)
    tester.expect(assertion.assert(() => {})).toBe(true)
  })

  tester.test('asserts false for falsy values', () => {
    const assertion = new TruthyAssertion()

    tester.expect(assertion.assert(false)).toBe(false)
    tester.expect(assertion.assert(0)).toBe(false)
    tester.expect(assertion.assert('')).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(NaN)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new TruthyAssertion(true)

      // Truthy values should return false when notToExpect is true
      tester.expect(assertion.assert(true)).toBe(false)
      tester.expect(assertion.assert(1)).toBe(false)
      tester.expect(assertion.assert('hello')).toBe(false)
      tester.expect(assertion.assert([])).toBe(false)
      tester.expect(assertion.assert({})).toBe(false)

      // Falsy values should return true when notToExpect is true
      tester.expect(assertion.assert(false)).toBe(true)
      tester.expect(assertion.assert(0)).toBe(true)
      tester.expect(assertion.assert('')).toBe(true)
      tester.expect(assertion.assert(null)).toBe(true)
      tester.expect(assertion.assert(undefined)).toBe(true)
      tester.expect(assertion.assert(NaN)).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true for truthy values'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts false for falsy values'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'inverts the assertion result'],
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
    console.log('TruthyAssertion test passed')
  }
} 
