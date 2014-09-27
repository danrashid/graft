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

Graft.template = function (name) {
  var template;

  $.ajax({
    url: 'templates/' + name + '.html',
    async: false,
    success: function (res) {
      template = res;
    }
  });

  return template;
};

Graft.lookup = function (setId) {
  setId = +setId;

  var ret;

  Graft.data.sets.some(function (s) {
    if (s.id === setId) {
      ret = s;
      return true;
    }
    return false;
  });
  return ret;
};
