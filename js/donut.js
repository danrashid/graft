/* global Graft, $: false */
'use strict';

Graft.donut = (function() {

  function getSkewY(deg) {
    return Math.min(deg - 90, 89);
  }

  function getTransformRules(start, deg) {
    var skewY = getSkewY(deg),
      transform = 'rotate(' + start + 'deg) skewY(' + skewY + 'deg)';

    return {
      '-ms-transform': transform,
      '-webkit-transform': transform,
      transform: transform
    };
  }

  function positionLabel($el) {
    $el.css('margin-top', -$el.height() / 2);
  }

  function setLabel($el, html) {
    $el.html(html);
    positionLabel($el);
  }

  function bind(sel, data, spaceDeg) {
    spaceDeg = spaceDeg || 5;

    var $el = $(sel),
      $donut = $('<div class="graft donut">'),
      $label = $('<div class="label">'),
      total = data.reduce(function (a, b) {
        return a + b.values.reduce(function (c, d) {
          return c + d[1];
        }, 0);
      }, 0),
      sets = data.map(function (d, i) {
        var localTotal = d.values.reduce(function (a, b) {
          return a + b[1];
        }, 0);

        return {
          id: i,
          name: d.name,
          color: d.color,
          total: localTotal,
          ratio: localTotal / total
        };
      }),
      start = -spaceDeg;

    $('<div class="hole">')
      .appendTo($donut)
      .append($label);

    sets.sort(function (a, b) {
      return a.total - b.total;
    });

    sets.forEach(function (d, i) {
      var setDeg = Math.floor(360 * d.ratio) - spaceDeg;

      if (sets.length > 1) {
        $('<div class="space">')
          .css(getTransformRules(start, spaceDeg))
          .appendTo($donut);

        start += spaceDeg;
      }

      $('<a class="set" href="#">')
        .data(d)
        .addClass(d.color)
        .css(i < sets.length - 1 ? getTransformRules(start, setDeg) : null)
        .appendTo($donut);

      start += setDeg;
    });

    $donut
      .data({total: total})
      .appendTo($el)
      .height(function () {
        return $(this).width();
      });

    setLabel($label, '<div class="all">' + total + '</div>');
  }

  $(window).on('resize', function () {
    $('.graft.donut').height(function () {
      return $(this).width();
    });
    positionLabel($('.graft.donut .label'));
  });

  $(document)
    .on('click', '.graft.donut .set', Graft.toggle)
    .on('graft:select', function (e, id) {
      var $set = $('.graft.donut .set').filter(function () {
          return $(this).data('id') === id;
        }),
        $label = $set.closest('.donut').find('.label'),
        percent = Graft.percent($set.data('ratio'), 2);

      setLabel($label, [
        '<div class="percent">' + percent + '%</div>',
        '<div class="name ' + $set.data('color') + '">' + $set.data('name') + '</div>',
        '<div class="total">' + $set.data('total') + '</div>'
      ].join(''));
    })
    .on('graft:deselect', function () {
      $('.graft.donut').each(function () {
        var $donut = $(this),
          $label = $donut.find('.label');

        setLabel($label, '<div class="all">' + $donut.data('total') + '</div>');
      });
    });

  return {
    bind: bind
  };
})();
