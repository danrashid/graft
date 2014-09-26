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

  function bind(sel, spaceDeg) {
    spaceDeg = spaceDeg || 5;

    Graft.data.sets.sort(function (a, b) {
      return a.total - b.total;
    });

    var $donut = $(Mustache.render(template, Graft.data)),
      start;

    if (Graft.data.sets.length > 1) {
      start = -spaceDeg;

      $donut.find('.set').each(function (i) {
        var $set = $(this),
          setDeg = Math.floor(360 * Graft.data.sets[i].ratio) - spaceDeg,
          isLast = i === Graft.data.sets.length - 1;

        $set.prev('.space').css(getTransformRules(start, spaceDeg));
        start += spaceDeg;
        $set.css(!isLast ? getTransformRules(start, setDeg) : null);
        start += setDeg;
      });
    } else {
      $donut.remove('.space');
    }

    $donut
      .appendTo($(sel))
      .height($donut.width());

    setLabel($donut, Mustache.render(allLabelTemplate, Graft.data));
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
      var $donut = $('.graft.donut .set').filter(function () {
          return $(this).data('id') === id;
        }).closest('.donut'),
        set = Graft.lookup(id);

      setLabel($donut, Mustache.render(oneLabelTemplate, set));
    })
    .on('graft:deselect', function () {
      $('.graft.donut').each(function () {
        var $donut = $(this);

        setLabel($donut, Mustache.render(allLabelTemplate, Graft.data));
      });
    });

  return {
    bind: bind
  };
})();
