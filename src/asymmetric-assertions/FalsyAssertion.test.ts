import { Tester } from '../Tester'

import { FalsyAssertion } from './FalsyAssertion'

export async function falsyAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true for falsy values', () => {
    const assertion = new FalsyAssertion()

    tester.expect(assertion.assert(false)).toBe(true)
    tester.expect(assertion.assert(0)).toBe(true)
    tester.expect(assertion.assert('')).toBe(true)
    tester.expect(assertion.assert(null)).toBe(true)
    tester.expect(assertion.assert(undefined)).toBe(true)
    tester.expect(assertion.assert(NaN)).toBe(true)
  })

  tester.test('asserts false for truthy values', () => {
    const assertion = new FalsyAssertion()

    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert(1)).toBe(false)
    tester.expect(assertion.assert('hello')).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(() => {})).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new FalsyAssertion(true)

      // Falsy values should return false when notToExpect is true
      tester.expect(assertion.assert(false)).toBe(false)
      tester.expect(assertion.assert(0)).toBe(false)
      tester.expect(assertion.assert('')).toBe(false)
      tester.expect(assertion.assert(null)).toBe(false)
      tester.expect(assertion.assert(undefined)).toBe(false)
      tester.expect(assertion.assert(NaN)).toBe(false)

      // Truthy values should return true when notToExpect is true
      tester.expect(assertion.assert(true)).toBe(true)
      tester.expect(assertion.assert(1)).toBe(true)
      tester.expect(assertion.assert('hello')).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true for falsy values'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts false for truthy values'],
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

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('FalsyAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('FalsyAssertion test failed')
  }
} 
