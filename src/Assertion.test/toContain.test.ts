import { Tester } from '../Tester'

export async function toContainTest() {
  const tester = new Tester()

  tester.test('should pass for string containing substring', () => {
    tester.expect('hello world').toContain('world')
  })

  tester.test('should fail for string not containing substring', () => {
    tester.expect('hello world').toContain('universe')
  })

  tester.test('should pass for array containing element', () => {
    tester.expect([1, 2, 3]).toContain(2)
  })

  tester.test('should fail for array not containing element', () => {
    tester.expect([1, 2, 3]).toContain(4)
  })

  tester.test('should fail for non-string, non-array value', () => {
    tester.expect(123).toContain(2)
  })

  tester.test('should pass for not.toContain with string not containing substring', () => {
    tester.expect('hello world').not.toContain('universe')
  })

  tester.test('should fail for not.toContain with string containing substring', () => {
    tester.expect('hello world').not.toContain('world')
  })

  tester.test('should pass for not.toContain with array not containing element', () => {
    tester.expect([1, 2, 3]).not.toContain(4)
  })

  tester.test('should fail for not.toContain with array containing element', () => {
    tester.expect([1, 2, 3]).not.toContain(2)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass for string containing substring',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for string not containing substring',
      error: {
        message: 'Expected {{actual}} to contain {{expected}}, but it did not',
        messageLocals: {
          expected: 'universe',
          actual: 'hello world'
        },
        expected: 'universe',
        actual: 'hello world'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for array containing element',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array not containing element',
      error: {
        message: 'Expected {{actual}} to contain {{expected}}, but it did not',
        messageLocals: {
          expected: '4',
          actual: 'Array'
        },
        expected: 4,
        actual: [1, 2, 3]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for non-string, non-array value',
      error: {
        message: 'Expected a string or array, but got {{actual}}',
        messageLocals: {
          actual: '123'
        },
        expected: 'string or array',
        actual: 123
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toContain with string not containing substring',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toContain with string containing substring',
      error: {
        message: 'Expected {{actual}} not to contain {{expected}}, but it did',
        messageLocals: {
          expected: 'world',
          actual: 'hello world'
        },
        expected: 'world',
        actual: 'hello world'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toContain with array not containing element',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toContain with array containing element',
      error: {
        message: 'Expected {{actual}} not to contain {{expected}}, but it did',
        messageLocals: {
          expected: '2',
          actual: 'Array'
        },
        expected: 2,
        actual: [1, 2, 3]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toContain test failed')
  } else {
    console.log('toContain test passed')
  }
} 
