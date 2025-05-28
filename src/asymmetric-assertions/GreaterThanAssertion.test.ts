import { Tester } from '../Tester'

import { GreaterThanAssertion } from './GreaterThanAssertion'

export async function greaterThanAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when value is greater than expected', () => {
    const assertion = new GreaterThanAssertion(10)

    tester.expect(assertion.assert(11)).toBe(true)
    tester.expect(assertion.assert(100)).toBe(true)
    tester.expect(assertion.assert(10.1)).toBe(true)
    tester.expect(assertion.assert(10)).toBe(false)
    tester.expect(assertion.assert(9)).toBe(false)
    tester.expect(assertion.assert(-10)).toBe(false)
  })

  tester.test('returns false for non-number values', () => {
    const assertion = new GreaterThanAssertion(10)

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
      const assertion = new GreaterThanAssertion(10, true)

      tester.expect(assertion.assert(11)).toBe(false)
      tester.expect(assertion.assert(100)).toBe(false)
      tester.expect(assertion.assert(10.1)).toBe(false)
      tester.expect(assertion.assert(10)).toBe(true)
      tester.expect(assertion.assert(9)).toBe(true)
      tester.expect(assertion.assert(-10)).toBe(true)
      tester.expect(assertion.assert('11')).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when value is greater than expected'],
      passed: true
    },
    {
      spec: ['returns false for non-number values'],
      passed: true
    },
    {
      spec: ['when not is passed', 'inverts the assertion result'],
      passed: true
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('GreaterThanAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('GreaterThanAssertion test failed')
  }
} 
