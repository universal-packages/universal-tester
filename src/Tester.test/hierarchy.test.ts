import { Tester } from '../Tester'

export async function hierarchyTest() {
  const tester = new Tester()

  tester.test(
    'should be a isolated test',
    () => {
      tester.expect(10).toBe(10)
    },
    { timeout: 1000 }
  )

  tester.test(
    'should fail in a isolated test',
    () => {
      tester.expect(10).toBe(12)
    },
    { timeout: 2000 }
  )

  tester.describe(
    'Main describe',
    () => {
      tester.test('should be a describe nested test', () => {
        tester.expect(10).toBe(10)
      })

      tester.describe(
        'Nested describe level 1',
        () => {
          tester.test('should be a nested describe test', () => {
            tester.expect(20).toBe(20)
          })

          tester.describe('Nested describe level 2', () => {
            tester.test(
              'should be a deeply nested test',
              () => {
                tester.expect(30).toBe(30)
              },
              { timeout: 500 }
            )
          })
        },
        { timeout: 1200 }
      )

      tester.test('should fail in a describe nested test', () => {
        tester.expect(10).toBe(12)
      })
    },
    { timeout: 1000 }
  )

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should be a isolated test'],
      passed: true,
      options: {
        timeout: 1000
      }
    },
    {
      spec: ['should fail in a isolated test']  ,
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: '12',
          actual: '10'
        },
        expected: 12,
        actual: 10
      },
      passed: false,
      options: {
        timeout: 2000
      }
    },
    {
      spec: ['Main describe', 'should be a describe nested test'],
      passed: true,
      options: {
        timeout: 1000
      }
    },
    {
      spec: ['Main describe', 'Nested describe level 1', 'should be a nested describe test'],
      passed: true,
      options: {
        timeout: 1200
      }
    },
    {
      spec: ['Main describe', 'Nested describe level 1', 'Nested describe level 2', 'should be a deeply nested test'],
      passed: true,
      options: {
        timeout: 500
      }
    },
    {
      spec: ['Main describe', 'should fail in a describe nested test'],
      error: {
        message: 'Expected {{expected}} but got {{actual}}',
        messageLocals: {
          expected: '12',
          actual: '10'
        },
        expected: 12,
        actual: 10
      },
      passed: false,
      options: {
        timeout: 1000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('Hierarchy test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Hierarchy test failed')
  }
}
