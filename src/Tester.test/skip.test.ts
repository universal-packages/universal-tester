import { Tester } from '../Tester'

export async function skipTest() {
  const tester = new Tester()

  const executedTests: string[] = []

  tester.test('should run normally', () => {
    executedTests.push('test1')
    tester.expect(true).toBe(true)
  })

  tester.test(
    'should be skipped',
    () => {
      executedTests.push('test2')
      tester.expect(true).toBe(true)
    },
    { skip: true, skipReason: 'Just because' }
  )

  tester.test('should run normally', () => {
    executedTests.push('test3')
    tester.expect(true).toBe(true)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should run normally'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['should be skipped'],
      passed: true,
      options: {
        timeout: 5000,
        skip: true,
        skipReason: 'Just because'
      },
      skipped: true,
      skipReason: 'Just because'
    },
    {
      spec: ['should run normally'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Skip test failed')
  } else {
    console.log('Skip test passed')
  }
}
