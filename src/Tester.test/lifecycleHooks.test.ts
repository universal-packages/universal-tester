import { Tester } from '../Tester'

export async function lifecycleHooksTest() {
  // Test 1: Basic hook execution order
  await testBasicHookExecutionOrder()
  
  // Test 2: Hook scoping (global vs describe-level)
  await testHookScoping()
  
  // Test 3: Nested describe blocks with hooks
  await testNestedDescribeHooks()
  
  // Test 4: beforeEach and afterEach with multiple tests
  await testEachHooksWithMultipleTests()
  
  // Test 5: afterEach execution even when test fails
  await testAfterEachWithFailingTest()
  
  // Test 6: Hook execution with skipped tests
  await testHooksWithSkippedTests()
  
  // Test 7: Hook execution with only tests
  await testHooksWithOnlyTests()
  
  // Test 8: Lifecycle hooks with parallel execution
  await testHooksWithParallelExecution()
  
  // Test 9: Lifecycle hooks with random execution order
  await testHooksWithRandomOrder()
  
  // Test 10: Lifecycle hooks with describe blocks in parallel execution
  await testDescribeHooksWithParallelExecution()
  
  console.log('All lifecycle hooks tests passed')
}

async function testBasicHookExecutionOrder() {
  const tester = new Tester()
  const executionOrder: string[] = []
  
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
  
  tester.test('test 1', () => {
    executionOrder.push('test 1')
    tester.expect(1).toBe(1)
  })
  
  tester.test('test 2', () => {
    executionOrder.push('test 2')
    tester.expect(2).toBe(2)
  })
  
  await tester.run()
  
  const expectedOrder = [
    'before',
    'beforeEach',
    'test 1',
    'afterEach',
    'beforeEach',
    'test 2',
    'afterEach',
    'after'
  ]
  
  if (JSON.stringify(executionOrder) !== JSON.stringify(expectedOrder)) {
    console.log('Actual order:', executionOrder)
    console.log('Expected order:', expectedOrder)
    throw new Error('Basic hook execution order test failed')
  }
  
  console.log('Basic hook execution order test passed')
}

async function testHookScoping() {
  const tester = new Tester()
  const executionOrder: string[] = []
  
  // Global hooks
  tester.before(() => {
    executionOrder.push('global before')
  })
  
  tester.beforeEach(() => {
    executionOrder.push('global beforeEach')
  })
  
  tester.afterEach(() => {
    executionOrder.push('global afterEach')
  })
  
  tester.after(() => {
    executionOrder.push('global after')
  })
  
  // Global test
  tester.test('global test', () => {
    executionOrder.push('global test')
    tester.expect(1).toBe(1)
  })
  
  tester.describe('Group A', () => {
    tester.before(() => {
      executionOrder.push('group A before')
    })
    
    tester.beforeEach(() => {
      executionOrder.push('group A beforeEach')
    })
    
    tester.afterEach(() => {
      executionOrder.push('group A afterEach')
    })
    
    tester.after(() => {
      executionOrder.push('group A after')
    })
    
    tester.test('test A1', () => {
      executionOrder.push('test A1')
      tester.expect(2).toBe(2)
    })
    
    tester.test('test A2', () => {
      executionOrder.push('test A2')
      tester.expect(3).toBe(3)
    })
  })
  
  tester.describe('Group B', () => {
    tester.before(() => {
      executionOrder.push('group B before')
    })
    
    tester.test('test B1', () => {
      executionOrder.push('test B1')
      tester.expect(4).toBe(4)
    })
  })
  
  await tester.run()
  
  const expectedOrder = [
    'global before',
    'global beforeEach',
    'global test',
    'global afterEach',
    'group A before',
    'global beforeEach',
    'group A beforeEach',
    'test A1',
    'global afterEach',
    'group A afterEach',
    'global beforeEach',
    'group A beforeEach',
    'test A2',
    'global afterEach',
    'group A afterEach',
    'group A after',
    'group B before',
    'global beforeEach',
    'test B1',
    'global afterEach',
    'global after'
  ]
  
  if (JSON.stringify(executionOrder) !== JSON.stringify(expectedOrder)) {
    console.log('Actual order:', executionOrder)
    console.log('Expected order:', expectedOrder)
    throw new Error('Hook scoping test failed')
  }
  
  console.log('Hook scoping test passed')
}

