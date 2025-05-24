import { anythingAssertionTest } from './AnythingAssertion.test'
import { closeToAssertionTest } from './CloseToAssertion.test'
import { containAssertionTest } from './ContainAssertion.test'
import { containEqualAssertionTest } from './ContainEqualAssertion.test'
import { falsyAssertionTest } from './FalsyAssertion.test'
import { greaterThanAssertionTest } from './GreaterThanAssertion.test'
import { greaterThanOrEqualAssertionTest } from './GreaterThanOrEqualAssertion.test'
import { haveLengthAssertionTest } from './HaveLengthAssertion.test'
import { havePropertyAssertionTest } from './HavePropertyAssertion.test'
import { instanceOfAssertionTest } from './InstanceOfAssertion.test'
import { lessThanAssertionTest } from './LessThanAssertion.test'
import { lessThanOrEqualAssertionTest } from './LessThanOrEqualAssertion.test'
import { matchAssertionTest } from './MatchAssertion.test'
import { matchObjectAssertionTest } from './MatchObjectAssertion.test'
import { truthyAssertionTest } from './TruthyAssertion.test'

export async function asymmetricAssertionsTest() {
  console.log('\n--- RUNNING AnythingAssertion TESTS ---')
  try {
    await anythingAssertionTest()
  } catch (error) {
    console.error('AnythingAssertion test failed:', error)
  }

  console.log('\n--- RUNNING CloseToAssertion TESTS ---')
  try {
    await closeToAssertionTest()
  } catch (error) {
    console.error('CloseToAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING ContainAssertion TESTS ---')
  try {
    await containAssertionTest()
  } catch (error) {
    console.error('ContainAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING ContainEqualAssertion TESTS ---')
  try {
    await containEqualAssertionTest()
  } catch (error) {
    console.error('ContainEqualAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING FalsyAssertion TESTS ---')
  try {
    await falsyAssertionTest()
  } catch (error) {
    console.error('FalsyAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING GreaterThanAssertion TESTS ---')
  try {
    await greaterThanAssertionTest()
  } catch (error) {
    console.error('GreaterThanAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING GreaterThanOrEqualAssertion TESTS ---')
  try {
    await greaterThanOrEqualAssertionTest()
  } catch (error) {
    console.error('GreaterThanOrEqualAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING HaveLengthAssertion TESTS ---')
  try {
    await haveLengthAssertionTest()
  } catch (error) {
    console.error('HaveLengthAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING HavePropertyAssertion TESTS ---')
  try {
    await havePropertyAssertionTest()
  } catch (error) {
    console.error('HavePropertyAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING InstanceOfAssertion TESTS ---')
  try {
    await instanceOfAssertionTest()
  } catch (error) {
    console.error('InstanceOfAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING LessThanAssertion TESTS ---')
  try {
    await lessThanAssertionTest()
  } catch (error) {
    console.error('LessThanAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING LessThanOrEqualAssertion TESTS ---')
  try {
    await lessThanOrEqualAssertionTest()
  } catch (error) {
    console.error('LessThanOrEqualAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING MatchAssertion TESTS ---')
  try {
    await matchAssertionTest()
  } catch (error) {
    console.error('MatchAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING MatchObjectAssertion TESTS ---')
  try {
    await matchObjectAssertionTest()
  } catch (error) {
    console.error('MatchObjectAssertion test failed:', error)
  }
  
  console.log('\n--- RUNNING TruthyAssertion TESTS ---')
  try {
    await truthyAssertionTest()
  } catch (error) {
    console.error('TruthyAssertion test failed:', error)
  }
}
