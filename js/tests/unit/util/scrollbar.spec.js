import * as Scrollbar from '../../../src/util/scrollbar'
import { clearFixture, getFixture } from '../../helpers/fixture'

describe('ScrollBar', () => {
  let fixtureEl
  // const windowCalculations = () => {
  //   return {
  //     htmlClient: document.documentElement.clientWidth,
  //     docClient: document.body.clientWidth,
  //     htmlBound: document.documentElement.getBoundingClientRect().width,
  //     bodyBound: document.body.getBoundingClientRect().width,
  //     window: window.innerWidth,
  //     width: Math.abs(window.innerWidth - document.documentElement.clientWidth)
  //   }
  // }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    document.documentElement.removeAttribute('style')
  })

  beforeEach(() => {
    document.documentElement.removeAttribute('style')
  })

  describe('isBodyOverflowing', () => {
    it('should return true if body is overflowing', () => {
      document.documentElement.style.overflowY = 'scroll'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')
      const result = Scrollbar.isBodyOverflowing()

      expect(result).toEqual(true)
    })

    it('should return false if body is overflowing', () => {
      document.documentElement.style.overflowY = 'hidden'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')

      const result = Scrollbar.isBodyOverflowing()

      expect(result).toEqual(false)
    })
  })

  describe('getWidth', () => {
    it('should return an integer greater than zero, if body is overflowing', () => {
      document.documentElement.style.overflowY = 'scroll'
      document.body.style.overflowY = 'scroll'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')
      const result = Scrollbar.getWidth()

      expect(result).toBeGreaterThan(1)
    })

    it('should return 0 if body is not overflowing', () => {
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')

      const result = Scrollbar.getWidth()

      expect(result).toEqual(0)
    })
  })

  describe('hide - reset', () => {
    it('should adjust the inline padding of fixed elements', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%">' +
        '<div class="fixed-top" style="padding-right: 0px"></div>',
        '</div>'
      ].join('')
      document.documentElement.style.overflowY = 'scroll'

      const fixedEl = fixtureEl.querySelector('.fixed-top')
      const originalPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      const expectedPadding = originalPadding + Scrollbar.getWidth()

      Scrollbar.hide()

      let currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual('0px', 'original fixed element padding should be stored in data-bs-padding-right')
      expect(currentPadding).toEqual(expectedPadding, 'fixed element padding should be adjusted while opening')

      Scrollbar.reset()
      currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual(null, 'data-bs-padding-right should be cleared after closing')
      expect(currentPadding).toEqual(originalPadding, 'fixed element padding should be reset after closing')
      done()
    })

    it('should adjust the inline margin of sticky elements', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div class="sticky-top" style="margin-right: 0px;"></div>',
        '</div>'
      ].join('')
      document.documentElement.style.overflowY = 'scroll'

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const expectedMargin = originalMargin - Scrollbar.getWidth()

      Scrollbar.hide()

      let currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      expect(stickyTopEl.getAttribute('data-bs-margin-right')).toEqual('0px', 'original sticky element margin should be stored in data-bs-margin-right')
      expect(currentMargin).toEqual(expectedMargin, 'sticky element margin should be adjusted while opening')

      Scrollbar.reset()
      currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)

      expect(stickyTopEl.getAttribute('data-bs-margin-right')).toEqual(null, 'data-bs-margin-right should be cleared after closing')
      expect(currentMargin).toEqual(originalMargin, 'sticky element margin should be reset after closing')
      done()
    })

    it('should not adjust the inline margin and padding of sticky and fixed elements when element do not have full width', () => {
      fixtureEl.innerHTML = [
        '<div class="sticky-top" style="margin-right: 0px; padding-right: 0px; width: calc(100vw - 50%)"></div>'
      ].join('')

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const originalPadding = Number.parseInt(window.getComputedStyle(stickyTopEl).paddingRight, 10)

      Scrollbar.hide()

      const currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const currentPadding = Number.parseInt(window.getComputedStyle(stickyTopEl).paddingRight, 10)

      expect(currentMargin).toEqual(originalMargin, 'sticky element\'s margin should not be adjusted while opening')
      expect(currentPadding).toEqual(originalPadding, 'sticky element\'s padding should not be adjusted while opening')

      Scrollbar.reset()
    })
  })
})
