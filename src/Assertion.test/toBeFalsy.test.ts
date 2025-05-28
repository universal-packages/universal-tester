import { Tester } from '../Tester'

export async function toBeFalsyTest() {
  const tester = new Tester()

  tester.test('should pass for false value', () => {
    tester.expect(false).toBeFalsy()
  })

  tester.test('should pass for empty string', () => {
    tester.expect('').toBeFalsy()
  })

  tester.test('should pass for 0', () => {
    tester.expect(0).toBeFalsy()
  })

  tester.test('should pass for null', () => {
    tester.expect(null).toBeFalsy()
  })

  tester.test('should pass for undefined', () => {
    tester.expect(undefined).toBeFalsy()
  })

  tester.test('should fail for true value', () => {
    tester.expect(true).toBeFalsy()
  })

  tester.test('should fail for non-empty string', () => {
    tester.expect('hello').toBeFalsy()
  })

  tester.test('should fail for number 1', () => {
    tester.expect(1).toBeFalsy()
  })

  tester.test('should fail for non-empty object', () => {
    tester.expect({}).toBeFalsy()
  })

  tester.test('should pass for not.toBeFalsy with truthy value', () => {
    tester.expect(true).not.toBeFalsy()
  })

  tester.test('should fail for not.toBeFalsy with falsy value', () => {
    tester.expect(false).not.toBeFalsy()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for false value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for empty string'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for 0'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for null'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for undefined'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for true value'],
      error: {
        message: 'Expected value to be falsy, but got {{actual}}',
        messageLocals: {
          actual: 'true'
        },
        expected: 'falsy',
        actual: true
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-empty string'],
      error: {
        message: 'Expected value to be falsy, but got {{actual}}',
        messageLocals: {
          actual: 'hello'
        },
        expected: 'falsy',
        actual: 'hello'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for number 1'],
      error: {
        message: 'Expected value to be falsy, but got {{actual}}',
        messageLocals: {
          actual: '1'
        },
        expected: 'falsy',
        actual: 1
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-empty object'],
      error: {
        message: 'Expected value to be falsy, but got {{actual}}',
        messageLocals: {
          actual: 'Object'
        },
        expected: 'falsy',
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toBeFalsy with truthy value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toBeFalsy with falsy value'],
      error: {
        message: 'Expected value to be truthy, but got {{actual}}',
        messageLocals: {
          actual: 'false'
        },
        expected: 'truthy',
        actual: false
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeFalsy test failed')
  } else {
    console.log('toBeFalsy test passed')
  }
} 
