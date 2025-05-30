import { Tester } from '../Tester'

export async function toBeNullTest() {
  const tester = new Tester()

  tester.test('should pass for null value', () => {
    tester.expect(null).toBeNull()
  })

  tester.test('should fail for non-null value', () => {
    tester.expect('hello').toBeNull()
  })

  tester.test('should pass for not.toBeNull with non-null value', () => {
    tester.expect('hello').not.toBeNull()
  })

  tester.test('should fail for not.toBeNull with null value', () => {
    tester.expect(null).not.toBeNull()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for null value'], 
      passed: true
    },
    {
      spec: ['should fail for non-null value'],
      error: {
        message: 'Expected value to be null, but got {{actual}}',
        messageLocals: {
          actual: 'hello'
        },
        expected: null,
        actual: 'hello'
      },
      passed: false
    },
    {
      spec: ['should pass for not.toBeNull with non-null value'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeNull with null value'],
      error: {
        message: 'Expected value not to be null, but it was',
        messageLocals: {},
        expected: 'not null',
        actual: null
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeNull test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeNull test failed')
  }
} 
