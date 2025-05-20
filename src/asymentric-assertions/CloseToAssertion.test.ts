import { Tester } from 'src/Tester'

import { CloseToAssertion } from './CloseToAssertion'

export async function closeToAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when number is close to expected within precision', () => {
    const assertion = new CloseToAssertion(10, 2)

    tester.expect(assertion.assert(10)).toBe(true)
    tester.expect(assertion.assert(10.009)).toBe(true)
    tester.expect(assertion.assert(9.991)).toBe(true)
    tester.expect(assertion.assert(10.011)).toBe(false)
    tester.expect(assertion.assert(9.989)).toBe(false)
  })

  tester.test('works with different precision values', () => {
    const lowPrecision = new CloseToAssertion(10, 0)
    tester.expect(lowPrecision.assert(10.9)).toBe(true)
    tester.expect(lowPrecision.assert(9.1)).toBe(true)
    tester.expect(lowPrecision.assert(11.1)).toBe(false)

    const highPrecision = new CloseToAssertion(10, 4)
    tester.expect(highPrecision.assert(10.00009)).toBe(true)
    tester.expect(highPrecision.assert(9.99991)).toBe(true)
    tester.expect(highPrecision.assert(10.00011)).toBe(false)
  })

  tester.test('returns false for non-number values', () => {
    const assertion = new CloseToAssertion(10)

    tester.expect(assertion.assert('10')).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(NaN)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new CloseToAssertion(10, 2, true)

      tester.expect(assertion.assert(10)).toBe(false)
      tester.expect(assertion.assert(10.009)).toBe(false)
      tester.expect(assertion.assert(9.991)).toBe(false)
      tester.expect(assertion.assert(10.011)).toBe(true)
      tester.expect(assertion.assert(9.989)).toBe(true)
      tester.expect(assertion.assert('10')).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'asserts true when number is close to expected within precision',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'works with different precision values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'returns false for non-number values',
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
    console.log('CloseToAssertion test passed')
  }
} 
