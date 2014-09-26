#!/usr/bin/env bash

jade -w build/index.jade -o . &
jade -w build/mustache -o templates &
sass --watch build/scss/_app.scss:app.css
wait
