import { Tester } from '../Tester'

export async function onlyTest() {
  const tester = new Tester()

  tester.test('should not run because only is set on another test', () => {
    tester.expect(true).toBe(true)
  })

  tester.test(
    'should run because only is set',
    () => {
      tester.expect(true).toBe(true)
    },
    { only: true }
  )

  tester.test('should not run because only is set on another test', () => {
    tester.expect(true).toBe(true)
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should not run because only is set on another test'],
      passed: true,
      skipped: true,
      skipReason: '"only" tests are active'
    },
    {
      spec: ['should run because only is set'],
      passed: true
    },
    {
      spec: ['should not run because only is set on another test'],
      passed: true,
      skipped: true,
      skipReason: '"only" tests are active'
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('Only test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Only test failed')
  }
}
