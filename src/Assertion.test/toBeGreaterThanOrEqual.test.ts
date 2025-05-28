import { Tester } from '../Tester'

export async function toBeGreaterThanOrEqualTest() {
  const tester = new Tester()

  tester.test('should pass for greater number', () => {
    tester.expect(10).toBeGreaterThanOrEqual(5)
  })

  tester.test('should pass for equal number', () => {
    tester.expect(10).toBeGreaterThanOrEqual(10)
  })

  tester.test('should fail for smaller number', () => {
    tester.expect(5).toBeGreaterThanOrEqual(10)
  })

  tester.test('should fail for non-number value', () => {
    tester.expect('string').toBeGreaterThanOrEqual(5)
  })

  tester.test('should pass for not.toBeGreaterThanOrEqual with smaller number', () => {
    tester.expect(5).not.toBeGreaterThanOrEqual(10)
  })

  tester.test('should fail for not.toBeGreaterThanOrEqual with greater number', () => {
    tester.expect(10).not.toBeGreaterThanOrEqual(5)
  })

  tester.test('should fail for not.toBeGreaterThanOrEqual with equal number', () => {
    tester.expect(10).not.toBeGreaterThanOrEqual(10)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for greater number'],
      passed: true
    },
    {
      spec: ['should pass for equal number'],
      passed: true
    },
    {
      spec: ['should fail for smaller number'],
      error: {
        message: 'Expected {{actual}} to be greater than or equal to {{expected}}, but it was not',
        messageLocals: {
          expected: '10',
          actual: '5'
        },
        expected: 10,
        actual: 5
      },
      passed: false
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
      passed: false
    },
    {
      spec: ['should pass for not.toBeGreaterThanOrEqual with smaller number'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeGreaterThanOrEqual with greater number'],
      error: {
        message: 'Expected {{actual}} not to be greater than or equal to {{expected}}, but it was',
        messageLocals: {
          expected: '5',
          actual: '10'
        },
        expected: 5,
        actual: 10
      },
      passed: false
    },
    {
      spec: ['should fail for not.toBeGreaterThanOrEqual with equal number'],
      error: {
        message: 'Expected {{actual}} not to be greater than or equal to {{expected}}, but it was',
        messageLocals: {
          expected: '10',
          actual: '10'
        },
        expected: 10,
        actual: 10
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeGreaterThanOrEqual test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeGreaterThanOrEqual test failed')
  }
} 
