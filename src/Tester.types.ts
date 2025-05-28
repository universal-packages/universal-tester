import { TestError } from './TestError'

export type RunOrder = 'sequence' | 'random' | 'parallel'
export type TestingStatus = 'idle' | 'running' | 'success' | 'failure'
export type TestStatus = TestingStatus | 'skipped'

export interface TesterOptions {
  bail?: boolean
  runOrder?: RunOrder
  timeout?: number
  identifier?: string
}

export interface DescribeOptions {
  only?: boolean
  skip?: boolean
  skipReason?: string
  timeout?: number
}

export interface TestOptions {
  only?: boolean
  skip?: boolean
  skipReason?: string
  timeout?: number
}

export interface Test {
  id: string
  name: string
  fn: () => void | Promise<void>
  options: TestOptions
  parent: TestingNode
  hasRun: boolean
  status: TestStatus
  result?: TestResult
}

export interface TestResult {
  id: string
  spec: string[]
  error?: TestError | Error
  passed: boolean
  skipped?: boolean
  skipReason?: string
}

export interface TestingNode {
  name: string | symbol
  describeOptions: DescribeOptions
  tests: Test[]
  children: TestingNode[]
  parent?: TestingNode
  completed: boolean
  status: TestStatus
  beforeHooks: (() => void | Promise<void>)[]
  beforeHooksErrors: Error[]
  beforeHooksHaveRun: boolean
  beforeEachHooks: (() => void | Promise<void>)[]
  afterEachHooks: (() => void | Promise<void>)[]
  afterEachHooksErrors: Error[]
  afterHooks: (() => void | Promise<void>)[]
  afterHooksErrors: Error[]
}

export interface TestingTree {
  status: TestingStatus
  identifier: string
  nodes: TestingNode[]
}

// Sanitized versions without function references
export interface StateTest {
  id: string
  name: string
  options: TestOptions
  status: TestStatus
  result?: TestResult
}

export interface StateTestingNode {
  name: string | symbol
  describeOptions: DescribeOptions
  tests: StateTest[]
  children: StateTestingNode[]
  completed: boolean
  status: TestStatus
  beforeHooksErrors: Error[]
  beforeHooksHaveRun: boolean
  afterEachHooksErrors: Error[]
  afterHooksErrors: Error[]
}

export interface StateTestingTree {
  status: TestingStatus
  identifier: string
  nodes: StateTestingNode[]
}