async function testNestedDescribeHooks() {
  const tester = new Tester()
  const executionOrder: string[] = []
  
  tester.describe('Outer', () => {
    tester.before(() => {
      executionOrder.push('outer before')
    })
    
    tester.beforeEach(() => {
      executionOrder.push('outer beforeEach')
    })
    
    tester.afterEach(() => {
      executionOrder.push('outer afterEach')
    })
    
    tester.after(() => {
      executionOrder.push('outer after')
    })
    
    tester.describe('Inner', () => {
      tester.before(() => {
        executionOrder.push('inner before')
      })
      
      tester.beforeEach(() => {
        executionOrder.push('inner beforeEach')
      })
      
      tester.afterEach(() => {
        executionOrder.push('inner afterEach')
      })
      
      tester.after(() => {
        executionOrder.push('inner after')
      })
      
      tester.test('nested test', () => {
        executionOrder.push('nested test')
        tester.expect(1).toBe(1)
      })
    })
  })
  
  await tester.run()
  
  const expectedOrder = [
    'outer before',
    'inner before',
    'outer beforeEach',
    'inner beforeEach',
    'nested test',
    'outer afterEach',
    'inner afterEach',
    'inner after',
    'outer after'
  ]
  
  if (JSON.stringify(executionOrder) !== JSON.stringify(expectedOrder)) {
    console.log('Actual order:', executionOrder)
    console.log('Expected order:', expectedOrder)
    throw new Error('Nested describe hooks test failed')
  }
  
  console.log('Nested describe hooks test passed')
}

async function testEachHooksWithMultipleTests() {
  const tester = new Tester()
  let beforeEachCount = 0
  let afterEachCount = 0
  
  tester.beforeEach(() => {
    beforeEachCount++
  })
  
  tester.afterEach(() => {
    afterEachCount++
  })
  
  tester.test('test 1', () => {
    tester.expect(beforeEachCount).toBe(1)
    tester.expect(afterEachCount).toBe(0)
  })
  
  tester.test('test 2', () => {
    tester.expect(beforeEachCount).toBe(2)
    tester.expect(afterEachCount).toBe(1)
  })
  
  tester.test('test 3', () => {
    tester.expect(beforeEachCount).toBe(3)
    tester.expect(afterEachCount).toBe(2)
  })
  
  const results = await tester.run()
  
  // Verify all tests passed
  const allPassed = results.every(result => result.passed)
  if (!allPassed) {
    throw new Error('Each hooks with multiple tests failed - some tests failed')
  }
  
  // Verify final counts
  if (beforeEachCount !== 3 || afterEachCount !== 3) {
    throw new Error(`Each hooks with multiple tests failed - expected counts 3/3, got ${beforeEachCount}/${afterEachCount}`)
  }
  
  console.log('Each hooks with multiple tests passed')
}

async function testAfterEachWithFailingTest() {
  const tester = new Tester()
  let afterEachExecuted = false
  
  tester.afterEach(() => {
    afterEachExecuted = true
  })
  
  tester.test('failing test', () => {
    tester.expect(1).toBe(2) // This will fail
  })
  
  const results = await tester.run()
  
  // Verify test failed
  if (results[0].passed) {
    throw new Error('afterEach with failing test - test should have failed')
  }
  
  // Verify afterEach still executed
  if (!afterEachExecuted) {
    throw new Error('afterEach with failing test - afterEach should have executed')
  }
  
  console.log('afterEach with failing test passed')
}

