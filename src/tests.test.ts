import { assertionTest } from './Assertion.test/index.test'
import { testerTest } from './Tester.test/index.test'
import { asymmetricAssertionsTest } from './asymmetric-assertions/index.test'
import { createMockFunctionTest } from './createMockFunction.test'
import { diffTest } from './diff.test'
import { spyOnTest } from './spyOn.test'

async function runTests() {
  await testerTest()
  await assertionTest()
  await diffTest()
  await createMockFunctionTest()
  await spyOnTest()
  await asymmetricAssertionsTest()
}

runTests().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
