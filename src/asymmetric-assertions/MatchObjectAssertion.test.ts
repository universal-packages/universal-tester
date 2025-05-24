import { Tester } from '../Tester'

import { MatchObjectAssertion } from './MatchObjectAssertion'

export async function matchObjectAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when object contains all expected keys with matching values', () => {
    const assertion = new MatchObjectAssertion({ a: 1, b: 2 })

    tester.expect(assertion.assert({ a: 1, b: 2 })).toBe(true)
    tester.expect(assertion.assert({ a: 1, b: 2, c: 3 })).toBe(true)
    tester.expect(assertion.assert({ a: 1, b: 3 })).toBe(false)
    tester.expect(assertion.assert({ a: 1 })).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
  })

  tester.test('works with nested objects', () => {
    const assertion = new MatchObjectAssertion({
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3
        }
      }
    })

    tester
      .expect(
        assertion.assert({
          a: 1,
          b: {
            c: 2,
            d: {
              e: 3
            }
          }
        })
      )
      .toBe(true)

    tester
      .expect(
        assertion.assert({
          a: 1,
          b: {
            c: 2,
            d: {
              e: 3,
              f: 4 // Extra property is fine
            }
          }
        })
      )
      .toBe(true)

    tester
      .expect(
        assertion.assert({
          a: 1,
          b: {
            c: 2,
            d: {
              e: 4 // Different value
            }
          }
        })
      )
      .toBe(false)

    tester
      .expect(
        assertion.assert({
          a: 1,
          b: {
            c: 2
            // Missing d property
          }
        })
      )
      .toBe(false)
  })

  tester.test('works with arrays', () => {
    const assertion = new MatchObjectAssertion({
      array: [1, 2, 3]
    })

    tester
      .expect(
        assertion.assert({
          array: [1, 2, 3]
        })
      )
      .toBe(true)

    tester
      .expect(
        assertion.assert({
          array: [1, 2, 3, 4]
        })
      )
      .toBe(true)

    tester
      .expect(
        assertion.assert({
          array: [1, 2] // Missing item
        })
      )
      .toBe(false)

    tester
      .expect(
        assertion.assert({
          array: [1, 2, 4] // Different value
        })
      )
      .toBe(false)
  })

  tester.test('returns false for non-object values', () => {
    const assertion = new MatchObjectAssertion({ a: 1 })

    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert('string')).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert([1, 2, 3])).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new MatchObjectAssertion({ a: 1, b: 2 }, true)

      tester.expect(assertion.assert({ a: 1, b: 2 })).toBe(false)
      tester.expect(assertion.assert({ a: 1, b: 2, c: 3 })).toBe(false)
      tester.expect(assertion.assert({ a: 1, b: 3 })).toBe(true)
      tester.expect(assertion.assert({ a: 1 })).toBe(true)
      tester.expect(assertion.assert({})).toBe(true)
      tester.expect(assertion.assert(null)).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'asserts true when object contains all expected keys with matching values',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'works with nested objects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'works with arrays',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'returns false for non-object values',
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
    console.log('MatchObjectAssertion test passed')
  }
}
