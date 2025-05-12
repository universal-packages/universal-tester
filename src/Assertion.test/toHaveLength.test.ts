import { Tester } from '../Tester'

export async function toHaveLengthTest() {
  const tester = new Tester()

  tester.test('should pass for array with correct length', () => {
    tester.expect([1, 2, 3]).toHaveLength(3)
  })

  tester.test('should fail for array with incorrect length', () => {
    tester.expect([1, 2, 3]).toHaveLength(4)
  })

  tester.test('should pass for string with correct length', () => {
    tester.expect('hello').toHaveLength(5)
  })

  tester.test('should fail for string with incorrect length', () => {
    tester.expect('hello').toHaveLength(4)
  })

  tester.test('should fail for value without length property', () => {
    tester.expect(123).toHaveLength(3)
  })

  tester.test('should pass for not.toHaveLength with array of different length', () => {
    tester.expect([1, 2, 3]).not.toHaveLength(4)
  })

  tester.test('should fail for not.toHaveLength with array of specified length', () => {
    tester.expect([1, 2, 3]).not.toHaveLength(3)
  })

  tester.test('should pass for not.toHaveLength with string of different length', () => {
    tester.expect('hello').not.toHaveLength(4)
  })

  tester.test('should fail for not.toHaveLength with string of specified length', () => {
    tester.expect('hello').not.toHaveLength(5)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass for array with correct length',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array with incorrect length',
      error: {
        message: 'Expected {{actual}} to have length {{expected}}, but got length {{actualLength}}',
        messageLocals: {
          expected: '4',
          actual: 'Array',
          actualLength: '3'
        },
        expected: 4,
        actual: 3
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for string with correct length',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for string with incorrect length',
      error: {
        message: 'Expected {{actual}} to have length {{expected}}, but got length {{actualLength}}',
        messageLocals: {
          expected: '4',
          actual: 'hello',
          actualLength: '5'
        },
        expected: 4,
        actual: 5
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for value without length property',
      error: {
        message: 'Expected value to have a length, but it does not',
        messageLocals: {},
        expected: 'value with length property',
        actual: 123
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toHaveLength with array of different length',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toHaveLength with array of specified length',
      error: {
        message: 'Expected {{actual}} not to have length {{expected}}, but it did',
        messageLocals: {
          expected: '3',
          actual: 'Array'
        },
        expected: 3,
        actual: 3
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toHaveLength with string of different length',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toHaveLength with string of specified length',
      error: {
        message: 'Expected {{actual}} not to have length {{expected}}, but it did',
        messageLocals: {
          expected: '5',
          actual: 'hello'
        },
        expected: 5,
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
    throw new Error('toHaveLength test failed')
  } else {
    console.log('toHaveLength test passed')
  }
} 
