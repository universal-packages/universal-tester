import { Tester } from '../Tester'

export async function toBeUndefinedTest() {
  const tester = new Tester()

  tester.test('should pass for undefined value', () => {
    tester.expect(undefined).toBeUndefined()
  })

  tester.test('should fail for defined value', () => {
    tester.expect('hello').toBeUndefined()
  })

  tester.test('should pass for not.toBeUndefined with defined value', () => {
    tester.expect('hello').not.toBeUndefined()
  })

  tester.test('should fail for not.toBeUndefined with undefined value', () => {
    tester.expect(undefined).not.toBeUndefined()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for undefined value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for defined value'],
      error: {
        message: 'Expected value to be undefined, but got {{actual}}',
        messageLocals: {
          actual: 'hello'
        },
        expected: undefined,
        actual: 'hello'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toBeUndefined with defined value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeUndefined with undefined value'],
      error: {
        message: 'Expected value not to be undefined, but it was',
        messageLocals: {},
        expected: 'not undefined',
        actual: undefined
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeUndefined test failed')
  } else {
    console.log('toBeUndefined test passed')
  }
} 
