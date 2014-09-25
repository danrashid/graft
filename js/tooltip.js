/* global Graft, $: false */
'use strict';

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
    var $target = $(e.target),
      clickedInInterval = $target.closest('.interval').length > 0,
      clickedInTooltip = $target.closest($el).length > 0;

    if (!clickedInInterval && !clickedInTooltip) {
      hide();
    }
  });

  return {
    show: show
  };
})();
