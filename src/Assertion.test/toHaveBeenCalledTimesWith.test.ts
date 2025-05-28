import { Tester } from '../Tester'

export async function toHaveBeenCalledTimesWithTest() {
  const tester = new Tester()

  // Test basic functionality - exact match
  tester.test('toHaveBeenCalledTimesWith passes when function has been called expected times with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('world', 456)
    mock('hello', 123)

    tester.expect(mock).toHaveBeenCalledTimesWith(2, 'hello', 123)
  })

  // Test when called fewer times with matching arguments
  tester.test('toHaveBeenCalledTimesWith fails when function has been called fewer times with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('world', 456)

    tester.expect(mock).toHaveBeenCalledTimesWith(2, 'hello', 123)
  })

  // Test when called more times with matching arguments
  tester.test('toHaveBeenCalledTimesWith fails when function has been called more times with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('hello', 123)
    mock('hello', 123)

    tester.expect(mock).toHaveBeenCalledTimesWith(2, 'hello', 123)
  })

  // Test not.toHaveBeenCalledTimesWith with different count
  tester.test('not.toHaveBeenCalledTimesWith passes when function has been called different times with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('world', 456)

    tester.expect(mock).not.toHaveBeenCalledTimesWith(2, 'hello', 123)
  })

  // Test not.toHaveBeenCalledTimesWith with exact count
  tester.test('not.toHaveBeenCalledTimesWith fails when function has been called expected times with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('world', 456)
    mock('hello', 123)

    tester.expect(mock).not.toHaveBeenCalledTimesWith(2, 'hello', 123)
  })

  // Test with objects
  tester.test('toHaveBeenCalledTimesWith works with objects using deep equality', () => {
    const mock = tester.mockFn()

    mock({ a: 1, b: { c: 2 } })
    mock({ a: 1, b: { c: 2 } })
    mock({ a: 1, b: { c: 3 } })

    tester.expect(mock).toHaveBeenCalledTimesWith(2, { a: 1, b: { c: 2 } })
  })

  // Test with arrays
  tester.test('toHaveBeenCalledTimesWith works with arrays', () => {
    const mock = tester.mockFn()

    mock([1, 2, { nested: 'value' }])
    mock([1, 2, { nested: 'value' }])
    mock([1, 2, { nested: 'other' }])

    tester.expect(mock).toHaveBeenCalledTimesWith(2, [1, 2, { nested: 'value' }])
  })

  // Test with non-mock function
  tester.test('toHaveBeenCalledTimesWith fails with non-mock function', () => {
    const regularFn = () => {}

    tester.expect(regularFn).toHaveBeenCalledTimesWith(1, 'hello')
  })

  // Test with asymmetric assertions
  tester.test('toHaveBeenCalledTimesWith works with asymmetric assertions', () => {
    const mock = tester.mockFn()

    mock({ a: 1, b: { c: 2 } })
    mock({ a: 1, b: { c: 2 } })
    mock({ a: 3, b: { c: 2 } })

    tester.expect(mock).toHaveBeenCalledTimesWith(2, { a: tester.expectAnything(), b: { c: 2 } })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['toHaveBeenCalledTimesWith passes when function has been called expected times with matching arguments'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith fails when function has been called fewer times with matching arguments'],
      error: {
        message: 'Expected mock function to have been called {{expected}} times with given arguments, but it was called {{actual}} times with those arguments',
        messageLocals: {
          expected: '2',
          actual: '1'
        },
        expected: 2,
        actual: 1,
        allCalls: [
          ['hello', 123],
          ['world', 456]
        ]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith fails when function has been called more times with matching arguments'],
      error: {
        message: 'Expected mock function to have been called {{expected}} times with given arguments, but it was called {{actual}} times with those arguments',
        messageLocals: {
          expected: '2',
          actual: '3'
        },
        expected: 2,
        actual: 3,
        allCalls: [
          ['hello', 123],
          ['hello', 123],
          ['hello', 123]
        ]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['not.toHaveBeenCalledTimesWith passes when function has been called different times with matching arguments'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['not.toHaveBeenCalledTimesWith fails when function has been called expected times with matching arguments'],
      error: {
        message: 'Expected mock function not to have been called {{expected}} times with given arguments, but it was',
        messageLocals: {
          expected: '2'
        },
        expected: 2,
        actual: 2
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith works with objects using deep equality'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith works with arrays'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith fails with non-mock function'],
      error: {
        message: 'Expected a mock function, but got {{actual}}',
        messageLocals: {
          actual: '()=>{}'
        },
        expected: 'mock function'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledTimesWith works with asymmetric assertions'],
      error: {
        message: 'Expected mock function to have been called {{expected}} times with given arguments, but it was called {{actual}} times with those arguments',
        messageLocals: {
          expected: '2',
          actual: '3'
        },
        expected: 2,
        actual: 3,
        allCalls: [
          [
            {
              a: 1,
              b: {
                c: 2
              }
            }
          ],
          [
            {
              a: 1,
              b: {
                c: 2
              }
            }
          ],
          [
            {
              a: 3,
              b: {
                c: 2
              }
            }
          ]
        ]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveBeenCalledTimesWith test failed')
  } else {
    console.log('toHaveBeenCalledTimesWith test passed')
  }
}
