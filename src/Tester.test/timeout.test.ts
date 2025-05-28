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
      id: 'tester-1',
      spec: ['should handle test that times out'],
      passed: false,
      error: {
        message: 'Test timed out after {{timeout}}ms',
        messageLocals: {
          timeout: '100'
        },
        expected: 'Test to not timeout',
        actual: 'Test timed out'
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('Timeout test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Timeout test failed')
  }
}
