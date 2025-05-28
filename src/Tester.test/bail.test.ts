import { Tester } from '../Tester'

export async function bailTest() {
  // Test 1: With bail enabled, execution should stop after first failure
  const testerWithBail = new Tester({ bail: true })

  const executedTests: string[] = []

  testerWithBail.test('should pass', () => {
    executedTests.push('test1')
    testerWithBail.expect(true).toBe(true)
  })

  testerWithBail.test('should fail and stop execution', () => {
    executedTests.push('test2')
    testerWithBail.expect(true).toBe(false) // This will fail
  })

  testerWithBail.test('should not run due to bail', () => {
    executedTests.push('test3')
    testerWithBail.expect(true).toBe(true)
  })

  testerWithBail.test('should also not run due to bail', () => {
    executedTests.push('test4')
    testerWithBail.expect(true).toBe(true)
  })

  const resultsWithBail = await testerWithBail.run()

  // Should only have results for the first two tests
  const expectedResultsWithBail = [
    {
      spec: ['should pass'],
      passed: true
    },
    {
      spec: ['should fail and stop execution'],
      passed: false
    }
  ]

  try {
    testerWithBail.expect(resultsWithBail).toHaveLength(2)
    testerWithBail.expect(resultsWithBail).toMatchObject(expectedResultsWithBail)
    testerWithBail.expect(executedTests).toEqual(['test1', 'test2'])
    console.log('Bail test (with bail enabled) passed')
  } catch (error) {
    console.log('Results with bail:', JSON.stringify(resultsWithBail, null, 2))
    console.log('Executed tests with bail:', executedTests)
    throw new Error('Bail test (with bail enabled) failed')
  }

  // Test 2: Without bail, all tests should run even after failures
  const testerWithoutBail = new Tester({ bail: false })

  const executedTestsNoBail: string[] = []

  testerWithoutBail.test('should pass', () => {
    executedTestsNoBail.push('test1')
    testerWithoutBail.expect(true).toBe(true)
  })

  testerWithoutBail.test('should fail but continue execution', () => {
    executedTestsNoBail.push('test2')
    testerWithoutBail.expect(true).toBe(false) // This will fail
  })

  testerWithoutBail.test('should run despite previous failure', () => {
    executedTestsNoBail.push('test3')
    testerWithoutBail.expect(true).toBe(true)
  })

  testerWithoutBail.test('should also run', () => {
    executedTestsNoBail.push('test4')
    testerWithoutBail.expect(true).toBe(true)
  })

  const resultsWithoutBail = await testerWithoutBail.run()

  // Should have results for all four tests
  const expectedResultsWithoutBail = [
    {
      spec: ['should pass'],
      passed: true
    },
    {
      spec: ['should fail but continue execution'],
      passed: false
    },
    {
      spec: ['should run despite previous failure'],
      passed: true
    },
    {
      spec: ['should also run'],
      passed: true
    }
  ]

  try {
    testerWithoutBail.expect(resultsWithoutBail).toHaveLength(4)
    testerWithoutBail.expect(resultsWithoutBail).toMatchObject(expectedResultsWithoutBail)
    testerWithoutBail.expect(executedTestsNoBail).toEqual(['test1', 'test2', 'test3', 'test4'])
    console.log('Bail test (without bail) passed')
  } catch (error) {
    console.log('Results without bail:', JSON.stringify(resultsWithoutBail, null, 2))
    console.log('Executed tests without bail:', executedTestsNoBail)
    throw new Error('Bail test (without bail) failed')
  }

  // Test 3: Default behavior (bail should be false by default)
  const testerDefault = new Tester()

  const executedTestsDefault: string[] = []

  testerDefault.test('should pass', () => {
    executedTestsDefault.push('test1')
    testerDefault.expect(true).toBe(true)
  })

  testerDefault.test('should fail but continue execution (default)', () => {
    executedTestsDefault.push('test2')
    testerDefault.expect(true).toBe(false) // This will fail
  })

  testerDefault.test('should run despite previous failure (default)', () => {
    executedTestsDefault.push('test3')
    testerDefault.expect(true).toBe(true)
  })

  const resultsDefault = await testerDefault.run()

  try {
    testerDefault.expect(resultsDefault).toHaveLength(3)
    testerDefault.expect(executedTestsDefault).toEqual(['test1', 'test2', 'test3'])
    console.log('Bail test (default behavior) passed')
  } catch (error) {
    console.log('Results default:', JSON.stringify(resultsDefault, null, 2))
    console.log('Executed tests default:', executedTestsDefault)
    throw new Error('Bail test (default behavior) failed')
  }

  // Test 4: Bail with multiple failures - should stop at first failure
  const testerMultipleFailures = new Tester({ bail: true })

  const executedTestsMultiple: string[] = []

  testerMultipleFailures.test('should pass first', () => {
    executedTestsMultiple.push('test1')
    testerMultipleFailures.expect(true).toBe(true)
  })

  testerMultipleFailures.test('first failure - should stop here', () => {
    executedTestsMultiple.push('test2')
    throw new Error('First failure')
  })

  testerMultipleFailures.test('second potential failure - should not run', () => {
    executedTestsMultiple.push('test3')
    throw new Error('Second failure')
  })

  testerMultipleFailures.test('should not run either', () => {
    executedTestsMultiple.push('test4')
    testerMultipleFailures.expect(true).toBe(true)
  })

  const resultsMultiple = await testerMultipleFailures.run()

  try {
    testerMultipleFailures.expect(resultsMultiple).toHaveLength(2)
    testerMultipleFailures.expect(executedTestsMultiple).toEqual(['test1', 'test2'])
    testerMultipleFailures.expect(resultsMultiple[0].passed).toBe(true)
    testerMultipleFailures.expect(resultsMultiple[1].passed).toBe(false)
    console.log('Bail test (multiple failures) passed')
  } catch (error) {
    console.log('Results multiple failures:', JSON.stringify(resultsMultiple, null, 2))
    console.log('Executed tests multiple failures:', executedTestsMultiple)
    throw new Error('Bail test (multiple failures) failed')
  }
} 
