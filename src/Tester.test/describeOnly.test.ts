import { Tester } from '../Tester'

export async function describeOnlyTest() {
  console.log('Testing "only" functionality in describe blocks:')

  const tester = new Tester()

  // This test should be skipped because there's a describe with only: true
  tester.test('should not run because only is set on a describe block', () => {
    tester.expect(true).toBe(true)
  })

  // This describe block has only: true, so only tests inside it should run
  tester.describe(
    'Describe with only set',
    () => {
      tester.test('should run because parent describe has only set', () => {
        tester.expect(true).toBe(true)
      })

      tester.describe('Nested describe inside only', () => {
        tester.test('should run because ancestor describe has only set', () => {
          tester.expect(true).toBe(true)
        })
      })
    },
    { only: true }
  )

  // This describe block should be skipped because there's another describe with only: true
  tester.describe('Regular describe that should be skipped', () => {
    tester.test('should not run because only is set on another describe', () => {
      tester.expect(true).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should not run because only is set on a describe block'],
      passed: true,
      options: {
        timeout: 5000
      },
      skipped: true,
      skipReason: '"only" tests are active'
    },
    {
      spec: ['Describe with only set', 'should run because parent describe has only set'],
      passed: true,
      options: {
        timeout: 5000,
        only: true
      }
    },
    {
      spec: ['Describe with only set', 'Nested describe inside only', 'should run because ancestor describe has only set'],
      passed: true,
      options: {
        timeout: 5000,
        only: true
      }
    },
    {
      spec: ['Regular describe that should be skipped', 'should not run because only is set on another describe'],
      passed: true,
      options: {
        timeout: 5000
      },
      skipped: true,
      skipReason: '"only" tests are active'
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('Describe only test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Describe only test failed')
  }
}
