import { Tester } from '../Tester'

export async function toBeGreaterThanTest() {
  const tester = new Tester()

  tester.test('should pass for greater number', () => {
    tester.expect(10).toBeGreaterThan(5)
  })

  tester.test('should fail for equal number', () => {
    tester.expect(10).toBeGreaterThan(10)
  })

  tester.test('should fail for smaller number', () => {
    tester.expect(5).toBeGreaterThan(10)
  })

  tester.test('should fail for non-number value', () => {
    tester.expect('string').toBeGreaterThan(5)
  })

  tester.test('should pass for not.toBeGreaterThan with smaller number', () => {
    tester.expect(5).not.toBeGreaterThan(10)
  })

  tester.test('should pass for not.toBeGreaterThan with equal number', () => {
    tester.expect(10).not.toBeGreaterThan(10)
  })

  tester.test('should fail for not.toBeGreaterThan with greater number', () => {
    tester.expect(10).not.toBeGreaterThan(5)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for greater number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for equal number'],
      error: {
        message: 'Expected {{actual}} to be greater than {{expected}}, but it was not',
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
    },
    {
      spec: ['should fail for smaller number'],
      error: {
        message: 'Expected {{actual}} to be greater than {{expected}}, but it was not',
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
      spec: ['should pass for not.toBeGreaterThan with smaller number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toBeGreaterThan with equal number'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeGreaterThan with greater number'],
      error: {
        message: 'Expected {{actual}} not to be greater than {{expected}}, but it was',
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
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeGreaterThan test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeGreaterThan test failed')
  }
} 
