import EventEmitter from 'events'

import { Assertion } from './Assertion'
import { TestError } from './TestError'
import { DescribeOptions, StateTest, StateTestingNode, StateTestingTree, Test, TestOptions, TestResult, TesterOptions, TestingNode, TestingTree } from './Tester.types'
import { AnythingAssertion } from './asymmetric-assertions/AnythingAssertion'
import { CloseToAssertion } from './asymmetric-assertions/CloseToAssertion'
import { ContainAssertion } from './asymmetric-assertions/ContainAssertion'
import { ContainEqualAssertion } from './asymmetric-assertions/ContainEqualAssertion'
import { FalsyAssertion } from './asymmetric-assertions/FalsyAssertion'
import { GreaterThanAssertion } from './asymmetric-assertions/GreaterThanAssertion'
import { GreaterThanOrEqualAssertion } from './asymmetric-assertions/GreaterThanOrEqualAssertion'
import { HaveLengthAssertion } from './asymmetric-assertions/HaveLengthAssertion'
import { HavePropertyAssertion } from './asymmetric-assertions/HavePropertyAssertion'
import { InstanceOfAssertion } from './asymmetric-assertions/InstanceOfAssertion'
import { LessThanAssertion } from './asymmetric-assertions/LessThanAssertion'
import { LessThanOrEqualAssertion } from './asymmetric-assertions/LessThanOrEqualAssertion'
import { MatchAssertion } from './asymmetric-assertions/MatchAssertion'
import { MatchObjectAssertion } from './asymmetric-assertions/MatchObjectAssertion'
import { TruthyAssertion } from './asymmetric-assertions/TruthyAssertion'
import { createMockFunction } from './createMockFunction'
import { spyOn } from './spyOn'

export class Tester extends EventEmitter {
  public readonly options: TesterOptions

  private readonly testingTree: TestingTree
  private readonly currentTestingNodeStack: TestingNode[] = []
  private readonly testResults: TestResult[] = []
  private readonly testsSequence: Test[] = []
  private testIdCounter = 0

  private beforeOrAfterHooksOrTestFailed = false

  public get state(): StateTestingTree {
    return this.sanitizeTestingTree(this.testingTree)
  }

  public get not() {
    return {
      expectAnything: () => new AnythingAssertion(true),
      expectCloseTo: (value: number, precision?: number) => new CloseToAssertion(value, precision, true),
      expectContain: (item: any) => new ContainAssertion(item, true),
      expectContainEqual: (item: any) => new ContainEqualAssertion(item, true),
      expectFalsy: () => new FalsyAssertion(true),
      expectGreaterThan: (value: number) => new GreaterThanAssertion(value, true),
      expectGreaterThanOrEqual: (value: number) => new GreaterThanOrEqualAssertion(value, true),
      expectHaveLength: (length: number) => new HaveLengthAssertion(length, true),
      expectHaveProperty: (path: string, ...args: any[]) => {
        if (args.length === 0) {
          return new HavePropertyAssertion(path, true)
        }
        return new HavePropertyAssertion(path, true, args[0])
      },
      expectInstanceOf: (constructor: Function) => new InstanceOfAssertion(constructor, true),
      expectLessThan: (value: number) => new LessThanAssertion(value, true),
      expectLessThanOrEqual: (value: number) => new LessThanOrEqualAssertion(value, true),
      expectMatch: (pattern: RegExp) => new MatchAssertion(pattern, true),
      expectMatchObject: (obj: Record<string, any>) => new MatchObjectAssertion(obj, true),
      expectTruthy: () => new TruthyAssertion(true)
    }
  }

  public constructor(options?: TesterOptions) {
    super()
    this.options = { bail: false, runOrder: 'sequence', timeout: 5000, identifier: 'tester', ...options }
    this.testingTree = {
      status: 'idle',
      identifier: this.options.identifier!,
      nodes: [
        {
          name: Symbol('root'),
          describeOptions: { timeout: this.options.timeout },
          tests: [],
          children: [],
          completed: false,
          status: 'idle',
          beforeHooks: [],
          beforeHooksErrors: [],
          beforeHooksHaveRun: false,
          beforeEachHooks: [],
          afterEachHooks: [],
          afterHooks: [],
          afterHooksErrors: []
        }
      ]
    }
    this.currentTestingNodeStack.push(this.testingTree.nodes[0])
  }

  public mockFn() {
    return createMockFunction()
  }

  public spyOn(object: any, propertyPath: string) {
    return spyOn(object, propertyPath)
  }

  public expectAnything() {
    return new AnythingAssertion()
  }

  public expectGreaterThan(value: number) {
    return new GreaterThanAssertion(value)
  }

  public expectLessThan(value: number) {
    return new LessThanAssertion(value)
  }

