import { Tester } from '../Tester'

export async function toBeCloseToTest() {
  const tester = new Tester()

  tester.test('should pass for numbers that are close', () => {
    tester.expect(0.1 + 0.2).toBeCloseTo(0.3)
  })

  tester.test('should fail for numbers that are not close', () => {
    tester.expect(0.1 + 0.2).toBeCloseTo(0.4)
  })

  tester.test('should pass with custom precision', () => {
    tester.expect(0.1234).toBeCloseTo(0.1239, 3)
  })

  tester.test('should fail with custom precision', () => {
    tester.expect(0.1234).toBeCloseTo(0.1239, 4)
  })

  tester.test('should fail for non-number value', () => {
    tester.expect('string').toBeCloseTo(5)
  })

  tester.test('should pass for not.toBeCloseTo with numbers that are not close', () => {
    tester.expect(0.1 + 0.2).not.toBeCloseTo(0.4)
  })

  tester.test('should fail for not.toBeCloseTo with numbers that are close', () => {
    tester.expect(0.1 + 0.2).not.toBeCloseTo(0.3)
  })

  tester.test('should pass for not.toBeCloseTo with custom precision', () => {
    tester.expect(0.1234).not.toBeCloseTo(0.1239, 4)
  })

  tester.test('should fail for not.toBeCloseTo with custom precision', () => {
    tester.expect(0.1234).not.toBeCloseTo(0.1239, 3)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for numbers that are close'],
      passed: true
    },
    {
      spec: ['should fail for numbers that are not close'],
      error: {
        message: 'Expected {{actual}} to be close to {{expected}} (precision: {{precision}}), but it was not',
        messageLocals: {
          expected: '0.4',
          actual: '0.30000000000000004',
          precision: '2'
        },
        expected: 0.4,
        actual: 0.30000000000000004
      },
      passed: false
    },
    {
      spec: ['should pass with custom precision'],
      passed: true
    },
    {
      spec: ['should fail with custom precision'],
      error: {
        message: 'Expected {{actual}} to be close to {{expected}} (precision: {{precision}}), but it was not',
        messageLocals: {
          expected: '0.1239',
          actual: '0.1234',
          precision: '4'
        },
        expected: 0.1239,
        actual: 0.1234
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
      spec: ['should pass for not.toBeCloseTo with numbers that are not close'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeCloseTo with numbers that are close'],
      error: {
        message: 'Expected {{actual}} not to be close to {{expected}} (precision: {{precision}}), but it was',
        messageLocals: {
          expected: '0.3',
          actual: '0.30000000000000004',
          precision: '2'
        },
        expected: 0.3,
        actual: 0.30000000000000004
      },
      passed: false
    },
    {
      spec: ['should pass for not.toBeCloseTo with custom precision'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeCloseTo with custom precision'],
      error: {
        message: 'Expected {{actual}} not to be close to {{expected}} (precision: {{precision}}), but it was',
        messageLocals: {
          expected: '0.1239',
          actual: '0.1234',
          precision: '3'
        },
        expected: 0.1239,
        actual: 0.1234
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeCloseTo test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeCloseTo test failed')
  }
}
