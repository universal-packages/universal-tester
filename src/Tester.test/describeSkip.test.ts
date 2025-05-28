import { Tester } from '../Tester'

export async function describeSkipTest() {
  const tester = new Tester()

  // This test should run normally
  tester.test('should run normally outside describe blocks', () => {
    tester.expect(true).toBe(true)
  })

  // This describe block has skip: true, so all tests inside it should be skipped
  tester.describe(
    'Describe with skip set',
    () => {
      tester.test('should be skipped because parent describe has skip set', () => {
        tester.expect(true).toBe(true)
      })

      tester.describe('Nested describe inside skipped describe', () => {
        tester.test('should be skipped because ancestor describe has skip set', () => {
          tester.expect(true).toBe(true)
        })
      })
    },
    { skip: true, skipReason: 'Testing skip functionality' }
  )

  // This describe block should run normally
  tester.describe('Regular describe that should run', () => {
    tester.test('should run normally in a regular describe', () => {
      tester.expect(true).toBe(true)
    })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: ['should run normally outside describe blocks'],
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: ['Describe with skip set', 'should be skipped because parent describe has skip set'],
      passed: true,
      options: {
        timeout: 5000,
        skip: true,
        skipReason: 'Testing skip functionality'
      },
      skipped: true,
      skipReason: 'Testing skip functionality'
    },
    {
      spec: ['Describe with skip set', 'Nested describe inside skipped describe', 'should be skipped because ancestor describe has skip set'],
      passed: true,
      options: {
        timeout: 5000,
        skip: true,
        skipReason: 'Testing skip functionality'
      },
      skipped: true,
      skipReason: 'Testing skip functionality'
    },
    {
      spec: ['Regular describe that should run', 'should run normally in a regular describe'],
      passed: true,
      options: {
        timeout: 5000
      }
    }
  ]

  try {
    tester.expect(results).toMatchObject(expectedResults)
    console.log('Describe skip test passed')
  } catch {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('Describe skip test failed')
  }
} 
