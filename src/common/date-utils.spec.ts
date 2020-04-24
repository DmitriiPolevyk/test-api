import { convertMonthToDate } from './date-utils'

describe('date-utils', () => {
  it('should return converted date', () => {
    const result = convertMonthToDate(18)

    expect(result).toBeInstanceOf(Date)
  })
})
