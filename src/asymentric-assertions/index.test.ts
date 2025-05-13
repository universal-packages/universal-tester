import { anythingAssertionTest } from './AnythingAssertion.test'

export async function asymmetricAssertionsTest() {
  console.log('\n--- RUNNING AnythingAssertion TESTS ---')
  try {
    await anythingAssertionTest()
  } catch (error) {
    console.error('AnythingAssertion test failed:', error)
  }
}
