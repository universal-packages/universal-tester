import { Tester } from '../Tester'

export async function toBeInstanceOfTest() {
  const tester = new Tester()

  class TestClass {}
  class DifferentClass {}

  tester.test('should pass for instance of class', () => {
    tester.expect(new TestClass()).toBeInstanceOf(TestClass)
  })

  tester.test('should fail for instance of different class', () => {
    tester.expect(new TestClass()).toBeInstanceOf(DifferentClass)
  })

  tester.test('should pass for array instance', () => {
    tester.expect([]).toBeInstanceOf(Array)
  })

  tester.test('should pass for object instance', () => {
    tester.expect({}).toBeInstanceOf(Object)
  })

  tester.test('should pass for date instance', () => {
    tester.expect(new Date()).toBeInstanceOf(Date)
  })

  tester.test('should pass for not.toBeInstanceOf with different class', () => {
    tester.expect(new TestClass()).not.toBeInstanceOf(DifferentClass)
  })

  tester.test('should fail for not.toBeInstanceOf with matching class', () => {
    tester.expect(new TestClass()).not.toBeInstanceOf(TestClass)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for instance of class'],
      passed: true
    },
    {
      spec: ['should fail for instance of different class'],
      error: {
        message: 'Expected {{actual}} to be instance of {{expected}}, but it was not',
        messageLocals: {
          expected: 'DifferentClass',
          actual: 'Object'
        },
        expected: 'DifferentClass',
        actual: new TestClass()
      },
      passed: false
    },
    {
      spec: ['should pass for array instance'],
      passed: true
    },
    {
      spec: ['should pass for object instance'],
      passed: true
    },
    {
      spec: ['should pass for date instance'],
      passed: true
    },
    {
      spec: ['should pass for not.toBeInstanceOf with different class'],
      passed: true
    },
    {
      spec: ['should fail for not.toBeInstanceOf with matching class'],
      error: {
        message: 'Expected {{actual}} not to be instance of {{expected}}, but it was',
        messageLocals: {
          expected: 'TestClass',
          actual: 'Object'
        },
        expected: 'TestClass',
        actual: new TestClass()
      },
      passed: false
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toBeInstanceOf test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toBeInstanceOf test failed')
  }
} 
