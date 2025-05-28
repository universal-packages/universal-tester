import { Tester } from '../Tester'

import { GreaterThanOrEqualAssertion } from './GreaterThanOrEqualAssertion'

export async function greaterThanOrEqualAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when value is greater than or equal to expected', () => {
    const assertion = new GreaterThanOrEqualAssertion(10)

    tester.expect(assertion.assert(11)).toBe(true)
    tester.expect(assertion.assert(100)).toBe(true)
    tester.expect(assertion.assert(10.1)).toBe(true)
    tester.expect(assertion.assert(10)).toBe(true)
    tester.expect(assertion.assert(9.999)).toBe(false)
    tester.expect(assertion.assert(9)).toBe(false)
    tester.expect(assertion.assert(-10)).toBe(false)
  })

  tester.test('returns false for non-number values', () => {
    const assertion = new GreaterThanOrEqualAssertion(10)

    tester.expect(assertion.assert('11')).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert(false)).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(NaN)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new GreaterThanOrEqualAssertion(10, true)

      tester.expect(assertion.assert(11)).toBe(false)
      tester.expect(assertion.assert(100)).toBe(false)
      tester.expect(assertion.assert(10.1)).toBe(false)
      tester.expect(assertion.assert(10)).toBe(false)
      tester.expect(assertion.assert(9.999)).toBe(true)
      tester.expect(assertion.assert(9)).toBe(true)
      tester.expect(assertion.assert(-10)).toBe(true)
      tester.expect(assertion.assert('11')).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when value is greater than or equal to expected'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for non-number values']   ,
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
    console.log('GreaterThanOrEqualAssertion test passed')
  }
} 
