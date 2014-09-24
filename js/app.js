/* global $: false */
'use strict';

var Graft = {};

Graft.percent = function (dec, places) {
  places = places || 1;

  var floorer = 100 * Math.pow(10, places),
    floored = Math.floor(dec * floorer) / floorer;

  return +((floored * 100).toFixed(places));
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

  return false;
};

Graft.timeseries = function (data) {
  var times = data[0].values.map(function (v) {
      return v[0];
    }),
    duration = times[times.length - 1] - times[0],
    interval = times[1] - times[0],
    intervalWidth = Graft.percent(interval / duration),
    rightEdge = 100 - (intervalWidth * times.length),
    ret = {
      sets: data.map(function (d, i) {
        return {
          id: i,
          name: d.name,
          color: d.color,
          values: d.values,
          total: d.values.reduce(function (a, b) {
            return a + b[1];
          }, 0),
          max: d.values.reduce(function (a, b) {
            return Math.max(a, b[1]);
          }, 0)
        };
      }),
      interval: interval,
      intervalWidth: intervalWidth,
      rightEdge: rightEdge
    };

  ret.max = times.map(function (t, i) {
    return data.reduce(function (a, b) {
      return a + b.values[i][1];
    }, 0);
  }).reduce(function (a, b) {
    return Math.max(a, b);
  }, 0);

  ret.sets.sort(function (a, b) {
    return b.total - a.total;
  });

  return ret;
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
