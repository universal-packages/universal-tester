import { Tester } from '../Tester'

export async function toRejectTest() {
  const tester = new Tester()

  tester.test('should pass for promise that rejects', async () => {
    await tester.expect(Promise.reject(new Error('error'))).toReject()
  })

  tester.test('should fail for promise that resolves', async () => {
    await tester.expect(Promise.resolve('success')).toReject()
  })

  tester.test('should pass for promise that rejects with expected error message', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).toReject('error message')
  })

  tester.test('should fail for promise that rejects with different error message', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).toReject('different error')
  })

  tester.test('should pass for promise that rejects with matching regex', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).toReject(/error/)
  })

  tester.test('should fail for promise that rejects with non-matching regex', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).toReject(/different/)
  })

  tester.test('should pass for promise that rejects with matching error', async () => {
    const error = new Error('error message')
    await tester.expect(Promise.reject(new Error('error message'))).toReject(error)
  })

  tester.test('should fail for promise that rejects with different error', async () => {
    const error = new Error('different error')
    await tester.expect(Promise.reject(new Error('error message'))).toReject(error)
  })

  tester.test('should fail for non-promise value', async () => {
    await tester.expect('not a promise').toReject()
  })

  tester.test('should pass for not.toReject with promise that resolves', async () => {
    await tester.expect(Promise.resolve('success')).not.toReject()
  })

  tester.test('should fail for not.toReject with promise that rejects', async () => {
    await tester.expect(Promise.reject(new Error('error'))).not.toReject()
  })

  tester.test('should pass for not.toReject with promise that rejects with different error', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).not.toReject('different error')
  })

  tester.test('should fail for not.toReject with promise that rejects with expected error', async () => {
    await tester.expect(Promise.reject(new Error('error message'))).not.toReject('error message')
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass for promise that rejects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for promise that resolves',
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
      spec: 'should pass for promise that rejects with expected error message',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for promise that rejects with different error message',
      error: {
        message: 'Expected promise to reject with {{expected}}, but it rejected with {{actual}}',
        messageLocals: {
          expected: 'different error',
          actual: 'error message'
        },
        expected: 'different error',
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for promise that rejects with matching regex',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for promise that rejects with non-matching regex',
      error: {
        message: 'Expected promise to reject with {{expected}}, but it rejected with {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'error message'
        },
        expected: {},
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for promise that rejects with matching error',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for promise that rejects with different error',
      error: {
        message: 'Expected promise to reject with {{expected}}, but it rejected with {{actual}}',
        messageLocals: {
          expected: 'different error',
          actual: 'error message'
        },
        expected: {},
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for non-promise value',
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
      spec: 'should pass for not.toReject with promise that resolves',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toReject with promise that rejects',
      error: {
        message: 'Expected promise not to reject, but it rejected with {{actual}}',
        messageLocals: {
          actual: 'error'
        },
        expected: 'no rejection',
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toReject with promise that rejects with different error',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toReject with promise that rejects with expected error',
      error: {
        message: 'Expected promise not to reject with {{expected}}, but it did',
        messageLocals: {
          expected: 'error message'
        },
        expected: 'error message',
        actual: {}
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toReject test failed')
  } else {
    console.log('toReject test passed')
  }
}
