import { Tester } from '../Tester'

import { HaveLengthAssertion } from './HaveLengthAssertion'

export async function haveLengthAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when array has expected length', () => {
    const assertion = new HaveLengthAssertion(3)

    tester.expect(assertion.assert([1, 2, 3])).toBe(true)
    tester.expect(assertion.assert(['a', 'b', 'c'])).toBe(true)
    tester.expect(assertion.assert([1, 2])).toBe(false)
    tester.expect(assertion.assert([1, 2, 3, 4])).toBe(false)
    tester.expect(assertion.assert([])).toBe(false)
  })

  tester.test('asserts true when string has expected length', () => {
    const assertion = new HaveLengthAssertion(5)

    tester.expect(assertion.assert('hello')).toBe(true)
    tester.expect(assertion.assert('world')).toBe(true)
    tester.expect(assertion.assert('hi')).toBe(false)
    tester.expect(assertion.assert('greetings')).toBe(false)
    tester.expect(assertion.assert('')).toBe(false)
  })

  tester.test('works with objects that have a length property', () => {
    const assertion = new HaveLengthAssertion(2)
    
    // Custom object with length property
    const objectWithLength = { length: 2 }
    tester.expect(assertion.assert(objectWithLength)).toBe(true)
    
    // ArrayBuffer, TypedArray, etc. have a length property
    const buffer = new ArrayBuffer(2)
    tester.expect(assertion.assert(buffer)).toBe(false) // ArrayBuffer has byteLength, not length
    
    const uint8Array = new Uint8Array(2)
    tester.expect(assertion.assert(uint8Array)).toBe(true)
  })

  tester.test('returns false for values without a length property', () => {
    const assertion = new HaveLengthAssertion(0)

    tester.expect(assertion.assert(123)).toBe(false)
    tester.expect(assertion.assert(true)).toBe(false)
    tester.expect(assertion.assert({})).toBe(false)
    tester.expect(assertion.assert(null)).toBe(false)
    tester.expect(assertion.assert(undefined)).toBe(false)
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new HaveLengthAssertion(3, true)

      tester.expect(assertion.assert([1, 2, 3])).toBe(false)
      tester.expect(assertion.assert(['a', 'b', 'c'])).toBe(false)
      tester.expect(assertion.assert([1, 2])).toBe(true)
      tester.expect(assertion.assert([1, 2, 3, 4])).toBe(true)
      tester.expect(assertion.assert('hello')).toBe(true) // length 5
      tester.expect(assertion.assert(123)).toBe(true) // no length property
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when array has expected length'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts true when string has expected length'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['works with objects that have a length property'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns false for values without a length property']  ,
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
    console.log('HaveLengthAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('HaveLengthAssertion test failed')
  }
} 
