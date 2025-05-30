import { Tester } from '../Tester'

export async function toHaveBeenLastCalledWithTest() {
  console.log('\n--- RUNNING toHaveBeenLastCalledWith TESTS ---')
  const tester = new Tester()

  // Test toHaveBeenLastCalledWith positive case
  tester.test('toHaveBeenLastCalledWith passes when last call matches args', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second')

    tester.expect(mock).toHaveBeenLastCalledWith('second')
  })

  // Test toHaveBeenLastCalledWith negative case
  tester.test('toHaveBeenLastCalledWith fails when last call does not match args', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second')

    tester.expect(mock).toHaveBeenLastCalledWith('first')
  })

  // Test not.toHaveBeenLastCalledWith positive case
  tester.test('not.toHaveBeenLastCalledWith passes when last call does not match args', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second')

    tester.expect(mock).not.toHaveBeenLastCalledWith('first')
  })

  // Test not.toHaveBeenLastCalledWith negative case
  tester.test('not.toHaveBeenLastCalledWith fails when last call matches args', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second')

    tester.expect(mock).not.toHaveBeenLastCalledWith('second')
  })

  // Test toHaveBeenLastCalledWith with multiple args
  tester.test('toHaveBeenLastCalledWith works with multiple args', () => {
    const mock = tester.mockFn()

    mock('a', 'b')
    mock('c', 'd', 'e')

    tester.expect(mock).toHaveBeenLastCalledWith('c', 'd', 'e')
  })

  // Test with no calls
  tester.test('toHaveBeenLastCalledWith fails when no calls were made', () => {
    const mock = tester.mockFn()

    tester.expect(mock).toHaveBeenLastCalledWith('any')
  })

  // Test with non-mock function
  tester.test('toHaveBeenLastCalledWith fails with non-mock function', () => {
    const regularFn = () => {}

    tester.expect(regularFn).toHaveBeenLastCalledWith('any')
  })

  tester.test('toHaveBeenLastCalledWith should be able to use asymmetric assertions', () => {
    const mock = tester.mockFn()

    mock({ a: 1, b: { c: 2 } })
    mock({ a: 3, b: { c: 4 } })

    tester.expect(mock).toHaveBeenLastCalledWith({ a: tester.expectAnything(), b: { c: tester.expectAnything() } })
  })

  const results = await tester.run()
  const regularFn = () => {}
  const expectedResults = [
    {
      spec: ['toHaveBeenLastCalledWith passes when last call matches args'],
      passed: true
    },
    {
      spec: ['toHaveBeenLastCalledWith fails when last call does not match args'],
      passed: false,
      error: {
        message: 'Expected last call to have been called with {{expected}}, but it was called with {{actual}}',
        messageLocals: {
          expected: 'Array',
          actual: 'Array'
        },
        expected: ['first'],
        actual: ['second'],
        difference: {
          type: 'array',
          items: [
            {
              type: 'different',
              expected: 'first',
              actual: 'second',
              same: false
            }
          ],
          same: false
        }
      }
    },
    {
      spec: ['not.toHaveBeenLastCalledWith passes when last call does not match args'],
      passed: true
    },
    {
      spec: ['not.toHaveBeenLastCalledWith fails when last call matches args'],
      passed: false,
      error: {
        message: 'Expected last call not to have been called with given arguments, but it was',
        messageLocals: {},
        expected: ['second'],
        actual: ['second'],
        difference: {
          type: 'array',
          items: [
            {
              type: 'same',
              value: 'second',
              same: true
            }
          ],
          same: true
        }
      }
    },
    {
      spec: ['toHaveBeenLastCalledWith works with multiple args'],
      passed: true
    },
    {
      spec: ['toHaveBeenLastCalledWith fails when no calls were made'],
      passed: false,
      error: {
        message: 'Expected mock function to have been called, but it was not called',
        messageLocals: {},
        expected: 'at least 1 call',
        actual: '0 calls'
      }
    },
    {
      spec: ['toHaveBeenLastCalledWith fails with non-mock function'],
      passed: false,
      error: {
        message: 'Expected a mock function, but got {{actual}}',
        messageLocals: {
          actual: '()=>{}'
        },
        expected: 'mock function'
      }
    },
    {
      spec: ['toHaveBeenLastCalledWith should be able to use asymmetric assertions'],
      passed: true
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toHaveBeenLastCalledWith test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveBeenLastCalledWith test failed')
  }
}
