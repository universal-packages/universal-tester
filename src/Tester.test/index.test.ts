import { asymmetricAssertionsTest } from './asymmetricAssertions.test'
import { describeOnlyTest } from './describeOnly.test'
import { describeSkipTest } from './describeSkip.test'
import { hierarchyTest } from './hierarchy.test'
import { lifecycleHooksTest } from './lifecycleHooks.test'
import { onlyTest } from './only.test'
import { parallelTest } from './parallel.test'
import { randomTest } from './random.test'
import { skipTest } from './skip.test'
import { timeoutTest } from './timeout.test'

export async function testerTest() {
  console.log('\n--- RUNNING HIERARCHY TESTS ---')
  try {
    await hierarchyTest()
  } catch (error) {
    console.error('Hierarchy test failed:', error)
  }

  console.log('\n--- RUNNING LIFECYCLE HOOKS TESTS ---')
  try {
    await lifecycleHooksTest()
  } catch (error) {
    console.error('Lifecycle hooks test failed:', error)
  }

  console.log('\n--- RUNNING RANDOM ORDER TESTS ---')
  try {
    const maxTries = 10
    let tries = 0

    while (tries < maxTries) {
      try {
        await randomTest()
        break
      } catch (error) {
        tries++
        if (tries === maxTries) {
          throw error
        }
      }
    }
  } catch (error) {
    console.error('Random test failed:', error)
  }

  console.log('\n--- RUNNING PARALLEL TESTS ---')
  try {
    await parallelTest()
  } catch (error) {
    console.error('Parallel test failed:', error)
  }

  console.log('\n--- RUNNING ONLY TESTS ---')
  try {
    await onlyTest()
  } catch (error) {
    console.error('Only test failed:', error)
  }

  console.log('\n--- RUNNING DESCRIBE ONLY TESTS ---')
  try {
    await describeOnlyTest()
  } catch (error) {
    console.error('Describe only test failed:', error)
  }

  console.log('\n--- RUNNING SKIP TESTS ---')
  try {
    await skipTest()
  } catch (error) {
    console.error('Skip test failed:', error)
  }

  console.log('\n--- RUNNING DESCRIBE SKIP TESTS ---')
  try {
    await describeSkipTest()
  } catch (error) {
    console.error('Describe skip test failed:', error)
  }

  console.log('\n--- RUNNING TIMEOUT TESTS ---')
  try {
    await timeoutTest()
  } catch (error) {
    console.error('Timeout test failed:', error)
  }

  console.log('\n--- RUNNING ASYMMETRIC ASSERTIONS TESTS ---')
  try {
    await asymmetricAssertionsTest()
  } catch (error) {
    console.error('Asymmetric assertions test failed:', error)
  }
}
