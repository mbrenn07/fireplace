#!/bin/sh

echo "Starting Python and JavaScript Servers"
(cd tests/ || exit; python full_game.py) & (cd chimney/ || exit; npm start)