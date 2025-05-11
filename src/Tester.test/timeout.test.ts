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
        descriptor: {
          message: 'Test timed out after 100ms',
          expected: 'test to complete within timeout',
          actual: 'test exceeded timeout of 100ms'
        }
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
