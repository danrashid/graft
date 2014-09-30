/* global Graft, $: false, Mustache: false */
'use strict';

Graft.bubbles = (function() {
  var template = Graft.template('bubbles');

  function bind(sel, maxWidth, minWidth) {
    maxWidth = maxWidth || 1;
    minWidth = minWidth || 0.01;

    Graft.data.sets
      .sort(function (a, b) {
        return b.total - a.total;
      })
      .forEach(function (s) {
        s.width = Graft.percent(Math.max(maxWidth * (s.sqrt / Graft.data.maxSqrt), minWidth));
      });

    $(Mustache.render(template, {
        sets: Graft.data.sets,
        abbreviate: function () {
          return function (text, render) {
            return Graft.abbreviate(render(text));
          };
        }
      }))
      .appendTo($(sel))
      .find('.bubble')
        .height(function () {
          return $(this).width();
        });
  }

  $(window).on('resize', function () {
    $('.graft.bubbles .bubble').height(function () {
      return $(this).width();
    });
  });

  $(document).on('click', '.graft.bubbles .bubble, .graft.bubbles .name', Graft.toggle);

  return {
    bind: bind
  };
})();
