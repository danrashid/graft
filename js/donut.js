/* global Graft, $: false, Mustache: false */
'use strict';

Graft.donut = (function() {
  var template = Graft.template('donut'),
    allLabelTemplate = $(template).find('.label').html(),
    oneLabelTemplate = Graft.template('donut.label');

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

  function positionLabel($label) {
    $label.css('margin-top', -$label.height() / 2);
  }

  function setLabel($donut, html) {
    var $label = $donut.find('.label');

    $label.html(html);
    positionLabel($label);
  }

  function bind(sel, data, spaceDeg) {
    spaceDeg = spaceDeg || 5;

    var total = data.reduce(function (a, b) {
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
      start = -spaceDeg,
      $donut,
      $sets;

    sets.sort(function (a, b) {
      return a.total - b.total;
    });

    $donut = $(Mustache.render(template, {
      total: total,
      sets: sets
    }));

    $sets = $donut.find('.set');

    if ($sets.length > 0) {
      $sets.each(function (i) {
        var $set = $(this),
          set = sets[i],
          setDeg = Math.floor(360 * set.ratio) - spaceDeg;

        $set.prev('.space').css(getTransformRules(start, spaceDeg));

        start += spaceDeg;

        $set
          .data(set)
          .css(i < sets.length - 1 ? getTransformRules(start, setDeg) : null);

        start += setDeg;
      });
    } else {
      $donut.remove('.space');
    }

    $donut
      .data({total: total})
      .appendTo($(sel))
      .height(function () {
        return $(this).width();
      });

    setLabel($donut, Mustache.render(allLabelTemplate, {
      total: total
    }));
  }

  $(window).on('resize', function () {
    $('.graft.donut').each(function () {
      var $donut = $(this);

      $donut.height($donut.width());
      positionLabel($donut.find('.label'));
    });
  });

  $(document)
    .on('click', '.graft.donut .set', Graft.toggle)
    .on('graft:select', function (e, id) {
      var $set = $('.graft.donut .set').filter(function () {
          return $(this).data('id') === id;
        }),
        $donut = $set.closest('.donut');

      setLabel($donut, Mustache.render(oneLabelTemplate, {
        percent: Graft.percent($set.data('ratio'), 2),
        color: $set.data('color'),
        name: $set.data('name'),
        total: $set.data('total')
      }));
    })
    .on('graft:deselect', function () {
      $('.graft.donut').each(function () {
        var $donut = $(this);

        setLabel($donut, Mustache.render(allLabelTemplate, {
          total: $donut.data('total')
        }));
      });
    });

  return {
    bind: bind
  };
})();
