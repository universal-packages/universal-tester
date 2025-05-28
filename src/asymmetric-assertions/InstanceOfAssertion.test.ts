import { Tester } from '../Tester'

import { InstanceOfAssertion } from './InstanceOfAssertion'

export async function instanceOfAssertionTest() {
  const tester = new Tester()

  tester.test('asserts true when value is an instance of expected constructor', () => {
    const dateAssertion = new InstanceOfAssertion(Date)
    const arrayAssertion = new InstanceOfAssertion(Array)
    const regExpAssertion = new InstanceOfAssertion(RegExp)
    const errorAssertion = new InstanceOfAssertion(Error)
    
    tester.expect(dateAssertion.assert(new Date())).toBe(true)
    tester.expect(arrayAssertion.assert([])).toBe(true)
    tester.expect(regExpAssertion.assert(/test/)).toBe(true)
    tester.expect(errorAssertion.assert(new Error())).toBe(true)
  })

  tester.test('asserts false when value is not an instance of expected constructor', () => {
    const dateAssertion = new InstanceOfAssertion(Date)
    
    tester.expect(dateAssertion.assert({})).toBe(false)
    tester.expect(dateAssertion.assert([])).toBe(false)
    tester.expect(dateAssertion.assert('2023-01-01')).toBe(false)
    tester.expect(dateAssertion.assert(123)).toBe(false)
    tester.expect(dateAssertion.assert(null)).toBe(false)
    tester.expect(dateAssertion.assert(undefined)).toBe(false)
  })

  tester.test('works with inheritance', () => {
    class Parent {}
    class Child extends Parent {}
    
    const parentAssertion = new InstanceOfAssertion(Parent)
    const childAssertion = new InstanceOfAssertion(Child)
    
    const parent = new Parent()
    const child = new Child()
    
    tester.expect(parentAssertion.assert(parent)).toBe(true)
    tester.expect(parentAssertion.assert(child)).toBe(true) // Child is also an instance of Parent
    tester.expect(childAssertion.assert(child)).toBe(true)
    tester.expect(childAssertion.assert(parent)).toBe(false) // Parent is not an instance of Child
  })

  tester.describe('when not is passed', () => {
    tester.test('inverts the assertion result', () => {
      const assertion = new InstanceOfAssertion(Date, true)
      
      tester.expect(assertion.assert(new Date())).toBe(false)
      tester.expect(assertion.assert({})).toBe(true)
      tester.expect(assertion.assert(null)).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['asserts true when value is an instance of expected constructor'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['asserts false when value is not an instance of expected constructor'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['works with inheritance'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['when not is passed', 'inverts the assertion result'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('InstanceOfAssertion test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('InstanceOfAssertion test failed')
  }
} 
