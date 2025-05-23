import { Tester } from '../Tester'

export async function toBeLessThanTest() {
  const tester = new Tester()

  tester.test('should pass for smaller number', () => {
    tester.expect(5).toBeLessThan(10)
  })

  tester.test('should fail for equal number', () => {
    tester.expect(10).toBeLessThan(10)
  })

  tester.test('should fail for greater number', () => {
    tester.expect(10).toBeLessThan(5)
  })

  tester.test('should fail for non-number value', () => {
    tester.expect('string').toBeLessThan(5)
  })

  tester.test('should pass for not.toBeLessThan with greater number', () => {
    tester.expect(10).not.toBeLessThan(5)
  })

  tester.test('should pass for not.toBeLessThan with equal number', () => {
    tester.expect(10).not.toBeLessThan(10)
  })

  tester.test('should fail for not.toBeLessThan with smaller number', () => {
    tester.expect(5).not.toBeLessThan(10)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass for smaller number',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for equal number',
      error: {
        message: 'Expected {{actual}} to be less than {{expected}}, but it was not',
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
      spec: 'should fail for greater number',
      error: {
        message: 'Expected {{actual}} to be less than {{expected}}, but it was not',
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
      spec: 'should fail for non-number value',
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
      spec: 'should pass for not.toBeLessThan with greater number',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toBeLessThan with equal number',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toBeLessThan with smaller number',
      error: {
        message: 'Expected {{actual}} not to be less than {{expected}}, but it was',
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
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeLessThan test failed')
  } else {
    console.log('toBeLessThan test passed')
  }
} 
