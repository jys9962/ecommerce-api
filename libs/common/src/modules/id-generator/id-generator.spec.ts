import { IdGenerator } from '@libs/common/modules/id-generator/id-generator'

describe('IdGenerator', () => {

  beforeAll(() => {
    IdGenerator.init(1, new Date('2020-01-01'))
  })

  it('생성 테스트', async function () {
    const id = IdGenerator.nextId()

    expect(id).toBeDefined()
    expect(typeof id).toBe('bigint')
  })

  it('순차 테스트', async function () {
    let before = 0n

    for (let i = 0; i < 10000; i++) {
      const current = IdGenerator.nextId()
      expect(parseInt(`${current}`)).toBeGreaterThan(parseInt(`${before}`))
    }
  })
})
