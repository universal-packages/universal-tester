import { Tester } from '../Tester'

import { MatchAssertion } from './MatchAssertion'

export async function matchAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when string matches the regex pattern', () => {
    const assertion = new MatchAssertion(/hello/)

    tester.expect(assertion.assert('hello')).toBe(true)
    tester.expect(assertion.assert('hello world')).toBe(true)
    tester.expect(assertion.assert('say hello to everyone')).toBe(true)
    tester.expect(assertion.assert('hi there')).toBe(false)
    tester.expect(assertion.assert('')).toBe(false)
  })

  tester.test('works with complex regex patterns', () => {
    const emailAssertion = new MatchAssertion(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

    tester.expect(emailAssertion.assert('test@example.com')).toBe(true)
    tester.expect(emailAssertion.assert('invalid-email')).toBe(false)
    tester.expect(emailAssertion.assert('test@domain')).toBe(false)

    const dateAssertion = new MatchAssertion(/^\d{4}-\d{2}-\d{2}$/)
    
    tester.expect(dateAssertion.assert('2023-01-01')).toBe(true)
    tester.expect(dateAssertion.assert('01/01/2023')).toBe(false)
  })

  tester.test('returns false for non-string values (when notToExpect is false)', () => {
    const assertion = new MatchAssertion(/test/)

    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result for strings', () => {
      const assertion = new MatchAssertion(/hello/, true)

      tester.expect(assertion.assert('hello')).toBe(false)
      tester.expect(assertion.assert('hello world')).toBe(false)
      tester.expect(assertion.assert('hi there')).toBe(true)
      tester.expect(assertion.assert('')).toBe(true)
    })

    tester.test('returns true for non-string values (when notToExpect is true)', () => {
      const assertion = new MatchAssertion(/test/, true)

      tester.expect(assertion.assert(123)).toBe(true)
      tester.expect(assertion.assert(true)).toBe(true)
      tester.expect(assertion.assert(null)).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
        {
          spec: ['asserts true when string matches the regex pattern'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['works with complex regex patterns'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for non-string values (when notToExpect is false)'],
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
      spec: ['when not is passed', 'returns true for non-string values (when notToExpect is true)'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('MatchAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('MatchAssertion test failed')
  }
} 
