import { Tester } from '../Tester'

export async function toHaveBeenCalledTest() {
  console.log('\n--- RUNNING toHaveBeenCalled TESTS ---')
  const tester = new Tester()

  // Test toHaveBeenCalled positive case
  tester.test('toHaveBeenCalled passes when function has been called', () => {
    const mock = tester.mockFn()

    mock()

    tester.expect(mock).toHaveBeenCalled()
  })

  // Test toHaveBeenCalled negative case
  tester.test('toHaveBeenCalled fails when function has not been called', () => {
    const mock = tester.mockFn()
    tester.expect(mock).toHaveBeenCalled()
  })

  // Test not.toHaveBeenCalled positive case
  tester.test('not.toHaveBeenCalled passes when function has not been called', () => {
    const mock = tester.mockFn()

    tester.expect(mock).not.toHaveBeenCalled()
  })

  // Test not.toHaveBeenCalled negative case
  tester.test('not.toHaveBeenCalled fails when function has been called', () => {
    const mock = tester.mockFn()

    mock()

    tester.expect(mock).not.toHaveBeenCalled()
  })

  // Test with multiple calls
  tester.test('toHaveBeenCalled works with multiple calls', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second')

    tester.expect(mock).toHaveBeenCalled()
  })

  // Test with non-mock function
  tester.test('toHaveBeenCalled fails with non-mock function', () => {
    const regularFn = () => {}

    tester.expect(regularFn).not.toHaveBeenCalled()
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'toHaveBeenCalled passes when function has been called',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'toHaveBeenCalled fails when function has not been called',
      error: {
        message: 'Expected mock function to have been called, but it was not called',
        messageLocals: {},
        expected: 'at least 1 call',
        actual: '0 calls'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'not.toHaveBeenCalled passes when function has not been called',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'not.toHaveBeenCalled fails when function has been called',
      error: {
        message: 'Expected mock function not to have been called, but it was called {{count}} times',
        messageLocals: {
          count: '1'
        },
        expected: 0,
        actual: 1
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'toHaveBeenCalled works with multiple calls',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'toHaveBeenCalled fails with non-mock function',
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
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveBeenCalled test failed')
  } else {
    console.log('toHaveBeenCalled test passed')
  }
}
