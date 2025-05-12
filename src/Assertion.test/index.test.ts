import { toBeTest } from './toBe.test'

export async function assertionTest() {
  console.log('\n--- RUNNING toBe TESTS ---')
  try {
    await toBeTest()
  } catch (error) {
    console.error('toBe test failed:', error)
  }
}
