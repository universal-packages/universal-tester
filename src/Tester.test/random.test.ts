import { Tester } from '../Tester'

export async function randomTest() {
  // Create a tester with random run order
  const tester = new Tester({ runOrder: 'random' })

  // Array to track execution order
  const executionOrder: string[] = []

  // Create several tests that record their execution order
  tester.test('test1', () => {
    executionOrder.push('test1')
    tester.expect(true).toBe(true)
  })

  tester.test('test2', () => {
    executionOrder.push('test2')
    tester.expect(true).toBe(true)
  })

  tester.test('test3', () => {
    executionOrder.push('test3')
    tester.expect(true).toBe(true)
  })

  tester.test('test4', () => {
    executionOrder.push('test4')
    tester.expect(true).toBe(true)
  })

  tester.test('test5', () => {
    executionOrder.push('test5')
    tester.expect(true).toBe(true)
  })

  // Run the tests
  const results = await tester.run()

  // Verify all tests passed
  const allPassed = results.every((result) => result.passed)
  if (!allPassed) {
    throw new Error('Not all tests passed')
  }

  // Get the default order
  const defaultOrder = ['test1', 'test2', 'test3', 'test4', 'test5']

  // Check if the execution order is different from the default order
  // (There's a small chance they could match by random chance, but it's unlikely)
  const isRandom = JSON.stringify(executionOrder) !== JSON.stringify(defaultOrder)

  if (!isRandom) {
    console.log('Expected random order, but got default order:', executionOrder)
    throw new Error('Random test order failed')
  } else {
    console.log('Random test passed with execution order:', executionOrder)
  }
}
