# Tester

[![npm version](https://badge.fury.io/js/@universal-packages%2Ftester.svg)](https://www.npmjs.com/package/@universal-packages/tester)
[![Testing](https://github.com/universal-packages/universal-tester/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-tester/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-tester/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-tester)

Class based tester utilities.

# Getting Started

```shell
npm install @universal-packages/tester
```

# Usage

## Tester `class`

The `Tester` class is a utility where you pack and organize your tests. It also supplies all matchers and utilities for testing.

```ts
import { Tester } from '@universal-packages/tester'

import { MyCode } from './my-code'

const tester = new Tester()

tester.describe(MyCode, () => {
  tester.it('should do something', () => {
    const result = MyCode.doSomething()
    tester.expect(result).toEqual('expected result')
  })
})
```

### Constructor <small><small>`constructor`</small></small>

```ts
new Tester(options?: TesterOptions)
```

#### TesterOptions

- **`bail`**: `boolean` (default: `false`)
  If a test fails, the tester will stop and mark the test suite as failed.
- **`runOrder`**: `sequence` | `random` | `parallel` (default: `sequence`)
  It defines the order of the tests.
  - **`sequence`**: Run tests in the order they are defined.
  - **`random`**: Run tests in random order.
  - **`parallel`**: Run tests in parallel.
- **`timeout`**: `number` (default: `5000`)
  If the test takes longer than the timeout, it will be killed and marked as failed.

### Tests description

#### describe

```ts
describe(description: string, callback: () => void, options?: DescribeOptions)
```

The `describe` method is used to group tests together.

```ts
tester.describe(MyCode, () => {
  tester.describe('when passing a string', () => {
    tester.it('should do something', () => {
      const result = MyCode.doSomething('test')
      tester.expect(result).toEqual('string found')
    })
  })

  tester.describe('when passing an array', () => {
    tester.it('should do something', () => {
      const result = MyCode.doSomething(['test'])
      tester.expect(result).toEqual('array found')
    })
  })
})
```

##### DescribeOptions

- **`only`**: `boolean` (default: `false`)
  It will run only the tests that are inside the `describe` block.
- **`skip`**: `boolean` (default: `false`)
  It will skip the tests that are inside the `describe` block.
- **`skipReason`**: `string` (default: `null`)
  Information about why the tests are skipped.
- **`timeout`**: `number` (default: `5000`)
  If the test inside the `describe` block takes longer than the timeout, it will be killed and marked as failed.

#### when

```ts
when(description: string, callback: () => void)
```

The `when` is an alias for the `describe` method.

#### test

```ts
test(description: string, callback: () => void)
```

The `test` method is used to run a single test. It can be inside a `describe` block or by itself.

```ts
tester.test('should do something', () => {
  const result = MyCode.doSomething()
  tester.expect(result).toEqual('expected result')
})
```

##### TestOptions

- **`only`**: `boolean` (default: `false`)
  It will run only the tests that are inside the `describe` block.
- **`skip`**: `boolean` (default: `false`)
  It will skip the tests that are inside the `describe` block.
- **`skipReason`**: `string` (default: `null`)
  Information about why the tests are skipped.
- **`timeout`**: `number` (default: `5000`)
  If the test takes longer than the timeout, it will be killed and marked as failed.

#### it

```ts
it(description: string, callback: () => void)
```

The `it` method is an alias for the `test` method.

### Tests lifecycle

#### before

```ts
before(callback: () => void | Promise<void>)
```

The `before` method is used to run a function before the immediate tests are run. For example, if you need something to happen before the whole test suite is run, you can use the `before` method outside of all the `describe` blocks.

```ts
tester.before(() => {
  console.log('before the whole test suite')
})
```

If you want to run something just before a group of tests inside a `describe` block, you can use the `before` method inside the `describe` block.

```ts
tester.describe('when passing a string', () => {
  tester.before(() => {
    console.log('before the tests inside the describe block')
  })
})
```

#### beforeEach

```ts
beforeEach(callback: () => void | Promise<void>)
```

The `beforeEach` method is used to run a function before each test. Just like the `before` method, it can be inside a `describe` block or by itself. If it is outside of a `describe` block, it will run before each test.

```ts
tester.beforeEach(() => {
  console.log('before each test')
})
```

If it is inside a `describe` block, it will run before each test inside that `describe` block.

```ts
tester.describe('when passing a string', () => {
  tester.beforeEach(() => {
    console.log('before each test inside the describe block')
  })
})
```

#### after

```ts
after(callback: () => void | Promise<void>)
```

The `after` method is used to run a function after the immediate tests are run. For example, if you need something to happen after the whole test suite is run, you can use the `after` method outside of all the `describe` blocks.

```ts
tester.after(() => {
  console.log('after the whole test suite')
})
```

If you want to run something just after a group of tests inside a `describe` block, you can use the `after` method inside the `describe` block.

```ts
tester.describe('when passing a string', () => {
  tester.after(() => {
    console.log('after the tests inside the describe block')
  })
})
```

#### afterEach

```ts
afterEach(callback: () => void | Promise<void>)
```

The `afterEach` method is used to run a function after each test. Just like the `after` method, it can be inside a `describe` block or by itself. If it is outside of a `describe` block, it will run after each test.

```ts
tester.afterEach(() => {
  console.log('after each test inside the describe block')
})
```

If it is inside a `describe` block, it will run after each test inside that `describe` block.

```ts
tester.describe('when passing a string', () => {
  tester.afterEach(() => {
    console.log('after each test inside the describe block')
  })
})
```

### Test matchers

The `Tester` class has a set of matchers that can be used to test the value of a variable.

#### expect

```ts
expect(value: any)
```

The `expect` method is used to setup an assertion with the obtained value of some calculation.

```ts
tester.expect(result).toEqual('expected result')
```

#### toBe

```ts
toBe(value: any)
```

The `toBe` matcher is used to test if the value of a variable is equal to the expected value. It works the same way as the `toEqual` matcher for primitive values, but it will not work for objects and arrays. For an object or array, it will check if the value is the same instance of the expected value.

```ts
tester.expect(result).toBe(expectedResult)
```

#### toBeCloseTo

```ts
toBeCloseTo(number: number, precision?: number)
```

The `toBeCloseTo` matcher is used to test if a floating point number is close to the expected value within a certain precision. The default precision is 2 decimal places.

```ts
tester.expect(0.1 + 0.2).toBeCloseTo(0.3)
tester.expect(0.1 + 0.2).toBeCloseTo(0.3, 5)
```

#### toBeDefined

```ts
toBeDefined()
```

The `toBeDefined` matcher is used to test if the value is not `undefined`.

```ts
tester.expect(result).toBeDefined()
```

#### toBeFalsy

```ts
toBeFalsy()
```

The `toBeFalsy` matcher is used to test if the value is falsy (evaluates to `false` in a boolean context).

```ts
tester.expect(result).toBeFalsy()
```

#### toBeGreaterThan

```ts
toBeGreaterThan(number: number)
```

The `toBeGreaterThan` matcher is used to test if a number is greater than the expected value.

```ts
tester.expect(10).toBeGreaterThan(5)
```

#### toBeGreaterThanOrEqual

```ts
toBeGreaterThanOrEqual(number: number)
```

The `toBeGreaterThanOrEqual` matcher is used to test if a number is greater than or equal to the expected value.

```ts
tester.expect(10).toBeGreaterThanOrEqual(10)
tester.expect(15).toBeGreaterThanOrEqual(10)
```

#### toBeInstanceOf

```ts
toBeInstanceOf(constructor: Function)
```

The `toBeInstanceOf` matcher is used to test if an object is an instance of a specific constructor function or class.

```ts
tester.expect(new Date()).toBeInstanceOf(Date)
tester.expect([]).toBeInstanceOf(Array)
tester.expect('hello').toBeInstanceOf(String)
```

#### toBeLessThan

```ts
toBeLessThan(number: number)
```

The `toBeLessThan` matcher is used to test if a number is less than the expected value.

```ts
tester.expect(5).toBeLessThan(10)
```

#### toBeLessThanOrEqual

```ts
toBeLessThanOrEqual(number: number)
```

The `toBeLessThanOrEqual` matcher is used to test if a number is less than or equal to the expected value.

```ts
tester.expect(10).toBeLessThanOrEqual(10)
tester.expect(5).toBeLessThanOrEqual(10)
```

#### toBeNaN

```ts
toBeNaN()
```

The `toBeNaN` matcher is used to test if the value is `NaN`.

```ts
tester.expect(NaN).toBeNaN()
tester.expect(Number('not a number')).toBeNaN()
```

#### toBeNull

```ts
toBeNull()
```

The `toBeNull` matcher is used to test if the value is `null`.

```ts
tester.expect(result).toBeNull()
```

#### toBeTruthy

```ts
toBeTruthy()
```

The `toBeTruthy` matcher is used to test if the value is truthy (evaluates to `true` in a boolean context).

```ts
tester.expect(result).toBeTruthy()
```

#### toBeUndefined

```ts
toBeUndefined()
```

The `toBeUndefined` matcher is used to test if the value is `undefined`.

```ts
tester.expect(result).toBeUndefined()
```

#### toContain

```ts
toContain(item: any)
```

The `toContain` matcher is used to test if an array contains a specific item or if a string contains a substring.

```ts
tester.expect(['apple', 'banana', 'cherry']).toContain('banana')
tester.expect('hello world').toContain('world')
```

#### toContainEqual

```ts
toContainEqual(item: any)
```

The `toContainEqual` matcher is used to test if an array contains an item that is equal to the expected value (using deep equality comparison).

```ts
tester.expect([{ name: 'John' }, { name: 'Jane' }]).toContainEqual({ name: 'John' })
```

#### toEqual

```ts
toEqual(value: any)
```

The `toEqual` matcher is used to test if the value of a variable is equal to the expected value. It works for primitive values, arrays, and objects. For objects, it will check if the value is equal to the expected value by comparing the keys and values. For arrays, it will check if the value is equal to the expected value by comparing the length and the values of the array.

```ts
tester.expect(result).toEqual('expected result')
```

#### toHaveLength

```ts
toHaveLength(length: number)
```

The `toHaveLength` matcher is used to test if an array, string, or any object with a `length` property has the expected length.

```ts
tester.expect([1, 2, 3]).toHaveLength(3)
tester.expect('hello').toHaveLength(5)
```

#### toHaveProperty

```ts
toHaveProperty(path: string, value?: any)
```

The `toHaveProperty` matcher is used to test if an object has a specific property. Optionally, you can also check if the property has a specific value. The path can use dot notation for nested properties.

```ts
tester.expect({ name: 'John', age: 30 }).toHaveProperty('name')
tester.expect({ name: 'John', age: 30 }).toHaveProperty('name', 'John')
tester.expect({ user: { name: 'John' } }).toHaveProperty('user.name', 'John')
```

#### toMatch

```ts
toMatch(regex: RegExp)
```

The `toMatch` matcher is used to test if a string matches a regular expression.

```ts
tester.expect('hello world').toMatch(/world/)
tester.expect('123-456-7890').toMatch(/\d{3}-\d{3}-\d{4}/)
```

#### toMatchObject

```ts
toMatchObject(object: Record<string, any>)
```

The `toMatchObject` matcher is used to test if an object matches a subset of properties from the expected object. The actual object can have additional properties.

```ts
tester.expect({ name: 'John', age: 30, city: 'New York' }).toMatchObject({ name: 'John', age: 30 })
```

#### toReject

```ts
async toReject(expected?: string | RegExp | Error): Promise<void>
```

The `toReject` matcher is used to test if a promise rejects. You can optionally specify the expected error message, error instance, or a regex pattern.

```ts
await tester.expect(Promise.reject(new Error('Failed'))).toReject()
await tester.expect(Promise.reject(new Error('Failed'))).toReject('Failed')
await tester.expect(Promise.reject(new Error('Failed'))).toReject(/Failed/)
```

#### toResolve

```ts
async toResolve(expected?: any): Promise<void>
```

The `toResolve` matcher is used to test if a promise resolves successfully. You can optionally specify the expected resolved value.

```ts
await tester.expect(Promise.resolve('success')).toResolve()
await tester.expect(Promise.resolve('success')).toResolve('success')
```

#### toThrow

```ts
toThrow(expected?: Error | RegExp | string)
```

The `toThrow` matcher is used to test if a function throws an error. You can optionally specify the expected error message, error instance, or a regex pattern.

```ts
tester.expect(() => { throw new Error('Something went wrong') }).toThrow()
tester.expect(() => { throw new Error('Something went wrong') }).toThrow('Something went wrong')
tester.expect(() => { throw new Error('Something went wrong') }).toThrow(/went wrong/)
tester.expect(() => { throw new Error('Something went wrong') }).toThrow(new Error('Something went wrong'))
```

### Mock function matchers

The following matchers are used specifically for testing mock functions created with the testing framework.

#### toHaveBeenCalled

```ts
toHaveBeenCalled()
```

The `toHaveBeenCalled` matcher is used to test if a mock function has been called at least once.

```ts
const mockFn = tester.createMockFunction()
mockFn()
tester.expect(mockFn).toHaveBeenCalled()
```

#### toHaveBeenCalledTimes

```ts
toHaveBeenCalledTimes(expectedCount: number)
```

The `toHaveBeenCalledTimes` matcher is used to test if a mock function has been called a specific number of times.

```ts
const mockFn = tester.createMockFunction()
mockFn()
mockFn()
tester.expect(mockFn).toHaveBeenCalledTimes(2)
```

#### toHaveBeenCalledTimesWith

```ts
toHaveBeenCalledTimesWith(expectedCount: number, ...args: any[])
```

The `toHaveBeenCalledTimesWith` matcher is used to test if a mock function has been called a specific number of times with specific arguments.

```ts
const mockFn = tester.createMockFunction()
mockFn('hello')
mockFn('world')
mockFn('hello')
tester.expect(mockFn).toHaveBeenCalledTimesWith(2, 'hello')
```

#### toHaveBeenCalledWith

```ts
toHaveBeenCalledWith(...args: any[])
```

The `toHaveBeenCalledWith` matcher is used to test if a mock function has been called with specific arguments.

```ts
const mockFn = tester.createMockFunction()
mockFn('hello', 'world')
tester.expect(mockFn).toHaveBeenCalledWith('hello', 'world')
```

#### toHaveBeenLastCalledWith

```ts
toHaveBeenLastCalledWith(...args: any[])
```

The `toHaveBeenLastCalledWith` matcher is used to test if a mock function's last call was made with specific arguments.

```ts
const mockFn = tester.createMockFunction()
mockFn('first', 'call')
mockFn('last', 'call')
tester.expect(mockFn).toHaveBeenLastCalledWith('last', 'call')
```

#### toHaveBeenNthCalledWith

```ts
toHaveBeenNthCalledWith(n: number, ...args: any[])
```

The `toHaveBeenNthCalledWith` matcher is used to test if a mock function's nth call was made with specific arguments.

```ts
const mockFn = tester.createMockFunction()
mockFn('first')
mockFn('second')
mockFn('third')
tester.expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
