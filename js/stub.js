/* global Graft */
'use strict';

Graft.stub = function () {
  var MINUTE = 1000 * 60,
    end = Math.floor(+(new Date()) / MINUTE) * MINUTE,
    start = end - (MINUTE * (60 - 1)),
    data = [
      {color: 'blue', name: 'The First'},
      {color: 'red', name: 'The Second'},
      {color: 'green', name: 'The Third has a much longer name'},
      {color: 'orange', name: 'The Fourth'},
      {color: 'purple', name: 'The Fifth'}
    ];

  data.forEach(function (d, i) {
    d.values = [];

    var t = start;

    for (; t <= end; t += MINUTE) {
      var v = Math.round(Math.random() * 100 * (i + 1));

      d.values.push([t, v]);
    }
  });

  return data;
};
