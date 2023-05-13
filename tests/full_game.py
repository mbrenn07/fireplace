#!/usr/bin/env python
import sys

from fireplace import cards
from fireplace.exceptions import GameOver
from fireplace.utils import play_full_game
from fireplace.logging import log
from flask import Flask, jsonify

app = Flask(__name__)


sys.path.append("..")


def test_full_game():
	try:
		play_full_game()
	except GameOver:
		log.info("Game completed normally.")

@app.route('/runGames/<numGames>', methods = ['GET'])
def main(numGames):
	numgames = int(numGames)
	cards.db.initialize()
	if numgames > 1:
		for i in range(int(numgames)):
			test_full_game()
	else:
		test_full_game()
	return jsonify({"code":200})

if __name__ == "__main__":
	port = 8000 #the custom port you want
	app.run(host='0.0.0.0', port=port)
