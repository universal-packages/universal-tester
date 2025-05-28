import { TestError } from '../TestError'
import { Tester } from '../Tester'

export async function toBeNaNTest() {
  const tester = new Tester()

  tester.test('should pass for NaN value', () => {
    tester.expect(NaN).toBeNaN()
  })

  tester.test('should fail for number value', () => {
    tester.expect(10).toBeNaN()
  })

  tester.test('should fail for string value', () => {
    tester.expect('not a number').toBeNaN()
  })

  tester.test('should fail for null value', () => {
    tester.expect(null).toBeNaN()
  })

  tester.test('should fail for undefined value', () => {
    tester.expect(undefined).toBeNaN()
  })

  tester.test('should pass for not.toBeNaN with number value', () => {
    tester.expect(10).not.toBeNaN()
  })

  tester.test('should fail for not.toBeNaN with NaN value', () => {
    tester.expect(NaN).not.toBeNaN()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for NaN value'],
      passed: true
    },
    {
      spec: ['should fail for number value'],
      error: {
        message: 'Expected value to be NaN, but got {{actual}}',
        messageLocals: {
          actual: '10'
        },
        expected: NaN,
        actual: 10
      },
      passed: false
    },
    {
      spec: ['should fail for string value'],
      error: {
        message: 'Expected value to be NaN, but got {{actual}}',
        messageLocals: {
          actual: 'not a number'
        },
        expected: NaN,
        actual: 'not a number'
      },
      passed: false
    },
    {
      spec: ['should fail for null value'],
      error: {
        message: 'Expected value to be NaN, but got {{actual}}',
        messageLocals: {
          actual: 'null'
        },
        expected: NaN,
        actual: null
      },
      passed: false
    },
    {
      spec: ['should fail for undefined value'],
      error: {
        message: 'Expected value to be NaN, but got {{actual}}',
        messageLocals: {
          actual: 'undefined'
        },
        expected: NaN,
        actual: undefined
      },
      passed: false
    },
    {
      spec: ['should pass for not.toBeNaN with number value'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeNaN with NaN value'],
      error: {
        message: 'Expected value not to be NaN, but it was',
        messageLocals: {},
        expected: 'not NaN',
        actual: NaN
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeNaN test passed')
  } catch (error) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeNaN test failed')
  }
}
