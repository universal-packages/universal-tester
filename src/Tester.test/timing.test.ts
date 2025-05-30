import { Tester } from '../Tester'

export async function timingTest() {
  console.log('Running timing test...')

  // Test basic timing functionality
  await testBasicTiming()
  console.log('Basic timing test passed')

  // Test timing with skipped tests
  await testSkippedTestTiming()
  console.log('Skipped test timing test passed')

  // Test timing with failed tests
  await testFailedTestTiming()
  console.log('Failed test timing test passed')

  // Test timing with parallel execution
  await testParallelTiming()
  console.log('Parallel timing test passed')

  console.log('All timing tests passed')
}

async function testBasicTiming() {
  const tester = new Tester()

  tester.describe('Timing Tests', () => {
    tester.test('fast test', () => {
      // This should complete quickly (< 10ms typically)
    })

    tester.test('slow test', async () => {
      // This should take approximately 50ms
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
  })

  const startTime = Date.now()
  const results = await tester.run()
  const endTime = Date.now()

  // Verify all tests have timing information
  tester.expect(results).toHaveLength(2)

  for (const result of results) {
    tester.expect(result.took).toBeDefined()
    tester.expect(typeof result.took).toBe('number')
    tester.expect(result.took).toBeGreaterThanOrEqual(0)
  }

  // Verify test objects have timestamps
  for (const test of tester['testsSequence']) {
    tester.expect(test.startedAt).toBeDefined()
    tester.expect(test.endedAt).toBeDefined()
    tester.expect(typeof test.startedAt).toBe('number')
    tester.expect(typeof test.endedAt).toBe('number')
    tester.expect(test.endedAt).toBeGreaterThanOrEqual(test.startedAt!)

    // Verify the duration matches the took field in result
    const expectedTook = test.endedAt! - test.startedAt!
    const testResult = results.find((r) => r.id === test.id)
    tester.expect(testResult?.took).toBe(expectedTook)
  }

  // Verify the slow test took longer than the fast test
  const slowTestResult = results.find((r) => r.spec.includes('slow test'))
  const fastTestResult = results.find((r) => r.spec.includes('fast test'))

  tester.expect(slowTestResult?.took).toBeGreaterThan(fastTestResult?.took!)
  tester.expect(slowTestResult?.took).toBeGreaterThan(40) // Should be around 50ms
  tester.expect(fastTestResult?.took).toBeLessThan(20) // Should be very fast

  // Verify timestamps are within reasonable bounds
  for (const test of tester['testsSequence']) {
    tester.expect(test.startedAt).toBeGreaterThanOrEqual(startTime)
    tester.expect(test.endedAt).toBeLessThanOrEqual(endTime)
  }
}

async function testSkippedTestTiming() {
  const tester = new Tester()

  tester.test(
    'skipped test',
    () => {
      // This won't run
    },
    { skip: true }
  )

  const results = await tester.run()

  tester.expect(results).toHaveLength(1)
  const result = results[0]

  // Skipped tests should still have timing information
  tester.expect(result.took).toBeDefined()
  tester.expect(result.took).toBeGreaterThanOrEqual(0)
  tester.expect(result.took).toBeLessThan(10) // Should be very fast since it's skipped
  tester.expect(result.skipped).toBe(true)

  // Test object should have timestamps
  const test = tester['testsSequence'][0]
  tester.expect(test.startedAt).toBeDefined()
  tester.expect(test.endedAt).toBeDefined()
  tester.expect(test.endedAt).toBeGreaterThanOrEqual(test.startedAt!)
}

async function testFailedTestTiming() {
  const tester = new Tester()

  tester.test('failing test', () => {
    throw new Error('Test error')
  })

  const results = await tester.run()

  tester.expect(results).toHaveLength(1)
  const result = results[0]

  // Failed tests should have timing information
  tester.expect(result.passed).toBe(false)
  tester.expect(result.took).toBeDefined()
  tester.expect(result.took).toBeGreaterThanOrEqual(0)

  // Test object should have timestamps
  const test = tester['testsSequence'][0]
  tester.expect(test.startedAt).toBeDefined()
  tester.expect(test.endedAt).toBeDefined()
  tester.expect(test.endedAt).toBeGreaterThanOrEqual(test.startedAt!)
}

async function testParallelTiming() {
  const tester = new Tester({ runOrder: 'parallel' })

  tester.test('parallel test 1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 30))
  })

  tester.test('parallel test 2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 30))
  })

  const startTime = Date.now()
  const results = await tester.run()
  const endTime = Date.now()
  const totalTime = endTime - startTime

  tester.expect(results).toHaveLength(2)

  // Verify both tests have timing information
  for (const result of results) {
    tester.expect(result.took).toBeDefined()
    tester.expect(result.took).toBeGreaterThan(25) // Each should take around 30ms
    tester.expect(result.took).toBeLessThan(50)
  }

  // In parallel execution, total time should be less than sequential
  // (should be around 30ms instead of 60ms)
  tester.expect(totalTime).toBeLessThan(55) // Some buffer for execution overhead

  // Verify test objects have proper timestamps
  for (const test of tester['testsSequence']) {
    tester.expect(test.startedAt).toBeDefined()
    tester.expect(test.endedAt).toBeDefined()
    tester.expect(test.endedAt).toBeGreaterThanOrEqual(test.startedAt!)
  }
}
