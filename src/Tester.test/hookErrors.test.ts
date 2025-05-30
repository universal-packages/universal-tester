import { Tester } from '../Tester'

export async function hookErrorsTest() {
  // Test 1: Before hook errors
  await testBeforeHookErrors()
  
  // Test 2: BeforeEach hook errors
  await testBeforeEachHookErrors()
  
  // Test 3: AfterEach hook errors
  await testAfterEachHookErrors()
  
  // Test 4: After hook errors
  await testAfterHookErrors()
  
  // Test 5: Multiple hook errors in same describe block
  await testMultipleHookErrors()
  
  // Test 6: Nested describe blocks with hook errors
  await testNestedHookErrors()
  
  // Test 7: Hook errors with passing and failing tests
  await testHookErrorsWithMixedTests()
  
  // Test 8: After hook errors that actually run (when tests complete)
  await testAfterHookErrorsThatRun()

  console.log('All hook error tests passed')
}

async function testBeforeHookErrors() {
  const tester = new Tester()
  
  tester.before(() => {
    throw new Error('Before hook error')
  })
  
  tester.test('test 1', () => {
    tester.expect(1).toBe(1)
  })
  
  tester.test('test 2', () => {
    tester.expect(2).toBe(2)
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Tests should have results but should have failed due to before hook failure
  tester.expect(results.length).toBe(2)
  tester.expect(results[0].passed).toBe(false)
  tester.expect(results[1].passed).toBe(false)
  
  // Check that the error message indicates before hook failure
  tester.expect(results[0].error?.message).toBe('Can not run if before hooks fail')
  tester.expect(results[1].error?.message).toBe('Can not run if before hooks fail')
  
  // Check that before hook error is captured in state
  const rootNode = state.nodes[0]
  tester.expect(rootNode.beforeHooksErrors.length).toBe(1)
  tester.expect(rootNode.beforeHooksErrors[0].message).toBe('Before hook error')
  tester.expect(rootNode.beforeHooksHaveRun).toBe(true)
  
  // Check expected result structure
  const expectedResults = [
    {
      spec: ['test 1'],
      passed: false,
      error: {
        message: 'Can not run if before hooks fail',
        expected: 'Before hooks to not fail',
        actual: 'Before hooks failed'
      }
    },
    {
      spec: ['test 2'],
      passed: false,
      error: {
        message: 'Can not run if before hooks fail',
        expected: 'Before hooks to not fail',
        actual: 'Before hooks failed'
      }
    }
  ]
  
  tester.expect(results[0]).toMatchObject(expectedResults[0])
  tester.expect(results[1]).toMatchObject(expectedResults[1])
  
  console.log('Before hook errors test passed')
}

async function testBeforeEachHookErrors() {
  const tester = new Tester()
  
  tester.beforeEach(() => {
    throw new Error('BeforeEach hook error')
  })
  
  tester.test('test 1', () => {
    tester.expect(1).toBe(1)
  })
  
  tester.test('test 2', () => {
    tester.expect(2).toBe(2)
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // BeforeEach errors cause tests to fail
  tester.expect(results.length).toBe(2)
  
  // Both tests should fail due to beforeEach hook errors
  tester.expect(results[0].passed).toBe(false)
  tester.expect(results[1].passed).toBe(false)
  
  // Check that the error message indicates beforeEach hook failure
  tester.expect(results[0].error?.message).toBe('BeforeEach hook error')
  tester.expect(results[1].error?.message).toBe('BeforeEach hook error')
  
  // Check expected result structure
  const expectedResults = [
    {
      spec: ['test 1'],
      passed: false,
      error: {
        message: 'BeforeEach hook error',
        expected: 'BeforeEach hook to not fail',
        actual: 'BeforeEach hook failed'
      }
    },
    {
      spec: ['test 2'],
      passed: false,
      error: {
        message: 'BeforeEach hook error',
        expected: 'BeforeEach hook to not fail',
        actual: 'BeforeEach hook failed'
      }
    }
  ]
  
  tester.expect(results[0]).toMatchObject(expectedResults[0])
  tester.expect(results[1]).toMatchObject(expectedResults[1])
  
  // Check that we have access to the actual tests through state
  const rootNode = state.nodes[0]
  tester.expect(rootNode.tests.length).toBe(2)
  
  console.log('BeforeEach hook errors test passed')
}

async function testAfterEachHookErrors() {
  const tester = new Tester()
  
  tester.afterEach(() => {
    throw new Error('AfterEach hook error')
  })
  
  tester.test('test 1', () => {
    tester.expect(1).toBe(1)
  })
  
  tester.test('test 2', () => {
    tester.expect(2).toBe(2)
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Tests should run and pass, but afterEach errors should be captured
  tester.expect(results.length).toBe(2)
  tester.expect(results[0].passed).toBe(true)
  tester.expect(results[1].passed).toBe(true)
  
  // Check afterEach errors are captured
  const rootNode = state.nodes[0]
  tester.expect(rootNode.tests[0].afterEachHooksErrors.length).toBe(1)
  tester.expect(rootNode.tests[0].afterEachHooksErrors[0].message).toBe('AfterEach hook error')
  tester.expect(rootNode.tests[1].afterEachHooksErrors.length).toBe(1)
  tester.expect(rootNode.tests[1].afterEachHooksErrors[0].message).toBe('AfterEach hook error')
  
  console.log('AfterEach hook errors test passed')
}

async function testAfterHookErrors() {
  const tester = new Tester()
  
  tester.after(() => {
    throw new Error('After hook error')
  })
  
  tester.test('test 1', () => {
    tester.expect(1).toBe(1)
  })
  
  tester.test('test 2', () => {
    tester.expect(2).toBe(2)
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Tests should run and pass, after hooks run after all tests
  tester.expect(results.length).toBe(2)
  tester.expect(results[0].passed).toBe(true)
  tester.expect(results[1].passed).toBe(true)
  
  // Check that after hook error is captured
  const rootNode = state.nodes[0]
  tester.expect(rootNode.afterHooksErrors.length).toBe(1)
  tester.expect(rootNode.afterHooksErrors[0].message).toBe('After hook error')
  
  console.log('After hook errors test passed')
}

async function testMultipleHookErrors() {
  const tester = new Tester()
  
  tester.describe('Main describe', () => {
    tester.before(() => {
      throw new Error('Before hook error 1')
    })
    
    tester.before(() => {
      throw new Error('Before hook error 2')
    })
    
    tester.after(() => {
      throw new Error('After hook error 1')
    })
    
    tester.after(() => {
      throw new Error('After hook error 2')
    })
    
    tester.test('test 1', () => {
      tester.expect(1).toBe(1)
    })
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Test should have result but should fail due to before hook failures
  tester.expect(results.length).toBe(1)
  tester.expect(results[0].passed).toBe(false)
  tester.expect(results[0].error?.message).toBe('Can not run if before hooks fail')
  
  // Check multiple before hook errors
  const describeNode = state.nodes[0].children[0]
  tester.expect(describeNode.beforeHooksErrors.length).toBe(2)
  tester.expect(describeNode.beforeHooksErrors[0].message).toBe('Before hook error 1')
  tester.expect(describeNode.beforeHooksErrors[1].message).toBe('Before hook error 2')
  
  // After hooks won't run because the node doesn't complete due to before hook failures
  // We can verify the after hooks exist but weren't executed by checking the error array is empty
  tester.expect(describeNode.afterHooksErrors.length).toBe(0)
  
  // Check expected result structure
  const expectedResult = {
    spec: ['Main describe', 'test 1'],
    passed: false,
    error: {
      message: 'Can not run if before hooks fail'
    }
  }
  
  tester.expect(results[0]).toMatchObject(expectedResult)
  
  console.log('Multiple hook errors test passed')
}

async function testNestedHookErrors() {
  const tester = new Tester()
  
  tester.before(() => {
    throw new Error('Global before error')
  })
  
  tester.describe('Outer describe', () => {
    tester.before(() => {
      throw new Error('Outer before error')
    })
    
    tester.afterEach(() => {
      throw new Error('Outer afterEach error')
    })
    
    tester.describe('Inner describe', () => {
      tester.beforeEach(() => {
        throw new Error('Inner beforeEach error')
      })
      
      tester.after(() => {
        throw new Error('Inner after error')
      })
      
      tester.test('nested test', () => {
        tester.expect(1).toBe(1)
      })
    })
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Test should have result but should fail due to before hook failures
  tester.expect(results.length).toBe(1)
  tester.expect(results[0].passed).toBe(false)
  tester.expect(results[0].error?.message).toBe('Can not run if before hooks fail')
  
  // Check global before hook error
  const rootNode = state.nodes[0]
  tester.expect(rootNode.beforeHooksErrors.length).toBe(1)
  tester.expect(rootNode.beforeHooksErrors[0].message).toBe('Global before error')
  
  // When global before hooks fail, nested before hooks don't run
  const outerNode = rootNode.children[0]
  tester.expect(outerNode.beforeHooksErrors.length).toBe(0)
  
  // After hooks won't run because nodes don't complete due to before hook failures
  const innerNode = outerNode.children[0]
  tester.expect(innerNode.afterHooksErrors.length).toBe(0)
  
  // Check expected result structure
  const expectedResult = {
    spec: ['Outer describe', 'Inner describe', 'nested test'],
    passed: false,
    error: {
      message: 'Can not run if before hooks fail'
    }
  }
  
  tester.expect(results[0]).toMatchObject(expectedResult)
  
  console.log('Nested hook errors test passed')
}

async function testHookErrorsWithMixedTests() {
  const tester = new Tester()
  
  tester.describe('Mixed scenario', () => {
    tester.beforeEach(() => {
      throw new Error('BeforeEach error')
    })
    
    tester.afterEach(() => {
      throw new Error('AfterEach error')
    })
    
    tester.test('passing test', () => {
      tester.expect(1).toBe(1)
    })
    
    tester.test('failing test', () => {
      tester.expect(1).toBe(2)
    })
    
    tester.after(() => {
      throw new Error('After error')
    })
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Both tests should run but fail due to beforeEach errors
  tester.expect(results.length).toBe(2)
  tester.expect(results[0].passed).toBe(false)
  tester.expect(results[1].passed).toBe(false)
  
  // Check expected result structure for first test (would pass without beforeEach error)
  const expectedFirstResult = {
    spec: ['Mixed scenario', 'passing test'],
    passed: false
  }
  
  // Check expected result structure for second test (fails due to assertion + beforeEach error)
  const expectedSecondResult = {
    spec: ['Mixed scenario', 'failing test'],
    passed: false
  }
  
  tester.expect(results[0]).toMatchObject(expectedFirstResult)
  tester.expect(results[1]).toMatchObject(expectedSecondResult)
  
  // Check hook errors in state
  const describeNode = state.nodes[0].children[0]
  // After hooks don't run when beforeEach hooks cause test failures
  tester.expect(describeNode.afterHooksErrors.length).toBe(0)
  
  // Check afterEach hook errors for both tests
  tester.expect(describeNode.tests[0].afterEachHooksErrors.length).toBe(1)
  tester.expect(describeNode.tests[0].afterEachHooksErrors[0].message).toBe('AfterEach error')
  tester.expect(describeNode.tests[1].afterEachHooksErrors.length).toBe(1)
  tester.expect(describeNode.tests[1].afterEachHooksErrors[0].message).toBe('AfterEach error')
  
  console.log('Hook errors with mixed tests passed')
}

async function testAfterHookErrorsThatRun() {
  const tester = new Tester()
  
  tester.describe('After hook test', () => {
    tester.after(() => {
      throw new Error('After hook error 1')
    })
    
    tester.after(() => {
      throw new Error('After hook error 2')
    })
    
    tester.test('test 1', () => {
      tester.expect(1).toBe(1)
    })
  })
  
  const results = await tester.run()
  const state = tester.state
  
  // Test should pass normally
  tester.expect(results.length).toBe(1)
  tester.expect(results[0].passed).toBe(true)
  
  // After hooks should run and capture errors after test completion
  const describeNode = state.nodes[0].children[0]
  tester.expect(describeNode.afterHooksErrors.length).toBe(2)
  tester.expect(describeNode.afterHooksErrors[0].message).toBe('After hook error 1')
  tester.expect(describeNode.afterHooksErrors[1].message).toBe('After hook error 2')
  
  // Check expected result structure
  const expectedResult = {
    spec: ['After hook test', 'test 1'],
    passed: true
  }
  
  tester.expect(results[0]).toMatchObject(expectedResult)
  
  console.log('After hook errors that run test passed')
} 
