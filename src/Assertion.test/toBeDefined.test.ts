import { Tester } from '../Tester'

export async function toBeDefinedTest() {
  const tester = new Tester()

  tester.test('should pass for defined value', () => {
    tester.expect('hello').toBeDefined()
  })

  tester.test('should pass for null value', () => {
    tester.expect(null).toBeDefined()
  })

  tester.test('should fail for undefined value', () => {
    tester.expect(undefined).toBeDefined()
  })

  tester.test('should pass for not.toBeDefined with undefined value', () => {
    tester.expect(undefined).not.toBeDefined()
  })

  tester.test('should fail for not.toBeDefined with defined value', () => {
    tester.expect('hello').not.toBeDefined()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for defined value'],
      passed: true
    },
    {
      spec: ['should pass for null value'],
      passed: true
    },
    {
      spec: ['should fail for undefined value'],
      error: {
        message: 'Expected value to be defined, but it was undefined',
        messageLocals: {},
        expected: 'defined',
        actual: undefined
      },
      passed: false
    },
    {
      spec: ['should pass for not.toBeDefined with undefined value'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeDefined with defined value'],
      error: {
        message: 'Expected value to be undefined, but got {{actual}}',
        messageLocals: {
          actual: 'hello'
        },
        expected: undefined,
        actual: 'hello'
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeDefined test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeDefined test failed')
  }
} 
