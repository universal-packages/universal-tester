import { Tester } from './Tester'
import { MockFn } from './createMockFunction.types'

export async function createMockFunctionTest() {
  console.log('\n--- RUNNING mock TESTS ---')
  const tester = new Tester()

  // Basic mock function
  tester.test('creates a mock function that returns undefined by default', () => {
    const mock: MockFn = tester.mockFn()
    tester.expect(mock()).toBeUndefined()
  })

  // Implement functionality
  tester.test('implements a function', () => {
    const mock = tester.mockFn()
    mock.implement((a: number, b: number) => a + b)
    tester.expect(mock(1, 2)).toBe(3)
    tester.expect(mock(3, 4)).toBe(7)
  })

  // ImplementOnce
  tester.test('implements a function once', () => {
    const mock = tester.mockFn()
    mock.implementOnce(() => 'first call')
    mock.implementOnce(() => 'second call')
    tester.expect(mock()).toBe('first call')
    tester.expect(mock()).toBe('second call')
    tester.expect(mock()).toBeUndefined()
  })

  // Scenario-based returns
  tester.test('returns values based on argument scenarios', () => {
    const mock = tester.mockFn()

    mock.scenario([1, 2], 'one and two')
    mock.scenario(['hello'], 'greeting')
    mock.scenario([{ a: 1, b: 2 }], 'object match')

    tester.expect(mock(1, 2)).toBe('one and two')
    tester.expect(mock('hello')).toBe('greeting')
    tester.expect(mock({ a: 1, b: 2 })).toBe('object match')
    tester.expect(mock('other')).toBeUndefined()
  })

  // Tracking calls
  tester.test('tracks function calls', () => {
    const mock = tester.mockFn()

    mock('first')
    mock('second', 123)
    mock({ complex: 'object' })

    tester.expect(mock.calls.length).toBe(3)
    tester.expect(mock.calls[0].args).toEqual(['first'])
    tester.expect(mock.calls[1].args).toEqual(['second', 123])
    tester.expect(mock.calls[2].args[0]).toEqual({ complex: 'object' })
  })

  // toHaveBeenCalled
  tester.test('asserts if a function has been called', () => {
    const mock = tester.mockFn()

    tester.expect(mock).not.toHaveBeenCalled()

    mock()

    tester.expect(mock).toHaveBeenCalled()
  })

  // toHaveBeenCalledWith
  tester.test('asserts if a function has been called with specific arguments', () => {
    const mock = tester.mockFn()

    mock('hello', 123)
    mock('world')

    tester.expect(mock).toHaveBeenCalledWith('hello', 123)
    tester.expect(mock).toHaveBeenCalledWith('world')
    tester.expect(mock).not.toHaveBeenCalledWith('other')
    tester.expect(mock).not.toHaveBeenCalledWith('hello', 456)
  })

  // Complex objects
  tester.test('handles complex object matching', () => {
    const mock = tester.mockFn()

    const complexObj = {
      a: 1,
      b: {
        c: [1, 2, 3],
        d: { e: 'nested' }
      }
    }

    mock(complexObj)

    tester.expect(mock).toHaveBeenCalledWith({
      a: 1,
      b: {
        c: [1, 2, 3],
        d: { e: 'nested' }
      }
    })
  })

  // Reset functionality
  tester.test('resets the mock function', () => {
    const mock = tester.mockFn()

    mock.implement(() => 'implementation')
    mock.scenario([1], 'one')
    mock()

    mock.reset()

    tester.expect(mock.calls.length).toBe(0)
    tester.expect(mock()).toBeUndefined()
    tester.expect(mock(1)).toBeUndefined() // Scenario should be gone
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['creates a mock function that returns undefined by default'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['implements a function'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['implements a function once'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['returns values based on argument scenarios'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['tracks function calls'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts if a function has been called'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts if a function has been called with specific arguments'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['handles complex object matching'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['resets the mock function'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('createMockFunction test failed')
  } else {
    console.log('createMockFunction test passed')
  }
}
