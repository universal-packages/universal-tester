import { Tester } from '../Tester'

import { LessThanAssertion } from './LessThanAssertion'

export async function lessThanAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when value is less than expected', () => {
    const assertion = new LessThanAssertion(10)

    tester.expect(assertion.assert(9)).toBe(true)
    tester.expect(assertion.assert(0)).toBe(true)
    tester.expect(assertion.assert(-10)).toBe(true)
    tester.expect(assertion.assert(9.999)).toBe(true)
    tester.expect(assertion.assert(10)).toBe(false)
    tester.expect(assertion.assert(10.001)).toBe(false)
    tester.expect(assertion.assert(100)).toBe(false)
  })

  tester.test('returns false for non-number values (when notToExpect is false)', () => {
    const assertion = new LessThanAssertion(10)

    tester.expect(assertion.assert('9')).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert(false)).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(NaN)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result for numbers', () => {
      const assertion = new LessThanAssertion(10, true)

      tester.expect(assertion.assert(9)).toBe(false)
      tester.expect(assertion.assert(0)).toBe(false)
      tester.expect(assertion.assert(-10)).toBe(false)
      tester.expect(assertion.assert(9.999)).toBe(false)
      tester.expect(assertion.assert(10)).toBe(true)
      tester.expect(assertion.assert(10.001)).toBe(true)
      tester.expect(assertion.assert(100)).toBe(true)
    })

    tester.test('returns true for non-number values (when notToExpect is true)', () => {
      const assertion = new LessThanAssertion(10, true)

      tester.expect(assertion.assert('9')).toBe(true)
      tester.expect(assertion.assert(true)).toBe(true)
      tester.expect(assertion.assert(null)).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when value is less than expected'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for non-number values (when notToExpect is false)'] ,
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'inverts the assertion result for numbers'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'returns true for non-number values (when notToExpect is true)'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('LessThanAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('LessThanAssertion test failed')
  }
} 
