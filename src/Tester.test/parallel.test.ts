import { Tester } from '../Tester'

export async function parallelTest() {
  // Create a tester with parallel run order
  const tester = new Tester({ runOrder: 'parallel' })

  // Shared array to track test execution order and timing
  const executionLog: { test: string; time: number }[] = []
  const startTime = Date.now()

  // Create tests with deliberate delays to verify parallel execution
  tester.test('slowTest1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    executionLog.push({ test: 'slowTest1', time: Date.now() - startTime })
    tester.expect(true).toBe(true)
  })

  tester.test('slowTest2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 150))
    executionLog.push({ test: 'slowTest2', time: Date.now() - startTime })
    tester.expect(true).toBe(true)
  })

  tester.test('fastTest1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    executionLog.push({ test: 'fastTest1', time: Date.now() - startTime })
    tester.expect(true).toBe(true)
  })

  tester.test('fastTest2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 25))
    executionLog.push({ test: 'fastTest2', time: Date.now() - startTime })
    tester.expect(true).toBe(true)
  })

  // Run the tests
  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['fastTest2'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['fastTest1'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['slowTest1'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['slowTest2'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)

    const totalTime = Date.now() - startTime

    // In truly parallel execution, the total time should be less than the sum of all test times
    // The longest test is slowTest2 at 150ms, so the total should be close to that (plus overhead)
    const sumOfDelays = 100 + 150 + 50 + 25 // 325ms

    console.log('Execution log:', executionLog)
    console.log(`Total time: ${totalTime}ms, Sum of delays: ${sumOfDelays}ms`)

    // Verify that tests ran in parallel by checking if total time is significantly less
    // than the sum of all individual test times
    const isParallel = totalTime < sumOfDelays - 100 // Allow for some overhead

    if (!isParallel) {
      throw new Error(`Parallel execution test failed - execution took too long: ${totalTime}ms`)
    } else {
      console.log('Parallel test passed')
    }
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Parallel test failed')
  }
}
