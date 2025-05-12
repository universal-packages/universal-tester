import { Tester } from '../Tester'

export async function toMatchObjectTest() {
  const tester = new Tester()

  tester.test('should pass when object matches subset', () => {
    const obj = { a: 1, b: 2, c: 3, d: { e: 5, f: 6 } }
    tester.expect(obj).toMatchObject({ a: 1, d: { e: 5 } })
  })

  tester.test('should fail when property does not match', () => {
    const obj = { a: 1, b: 2, c: 3 }
    tester.expect(obj).toMatchObject({ a: 2 })
  })

  tester.test('should fail when property does not exist', () => {
    const obj = { a: 1, b: 2, c: 3 }
    tester.expect(obj).toMatchObject({ d: 4 })
  })

  tester.test('should fail when not an object', () => {
    tester.expect('not an object').toMatchObject({ a: 1 })
  })

  tester.test('should fail when object is null', () => {
    tester.expect(null).toMatchObject({ a: 1 })
  })

  tester.test('should pass for array with matching items', () => {
    const obj = { arr: [1, 2, 3] }
    tester.expect(obj).toMatchObject({ arr: [1, 2] })
  })

  tester.test('should fail for array with non-matching items', () => {
    const obj = { arr: [1, 2, 3] }
    tester.expect(obj).toMatchObject({ arr: [1, 4] })
  })

  tester.test('should pass for nested objects', () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } }
    tester.expect(obj).toMatchObject({ b: { d: { e: 3 } } })
  })

  tester.test('should fail for nested objects with non-matching property', () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } }
    tester.expect(obj).toMatchObject({ b: { d: { e: 4 } } })
  })

  tester.test('should pass for not.toMatchObject when object does not match', () => {
    const obj = { a: 1, b: 2, c: 3 }
    tester.expect(obj).not.toMatchObject({ a: 2 })
  })

  tester.test('should fail for not.toMatchObject when object matches', () => {
    const obj = { a: 1, b: 2, c: 3 }
    tester.expect(obj).not.toMatchObject({ a: 1, b: 2 })
  })

  const results = await tester.run()
  const expectedResults = [
    {
      spec: 'should pass when object matches subset',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail when property does not match',
      error: {
        message: 'Expected {{expected}} to match {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          a: 2
        },
        actual: {
          a: 1,
          b: 2,
          c: 3
        },
        difference: {
          type: 'object',
          keys: {
            a: {
              type: 'different',
              expected: 2,
              actual: 1,
              same: false
            }
          },
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail when property does not exist',
      error: {
        message: 'Expected {{expected}} to match {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          d: 4
        },
        actual: {
          a: 1,
          b: 2,
          c: 3
        },
        difference: {
          type: 'object',
          keys: {
            d: {
              type: 'removed',
              value: 4,
              same: false
            }
          },
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail when not an object',
      error: {
        message: 'Expected an object, but got {{actual}}',
        messageLocals: {
          actual: 'not an object'
        },
        expected: 'object',
        actual: 'not an object'
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail when object is null',
      error: {
        message: 'Expected an object, but got {{actual}}',
        messageLocals: {
          actual: 'null'
        },
        expected: 'object',
        actual: null
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for array with matching items',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for array with non-matching items',
      error: {
        message: 'Expected {{expected}} to match {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          arr: [1, 4]
        },
        actual: {
          arr: [1, 2, 3]
        },
        difference: {
          type: 'object',
          keys: {
            arr: {
              type: 'array',
              items: [
                {
                  type: 'same',
                  value: 1,
                  same: true
                },
                {
                  type: 'different',
                  expected: 4,
                  actual: 2,
                  same: false
                }
              ],
              same: false
            }
          },
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for nested objects',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for nested objects with non-matching property',
      error: {
        message: 'Expected {{expected}} to match {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          b: {
            d: {
              e: 4
            }
          }
        },
        actual: {
          a: 1,
          b: {
            c: 2,
            d: {
              e: 3
            }
          }
        },
        difference: {
          type: 'object',
          keys: {
            b: {
              type: 'object',
              keys: {
                d: {
                  type: 'object',
                  keys: {
                    e: {
                      type: 'different',
                      expected: 4,
                      actual: 3,
                      same: false
                    }
                  },
                  same: false
                }
              },
              same: false
            }
          },
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should pass for not.toMatchObject when object does not match',
      passed: true,
      options: {
        timeout: 5000
      }
    },
    {
      spec: 'should fail for not.toMatchObject when object matches',
      error: {
        message: 'Expected {{expected}} not to match {{actual}}',
        messageLocals: {
          expected: 'Object',
          actual: 'Object'
        },
        expected: {
          a: 1,
          b: 2
        },
        actual: {
          a: 1,
          b: 2,
          c: 3
        },
        difference: {
          type: 'object',
          keys: {
            a: {
              type: 'same',
              value: 1,
              same: true
            },
            b: {
              type: 'same',
              value: 2,
              same: true
            }
          },
          same: false
        }
      },
      passed: false,
      options: {
        timeout: 5000
      }
    }
  ]

  if (JSON.stringify(results, null, 2) !== JSON.stringify(expectedResults, null, 2)) {
    console.log(JSON.stringify(results, null, 2))
    throw new Error('toMatchObject test failed')
  } else {
    console.log('toMatchObject test passed')
  }
}
