from fireplace import cards
from ember.selfplay import play_full_game
from ember.agent import (Ember, RandomAgent)
from fireplace.game import GameOver

try:
	cards.db.initialize()
	play_full_game(Ember, Ember)
except GameOver:
	print("Game completed normally.")