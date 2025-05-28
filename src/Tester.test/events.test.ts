import { Tester } from '../Tester'
import { StateTestingTree } from '../Tester.types'

export async function eventsTest() {
  console.log('Running events test...')

  // Test 1: Basic event emission during simple test execution
  await testBasicEventEmission()

  // Test 2: Event emission with skipped tests
  await testEventEmissionWithSkippedTests()

  // Test 3: Event emission with failing tests
  await testEventEmissionWithFailingTests()

  // Test 4: Event emission with nested describes
  await testEventEmissionWithNestedDescribes()

  // Test 5: Event emission with parallel execution
  await testEventEmissionWithParallel()

  // Test 6: Event emission with lifecycle hooks
  await testEventEmissionWithLifecycleHooks()

  // Test 7: Event timing and edge cases
  await testEventTimingAndEdgeCases()

  // Test 8: Event emission with only tests
  await testEventEmissionWithOnlyTests()

  // Test 9: Event emission with bail
  await testEventEmissionWithBail()

  console.log('All events tests passed')
}

async function testBasicEventEmission() {
  const tester = new Tester({ identifier: 'basic-events' })
  const emittedStates: StateTestingTree[] = []
  
  // Listen to change events
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state))) // Deep clone
  })

  tester.test('simple passing test', () => {
    tester.expect(1).toBe(1)
  })

  tester.test('another passing test', () => {
    tester.expect(2).toBe(2)
  })

  const results = await tester.run()

  // Should emit:
  // 1. When tester starts running (status: 'running')
  // 2. When first test starts (test status: 'running')
  // 3. When first test completes (test status: 'success', node status updated)
  // 4. When second test starts (test status: 'running')
  // 5. When second test completes (test status: 'success', node status updated)
  // 6. When tester completes (status: 'success')

  tester.expect(emittedStates.length).toBe(6)

  // Verify initial running state
  tester.expect(emittedStates[0].status).toBe('running')
  tester.expect(emittedStates[0].nodes[0].status).toBe('idle')

  // Verify first test running
  tester.expect(emittedStates[1].nodes[0].tests[0].status).toBe('running')
  tester.expect(emittedStates[1].nodes[0].status).toBe('running')

  // Verify first test completed
  tester.expect(emittedStates[2].nodes[0].tests[0].status).toBe('success')

  // Verify second test running
  tester.expect(emittedStates[3].nodes[0].tests[1].status).toBe('running')

  // Verify second test completed
  tester.expect(emittedStates[4].nodes[0].tests[1].status).toBe('success')
  tester.expect(emittedStates[4].nodes[0].status).toBe('success')

  // Verify final completion state
  tester.expect(emittedStates[5].status).toBe('success')

  console.log('Basic event emission test passed')
}

async function testEventEmissionWithSkippedTests() {
  const tester = new Tester({ identifier: 'skip-events' })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.test('passing test', () => {
    tester.expect(1).toBe(1)
  })

  tester.test('skipped test', () => {
    tester.expect(1).toBe(2) // Would fail if run
  }, { skip: true, skipReason: 'Testing skip' })

  await tester.run()

  // Should handle skipped tests correctly in state
  const skipEventStates = emittedStates.filter(state => 
    state.nodes[0].tests.some(test => test.status === 'skipped')
  )

  tester.expect(skipEventStates.length).toBeGreaterThan(0)
  
  const finalState = emittedStates[emittedStates.length - 1]
  tester.expect(finalState.nodes[0].tests[1].status).toBe('skipped')
  tester.expect(finalState.nodes[0].tests[1].result?.skipped).toBe(true)
  tester.expect(finalState.nodes[0].tests[1].result?.skipReason).toBe('Testing skip')

  console.log('Skipped tests event emission test passed')
}

async function testEventEmissionWithFailingTests() {
  const tester = new Tester({ identifier: 'fail-events' })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.test('passing test', () => {
    tester.expect(1).toBe(1)
  })

  tester.test('failing test', () => {
    tester.expect(1).toBe(2)
  })

  await tester.run()

  // Verify failure states are emitted correctly
  const failureStates = emittedStates.filter(state => 
    state.nodes[0].tests.some(test => test.status === 'failure')
  )

  tester.expect(failureStates.length).toBeGreaterThan(0)

  const finalState = emittedStates[emittedStates.length - 1]
  tester.expect(finalState.status).toBe('failure')
  tester.expect(finalState.nodes[0].status).toBe('failure')
  tester.expect(finalState.nodes[0].tests[1].status).toBe('failure')
  tester.expect(finalState.nodes[0].tests[1].result?.passed).toBe(false)
  tester.expect(finalState.nodes[0].tests[1].result?.error).toBeDefined()

  console.log('Failing tests event emission test passed')
}

async function testEventEmissionWithNestedDescribes() {
  const tester = new Tester({ identifier: 'nested-events' })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.describe('Outer describe', () => {
    tester.test('outer test', () => {
      tester.expect(1).toBe(1)
    })

    tester.describe('Inner describe', () => {
      tester.test('inner test', () => {
        tester.expect(2).toBe(2)
      })
    })
  })

  await tester.run()

  // Verify nested structure is maintained in emitted states
  const statesWithNestedNodes = emittedStates.filter(state => 
    state.nodes[0].children.length > 0 && 
    state.nodes[0].children[0].children.length > 0
  )

  tester.expect(statesWithNestedNodes.length).toBeGreaterThan(0)

  const finalState = emittedStates[emittedStates.length - 1]
  const outerDescribe = finalState.nodes[0].children[0]
  const innerDescribe = outerDescribe.children[0]

  tester.expect(outerDescribe.name).toBe('Outer describe')
  tester.expect(outerDescribe.status).toBe('success')
  tester.expect(innerDescribe.name).toBe('Inner describe')
  tester.expect(innerDescribe.status).toBe('success')

  console.log('Nested describes event emission test passed')
}

