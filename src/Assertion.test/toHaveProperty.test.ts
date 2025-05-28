import { Tester } from '../Tester'

export async function toHavePropertyTest() {
  const tester = new Tester()

  tester.test('should pass for object with property', () => {
    tester.expect({ name: 'test' }).toHaveProperty('name')
  })

  tester.test('should fail for object without property', () => {
    tester.expect({ name: 'test' }).toHaveProperty('age')
  })

  tester.test('should pass for nested property', () => {
    tester.expect({ user: { name: 'test' } }).toHaveProperty('user.name')
  })

  tester.test('should fail for missing nested property', () => {
    tester.expect({ user: { name: 'test' } }).toHaveProperty('user.age')
  })

  tester.test('should pass for property with specific value', () => {
    tester.expect({ name: 'test' }).toHaveProperty('name', 'test')
  })

  tester.test('should fail for property with different value', () => {
    tester.expect({ name: 'test' }).toHaveProperty('name', 'wrong')
  })

  tester.test('should pass for nested property with specific value', () => {
    tester.expect({ user: { name: 'test' } }).toHaveProperty('user.name', 'test')
  })

  tester.test('should fail for nested property with different value', () => {
    tester.expect({ user: { name: 'test' } }).toHaveProperty('user.name', 'wrong')
  })

  tester.test('should fail for non-object value', () => {
    tester.expect('string').toHaveProperty('length')
  })

  tester.test('should pass for not.toHaveProperty with missing property', () => {
    tester.expect({ name: 'test' }).not.toHaveProperty('age')
  })

  tester.test('should fail for not.toHaveProperty with existing property', () => {
    tester.expect({ name: 'test' }).not.toHaveProperty('name')
  })

  tester.test('should pass for not.toHaveProperty with different value', () => {
    tester.expect({ name: 'test' }).not.toHaveProperty('name', 'wrong')
  })

  tester.test('should fail for not.toHaveProperty with matching value', () => {
    tester.expect({ name: 'test' }).not.toHaveProperty('name', 'test')
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should pass for object with property'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for object without property'],
      error: {
        message: 'Expected object to have property {{path}}, but it did not',
        messageLocals: {
          path: 'age'
        },
        expected: 'property age',
        actual: { name: 'test' }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for nested property'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for missing nested property'],
      error: {
        message: 'Expected object to have property {{path}}, but it did not',
        messageLocals: {
          path: 'user.age'
        },
        expected: 'property user.age',
        actual: { user: { name: 'test' } }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for property with specific value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for property with different value'],
      error: {
        message: 'Expected property {{path}} to equal {{expected}}, but got {{actual}}',
        messageLocals: {
          path: 'name',
          expected: 'wrong',
          actual: 'test'
        },
        expected: 'wrong',
        actual: 'test'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for nested property with specific value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for nested property with different value'],
      error: {
        message: 'Expected property {{path}} to equal {{expected}}, but got {{actual}}',
        messageLocals: {
          path: 'user.name',
          expected: 'wrong',
          actual: 'test'
        },
        expected: 'wrong',
        actual: 'test'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for non-object value'],
      error: {
        message: 'Expected object to have property {{path}}, but it did not',
        messageLocals: {
          path: 'length'
        },
        expected: 'property length',
        actual: 'string'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toHaveProperty with missing property'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toHaveProperty with existing property'],
      error: {
        message: 'Expected object not to have property {{path}}, but it did',
        messageLocals: {
          path: 'name'
        },
        expected: 'no property name',
        actual: 'test'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should pass for not.toHaveProperty with different value'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should fail for not.toHaveProperty with matching value'],
      error: {
        message: 'Expected property {{path}} not to equal {{expected}}, but it did',
        messageLocals: {
          path: 'name',
          expected: 'test'
        },
        expected: 'test',
        actual: 'test'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('toHaveProperty test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toHaveProperty test failed')
  }
}
