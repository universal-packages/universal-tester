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