async function testHooksWithSkippedTests() {
  const tester = new Tester()
  const executionOrder: string[] = []
  
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
  
  tester.test('normal test', () => {
    executionOrder.push('normal test')
    tester.expect(1).toBe(1)
  })
  
  tester.test('skipped test', () => {
    executionOrder.push('skipped test')
    tester.expect(1).toBe(1)
  }, { skip: true })
  
  const results = await tester.run()
  
  // Verify one test passed and one was skipped
  if (results.length !== 2 || !results[0].passed || !results[1].skipped) {
    throw new Error('Hooks with skipped tests - unexpected test results')
  }
  
  // Verify hooks only ran for non-skipped test
  const expectedOrder = [
    'before',
    'beforeEach',
    'normal test',
    'afterEach',
    'after'
  ]
  
  if (JSON.stringify(executionOrder) !== JSON.stringify(expectedOrder)) {
    console.log('Actual order:', executionOrder)
    console.log('Expected order:', expectedOrder)
    throw new Error('Hooks with skipped tests - incorrect execution order')
  }
  
  console.log('Hooks with skipped tests passed')
}

async function testHooksWithOnlyTests() {
  const tester = new Tester()
  const executionOrder: string[] = []
  
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
  
  tester.test('normal test', () => {
    executionOrder.push('normal test')
    tester.expect(1).toBe(1)
  })
  
  tester.test('only test', () => {
    executionOrder.push('only test')
    tester.expect(1).toBe(1)
  }, { only: true })
  
  const results = await tester.run()
  
  // Verify only the "only" test ran, other was skipped
  if (results.length !== 2 || !results[0].skipped || !results[1].passed) {
    throw new Error('Hooks with only tests - unexpected test results')
  }
  
  // Verify hooks only ran for the "only" test
  const expectedOrder = [
    'before',
    'beforeEach',
    'only test',
    'afterEach',
    'after'
  ]
  
  if (JSON.stringify(executionOrder) !== JSON.stringify(expectedOrder)) {
    console.log('Actual order:', executionOrder)
    console.log('Expected order:', expectedOrder)
    throw new Error('Hooks with only tests - incorrect execution order')
  }
  
  console.log('Hooks with only tests passed')
}

async function testHooksWithParallelExecution() {
  const tester = new Tester({ runOrder: 'parallel' })
  const executionLog: { event: string; test?: string; time: number }[] = []
  const startTime = Date.now()
  
  // Global hooks
  tester.before(() => {
    executionLog.push({ event: 'before', time: Date.now() - startTime })
  })
  
  tester.beforeEach(() => {
    executionLog.push({ event: 'beforeEach', time: Date.now() - startTime })
  })
  
  tester.afterEach(() => {
    executionLog.push({ event: 'afterEach', time: Date.now() - startTime })
  })
  
  tester.after(() => {
    executionLog.push({ event: 'after', time: Date.now() - startTime })
  })
  
  // Create tests with different execution times to verify parallel behavior
  tester.test('slowTest1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    executionLog.push({ event: 'test', test: 'slowTest1', time: Date.now() - startTime })
    tester.expect(1).toBe(1)
  })
  
  tester.test('slowTest2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 120))
    executionLog.push({ event: 'test', test: 'slowTest2', time: Date.now() - startTime })
    tester.expect(2).toBe(2)
  })
  
  tester.test('fastTest1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 30))
    executionLog.push({ event: 'test', test: 'fastTest1', time: Date.now() - startTime })
    tester.expect(3).toBe(3)
  })
  
  tester.test('fastTest2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    executionLog.push({ event: 'test', test: 'fastTest2', time: Date.now() - startTime })
    tester.expect(4).toBe(4)
  })
  
  const results = await tester.run()
  const totalTime = Date.now() - startTime
  
  // Verify all tests passed
  const allPassed = results.every(result => result.passed)
  if (!allPassed) {
    throw new Error('Parallel hooks test failed - some tests failed')
  }
  
  // Verify parallel execution by checking total time
  const sumOfDelays = 100 + 120 + 30 + 50 // 300ms
  const isParallel = totalTime < sumOfDelays - 50 // Allow for some overhead
  
  if (!isParallel) {
    throw new Error(`Parallel hooks test failed - execution took too long: ${totalTime}ms`)
  }
  
  // Verify hooks executed correct number of times
  const beforeCount = executionLog.filter(log => log.event === 'before').length
  const beforeEachCount = executionLog.filter(log => log.event === 'beforeEach').length
  const afterEachCount = executionLog.filter(log => log.event === 'afterEach').length
  const afterCount = executionLog.filter(log => log.event === 'after').length
  const testCount = executionLog.filter(log => log.event === 'test').length
  
  if (beforeCount !== 1) {
    throw new Error(`Parallel hooks test failed - expected 1 before hook, got ${beforeCount}`)
  }
  if (beforeEachCount !== 4) {
    throw new Error(`Parallel hooks test failed - expected 4 beforeEach hooks, got ${beforeEachCount}`)
  }
  if (afterEachCount !== 4) {
    throw new Error(`Parallel hooks test failed - expected 4 afterEach hooks, got ${afterEachCount}`)
  }
  if (afterCount !== 1) {
    throw new Error(`Parallel hooks test failed - expected 1 after hook, got ${afterCount}`)
  }
  if (testCount !== 4) {
    throw new Error(`Parallel hooks test failed - expected 4 tests, got ${testCount}`)
  }
  
  // Verify before hook ran before any tests
  const beforeTime = executionLog.find(log => log.event === 'before')?.time || 0
  const firstTestTime = Math.min(...executionLog.filter(log => log.event === 'test').map(log => log.time))
  if (beforeTime >= firstTestTime) {
    throw new Error('Parallel hooks test failed - before hook should run before any test')
  }
  
  // Verify after hook ran after all tests
  const afterTime = executionLog.find(log => log.event === 'after')?.time || 0
  const lastTestTime = Math.max(...executionLog.filter(log => log.event === 'test').map(log => log.time))
  if (afterTime <= lastTestTime) {
    throw new Error('Parallel hooks test failed - after hook should run after all tests')
  }
  
  console.log('Hooks with parallel execution test passed')
}

