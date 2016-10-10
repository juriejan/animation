(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash'), require('jquery')) :
  typeof define === 'function' && define.amd ? define(['lodash', 'jquery'], factory) :
  (global.animation = factory(global._,global.$));
}(this, function (_,$) { 'use strict';

  _ = 'default' in _ ? _['default'] : _;
  $ = 'default' in $ ? $['default'] : $;

  var DIMENSIONS = {
    width: ['width', 'margin-left', 'margin-right', 'padding-left', 'padding-right'],
    height: ['height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'],
    row: ['margin-left', 'margin-right', 'padding-left', 'padding-right'],
    column: ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom']
  };

  var DURATION = 150;

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

  function show(el) {
    return a(el, { opacity: 1 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      visibility: 'visible',
      queue: false
    });
  }

  function hide(el) {
    return a(el, { opacity: 0 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      visibility: 'hidden',
      queue: false
    });
  }

  function slideOut(el, side, complete, progress) {
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
      duration: DURATION,
      progress: progress,
      complete: complete
    });
  }

  function slideIn(el, side, complete, progress) {
    var margin = 'margin-' + side;
    var properties = { opacity: 0 };
    var size = determineSize(el, side);
    // Animate to the new properties
    properties[margin] = '-' + size + 'px';
    el.velocity(properties, {
      easing: 'easeInOutCubic',
      duration: DURATION,
      progress: progress,
      complete: complete
    });
  }

  function flexGrow(el, basis, show, complete) {
    // Determine the final properties by removing, storing and reapplying
    var direction = el.parent().css('flex-direction');
    var properties = _.clone(DIMENSIONS[direction]);
    var values = el.css(properties);
    el.css(_.fromPairs(_.map(properties, function (o) {
      return [o, ''];
    })));
    var final = el.css(properties);
    el.css(values);
    // Indicate final flex and opacity properties
    final['flex-grow'] = '1';
    if (show) final.opacity = 1;
    if (basis) final['flex-basis'] = basis + 'px';
    // Run the animation
    return a(el, final, { complete: complete }).then(function () {
      if (show) el.css('pointer-events', 'inherit');
    });
  }

  function flexShrink(el, basis, hide, complete) {
    var final = {};
    // Indicate final flex and opacity properties
    final['flex-grow'] = '.0001';
    if (hide) {
      el.css({ 'pointer-events': 'none' });
      Object.assign(final, { opacity: 0 });
    }
    // Determine the final basis or paddgin and margin
    if (basis) {
      final['flex-basis'] = basis + 'px';
    } else {
      var direction = el.parent().css('flex-direction');
      var properties = _.clone(DIMENSIONS[direction]);
      properties = _.fromPairs(_.map(properties, function (o) {
        return [o, 0];
      }));
      final = _.assign(final, properties);
    }
    // Run the animation
    return a(el, final, { complete: complete });
  }

  function grow(el, dimension, size, complete, progress) {
    // Set the initial styles
    var initial = { opacity: 0 };
    initial[dimension] = 0;
    el.css(initial);
    // Determine the final properties by removing, storing and reapplying
    var properties = _.clone(DIMENSIONS[dimension]);
    var values = el.css(properties);
    el.css(_.fromPairs(_.map(properties, function (o) {
      return [o, ''];
    })));
    var final = el.css(properties);
    el.css(values);
    // Indicate the final opacity and size properties
    final.opacity = 1;
    if (size) final[dimension] = size;
    // Run the animation
    return a(el, final, { display: '', queue: false, complete: complete, progress: progress }).then(function () {
      return el.css('pointer-events', 'inherit');
    });
  }

  function shrink(el, dimension, complete, progress) {
    // Set the initial styles
    el.css({ 'pointer-events': 'none' });
    // Determine the final properties
    var final = _.clone(DIMENSIONS[dimension]);
    final = _.fromPairs(_.map(final, function (o) {
      return [o, 0];
    }));
    // Indicate the final opacity
    final.opacity = 0;
    // Run the animation
    return a(el, final, { display: '', queue: false, complete: complete, progress: progress });
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

  function showRegion(region, view) {
    region.show(view);
    return this.show(region.$el);
  }

  function hideRegion(region) {
    if (region.hasView()) {
      return this.hide(region.$el).then(function () {
        region.reset();
      });
    } else {
      return Promise.resolve();
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
    var final = _.clone(DIMENSIONS['width']);
    final = _.fromPairs(_.map(final, function (o) {
      return [o, 0];
    }));
    final.opacity = 0;
    final['pointer-events'] = 'none';
    el.css(final);
  }

  function flat(el) {
    var final = _.clone(DIMENSIONS['height']);
    final = _.fromPairs(_.map(final, function (o) {
      return [o, 0];
    }));
    final.opacity = 0;
    final['pointer-events'] = 'none';
    el.css(final);
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
      'padding-right': '',
      'pointer-events': ''
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
      el.css({ opacity: 1, 'pointer-events': '' });
    } else {
      el.css({ opacity: 0, 'pointer-events': 'none' });
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
      duration: DURATION,
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
      duration: DURATION,
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
      easing: 'easeInOutCubic',
      duration: DURATION
    }, options);
    return $.Velocity.animate(el, properties, options);
  }

  var index = {
    a: a,
    basisGrow: basisGrow,
    basisShrink: basisShrink,
    basisZero: basisZero,
    flat: flat,
    flexGrow: flexGrow,
    flexShrink: flexShrink,
    grow: grow,
    hide: hide,
    hideRegion: hideRegion,
    original: original,
    scroll: scroll,
    setIn: setIn,
    show: show,
    showRegion: showRegion,
    shrink: shrink,
    slideIn: slideIn,
    slideOut: slideOut,
    thin: thin,
    toggleIcon: toggleIcon,
    visible: visible
  };

  return index;

}));
//# sourceMappingURL=animation.js.map