async function testEventEmissionWithParallel() {
  const tester = new Tester({ identifier: 'parallel-events', runOrder: 'parallel' })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.test('test 1', async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
    tester.expect(1).toBe(1)
  })

  tester.test('test 2', async () => {
    await new Promise(resolve => setTimeout(resolve, 30))
    tester.expect(2).toBe(2)
  })

  tester.test('test 3', async () => {
    await new Promise(resolve => setTimeout(resolve, 10))
    tester.expect(3).toBe(3)
  })

  await tester.run()

  // In parallel mode, we should see multiple tests running simultaneously
  const runningStates = emittedStates.filter(state => 
    state.nodes[0].tests.filter(test => test.status === 'running').length > 1
  )

  // At some point, multiple tests should be running
  tester.expect(runningStates.length).toBeGreaterThan(0)

  const finalState = emittedStates[emittedStates.length - 1]
  tester.expect(finalState.status).toBe('success')
  tester.expect(finalState.nodes[0].tests.every(test => test.status === 'success')).toBe(true)

  console.log('Parallel execution event emission test passed')
}

async function testEventEmissionWithLifecycleHooks() {
  const tester = new Tester({ identifier: 'hooks-events' })
  const emittedStates: StateTestingTree[] = []
  const executionOrder: string[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.describe('With hooks', () => {
    tester.before(() => {
      executionOrder.push('before')
    })

    tester.beforeEach(() => {
      executionOrder.push('beforeEach')
    })

    tester.afterEach(() => {
      executionOrder.push('afterEach')
    })

    tester.after(() => {
      executionOrder.push('after')
    })

    tester.test('test with hooks', () => {
      executionOrder.push('test')
      tester.expect(1).toBe(1)
    })
  })

  await tester.run()

  // Verify hooks executed in correct order
  tester.expect(executionOrder).toEqual(['before', 'beforeEach', 'test', 'afterEach', 'after'])

  // Verify state changes were emitted correctly
  tester.expect(emittedStates.length).toBeGreaterThan(0)

  const finalState = emittedStates[emittedStates.length - 1]
  tester.expect(finalState.status).toBe('success')

  // Verify describe node has hook information
  const describeNode = finalState.nodes[0].children[0]
  tester.expect(describeNode.beforeHooksHaveRun).toBe(true)
  tester.expect(describeNode.beforeHooksErrors).toEqual([])
  tester.expect(describeNode.afterEachHooksErrors).toEqual([])
  tester.expect(describeNode.afterHooksErrors).toEqual([])

  console.log('Lifecycle hooks event emission test passed')
}

async function testEventTimingAndEdgeCases() {
  const tester = new Tester({ identifier: 'timing-events' })
  const emittedStates: StateTestingTree[] = []
  const eventTimestamps: number[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
    eventTimestamps.push(Date.now())
  })

  // Test with no tests - should still emit start and end events
  const startTime = Date.now()
  await tester.run()
  const endTime = Date.now()

  // Should emit at least start (running) and end (success) events
  tester.expect(emittedStates.length).toBeGreaterThanOrEqual(2)
  tester.expect(emittedStates[0].status).toBe('running')
  tester.expect(emittedStates[emittedStates.length - 1].status).toBe('success')

  // All event timestamps should be within the test execution timeframe
  eventTimestamps.forEach(timestamp => {
    tester.expect(timestamp).toBeGreaterThanOrEqual(startTime)
    tester.expect(timestamp).toBeLessThanOrEqual(endTime)
  })

  console.log('Event timing and edge cases test passed')
}

async function testEventEmissionWithOnlyTests() {
  const tester = new Tester({ identifier: 'only-events' })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.test('normal test', () => {
    tester.expect(1).toBe(1)
  })

  tester.test('only test', () => {
    tester.expect(2).toBe(2)
  }, { only: true })

  tester.test('another normal test', () => {
    tester.expect(3).toBe(3)
  })

  await tester.run()

  // When only tests are present, other tests should be skipped
  const finalState = emittedStates[emittedStates.length - 1]
  
  // Should have run only the 'only' test, others should be skipped
  const onlyTest = finalState.nodes[0].tests.find(test => test.name === 'only test')
  const normalTests = finalState.nodes[0].tests.filter(test => test.name !== 'only test')

  tester.expect(onlyTest?.status).toBe('success')
  normalTests.forEach(test => {
    tester.expect(test.status).toBe('skipped')
    tester.expect(test.result?.skipReason).toBe('"only" tests are active')
  })

  console.log('Only tests event emission test passed')
}

async function testEventEmissionWithBail() {
  const tester = new Tester({ identifier: 'bail-events', bail: true })
  const emittedStates: StateTestingTree[] = []
  
  tester.on('change', (state: StateTestingTree) => {
    emittedStates.push(JSON.parse(JSON.stringify(state)))
  })

  tester.test('passing test', () => {
    tester.expect(1).toBe(1)
  })

  tester.test('failing test', () => {
    tester.expect(1).toBe(2) // This will fail
  })

  tester.test('should not run', () => {
    tester.expect(3).toBe(3) // This should not run due to bail
  })

  await tester.run()

  const finalState = emittedStates[emittedStates.length - 1]
  
  // First test should pass
  tester.expect(finalState.nodes[0].tests[0].status).toBe('success')
  
  // Second test should fail
  tester.expect(finalState.nodes[0].tests[1].status).toBe('failure')
  
  // Third test should not have run (should still be idle)
  tester.expect(finalState.nodes[0].tests[2].status).toBe('idle')
  
  // Overall status should be failure
  tester.expect(finalState.status).toBe('failure')

  console.log('Bail event emission test passed')
} 
