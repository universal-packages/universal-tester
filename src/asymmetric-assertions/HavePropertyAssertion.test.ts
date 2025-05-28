import { Tester } from '../Tester'

import { HavePropertyAssertion } from './HavePropertyAssertion'

export async function havePropertyAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when object has expected property', () => {
    const assertion = new HavePropertyAssertion('a')

    tester.expect(assertion.assert({ a: 1 })).toBe(true)
    tester.expect(assertion.assert({ a: null })).toBe(true)
    tester.expect(assertion.assert({ a: undefined })).toBe(true)
    tester.expect(assertion.assert({ b: 2 })).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
  })

  tester.test('works with nested properties using dot notation', () => {
    const assertion = new HavePropertyAssertion('a.b.c')

    tester.expect(assertion.assert({ a: { b: { c: 1 } } })).toBe(true)
    tester.expect(assertion.assert({ a: { b: { c: null } } })).toBe(true)
    tester.expect(assertion.assert({ a: { b: {} } })).toBe(false)
    tester.expect(assertion.assert({ a: {} })).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
  })

  tester.test('asserts true when object has property with expected value', () => {
    const assertion = new HavePropertyAssertion('a', false, 1)

    tester.expect(assertion.assert({ a: 1 })).toBe(true)
    tester.expect(assertion.assert({ a: 2 })).toBe(false)
    tester.expect(assertion.assert({ a: '1' })).toBe(false)
    tester.expect(assertion.assert({ b: 1 })).toBe(false)
  })

  tester.test('works with nested properties and expected values', () => {
    const assertion = new HavePropertyAssertion('a.b.c', false, 42)

    tester.expect(assertion.assert({ a: { b: { c: 42 } } })).toBe(true)
    tester.expect(assertion.assert({ a: { b: { c: 43 } } })).toBe(false)
    tester.expect(assertion.assert({ a: { b: {} } })).toBe(false)
  })

  tester.test('works with object expected values', () => {
    const assertion = new HavePropertyAssertion('a', false, { b: 2 })

    tester.expect(assertion.assert({ a: { b: 2 } })).toBe(true)
    tester.expect(assertion.assert({ a: { b: 3 } })).toBe(false)
    tester.expect(assertion.assert({ a: {} })).toBe(false)
  })

  tester.test('returns false for non-object values', () => {
    const assertion = new HavePropertyAssertion('length')

    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert('string')).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result for property existence', () => {
      const assertion = new HavePropertyAssertion('a', true)

      tester.expect(assertion.assert({ a: 1 })).toBe(false)
      tester.expect(assertion.assert({ b: 2 })).toBe(true)
    })

    tester.test('inverts the assertion result for property value', () => {
      const assertion = new HavePropertyAssertion('a', true, 1)

      tester.expect(assertion.assert({ a: 1 })).toBe(false)
      tester.expect(assertion.assert({ a: 2 })).toBe(true)
      tester.expect(assertion.assert({ b: 1 })).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when object has expected property'],
      passed: true
    },
    {
      spec: ['works with nested properties using dot notation'],
      passed: true
    },
    {
      spec: ['asserts true when object has property with expected value'],
      passed: true
    },
    {
      spec: ['works with nested properties and expected values'],
      passed: true
    },
    {
      spec: ['works with object expected values'],
      passed: true
    },
    {
      spec: ['returns false for non-object values']   ,
      passed: true
    },
    {
      spec: ['when not is passed', 'inverts the assertion result for property existence'],
      passed: true
    },
    {
      spec: ['when not is passed', 'inverts the assertion result for property value'],
      passed: true
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('HavePropertyAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('HavePropertyAssertion test failed')
  }
}
