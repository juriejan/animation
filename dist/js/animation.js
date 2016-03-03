(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash'), require('jquery')) :
  typeof define === 'function' && define.amd ? define(['lodash', 'jquery'], factory) :
  (global.animation = factory(global._,global.$));
}(this, function (_,$) { 'use strict';

  _ = 'default' in _ ? _['default'] : _;
  $ = 'default' in $ ? $['default'] : $;

  const DIMENSIONS = {
    width: ['width', 'margin-left', 'margin-right', 'padding-left', 'padding-right'],
    height: ['height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'],
    row: ['margin-left', 'margin-right', 'padding-left', 'padding-right'],
    column: ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom']
  };

  function getOriginal(el, name) {
    var current = el.css(name);
    el.css(name, '');
    var original = el.css(name);
    el.css(name, current);
    return original;
  }

  function determineSize(el, side) {
    if (side === 'top' || side === 'bottom') {
      return parseInt(el.css('height'), 10);
    } else if (side === 'left' || side === 'right') {
      return parseInt(el.css('width'), 10);
    }
  }

  function show(el, done) {
    el.velocity({ opacity: 1 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      complete: done,
      visibility: 'visible',
      queue: false
    });
  }

  function hide(el, done) {
    el.velocity({ opacity: 0 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      complete: done,
      visibility: 'hidden',
      queue: false
    });
  }

  function slideOut(el, side, done, progress) {
    var margin = 'margin-' + side;
    var properties = { opacity: 1 };
    var size = determineSize(el, side);
    // Set the initial css properties
    el.css(margin, '-' + size + 'px');
    el.css('display', '');
    // Animate to the new properties
    properties[margin] = 0;
    el.velocity(properties, {
      easing: 'easeInOutCubic',
      progress: progress,
      complete: done
    });
  }

  function slideIn(el, side, done, progress) {
    var margin = 'margin-' + side;
    var properties = { opacity: 0 };
    var size = determineSize(el, side);
    // Animate to the new properties
    properties[margin] = '-' + size + 'px';
    el.velocity(properties, {
      easing: 'easeInOutCubic',
      progress: progress,
      complete: done
    });
  }

  function flexGrow(el, basis, show, done) {
    // Determine the final properties by removing, storing and reapplying
    var direction = el.parent().css('flex-direction');
    var properties = _.clone(DIMENSIONS[direction]);
    var values = el.css(properties);
    el.css(_.fromPairs(_.map(properties, o => [o, ''])));
    var final = el.css(properties);
    el.css(values);
    // Indicate final flex and opacity properties
    final['flex-grow'] = '1';
    if (show) {
      final.opacity = 1;
    }
    if (basis) {
      final['flex-basis'] = basis + 'px';
    }
    // Run the animation
    el.velocity(final, { easing: 'easeInOutCubic', complete: done });
  }

  function flexShrink(el, basis, hide, done) {
    var final = {};
    // Indicate final flex and opacity properties
    final['flex-grow'] = '.0001';
    if (hide) {
      final.opacity = 0;
    }
    // Determine the final basis or paddgin and margin
    if (basis) {
      final['flex-basis'] = basis + 'px';
    } else {
      var direction = el.parent().css('flex-direction');
      var properties = _.clone(DIMENSIONS[direction]);
      properties = _.fromPairs(_.map(properties, o => [o, 0]));
      final = _.assign(final, properties);
    }
    // Run the animation
    el.velocity(final, { easing: 'easeInOutCubic', complete: done });
  }

  function grow(el, dimension, size, done) {
    // Set the initial styles
    var initial = { opacity: 0 };
    initial[dimension] = 0;
    el.css(initial);
    // Determine the final properties by removing, storing and reapplying
    var properties = _.clone(DIMENSIONS[dimension]);
    var values = el.css(properties);
    el.css(_.fromPairs(_.map(properties, o => [o, ''])));
    var final = el.css(properties);
    el.css(values);
    // Indicate the final opacity and size properties
    final.opacity = 1;
    if (size) final[dimension] = size;
    // Run the animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function shrink(el, dimension, done) {
    // Determine the final properties
    var final = _.clone(DIMENSIONS[dimension]);
    final = _.fromPairs(_.map(final, o => [o, 0]));
    // Indicate the final opacity
    final.opacity = 0;
    // Run the animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function toggleIcon(onIcon, offIcon, status, animate) {
    if (animate) {
      if (status) {
        onIcon.velocity({ opacity: 0 }, { easing: 'easeInOutCubic' });
        offIcon.velocity({ opacity: 1 }, { easing: 'easeInOutCubic' });
      } else {
        onIcon.velocity({ opacity: 1 }, { easing: 'easeInOutCubic' });
        offIcon.velocity({ opacity: 0 }, { easing: 'easeInOutCubic' });
      }
    } else {
      if (status) {
        onIcon.css({ opacity: 0 });
        offIcon.css({ opacity: 1 });
      } else {
        onIcon.css({ opacity: 1 });
        offIcon.css({ opacity: 0 });
      }
    }
  }

  function showRegion(region, view, done) {
    region.show(view);
    this.show(region.$el, done);
  }

  function hideRegion(region, done) {
    if (region.hasView()) {
      this.hide(region.$el, function () {
        region.reset();
        if (done) {
          done();
        }
      });
    } else {
      if (done) {
        done();
      }
    }
  }

  function scroll(el, container, options) {
    options = options || {};
    options = Object.assign({
      axis: 'y',
      duration: 'fast',
      easing: 'easeInOutCubic',
      container: container
    }, options);
    el.velocity('scroll', options);
  }

  function thin(el) {
    el.css({
      opacity: 0,
      width: 0,
      'margin-left': 0,
      'margin-right': 0,
      'padding-left': 0,
      'padding-right': 0
    });
  }

  function flat(el) {
    el.css({
      opacity: 0,
      height: 0,
      'margin-top': 0,
      'margin-bottom': 0,
      'padding-top': 0,
      'padding-bottom': 0
    });
  }

  function original(el) {
    el.css({
      opacity: '',
      visibility: '',
      height: '',
      width: '',
      'margin-top': '',
      'margin-bottom': '',
      'margin-left': '',
      'margin-right': '',
      'padding-top': '',
      'padding-bottom': '',
      'padding-left': '',
      'padding-right': ''
    });
  }

  function setIn(el, side) {
    var margin = 'margin-' + side;
    var properties = { opacity: 0 };
    var size = determineSize(el, side);
    // Set the element css
    properties[margin] = '-' + size + 'px';
    el.css(properties);
  }

  function visible(el, state) {
    if (state) {
      el.css({ opacity: 1, visibility: 'visible' });
    } else {
      el.css({ opacity: 0, visibility: 'hidden' });
    }
  }

  function basisGrow(el, size, done) {
    // Set the initial styles
    var initial = { opacity: 0, 'flex-basis': 0 };
    el.css(initial);
    // Animate the grow
    var final = { opacity: 1 };
    // Determine the size to grow to
    if (size) {
      final['flex-basis'] = size;
    } else {
      final['flex-basis'] = getOriginal(el, 'flex-basis');
    }
    // Initiate animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function basisShrink(el, done) {
    var final = { opacity: 0, 'flex-basis': 0 };
    // Initiate animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function basisZero(el) {
    el.css({
      opacity: 0,
      'flex-basis': 0
    });
  }

  function a(el, properties, options) {
    options = options || {};
    options = Object.assign({
      easing: 'easeInOutCubic'
    }, options);
    return $.Velocity.animate(el, properties, options);
  }

  var index = {
    a,
    basisGrow,
    basisShrink,
    basisZero,
    flat,
    flexGrow,
    flexShrink,
    grow,
    hide,
    hideRegion,
    original,
    scroll,
    setIn,
    show,
    showRegion,
    shrink,
    slideIn,
    slideOut,
    thin,
    toggleIcon,
    visible
  };

  return index;

}));
//# sourceMappingURL=animation.js.map