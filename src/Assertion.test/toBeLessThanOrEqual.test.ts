import { Tester } from '../Tester'

export async function toBeLessThanOrEqualTest() {
  const tester = new Tester()

  tester.test('should pass for smaller number', () => {
    tester.expect(5).toBeLessThanOrEqual(10)
  })

  tester.test('should pass for equal number', () => {
    tester.expect(10).toBeLessThanOrEqual(10)
  })

  tester.test('should fail for greater number', () => {
    tester.expect(10).toBeLessThanOrEqual(5)
  })

  tester.test('should fail for non-number value', () => {
    tester.expect('string').toBeLessThanOrEqual(5)
  })

  tester.test('should pass for not.toBeLessThanOrEqual with greater number', () => {
    tester.expect(10).not.toBeLessThanOrEqual(5)
  })

  tester.test('should fail for not.toBeLessThanOrEqual with smaller number', () => {
    tester.expect(5).not.toBeLessThanOrEqual(10)
  })

  tester.test('should fail for not.toBeLessThanOrEqual with equal number', () => {
    tester.expect(10).not.toBeLessThanOrEqual(10)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for smaller number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for equal number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for greater number'],
      error: {
        message: 'Expected {{actual}} to be less than or equal to {{expected}}, but it was not',
        messageLocals: {
          expected: '5',
          actual: '10'
        },
        expected: 5,
        actual: 10
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-number value'],
      error: {
        message: 'Expected a number, but got {{actual}}',
        messageLocals: {
          actual: 'string'
        },
        expected: 'number',
        actual: 'string'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toBeLessThanOrEqual with greater number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeLessThanOrEqual with smaller number'],
      error: {
        message: 'Expected {{actual}} not to be less than or equal to {{expected}}, but it was',
        messageLocals: {
          expected: '10',
          actual: '5'
        },
        expected: 10,
        actual: 5
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeLessThanOrEqual with equal number'],
      error: {
        message: 'Expected {{actual}} not to be less than or equal to {{expected}}, but it was',
        messageLocals: {
          expected: '10',
          actual: '10'
        },
        expected: 10,
        actual: 10
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeLessThanOrEqual test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeLessThanOrEqual test failed')
  }
} 
