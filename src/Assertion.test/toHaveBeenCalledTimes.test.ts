import { Tester } from '../Tester'

export async function toHaveBeenCalledTimesTest() {
  console.log('\n--- RUNNING toHaveBeenCalledTimes TESTS ---')
  const tester = new Tester()

  // Test toHaveBeenCalledTimes with exact match
  tester.test('toHaveBeenCalledTimes passes when function has been called expected times', () => {
    const mock = tester.mockFn()

    mock()
    mock()
    mock()

    tester.expect(mock).toHaveBeenCalledTimes(3)
  })

  // Test toHaveBeenCalledTimes when called more times
  tester.test('toHaveBeenCalledTimes fails when function has been called more than expected', () => {
    const mock = tester.mockFn()

    mock()
    mock()
    mock()

    tester.expect(mock).toHaveBeenCalledTimes(2)
  })

  // Test toHaveBeenCalledTimes when called fewer times
  tester.test('toHaveBeenCalledTimes fails when function has been called fewer than expected', () => {
    const mock = tester.mockFn()

    mock()

    tester.expect(mock).toHaveBeenCalledTimes(2)
  })

  // Test not.toHaveBeenCalledTimes with different count
  tester.test('not.toHaveBeenCalledTimes passes when function has been called different times', () => {
    const mock = tester.mockFn()

    mock()
    mock()

    tester.expect(mock).not.toHaveBeenCalledTimes(3)
  })

  // Test not.toHaveBeenCalledTimes with exact count
  tester.test('not.toHaveBeenCalledTimes fails when function has been called expected times', () => {
    const mock = tester.mockFn()

    mock()
    mock()

    tester.expect(mock).not.toHaveBeenCalledTimes(2)
  })

  // Test with non-mock function
  tester.test('toHaveBeenCalledTimes fails with non-mock function', () => {
    const regularFn = () => {}

    tester.expect(regularFn).toHaveBeenCalledTimes(1)
  })

  const results = await tester.run()
  const regularFn = () => {}
  const expectedResults = [
    {
      spec: 'toHaveBeenCalledTimes passes when function has been called expected times',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'toHaveBeenCalledTimes fails when function has been called more than expected',
      error: {
        message: 'Expected mock function to have been called {{expected}} times, but it was called {{actual}} times',
        messageLocals: {
          expected: '2',
          actual: '3'
        },
        expected: 2,
        actual: 3
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'toHaveBeenCalledTimes fails when function has been called fewer than expected',
      error: {
        message: 'Expected mock function to have been called {{expected}} times, but it was called {{actual}} times',
        messageLocals: {
          expected: '2',
          actual: '1'
        },
        expected: 2,
        actual: 1
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'not.toHaveBeenCalledTimes passes when function has been called different times',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'not.toHaveBeenCalledTimes fails when function has been called expected times',
      error: {
        message: 'Expected mock function not to have been called {{expected}} times, but it was',
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
      spec: 'toHaveBeenCalledTimes fails with non-mock function',
      error: {
        message: 'Expected a mock function, but got {{actual}}',
        messageLocals: {
          actual: '()=>{}'
        },
        expected: 'mock function',
        actual: regularFn
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveBeenCalledTimes test failed')
  } else {
    console.log('toHaveBeenCalledTimes test passed')
  }
} 
