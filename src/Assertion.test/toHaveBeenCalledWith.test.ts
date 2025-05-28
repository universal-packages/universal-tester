import { Tester } from '../Tester'

export async function toHaveBeenCalledWithTest() {
  console.log('\n--- RUNNING toHaveBeenCalledWith TESTS ---')
  const tester = new Tester()

  // Test toHaveBeenCalledWith with primitive arguments
  tester.test('toHaveBeenCalledWith passes when function was called with matching primitive arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123, true)

    tester.expect(mock).toHaveBeenCalledWith('hello', 123, true)
  })

  // Test toHaveBeenCalledWith fails with wrong arguments
  tester.test('toHaveBeenCalledWith fails when function was not called with matching arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)

    tester.expect(mock).toHaveBeenCalledWith('hello', 456)
  })

  // Test not.toHaveBeenCalledWith
  tester.test('not.toHaveBeenCalledWith passes when function was not called with given arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)

    tester.expect(mock).not.toHaveBeenCalledWith('world', 456)
  })

  // Test not.toHaveBeenCalledWith fails when function was called with given arguments
  tester.test('not.toHaveBeenCalledWith fails when function was called with given arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)

    tester.expect(mock).not.toHaveBeenCalledWith('hello', 123)
  })

  // Test toHaveBeenCalledWith with objects
  tester.test('toHaveBeenCalledWith works with objects using deep equality', () => {
    const mock = tester.mockFn()

    mock({ a: 1, b: { c: 2 } })

    tester.expect(mock).toHaveBeenCalledWith({ a: 1, b: { c: 2 } })
  })

  // Test toHaveBeenCalledWith with arrays
  tester.test('toHaveBeenCalledWith works with arrays', () => {
    const mock = tester.mockFn()

    mock([1, 2, { nested: 'value' }])

    tester.expect(mock).toHaveBeenCalledWith([1, 2, { nested: 'value' }])
  })

  // Test with multiple calls finding the right match
  tester.test('toHaveBeenCalledWith finds matching call among multiple calls', () => {
    const mock = tester.mockFn()

    mock('first', 1)
    mock('second', 2)
    mock('third', 3)

    tester.expect(mock).toHaveBeenCalledWith('second', 2)
  })

  // Test with non-mock function
  tester.test('toHaveBeenCalledWith fails with non-mock function', () => {
    const regularFn = () => {}

    tester.expect(regularFn).toHaveBeenCalledWith(1, 2)
  })

  tester.test('toHaveBeenCalledWith should be able to use asymmetric assertions', () => {
    const mock = tester.mockFn()

    mock({ a: 1, b: { c: 2 } })

    tester.expect(mock).toHaveBeenCalledWith({ a: tester.expectAnything(), b: { c: 2 } })
    tester.expect(mock).toHaveBeenCalledWith(tester.expectAnything())
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['toHaveBeenCalledWith passes when function was called with matching primitive arguments'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledWith fails when function was not called with matching arguments'],
      error: {
        message: 'Expected mock function to have been called with given arguments, but it was not',
        messageLocals: {},
        expected: ['hello', 456],
        actual: [['hello', 123]],
        differences: [
          {
            type: 'array',
            items: [
              {
                type: 'same',
                value: 'hello',
                same: true
              },
              {
                type: 'different',
                expected: 456,
                actual: 123,
                same: false
              }
            ],
            same: false
          }
        ]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['not.toHaveBeenCalledWith passes when function was not called with given arguments'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['not.toHaveBeenCalledWith fails when function was called with given arguments'],
      error: {
        message: 'Expected mock function not to have been called with given arguments, but it was',
        messageLocals: {},
        expected: ['hello', 123],
        actual: [['hello', 123]],
        differences: [
          {
            type: 'array',
            items: [
              {
                type: 'same',
                value: 'hello',
                same: true
              },
              {
                type: 'same',
                value: 123,
                same: true
              }
            ],
            same: true
          }
        ]
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledWith works with objects using deep equality'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledWith works with arrays'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledWith finds matching call among multiple calls'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['toHaveBeenCalledWith fails with non-mock function'],
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
      spec: ['toHaveBeenCalledWith should be able to use asymmetric assertions'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toHaveBeenCalledWith test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveBeenCalledWith test failed')
  }
}
