#!/usr/bin/env python
import sys

from fireplace import cards
from fireplace.exceptions import GameOver
from ember.selfplay import play_full_game
from ember.agent import RandomAgent, Ember, EndTurnAgent
from fireplace.logging import log, playedGames, playedActions
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

sys.path.append("..")
playerTypes = {"RandomAgent": RandomAgent, "Ember": Ember, "EndTurnAgent": EndTurnAgent}

def test_full_game(agent1Type, agent2Type, player1Class, player2Class):
	try:
		play_full_game(playerTypes[agent1Type], playerTypes[agent2Type], player1Class, player2Class)
	except GameOver:
		log.info("Game completed normally.")

@app.route('/runGames/<numGames>/<agent1Type>/<agent2Type>/<player1Class>/<player2Class>', methods = ['GET'])
def main(numGames, agent1Type, agent2Type, player1Class, player2Class):
	numgames = int(numGames)
	cards.db.initialize()
	if numgames > 1:
		for i in range(int(numgames)):
			test_full_game(agent1Type, agent2Type, player1Class, player2Class)
	else:
		test_full_game(agent1Type, agent2Type, player1Class, player2Class)
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
