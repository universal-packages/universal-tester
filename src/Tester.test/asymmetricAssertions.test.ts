import { Tester } from '../Tester'

export async function asymmetricAssertionsTest() {
  const tester = new Tester()

  // Test expectAnything
  tester.test('expectAnything matches any value in object properties', () => {
    tester.expect({ a: 1, b: 'hello', c: null }).toEqual({ a: 1, b: tester.expectAnything(), c: tester.expectAnything() })
    tester.expect([1, 'hello', null]).toEqual([1, tester.expectAnything(), tester.expectAnything()])
  })

  // Test expectGreaterThan
  tester.test('expectGreaterThan matches values greater than expected in object properties', () => {
    tester.expect({ a: 1, b: 20 }).toEqual({ a: 1, b: tester.expectGreaterThan(10) })
    tester.expect({ a: 1, b: 5 }).not.toEqual({ a: 1, b: tester.expectGreaterThan(10) })
  })

  // Test expectLessThan
  tester.test('expectLessThan matches values less than expected in object properties', () => {
    tester.expect({ a: 1, b: 5 }).toEqual({ a: 1, b: tester.expectLessThan(10) })
    tester.expect({ a: 1, b: 15 }).not.toEqual({ a: 1, b: tester.expectLessThan(10) })
  })

  // Test expectGreaterThanOrEqual
  tester.test('expectGreaterThanOrEqual matches values greater than or equal to expected in object properties', () => {
    tester.expect({ a: 1, b: 20 }).toEqual({ a: 1, b: tester.expectGreaterThanOrEqual(10) })
    tester.expect({ a: 1, b: 10 }).toEqual({ a: 1, b: tester.expectGreaterThanOrEqual(10) })
    tester.expect({ a: 1, b: 5 }).not.toEqual({ a: 1, b: tester.expectGreaterThanOrEqual(10) })
  })

  // Test expectLessThanOrEqual
  tester.test('expectLessThanOrEqual matches values less than or equal to expected in object properties', () => {
    tester.expect({ a: 1, b: 5 }).toEqual({ a: 1, b: tester.expectLessThanOrEqual(10) })
    tester.expect({ a: 1, b: 10 }).toEqual({ a: 1, b: tester.expectLessThanOrEqual(10) })
    tester.expect({ a: 1, b: 15 }).not.toEqual({ a: 1, b: tester.expectLessThanOrEqual(10) })
  })

  // Test expectMatch
  tester.test('expectMatch matches strings that match a regex pattern in object properties', () => {
    tester.expect({ a: 1, b: 'hello world' }).toEqual({ a: 1, b: tester.expectMatch(/hello/) })
    tester.expect({ a: 1, b: 'hi there' }).not.toEqual({ a: 1, b: tester.expectMatch(/hello/) })
  })

  // Test expectInstanceOf
  tester.test('expectInstanceOf matches instances of a class in object properties', () => {
    tester.expect({ a: 1, b: new Date() }).toEqual({ a: 1, b: tester.expectInstanceOf(Date) })
    tester.expect({ a: 1, b: {} }).not.toEqual({ a: 1, b: tester.expectInstanceOf(Date) })
  })

  // Test expectCloseTo
  tester.test('expectCloseTo matches numbers close to expected in object properties', () => {
    tester.expect({ a: 1, b: 10.001 }).toEqual({ a: 1, b: tester.expectCloseTo(10, 2) })
    tester.expect({ a: 1, b: 10.1 }).not.toEqual({ a: 1, b: tester.expectCloseTo(10, 2) })
  })

  // Test expectContain
  tester.test('expectContain matches strings containing a substring or arrays containing a value', () => {
    tester.expect({ a: 1, b: 'hello world' }).toEqual({ a: 1, b: tester.expectContain('world') })
    tester.expect({ a: 1, b: [1, 2, 3] }).toEqual({ a: 1, b: tester.expectContain(2) })
    tester.expect({ a: 1, b: 'hello' }).not.toEqual({ a: 1, b: tester.expectContain('world') })
    tester.expect({ a: 1, b: [1, 3] }).not.toEqual({ a: 1, b: tester.expectContain(2) })
  })

  // Test expectContainEqual
  tester.test('expectContainEqual matches arrays containing an object with the same structure', () => {
    tester.expect({ a: 1, b: [{ id: 1, name: 'test' }, { id: 2 }] }).toEqual({
      a: 1,
      b: tester.expectContainEqual({ id: 1, name: 'test' })
    })
    tester.expect({ a: 1, b: [{ id: 3 }, { id: 2 }] }).not.toEqual({
      a: 1,
      b: tester.expectContainEqual({ id: 1, name: 'test' })
    })
  })

  // Test expectHaveLength
  tester.test('expectHaveLength matches strings or arrays with the expected length', () => {
    tester.expect({ a: 1, b: [1, 2, 3] }).toEqual({ a: 1, b: tester.expectHaveLength(3) })
    tester.expect({ a: 1, b: 'hello' }).toEqual({ a: 1, b: tester.expectHaveLength(5) })
    tester.expect({ a: 1, b: [1, 2] }).not.toEqual({ a: 1, b: tester.expectHaveLength(3) })
    tester.expect({ a: 1, b: 'hi' }).not.toEqual({ a: 1, b: tester.expectHaveLength(5) })
  })

  // Test expectHaveProperty
  tester.test(
    'expectHaveProperty matches objects with the expected property',
    () => {
      tester.expect({ a: 1, b: { c: 2, d: 3 } }).toEqual({ a: 1, b: tester.expectHaveProperty('c') })
      tester.expect({ a: 1, b: { c: 2, d: 3 } }).toEqual({ a: 1, b: tester.expectHaveProperty('c', 2) })
      tester.expect({ a: 1, b: { d: 3 } }).not.toEqual({ a: 1, b: tester.expectHaveProperty('c') })
      tester.expect({ a: 1, b: { c: 3, d: 3 } }).not.toEqual({ a: 1, b: tester.expectHaveProperty('c', 2) })
    },
    { only: true }
  )

  // Test expectMatchObject
  tester.test('expectMatchObject matches objects that contain the expected properties', () => {
    tester.expect({ a: 1, b: { c: 2, d: 3, e: 4 } }).toEqual({ a: 1, b: tester.expectMatchObject({ c: 2, d: 3 }) })
    tester.expect({ a: 1, b: { c: 5, d: 3 } }).not.toEqual({ a: 1, b: tester.expectMatchObject({ c: 2, d: 3 }) })
  })

  // Test expectTruthy
  tester.test('expectTruthy matches truthy values in object properties', () => {
    tester.expect({ a: 1, b: true, c: 'hello', d: [1], e: {} }).toEqual({
      a: tester.expectTruthy(),
      b: tester.expectTruthy(),
      c: tester.expectTruthy(),
      d: tester.expectTruthy(),
      e: tester.expectTruthy()
    })
    tester.expect({ a: 0, b: '', c: null, d: undefined, e: false }).not.toEqual({
      a: tester.expectTruthy(),
      b: tester.expectTruthy(),
      c: tester.expectTruthy(),
      d: tester.expectTruthy(),
      e: tester.expectTruthy()
    })
  })

  // Test expectFalsy
  tester.test('expectFalsy matches falsy values in object properties', () => {
    tester.expect({ a: 0, b: '', c: null, d: undefined, e: false, f: NaN }).toEqual({
      a: tester.expectFalsy(),
      b: tester.expectFalsy(),
      c: tester.expectFalsy(),
      d: tester.expectFalsy(),
      e: tester.expectFalsy(),
      f: tester.expectFalsy()
    })
    tester.expect({ a: 1, b: 'hello', c: true, d: [], e: {} }).not.toEqual({
      a: tester.expectFalsy(),
      b: tester.expectFalsy(),
      c: tester.expectFalsy(),
      d: tester.expectFalsy(),
      e: tester.expectFalsy()
    })
  })

  // Test combining multiple asymmetric matchers
  tester.test('multiple asymmetric matchers can be combined in complex objects', () => {
    const complexObject = {
      id: 123,
      name: 'Test Object',
      created: new Date(),
      tags: ['important', 'test', 'example'],
      metadata: {
        version: '1.0.5',
        priority: 1,
        settings: {
          enabled: true,
          timeout: 500
        }
      },
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }

    tester.expect(complexObject).toEqual({
      id: tester.expectGreaterThan(100),
      name: tester.expectMatch(/Test/),
      created: tester.expectInstanceOf(Date),
      tags: tester.expectContain('important'),
      metadata: tester.expectMatchObject({
        version: tester.expectMatch(/^\d+\.\d+\.\d+$/),
        priority: tester.expectLessThanOrEqual(10),
        settings: tester.expectHaveProperty('enabled', true)
      }),
      items: tester.expectHaveLength(3)
    })
  })

  // Test not variants
  tester.test('not variants of asymmetric matchers work as expected', () => {
    tester.expect({ a: 1, b: 'hello' }).toEqual({
      a: tester.not.expectGreaterThan(10),
      b: tester.not.expectMatch(/world/)
    })

    tester.expect({ a: 20, b: 'hello world' }).not.toEqual({
      a: tester.not.expectGreaterThan(10),
      b: tester.not.expectMatch(/world/)
    })
  })

  const results = await tester.run()

  // Check if all tests passed
  if (!results.every((result) => result.passed)) {
    const failedTests = results.filter((result) => !result.passed)
    failedTests.forEach((test) => {
      console.error(`Test failed: ${test.spec}`, test.error)
    })
    throw new Error('Some tests failed to verify the Tester asymmetric assertion methods')
  } else {
    console.log('All asymmetric assertion tests passed')
  }

  return results
}
