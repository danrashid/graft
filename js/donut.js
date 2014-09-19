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

  function bind(sel, data, spaceDeg) {
    spaceDeg = spaceDeg || 5;

    function setLabel(html) {
      $label.html(html);
      positionLabel($label);
    }

    var $el = $(sel),
      $donut = $('<div class="graft donut">'),
      $label = $('<div class="label">'),
      total = data.reduce(function (a, b) {
        return a + b.total;
      }, 0),
      slices = data.map(function (d) {
        return {
          id: d.id,
          name: d.name,
          color: d.color,
          total: d.total,
          ratio: d.total / total
        };
      }),
      start = -spaceDeg;

    $('<div class="hole">')
      .appendTo($donut)
      .append($label);

    slices.sort(function (a, b) {
      return a.total - b.total;
    });

    slices.forEach(function (d, i) {
      var sliceDeg = Math.floor(360 * d.ratio) - spaceDeg;

      if (slices.length > 1) {
        $('<div class="space">')
          .css(getTransformRules(start, spaceDeg))
          .appendTo($donut);

        start += spaceDeg;
      }

      $('<div class="slice">')
        .data(d)
        .css('background', d.color)
        .css(i < slices.length - 1 ? getTransformRules(start, sliceDeg) : null)
        .appendTo($donut);

      start += sliceDeg;
    });

    $donut
      .height($el.width())
      .appendTo($el)
      .on('click', '.slice', function () {
        var $slice = $(this),
          percent;

        if ($slice.hasClass('inactive') || !$slice.siblings('.inactive').length) {
          percent = Math.round($slice.data('ratio') * 10000) / 100;

          $slice
            .removeClass('inactive')
            .siblings()
              .addClass('inactive');

          setLabel([
            '<div class="percent">' + percent + '%</div>',
            '<div class="name" style="color:' + $slice.data('color') + '">' + $slice.data('name') + '</div>',
            '<div class="total">' + $slice.data('total') + '</div>'
          ].join(''));
        } else {
          $slice.siblings().removeClass('inactive');
          setLabel(total);
        }
      });

    setLabel(total);
  }

  $(window).on('resize', function () {
    $('.graft.donut').height(function () {
      return $(this).width();
    });
    positionLabel($('.graft.donut .label'));
  });

  return {
    bind: bind
  };
})();
