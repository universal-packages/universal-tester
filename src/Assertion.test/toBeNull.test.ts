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
      passed: true,
      options: {
        timeout: 5000
      }
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
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toBeNull with non-null value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeNull with null value'],
      error: {
        message: 'Expected value not to be null, but it was',
        messageLocals: {},
        expected: 'not null',
        actual: null
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeNull test failed')
  } else {
    console.log('toBeNull test passed')
  }
} 
