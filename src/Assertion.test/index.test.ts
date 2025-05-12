import { toBeTest } from './toBe.test'
import { toEqualTest } from './toEqual.test'

export async function assertionTest() {
  console.log('\n--- RUNNING toBe TESTS ---')
  try {
    await toBeTest()
  } catch (error) {
    console.error('toBe test failed:', error)
  }

  console.log('\n--- RUNNING toEqual TESTS ---')
  try {
    await toEqualTest()
  } catch (error) {
    console.error('toEqual test failed:', error)
  }
}
