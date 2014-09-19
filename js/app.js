/* global $: false */
'use strict';

var Graft = {};

Graft.tooltip = (function() {
  var $el = $('<div class="graft tooltip">');

  $(function() {
    $el.appendTo('body');
  });

  function show(e, html) {
    hide();

    $el
      .html(html)
      .css({
        left: e.pageX - ($el.width() / 2),
        top: e.pageY,
        visibility: 'visible'
      });
  }

  function hide() {
    $el.css('visibility', 'hidden');
  }

  $(window).on('resize', hide);

  $(document).on('click', function (e) {
    if ($(e.target).closest($el).length === 0) {
      hide();
    }
  });

  return {
    show: show,
    hide: hide
  };
})();