async function testHooksWithRandomOrder() {
  const tester = new Tester({ runOrder: 'random' })
  const executionOrder: string[] = []
  
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
  
  // Create several tests to increase chance of random order
  tester.test('test1', () => {
    executionOrder.push('test1')
    tester.expect(1).toBe(1)
  })
  
  tester.test('test2', () => {
    executionOrder.push('test2')
    tester.expect(2).toBe(2)
  })
  
  tester.test('test3', () => {
    executionOrder.push('test3')
    tester.expect(3).toBe(3)
  })
  
  tester.test('test4', () => {
    executionOrder.push('test4')
    tester.expect(4).toBe(4)
  })
  
  tester.test('test5', () => {
    executionOrder.push('test5')
    tester.expect(5).toBe(5)
  })
  
  const results = await tester.run()
  
  // Verify all tests passed
  const allPassed = results.every(result => result.passed)
  if (!allPassed) {
    throw new Error('Random hooks test failed - some tests failed')
  }
  
  // Verify hooks executed correct number of times
  const beforeCount = executionOrder.filter(event => event === 'before').length
  const beforeEachCount = executionOrder.filter(event => event === 'beforeEach').length
  const afterEachCount = executionOrder.filter(event => event === 'afterEach').length
  const afterCount = executionOrder.filter(event => event === 'after').length
  const testCount = executionOrder.filter(event => event.startsWith('test')).length
  
  if (beforeCount !== 1 || beforeEachCount !== 5 || afterEachCount !== 5 || afterCount !== 1 || testCount !== 5) {
    throw new Error(`Random hooks test failed - incorrect hook counts: before=${beforeCount}, beforeEach=${beforeEachCount}, afterEach=${afterEachCount}, after=${afterCount}, tests=${testCount}`)
  }
  
  // Verify hook order integrity
  const beforeIndex = executionOrder.indexOf('before')
  const afterIndex = executionOrder.lastIndexOf('after')
  
  if (beforeIndex !== 0) {
    throw new Error('Random hooks test failed - before hook should be first')
  }
  
  if (afterIndex !== executionOrder.length - 1) {
    throw new Error('Random hooks test failed - after hook should be last')
  }
  
  // Verify beforeEach/afterEach pairs are properly ordered for each test
  const testNames = ['test1', 'test2', 'test3', 'test4', 'test5']
  for (const testName of testNames) {
    const testIndex = executionOrder.indexOf(testName)
    if (testIndex === -1) continue
    
    // Find the closest beforeEach before this test
    let beforeEachIndex = -1
    for (let i = testIndex - 1; i >= 0; i--) {
      if (executionOrder[i] === 'beforeEach') {
        beforeEachIndex = i
        break
      }
    }
    
    // Find the closest afterEach after this test
    let afterEachIndex = -1
    for (let i = testIndex + 1; i < executionOrder.length; i++) {
      if (executionOrder[i] === 'afterEach') {
        afterEachIndex = i
        break
      }
    }
    
    if (beforeEachIndex === -1 || afterEachIndex === -1) {
      throw new Error(`Random hooks test failed - missing beforeEach/afterEach for ${testName}`)
    }
    
    if (beforeEachIndex >= testIndex || afterEachIndex <= testIndex) {
      throw new Error(`Random hooks test failed - incorrect beforeEach/afterEach order for ${testName}`)
    }
  }
  
  // Extract just the test execution order to verify randomization
  const testExecutionOrder = executionOrder.filter(event => event.startsWith('test'))
  const defaultOrder = ['test1', 'test2', 'test3', 'test4', 'test5']
  
  // Check if the execution order is different from the default order
  const isRandom = JSON.stringify(testExecutionOrder) !== JSON.stringify(defaultOrder)
  
  if (!isRandom) {
    console.log('Expected random order, but got default order:', testExecutionOrder)
    // Don't fail the test since there's a small chance of random matching default
    console.log('Random hooks test passed (though order matched default by chance)')
  } else {
    console.log(`Random hooks test passed with execution order: ${testExecutionOrder.join(', ')}`)
  }
}

