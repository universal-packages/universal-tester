import { Tester } from '../Tester'

export async function toBeTruthyTest() {
  const tester = new Tester()

  tester.test('should pass for true value', () => {
    tester.expect(true).toBeTruthy()
  })

  tester.test('should pass for non-empty string', () => {
    tester.expect('hello').toBeTruthy()
  })

  tester.test('should pass for number 1', () => {
    tester.expect(1).toBeTruthy()
  })

  tester.test('should pass for non-empty object', () => {
    tester.expect({}).toBeTruthy()
  })

  tester.test('should fail for false value', () => {
    tester.expect(false).toBeTruthy()
  })

  tester.test('should fail for empty string', () => {
    tester.expect('').toBeTruthy()
  })

  tester.test('should fail for 0', () => {
    tester.expect(0).toBeTruthy()
  })

  tester.test('should fail for null', () => {
    tester.expect(null).toBeTruthy()
  })

  tester.test('should fail for undefined', () => {
    tester.expect(undefined).toBeTruthy()
  })

  tester.test('should pass for not.toBeTruthy with falsy value', () => {
    tester.expect(false).not.toBeTruthy()
  })

  tester.test('should fail for not.toBeTruthy with truthy value', () => {
    tester.expect(true).not.toBeTruthy()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for true value'],
      passed: true
    },
    {
      spec: ['should pass for non-empty string'],
      passed: true
    },
    {
      spec: ['should pass for number 1'],
      passed: true
    },
    {
      spec: ['should pass for non-empty object'],
      passed: true
    },
    {
      spec: ['should fail for false value'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: 'false'
        },
        expected: 'truthy',
        actual: false
      },
      passed: false
    },
    {
      spec: ['should fail for empty string'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: ''
        },
        expected: 'truthy',
        actual: ''
      },
      passed: false
    },
    {
      spec: ['should fail for 0'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: '0'
        },
        expected: 'truthy',
        actual: 0
      },
      passed: false
    },
    {
      spec: ['should fail for null'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: 'null'
        },
        expected: 'truthy',
        actual: null
      },
      passed: false
    },
    {
      spec: ['should fail for undefined'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: 'undefined'
        },
        expected: 'truthy',
        actual: undefined
      },
      passed: false
    },
    {
      spec: ['should pass for not.toBeTruthy with falsy value'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeTruthy with truthy value'],
      error: {
        message: 'Expected value to be falsy, but got {{actual}}',
        messageLocals: {
          actual: 'true'
        },
        expected: 'falsy',
        actual: true
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeTruthy test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeTruthy test failed')
  }
} 
