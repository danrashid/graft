/* global Graft */
'use strict';

Graft.stub = function () {
  var MINUTE = 1000 * 60,
    end = Math.floor(+(new Date()) / MINUTE) * MINUTE,
    start = end - (MINUTE * (60 - 1)),
    data = [
      {color: 'CornflowerBlue', name: 'The First'},
      {color: 'Crimson', name: 'The Second'},
      {color: 'LimeGreen', name: 'The Third has a much longer name'},
      {color: 'Orange', name: 'The Fourth'},
      {color: 'Purple', name: 'The Fifth'}
    ];

  data.forEach(function (d, i) {
    d.id = i;
    d.values = [];
    d.total = 0;

    var t = start;

    for (; t <= end; t += MINUTE) {
      var v = Math.round(Math.random() * 100 * (i + 1));

      d.values.push([t, v]);
      d.total += v;
    }
  });

  return data;
};
