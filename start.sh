#!/bin/sh

(cd tests/ || exit; python full_game.py) & (cd chimney/ || exit; npm start)
echo "Starting Python and JavaScript Servers"