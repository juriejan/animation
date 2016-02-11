/* global mocha, describe, it */

import {expect} from 'chai'
import animation from 'animation'

describe('Animation exposes', function () {
  it('show', function () {
    expect(animation.show).to.exists
  })
  it('hide', function () {
    expect(animation.hide).to.exists
  })
  it('slideOut', function () {
    expect(animation.slideOut).to.exists
  })
  it('slideIn', function () {
    expect(animation.slideIn).to.exists
  })
  it('flexGrow', function () {
    expect(animation.flexGrow).to.exists
  })
  it('flexShrink', function () {
    expect(animation.flexShrink).to.exists
  })
  it('grow', function () {
    expect(animation.grow).to.exists
  })
  it('shrink', function () {
    expect(animation.shrink).to.exists
  })
  it('toggleIcon', function () {
    expect(animation.toggleIcon).to.exists
  })
  it('showRegion', function () {
    expect(animation.showRegion).to.exists
  })
  it('hideRegion', function () {
    expect(animation.hideRegion).to.exists
  })
  it('scroll', function () {
    expect(animation.scroll).to.exists
  })
  it('thin', function () {
    expect(animation.thin).to.exists
  })
  it('flat', function () {
    expect(animation.flat).to.exists
  })
  it('original', function () {
    expect(animation.original).to.exists
  })
  it('setIn', function () {
    expect(animation.setIn).to.exists
  })
  it('visible', function () {
    expect(animation.visible).to.exists
  })
  it('basisShrink', function () {
    expect(animation.basisShrink).to.exists
  })
  it('basisGrow', function () {
    expect(animation.basisGrow).to.exists
  })
  it('basisZero', function () {
    expect(animation.basisZero).to.exists
  })
})

mocha.run()
