#!/usr/bin/env python
import sys

from fireplace import cards
from fireplace.exceptions import GameOver
from fireplace.utils import play_full_game
from fireplace.logging import log, playedGames, playedActions
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


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
	return jsonify(playedGames)

@app.route('/newGames', methods = ['GET'])
def getNewGames():
	returnVal = jsonify(playedGames)
	playedGames.clear()
	return returnVal

@app.route('/newActions', methods = ['GET'])
def getNewActions():
	returnVal = jsonify(playedActions)
	playedActions.clear()
	return returnVal

if __name__ == "__main__":
	port = 8000 #the custom port you want
	app.run(host='0.0.0.0', port=port)
