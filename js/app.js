/* global $: false */
'use strict';

var Graft = {};

$(function() {
  Graft.$tooltip = $('<div class="graft tooltip">')
    .appendTo('body');
});

$(document)
  .on('graft:tooltip:show', function (E, e, html) {
    Graft.$tooltip
      .css('visibility', 'hidden')
      .html(html)
      .css({
        left: e.pageX - (Graft.$tooltip.width() / 2),
        top: e.pageY
      })
      .css('visibility', 'visible');
  })
  .on('graft:tooltip:hide', function () {
    Graft.$tooltip
      .css('visibility', 'hidden');
  })
  .on('click', function (e) {
    if ($(e.target).closest(Graft.$tooltip).length === 0) {
      $(document).trigger('graft:tooltip:hide');
    }
  });

$(window)
  .on('resize', function () {
    $(document).trigger('graft:tooltip:hide');
  });
