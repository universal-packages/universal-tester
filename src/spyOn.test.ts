import { Tester } from './Tester'

export async function spyOnTest() {
  console.log('\n--- RUNNING spyOn TESTS ---')
  const tester = new Tester()

  // Basic spy functionality with class method
  tester.test('should spy on a class method and preserve original behavior', () => {
    class Calculator {
      sum(a: number, b: number): number {
        return a + b
      }
    }

    const calculator = new Calculator()
    const mockSum = tester.spyOn(calculator, 'sum')

    // Call the method - should behave normally
    const result = calculator.sum(1, 2)

    // Original behavior should be preserved
    tester.expect(result).toBe(3)
    
    // Spy should track the call
    tester.expect(mockSum.calls).toHaveLength(1)
    tester.expect(mockSum.calls[0].args).toEqual([1, 2])
    tester.expect(mockSum.calls[0].result).toBe(3)
  })

  // Spy on object method
  tester.test('should spy on object methods', () => {
    const obj = {
      multiply: (x: number, y: number) => x * y
    }

    const spy = tester.spyOn(obj, 'multiply')
    
    const result = obj.multiply(3, 4)
    
    tester.expect(result).toBe(12)
    tester.expect(spy.calls).toHaveLength(1)
    tester.expect(spy.calls[0].args).toEqual([3, 4])
    tester.expect(spy.calls[0].result).toBe(12)
  })

  // Override implementation while spying
  tester.test('should allow overriding implementation while spying', () => {
    const obj = {
      getValue: () => 'original'
    }

    const spy = tester.spyOn(obj, 'getValue')
    spy.implement(() => 'mocked')

    const result = obj.getValue()
    
    tester.expect(result).toBe('mocked')
    tester.expect(spy.calls).toHaveLength(1)
    tester.expect(spy.calls[0].result).toBe('mocked')
  })

  // Restore functionality
  tester.test('should restore original behavior when restore is called', () => {
    const obj = {
      getValue: () => 'original'
    }

    const spy = tester.spyOn(obj, 'getValue')
    spy.implement(() => 'mocked')

    // Should be mocked
    tester.expect(obj.getValue()).toBe('mocked')
    
    // Restore original
    spy.restore()
    
    // Should be back to original
    tester.expect(obj.getValue()).toBe('original')
  })

  // Scenarios like regular mock functions
  tester.test('should handle scenarios like regular mock functions', () => {
    const obj = {
      add: (a: number, b: number) => a + b
    }

    const spy = tester.spyOn(obj, 'add')
    spy.scenario([1, 2], 100) // When called with [1, 2], return 100

    const result1 = obj.add(1, 2) // Should return 100 (scenario)
    const result2 = obj.add(3, 4) // Should return 7 (original behavior)
    
    tester.expect(result1).toBe(100)
    tester.expect(result2).toBe(7)
    tester.expect(spy.calls).toHaveLength(2)
  })

  // Error handling - non-existent property
  tester.test('should throw error when trying to spy on non-existent property', () => {
    const obj = {}
    
    tester.expect(() => {
      tester.spyOn(obj, 'nonExistent')
    }).toThrow('Cannot spy on nonExistent: property does not exist')
  })

  // implementOnce functionality
  tester.test('should support implementOnce like regular mock functions', () => {
    const obj = {
      getValue: () => 'original'
    }

    const spy = tester.spyOn(obj, 'getValue')
    spy.implementOnce(() => 'once')

    const result1 = obj.getValue() // Should return 'once'
    const result2 = obj.getValue() // Should return 'original'
    
    tester.expect(result1).toBe('once')
    tester.expect(result2).toBe('original')
    tester.expect(spy.calls).toHaveLength(2)
  })

  // Test toHaveBeenCalled assertion
  tester.test('should work with toHaveBeenCalled assertions', () => {
    const obj = {
      method: () => 'result'
    }

    const spy = tester.spyOn(obj, 'method')
    
    tester.expect(spy).not.toHaveBeenCalled()
    
    obj.method()
    
    tester.expect(spy).toHaveBeenCalled()
    tester.expect(spy).toHaveBeenCalledWith()
  })

  // Test methods that use 'this' context
  tester.test('should preserve this context for class methods', () => {
    class Counter {
      count: number = 0

      increment(): number {
        this.count++
        return this.count
      }

      getCount(): number {
        return this.count
      }

      addToCount(value: number): number {
        this.count += value
        return this.count
      }
    }

    const counter = new Counter()
    const incrementSpy = tester.spyOn(counter, 'increment')
    const getCountSpy = tester.spyOn(counter, 'getCount')
    const addToCountSpy = tester.spyOn(counter, 'addToCount')

    // Initial state
    tester.expect(counter.getCount()).toBe(0)

    // Increment should work normally and modify this.count
    const result1 = counter.increment()
    tester.expect(result1).toBe(1)
    tester.expect(counter.count).toBe(1)

    // Get count should return updated value
    const result2 = counter.getCount()
    tester.expect(result2).toBe(1)

    // Add to count should work with this.count
    const result3 = counter.addToCount(5)
    tester.expect(result3).toBe(6)
    tester.expect(counter.count).toBe(6)

    // Verify spies tracked all calls correctly
    tester.expect(incrementSpy.calls).toHaveLength(1)
    tester.expect(incrementSpy.calls[0].result).toBe(1)

    tester.expect(getCountSpy.calls).toHaveLength(2)
    tester.expect(getCountSpy.calls[0].result).toBe(0)
    tester.expect(getCountSpy.calls[1].result).toBe(1)

    tester.expect(addToCountSpy.calls).toHaveLength(1)
    tester.expect(addToCountSpy.calls[0].args).toEqual([5])
    tester.expect(addToCountSpy.calls[0].result).toBe(6)
  })

  // Test methods that use 'this' context in plain objects
  tester.test('should preserve this context for object methods', () => {
    const user = {
      name: 'John',
      age: 25,
      
      getName() {
        return this.name
      },
      
      setAge(newAge: number) {
        this.age = newAge
        return this.age
      },
      
      getInfo() {
        return `${this.name} is ${this.age} years old`
      }
    }

    const getNameSpy = tester.spyOn(user, 'getName')
    const setAgeSpy = tester.spyOn(user, 'setAge')
    const getInfoSpy = tester.spyOn(user, 'getInfo')

    // Test getName with this context
    const name = user.getName()
    tester.expect(name).toBe('John')

    // Test setAge with this context
    const newAge = user.setAge(30)
    tester.expect(newAge).toBe(30)
    tester.expect(user.age).toBe(30) // this.age should be modified

    // Test getInfo with this context accessing multiple properties
    const info = user.getInfo()
    tester.expect(info).toBe('John is 30 years old')

    // Verify spies tracked calls correctly
    tester.expect(getNameSpy.calls).toHaveLength(1)
    tester.expect(getNameSpy.calls[0].result).toBe('John')

    tester.expect(setAgeSpy.calls).toHaveLength(1)
    tester.expect(setAgeSpy.calls[0].args).toEqual([30])
    tester.expect(setAgeSpy.calls[0].result).toBe(30)

    tester.expect(getInfoSpy.calls).toHaveLength(1)
    tester.expect(getInfoSpy.calls[0].result).toBe('John is 30 years old')
  })

  // Test 'this' context with overridden implementation
  tester.test('should preserve this context even with overridden implementation', () => {
    class Calculator {
      value: number = 0

      add(num: number): number {
        this.value += num
        return this.value
      }
    }

    const calc = new Calculator()
    const addSpy = tester.spyOn(calc, 'add')

    // Test original behavior first
    const result1 = calc.add(5)
    tester.expect(result1).toBe(5)
    tester.expect(calc.value).toBe(5)

    // Override implementation but it should still have access to 'this'
    addSpy.implement(function(this: Calculator, num: number) {
      this.value += num * 2 // Double the value
      return this.value
    })

    const result2 = calc.add(3)
    tester.expect(result2).toBe(11) // 5 + (3 * 2) = 11
    tester.expect(calc.value).toBe(11)

    // Verify spy tracked both calls
    tester.expect(addSpy.calls).toHaveLength(2)
    tester.expect(addSpy.calls[0].result).toBe(5)
    tester.expect(addSpy.calls[1].result).toBe(11)
  })

  const results = await tester.run()
  
  // Check that all tests passed
  const failedTests = results.filter(result => !result.passed)
  if (failedTests.length > 0) {
    console.log('Failed tests:', JSON.stringify(failedTests, null, 2))
    throw new Error('spyOn test failed')
  } else {
    console.log('spyOn test passed')
  }
} 
