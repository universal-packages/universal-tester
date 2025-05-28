import { TestError } from './TestError'

export type RunOrder = 'sequence' | 'random' | 'parallel'
export type TestingStatus = 'idle' | 'running' | 'success' | 'failure'

export interface TesterOptions {
  bail?: boolean
  runOrder?: RunOrder
  timeout?: number
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
  name: string
  fn: () => void | Promise<void>
  options: TestOptions
  parent: TestingNode
  hasRun: boolean
  status: TestingStatus
  result?: TestResult
}

export interface TestResult {
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
  nodes: TestingNode[]
}