async function testDescribeHooksWithParallelExecution() {
  const tester = new Tester({ runOrder: 'parallel' })
  const executionLog: { event: string; group?: string; test?: string; time: number }[] = []
  const startTime = Date.now()
  
  // Global hooks
  tester.before(() => {
    executionLog.push({ event: 'global-before', time: Date.now() - startTime })
  })
  
  tester.beforeEach(() => {
    executionLog.push({ event: 'global-beforeEach', time: Date.now() - startTime })
  })
  
  tester.afterEach(() => {
    executionLog.push({ event: 'global-afterEach', time: Date.now() - startTime })
  })
  
  tester.after(() => {
    executionLog.push({ event: 'global-after', time: Date.now() - startTime })
  })
  
  tester.describe('Group A', () => {
    tester.before(() => {
      executionLog.push({ event: 'before', group: 'A', time: Date.now() - startTime })
    })
    
    tester.beforeEach(() => {
      executionLog.push({ event: 'beforeEach', group: 'A', time: Date.now() - startTime })
    })
    
    tester.afterEach(() => {
      executionLog.push({ event: 'afterEach', group: 'A', time: Date.now() - startTime })
    })
    
    tester.after(() => {
      executionLog.push({ event: 'after', group: 'A', time: Date.now() - startTime })
    })
    
    tester.test('test A1', async () => {
      await new Promise((resolve) => setTimeout(resolve, 80))
      executionLog.push({ event: 'test', group: 'A', test: 'A1', time: Date.now() - startTime })
      tester.expect(1).toBe(1)
    })
    
    tester.test('test A2', async () => {
      await new Promise((resolve) => setTimeout(resolve, 60))
      executionLog.push({ event: 'test', group: 'A', test: 'A2', time: Date.now() - startTime })
      tester.expect(2).toBe(2)
    })
  })
  
  tester.describe('Group B', () => {
    tester.before(() => {
      executionLog.push({ event: 'before', group: 'B', time: Date.now() - startTime })
    })
    
    tester.beforeEach(() => {
      executionLog.push({ event: 'beforeEach', group: 'B', time: Date.now() - startTime })
    })
    
    tester.afterEach(() => {
      executionLog.push({ event: 'afterEach', group: 'B', time: Date.now() - startTime })
    })
    
    tester.after(() => {
      executionLog.push({ event: 'after', group: 'B', time: Date.now() - startTime })
    })
    
    tester.test('test B1', async () => {
      await new Promise((resolve) => setTimeout(resolve, 40))
      executionLog.push({ event: 'test', group: 'B', test: 'B1', time: Date.now() - startTime })
      tester.expect(3).toBe(3)
    })
    
    tester.test('test B2', async () => {
      await new Promise((resolve) => setTimeout(resolve, 90))
      executionLog.push({ event: 'test', group: 'B', test: 'B2', time: Date.now() - startTime })
      tester.expect(4).toBe(4)
    })
  })
  
  const results = await tester.run()
  const totalTime = Date.now() - startTime
  
  // Verify all tests passed
  const allPassed = results.every(result => result.passed)
  if (!allPassed) {
    throw new Error('Describe hooks with parallel execution test failed - some tests failed')
  }
  
  // Verify parallel execution by checking total time
  const sumOfDelays = 80 + 60 + 40 + 90 // 270ms
  const isParallel = totalTime < sumOfDelays - 50 // Allow for some overhead
  
  if (!isParallel) {
    throw new Error(`Describe hooks with parallel execution test failed - execution took too long: ${totalTime}ms`)
  }
  
  // Verify hook execution counts
  const globalBeforeCount = executionLog.filter(log => log.event === 'global-before').length
  const globalBeforeEachCount = executionLog.filter(log => log.event === 'global-beforeEach').length
  const globalAfterEachCount = executionLog.filter(log => log.event === 'global-afterEach').length
  const globalAfterCount = executionLog.filter(log => log.event === 'global-after').length
  
  const groupABeforeCount = executionLog.filter(log => log.event === 'before' && log.group === 'A').length
  const groupBBeforeCount = executionLog.filter(log => log.event === 'before' && log.group === 'B').length
  const groupAAfterCount = executionLog.filter(log => log.event === 'after' && log.group === 'A').length
  const groupBAfterCount = executionLog.filter(log => log.event === 'after' && log.group === 'B').length
  
  const testCount = executionLog.filter(log => log.event === 'test').length
  
  if (globalBeforeCount !== 1 || globalAfterCount !== 1) {
    throw new Error('Describe hooks with parallel execution test failed - incorrect global before/after counts')
  }
  
  if (globalBeforeEachCount !== 4 || globalAfterEachCount !== 4) {
    throw new Error('Describe hooks with parallel execution test failed - incorrect global beforeEach/afterEach counts')
  }
  
  if (groupABeforeCount !== 1 || groupBBeforeCount !== 1 || groupAAfterCount !== 1 || groupBAfterCount !== 1) {
    throw new Error('Describe hooks with parallel execution test failed - incorrect group before/after counts')
  }
  
  if (testCount !== 4) {
    throw new Error('Describe hooks with parallel execution test failed - incorrect test count')
  }
  
  // Verify timing constraints for hooks
  const globalBeforeTime = executionLog.find(log => log.event === 'global-before')?.time || 0
  const globalAfterTime = executionLog.find(log => log.event === 'global-after')?.time || 0
  const firstTestTime = Math.min(...executionLog.filter(log => log.event === 'test').map(log => log.time))
  const lastTestTime = Math.max(...executionLog.filter(log => log.event === 'test').map(log => log.time))
  
  if (globalBeforeTime >= firstTestTime) {
    throw new Error('Describe hooks with parallel execution test failed - global before should run before any test')
  }
  
  if (globalAfterTime <= lastTestTime) {
    throw new Error('Describe hooks with parallel execution test failed - global after should run after all tests')
  }
  
  console.log('Describe hooks with parallel execution test passed')
} 
