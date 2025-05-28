import { Tester } from '../Tester'

export async function toResolveTest() {
  const tester = new Tester()

  tester.test('should pass for promise that resolves', async () => {
    await tester.expect(Promise.resolve('success')).toResolve()
  })

  tester.test('should fail for promise that rejects', async () => {
    await tester.expect(Promise.reject(new Error('error'))).toResolve()
  })

  tester.test('should pass for promise that resolves with expected value', async () => {
    await tester.expect(Promise.resolve('success')).toResolve('success')
  })

  tester.test('should fail for promise that resolves with different value', async () => {
    await tester.expect(Promise.resolve('success')).toResolve('different')
  })

  tester.test('should fail for non-promise value', async () => {
    await tester.expect('not a promise').toResolve()
  })

  tester.test('should pass for not.toResolve with promise that rejects', async () => {
    await tester.expect(Promise.reject(new Error('error'))).not.toResolve()
  })

  tester.test('should fail for not.toResolve with promise that resolves', async () => {
    await tester.expect(Promise.resolve('success')).not.toResolve()
  })

  tester.test('should pass for not.toResolve with promise that resolves with different value', async () => {
    await tester.expect(Promise.resolve('success')).not.toResolve('different')
  })

  tester.test('should fail for not.toResolve with promise that resolves with expected value', async () => {
    await tester.expect(Promise.resolve('success')).not.toResolve('success')
  })

  tester.test('should be able to use asymmetric assertions', () => {
    const obj = { a: 1, b: 2, c: 3 }
    tester.expect(obj).toMatchObject({ a: 1, b: tester.expectAnything() })
    tester.expect(obj).toMatchObject(tester.expectAnything())
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for promise that resolves'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for promise that rejects'],
      error: {
        message: 'Expected promise to resolve, but it rejected with {{actual}}',
        messageLocals: {
          actual: 'error'
        },
        expected: 'resolution',
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for promise that resolves with expected value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for promise that resolves with different value'],
      error: {
        message: 'Expected promise to resolve with {{expected}}, but got {{actual}}',
        messageLocals: {
          expected: 'different',
          actual: 'success'
        },
        expected: 'different',
        actual: 'success',
        difference: {
          type: 'different',
          expected: 'different',
          actual: 'success',
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-promise value'],
      error: {
        message: 'Expected a promise, but got {{actual}}',
        messageLocals: {
          actual: 'not a promise'
        },
        expected: 'promise',
        actual: 'not a promise'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toResolve with promise that rejects'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toResolve with promise that resolves'],
      error: {
        message: 'Expected promise to reject, but it resolved with {{actual}}',
        messageLocals: {
          actual: 'success'
        },
        expected: 'rejection',
        actual: 'success'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toResolve with promise that resolves with different value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toResolve with promise that resolves with expected value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should be able to use asymmetric assertions'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toResolve test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toResolve test failed')
  }
}
