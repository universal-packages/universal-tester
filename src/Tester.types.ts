import { TestError } from './TestError'

export type RunOrder = 'sequence' | 'random' | 'parallel'

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

export interface TestDescription {
  name: string
  fn: () => void | Promise<void>
  options: TestOptions
  specPath: string[]
}

export interface LifecycleHook {
  fn: () => void | Promise<void>
  specPath: string[]
}

export interface TestResult {
  spec: string | string[]
  error?: TestError
  passed: boolean
  options: TestOptions
  skipped?: boolean
  skipReason?: string
}
