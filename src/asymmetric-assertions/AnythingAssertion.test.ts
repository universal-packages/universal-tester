import { Tester } from '../Tester'
import { AnythingAssertion } from './AnythingAssertion'

export async function anythingAssertionTest() {
  const tester = new Tester()

  tester.test('always asserts with true', () => {
    const assertion = new AnythingAssertion()

    tester.expect(assertion.assert(1)).toBe(true)
    tester.expect(assertion.assert('hello')).toBe(true)
    tester.expect(assertion.assert(true)).toBe(true)
    tester.expect(assertion.assert({})).toBe(true)
    tester.expect(assertion.assert([])).toBe(true)
    tester.expect(assertion.assert(null)).toBe(true)
    tester.expect(assertion.assert(undefined)).toBe(true)
    tester.expect(assertion.assert(NaN)).toBe(true)
    tester.expect(assertion.assert(new Date())).toBe(true)
    tester.expect(assertion.assert(new Error())).toBe(true)
    tester.expect(assertion.assert(new Map())).toBe(true)
    tester.expect(assertion.assert(new Set())).toBe(true)
  })

  tester.describe('when not is passed', () => {
    tester.test('always asserts with false', () => {
      const assertion = new AnythingAssertion(true)

      tester.expect(assertion.assert(1)).toBe(false)
      tester.expect(assertion.assert('hello')).toBe(false)
      tester.expect(assertion.assert(true)).toBe(false)
      tester.expect(assertion.assert({})).toBe(false)
      tester.expect(assertion.assert([])).toBe(false)
      tester.expect(assertion.assert(null)).toBe(false)
      tester.expect(assertion.assert(undefined)).toBe(false)
      tester.expect(assertion.assert(NaN)).toBe(false)
      tester.expect(assertion.assert(new Date())).toBe(false)
      tester.expect(assertion.assert(new Error())).toBe(false)
      tester.expect(assertion.assert(new Map())).toBe(false)
      tester.expect(assertion.assert(new Set())).toBe(false)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['always asserts with true'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'always asserts with false'],
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
    console.log('AnythingAssertion test passed')
  }
}
