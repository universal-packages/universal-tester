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

### Instance Methods

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

#### Instance Methods - Matchers

The `Tester` class has a set of matchers that can be used to test the value of a variable.

#### expect

```ts
expect(value: any)
```

The `expect` method is used to setup an assertion.

```ts
tester.expect(result).toEqual('expected result')
```

#### toEqual

```ts
toEqual(value: any)
```

The `toEqual` matcher is used to test if the value of a variable is equal to the expected value. It works for primitive values, arrays, and objects. For objects, it will check if the value is equal to the expected value by comparing the keys and values. For arrays, it will check if the value is equal to the expected value by comparing the length and the values of the array.

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

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
