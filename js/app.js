/* global $: false */
'use strict';

var Graft = {};

Graft.percent = function(x, places) {
  if (x >= 1) {
    return 100;
  }

  places = places || 1;

  var str = (x+'').substr(2), // Remove leading '0.'
    front = str.substr(0, 2),
    back = str.substr(2, places);

  return +(front + '.' + back);
};

Graft.toggle = function() {
  var id = $(this).closest('.set').data('id'),
    $set = $('.graft .set').filter(function () {
      return $(this).data('id') === id;
    }),
    $sets = $set.map(function () {
      return $(this).closest('.graft').find('.set');
    });

  if ($set.hasClass('inactive') || !$set.siblings('.inactive').length) {
    $sets.addClass('inactive');
    $set.removeClass('inactive');
    $(document).trigger('graft:select', id);
  } else {
    $sets.removeClass('inactive');
    $(document).trigger('graft:deselect');
  }
};

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
