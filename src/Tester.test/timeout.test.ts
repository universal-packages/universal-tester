import { Tester } from '../Tester'

export async function timeoutTest() {
  const tester = new Tester()

  tester.test(
    'should handle test that times out',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
    },
    { timeout: 100 }
  )

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should handle test that times out',
      error: {
        message: 'Test timed out after {{timeout}}ms',
        messageLocals: {
          timeout: '100'
        },
        expected: 100,
        actual: 100000
      },
      passed: false,
      options: {
        timeout: 100
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Timeout test failed')
  } else {
    console.log('Timeout test passed')
  }
}
