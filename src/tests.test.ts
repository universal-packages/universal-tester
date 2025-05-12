import { assertionTest } from './Assertion.test/index.test'
import { testerTest } from './Tester.test/index.test'
import { diffTest } from './diff.test'

async function runTests() {
  await testerTest()
  await assertionTest()
  await diffTest()
}

runTests().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