  public expectGreaterThanOrEqual(value: number) {
    return new GreaterThanOrEqualAssertion(value)
  }

  public expectLessThanOrEqual(value: number) {
    return new LessThanOrEqualAssertion(value)
  }

  public expectMatch(pattern: RegExp) {
    return new MatchAssertion(pattern)
  }

  public expectInstanceOf(constructor: Function) {
    return new InstanceOfAssertion(constructor)
  }

  public expectCloseTo(value: number, precision?: number) {
    return new CloseToAssertion(value, precision)
  }

  public expectContain(item: any) {
    return new ContainAssertion(item)
  }

  public expectContainEqual(item: any) {
    return new ContainEqualAssertion(item)
  }

  public expectHaveLength(length: number) {
    return new HaveLengthAssertion(length)
  }

  public expectHaveProperty(path: string, value?: any) {
    if (arguments.length === 1) {
      return new HavePropertyAssertion(path, false)
    }
    return new HavePropertyAssertion(path, false, value)
  }

  public expectMatchObject(obj: Record<string, any>) {
    return new MatchObjectAssertion(obj)
  }

  public expectTruthy() {
    return new TruthyAssertion()
  }

  public expectFalsy() {
    return new FalsyAssertion()
  }

  public describe(name: string | Function, fn: () => void, options?: DescribeOptions) {
    const descriptiveName = typeof name === 'string' ? name : name.name || 'Anonymous Function'

    const describeNode: TestingNode = {
      name: descriptiveName,
      describeOptions: options || {},
      tests: [],
      children: [],
      parent: this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1],
      completed: false,
      status: 'idle',
      beforeHooks: [],
      beforeHooksErrors: [],
      beforeHooksHaveRun: false,
      beforeEachHooks: [],
      afterEachHooks: [],
      afterHooks: [],
      afterHooksErrors: []
    }

    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].children.push(describeNode)
    this.currentTestingNodeStack.push(describeNode)

    // Execute the function to register nested tests and describes
    fn()

    this.currentTestingNodeStack.pop()
  }

  public test(name: string, fn: () => void | Promise<void>, options?: TestOptions) {
    // Merge options from describe blocks (from outer to inner)
    const mergedOptions: TestOptions = { timeout: this.options.timeout }
    const describeOptionsStack = this.currentTestingNodeStack.map((node) => node.describeOptions)

    // Apply describe options from outermost to innermost
    for (const describeOpts of describeOptionsStack) {
      if (describeOpts.timeout !== undefined) mergedOptions.timeout = describeOpts.timeout
      if (describeOpts.only !== undefined) mergedOptions.only = describeOpts.only
      if (describeOpts.skip !== undefined) mergedOptions.skip = describeOpts.skip
      if (describeOpts.skipReason !== undefined) mergedOptions.skipReason = describeOpts.skipReason
    }

    // Test options take precedence over all describe options
    if (options) Object.assign(mergedOptions, options)

    const test: Test = {
      id: this.generateTestId(),
      name,
      fn,
      options: mergedOptions,
      parent: this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1],
      hasRun: false,
      status: 'idle',
      afterEachHooksErrors: []
    }

    this.testsSequence.push(test)
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].tests.push(test)
  }

  public before(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].beforeHooks.push(fn)
  }

  public beforeEach(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].beforeEachHooks.push(fn)
  }

  public after(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].afterHooks.push(fn)
  }

  public afterEach(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].afterEachHooks.push(fn)
  }

  public expect(value: any) {
    return new Assertion(value)
  }

  public async run() {
    if (this.testingTree.status === 'running') {
      throw new Error('Tester is already running')
    } else if (this.testingTree.status === 'success' || this.testingTree.status === 'failure') {
      throw new Error('Tester has already completed')
    }

    this.testingTree.status = 'running'
    this.emitStateChange()

    // Check if any test has 'only' flag
    const hasOnlyTests = this.testsSequence.some((test) => test.options.only)

    // Make a copy of the test array
    const testsToRun = [...this.testsSequence]

    // Process tests based on their options and the tester's run order
    if (this.options.runOrder === 'random') {
      // Shuffle the array for random execution
      testsToRun.sort(() => Math.random() - 0.5)
    } else if (this.options.runOrder === 'parallel') {
      // For parallel execution, we'll pass the hasOnlyTests flag to runTest
      await Promise.all(testsToRun.map((test) => this.runTest(test, hasOnlyTests)))

      if (this.beforeOrAfterHooksOrTestFailed) {
        this.testingTree.status = 'failure'
      } else {
        this.testingTree.status = 'success'
      }

      this.emitStateChange()
      return this.testResults
    }

    // Run each test in sequence
    for (const test of testsToRun) {
      await this.runTest(test, hasOnlyTests)

      // If bail is enabled and a test has failed, stop execution
      if (this.options.bail && this.testResults.some((result) => !result.passed)) {
        break
      }
    }

    if (this.beforeOrAfterHooksOrTestFailed) {
      this.testingTree.status = 'failure'
    } else {
      this.testingTree.status = 'success'
    }

    this.emitStateChange()
    return this.testResults
  }

  private async runTest(test: Test, hasOnlyTests: boolean) {
    const nodePath: TestingNode[] = []
    let currentNode: TestingNode | undefined = test.parent

    test.status = 'running'
    test.startedAt = Date.now()
    this.updateNodeStatusesInPath(test)

    while (currentNode) {
      nodePath.push(currentNode)
      currentNode = currentNode.parent
    }

    const spec: string[] = [test.name]

    for (const node of nodePath) {
      if (node.name.toString() !== Symbol('root').toString()) spec.unshift(node.name.toString())
    }

    const hasBeforeHooksErrors = nodePath.some((node) => node.beforeHooksErrors.length > 0)

    if (hasBeforeHooksErrors) {
      test.endedAt = Date.now()
      const took = test.startedAt ? test.endedAt - test.startedAt : 0

      const testResult: TestResult = {
        id: test.id,
        spec,
        passed: false,
        took,
        error: new TestError({
          message: 'Can not run if before hooks fail',
          messageLocals: {},
          expected: 'Before hooks to not fail',
          actual: 'Before hooks failed'
        })
      }

      test.hasRun = true
      test.status = 'failure'
      test.result = testResult

      this.testResults.push(testResult)
      this.updateNodeStatusesInPath(test)

      return
    }

    const shouldSkip = test.options.skip || (hasOnlyTests && !test.options.only)
    const skipReason = test.options.skipReason || (hasOnlyTests && !test.options.only ? '"only" tests are active' : undefined)

    // If the test should be skipped, record the result without executing
    if (shouldSkip) {
      test.endedAt = Date.now()
      const took = test.startedAt ? test.endedAt - test.startedAt : 0

      const testResult: TestResult = {
        id: test.id,
        spec,
        passed: true,
        skipped: true,
        skipReason: skipReason,
        took
      }

      test.hasRun = true
      test.status = 'skipped'
      test.result = testResult

      this.testResults.push(testResult)
      this.updateNodeStatusesInPath(test)

      for (const node of nodePath) {
        const allTestsCompleted = node.tests.every((test) => test.hasRun)
        const allNodesCompleted = node.children.every((node) => node.completed)

        if (allTestsCompleted && allNodesCompleted) {
          node.completed = true
        }
      }

      for (const node of nodePath) {
        if (node.completed) {
          for (const hook of node.afterHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              this.beforeOrAfterHooksOrTestFailed = true
              node.afterHooksErrors.push(error as Error)
            }
          }
        }
      }

      return
    }

    // Set up timeout handling
    let timeoutId: NodeJS.Timeout | undefined

    try {
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new TestError({
              message: `Test timed out after {{timeout}}ms`,
              messageLocals: {
                timeout: String(test.options.timeout)
              },
              expected: 'Test to not timeout',
              actual: 'Test timed out'
            })
          )
        }, test.options.timeout)
      })

      // Run all before hooks for each node in the path
      for (const node of nodePath.slice().reverse()) {
        if (!node.beforeHooksHaveRun) {
          node.beforeHooksHaveRun = true

          for (const hook of node.beforeHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              node.beforeHooksErrors.push(error as Error)
            }
          }

          if (node.beforeHooksErrors.length > 0) {
            this.beforeOrAfterHooksOrTestFailed = true

            test.endedAt = Date.now()
            const took = test.startedAt ? test.endedAt - test.startedAt : 0

            const testResult: TestResult = {
              id: test.id,
              spec,
              passed: false,
              took,
              error: new TestError({
                message: 'Can not run if before hooks fail',
                messageLocals: {},
                expected: 'Before hooks to not fail',
                actual: 'Before hooks failed'
              })
            }

            test.hasRun = true
            test.status = 'failure'
            test.result = testResult

            this.testResults.push(testResult)
            this.updateNodeStatusesInPath(test)

            return
          }
        }
      }

      // Now we run all beforeEach hooks for each node in the path they all have to run
      for (const node of nodePath.slice().reverse()) {
        for (const hook of node.beforeEachHooks) {
          try {
            await hook()
          } catch (error: unknown) {
            throw new TestError({
              message: error instanceof Error ? error.message : 'Unknown error',
              messageLocals: {},
              expected: 'BeforeEach hook to not fail',
              actual: 'BeforeEach hook failed'
            })
          }
        }
      }

      try {
        await Promise.race([Promise.resolve().then(() => test.fn()), timeoutPromise])
      } catch (error: unknown) {
        throw error
      } finally {
        test.hasRun = true

        for (const node of nodePath) {
          const allTestsCompleted = node.tests.every((test) => test.hasRun)
          const allNodesCompleted = node.children.every((node) => node.completed)

          if (allTestsCompleted && allNodesCompleted) {
            node.completed = true
          }
        }
      }

      // If we get here, the test passed
      test.endedAt = Date.now()
      const took = test.startedAt ? test.endedAt - test.startedAt : 0

      const testResult: TestResult = {
        id: test.id,
        spec,
        passed: true,
        took
      }

      test.status = 'success'
      test.result = testResult

      this.testResults.push(testResult)
      this.updateNodeStatusesInPath(test)
    } catch (error: unknown) {
      this.beforeOrAfterHooksOrTestFailed = true

      test.endedAt = Date.now()
      const took = test.startedAt ? test.endedAt - test.startedAt : 0

      const testResult: TestResult = {
        id: test.id,
        spec,
        passed: false,
        took,
        error: error as TestError
      }

      test.status = 'failure'
      test.result = testResult

      this.testResults.push(testResult)
      this.updateNodeStatusesInPath(test)
    } finally {
      // Clear the timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId)

      // Now we run all afterEach hooks for each node in the path they all have to run
      for (const node of nodePath.slice().reverse()) {
        for (const hook of node.afterEachHooks) {
          try {
            await hook()
          } catch (error: unknown) {
            this.beforeOrAfterHooksOrTestFailed = true
            test.afterEachHooksErrors.push(error as Error)
          }
        }
      }

      for (const node of nodePath) {
        if (node.completed) {
          for (const hook of node.afterHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              this.beforeOrAfterHooksOrTestFailed = true
              node.afterHooksErrors.push(error as Error)
            }
          }
        }
      }
    }
  }

  private generateTestId(): string {
    return `${this.options.identifier}-${++this.testIdCounter}`
  }

  private sanitizeTestingTree(tree: TestingTree): StateTestingTree {
    return {
      status: tree.status,
      identifier: tree.identifier,
      nodes: tree.nodes.map((node) => this.sanitizeTestingNode(node))
    }
  }

  private sanitizeTestingNode(node: TestingNode): StateTestingNode {
    return {
      name: node.name,
      describeOptions: node.describeOptions,
      tests: node.tests.map((test) => this.sanitizeTest(test)),
      children: node.children.map((child) => this.sanitizeTestingNode(child)),
      completed: node.completed,
      status: node.status,
      beforeHooksErrors: node.beforeHooksErrors,
      beforeHooksHaveRun: node.beforeHooksHaveRun,
      afterHooksErrors: node.afterHooksErrors
    }
  }

  private sanitizeTest(test: Test): StateTest {
    return {
      id: test.id,
      name: test.name,
      options: test.options,
      status: test.status,
      result: test.result,
      startedAt: test.startedAt,
      endedAt: test.endedAt,
      afterEachHooksErrors: test.afterEachHooksErrors || []
    }
  }

  private updateNodeStatus(node: TestingNode): void {
    // Get all tests in this node and its children recursively
    const allTests = this.getAllTestsInNode(node)

    if (allTests.length === 0) {
      // No tests in this node or its children
      node.status = 'idle'
      return
    }

    // Check if any test is running
    const hasRunningTests = allTests.some((test) => test.status === 'running')
    if (hasRunningTests) {
      node.status = 'running'
      return
    }

    // Check if all tests have finished (hasRun = true)
    const allTestsFinished = allTests.every((test) => test.hasRun)
    if (!allTestsFinished) {
      node.status = 'idle'
      return
    }

    // All tests have finished, determine final status
    const allTestsSkipped = allTests.every((test) => test.status === 'skipped')
    if (allTestsSkipped) {
      node.status = 'skipped'
      return
    }

    // Check if all non-skipped tests passed
    const nonSkippedTests = allTests.filter((test) => test.status !== 'skipped')
    const allNonSkippedTestsPassed = nonSkippedTests.every((test) => test.status === 'success')

    if (allNonSkippedTestsPassed) {
      node.status = 'success'
    } else {
      node.status = 'failure'
    }
  }

  private getAllTestsInNode(node: TestingNode): Test[] {
    const tests = [...node.tests]

    // Recursively get tests from children
    for (const child of node.children) {
      tests.push(...this.getAllTestsInNode(child))
    }

    return tests
  }

  private updateNodeStatusesInPath(test: Test): void {
    // Update status for all nodes in the path from test to root
    let currentNode: TestingNode | undefined = test.parent

    while (currentNode) {
      this.updateNodeStatus(currentNode)
      currentNode = currentNode.parent
    }

    // Emit change event with current state
    this.emitStateChange()
  }

  private emitStateChange(): void {
    this.emit('change', this.state)
  }
}
