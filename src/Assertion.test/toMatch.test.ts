import { Tester } from '../Tester'

export async function toMatchTest() {
  const tester = new Tester()

  tester.test('should pass for string matching regex', () => {
    tester.expect('hello world').toMatch(/world/)
  })

  tester.test('should fail for string not matching regex', () => {
    tester.expect('hello world').toMatch(/universe/)
  })

  tester.test('should fail for non-string value', () => {
    tester.expect(123).toMatch(/123/)
  })

  tester.test('should pass for not.toMatch with non-matching regex', () => {
    tester.expect('hello world').not.toMatch(/universe/)
  })

  tester.test('should fail for not.toMatch with matching regex', () => {
    tester.expect('hello world').not.toMatch(/world/)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for string matching regex'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for string not matching regex'],
      error: {
        message: 'Expected {{actual}} to match {{expected}}, but it did not',
        messageLocals: {
          expected: '/universe/',
          actual: 'hello world'
        },
        expected: /universe/,
        actual: 'hello world'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-string value'],
      error: {
        message: 'Expected a string, but got {{actual}}',
        messageLocals: {
          actual: '123'
        },
        expected: 'string',
        actual: 123
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toMatch with non-matching regex'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toMatch with matching regex'],
      error: {
        message: 'Expected {{actual}} not to match {{expected}}, but it did',
        messageLocals: {
          expected: '/world/',
          actual: 'hello world'
        },
        expected: /world/,
        actual: 'hello world'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toMatch test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toMatch test failed')
  }
} 
