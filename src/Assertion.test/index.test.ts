import { toBeTest } from './toBe.test'
import { toBeCloseToTest } from './toBeCloseTo.test'
import { toBeDefinedTest } from './toBeDefined.test'
import { toBeFalsyTest } from './toBeFalsy.test'
import { toBeGreaterThanTest } from './toBeGreaterThan.test'
import { toBeGreaterThanOrEqualTest } from './toBeGreaterThanOrEqual.test'
import { toBeInstanceOfTest } from './toBeInstanceOf.test'
import { toBeLessThanTest } from './toBeLessThan.test'
import { toBeLessThanOrEqualTest } from './toBeLessThanOrEqual.test'
import { toBeNaNTest } from './toBeNaN.test'
import { toBeNullTest } from './toBeNull.test'
import { toBeTruthyTest } from './toBeTruthy.test'
import { toBeUndefinedTest } from './toBeUndefined.test'
import { toContainTest } from './toContain.test'
import { toContainEqualTest } from './toContainEqual.test'
import { toEqualTest } from './toEqual.test'
import { toHaveBeenCalledTest } from './toHaveBeenCalled.test'
import { toHaveBeenCalledWithTest } from './toHaveBeenCalledWith.test'
import { toHaveLengthTest } from './toHaveLength.test'
import { toHavePropertyTest } from './toHaveProperty.test'
import { toMatchTest } from './toMatch.test'
import { toMatchObjectTest } from './toMatchObject.test'
import { toRejectTest } from './toReject.test'
import { toResolveTest } from './toResolve.test'
import { toThrowTest } from './toThrow.test'

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

  console.log('\n--- RUNNING toBeNull TESTS ---')
  try {
    await toBeNullTest()
  } catch (error) {
    console.error('toBeNull test failed:', error)
  }

  console.log('\n--- RUNNING toBeUndefined TESTS ---')
  try {
    await toBeUndefinedTest()
  } catch (error) {
    console.error('toBeUndefined test failed:', error)
  }

  console.log('\n--- RUNNING toBeDefined TESTS ---')
  try {
    await toBeDefinedTest()
  } catch (error) {
    console.error('toBeDefined test failed:', error)
  }

  console.log('\n--- RUNNING toBeTruthy TESTS ---')
  try {
    await toBeTruthyTest()
  } catch (error) {
    console.error('toBeTruthy test failed:', error)
  }

  console.log('\n--- RUNNING toBeFalsy TESTS ---')
  try {
    await toBeFalsyTest()
  } catch (error) {
    console.error('toBeFalsy test failed:', error)
  }

  console.log('\n--- RUNNING toContain TESTS ---')
  try {
    await toContainTest()
  } catch (error) {
    console.error('toContain test failed:', error)
  }

  console.log('\n--- RUNNING toContainEqual TESTS ---')
  try {
    await toContainEqualTest()
  } catch (error) {
    console.error('toContainEqual test failed:', error)
  }

  console.log('\n--- RUNNING toHaveLength TESTS ---')
  try {
    await toHaveLengthTest()
  } catch (error) {
    console.error('toHaveLength test failed:', error)
  }

  console.log('\n--- RUNNING toHaveProperty TESTS ---')
  try {
    await toHavePropertyTest()
  } catch (error) {
    console.error('toHaveProperty test failed:', error)
  }

  console.log('\n--- RUNNING toBeGreaterThan TESTS ---')
  try {
    await toBeGreaterThanTest()
  } catch (error) {
    console.error('toBeGreaterThan test failed:', error)
  }

  console.log('\n--- RUNNING toBeGreaterThanOrEqual TESTS ---')
  try {
    await toBeGreaterThanOrEqualTest()
  } catch (error) {
    console.error('toBeGreaterThanOrEqual test failed:', error)
  }

  console.log('\n--- RUNNING toBeLessThan TESTS ---')
  try {
    await toBeLessThanTest()
  } catch (error) {
    console.error('toBeLessThan test failed:', error)
  }

  console.log('\n--- RUNNING toBeLessThanOrEqual TESTS ---')
  try {
    await toBeLessThanOrEqualTest()
  } catch (error) {
    console.error('toBeLessThanOrEqual test failed:', error)
  }

  console.log('\n--- RUNNING toBeNaN TESTS ---')
  try {
    await toBeNaNTest()
  } catch (error) {
    console.error('toBeNaN test failed:', error)
  }

  console.log('\n--- RUNNING toMatch TESTS ---')
  try {
    await toMatchTest()
  } catch (error) {
    console.error('toMatch test failed:', error)
  }

  console.log('\n--- RUNNING toMatchObject TESTS ---')
  try {
    await toMatchObjectTest()
  } catch (error) {
    console.error('toMatchObject test failed:', error)
  }

  console.log('\n--- RUNNING toThrow TESTS ---')
  try {
    await toThrowTest()
  } catch (error) {
    console.error('toThrow test failed:', error)
  }

  console.log('\n--- RUNNING toBeInstanceOf TESTS ---')
  try {
    await toBeInstanceOfTest()
  } catch (error) {
    console.error('toBeInstanceOf test failed:', error)
  }

  console.log('\n--- RUNNING toBeCloseTo TESTS ---')
  try {
    await toBeCloseToTest()
  } catch (error) {
    console.error('toBeCloseTo test failed:', error)
  }

  console.log('\n--- RUNNING toResolve TESTS ---')
  try {
    await toResolveTest()
  } catch (error) {
    console.error('toResolve test failed:', error)
  }

  console.log('\n--- RUNNING toReject TESTS ---')
  try {
    await toRejectTest()
  } catch (error) {
    console.error('toReject test failed:', error)
  }

  console.log('\n--- RUNNING toHaveBeenCalled TESTS ---')
  try {
    await toHaveBeenCalledTest()
  } catch (error) {
    console.error('toHaveBeenCalled test failed:', error)
  }

  console.log('\n--- RUNNING toHaveBeenCalledWith TESTS ---')
  try {
    await toHaveBeenCalledWithTest()
  } catch (error) {
    console.error('toHaveBeenCalledWith test failed:', error)
  }
}
