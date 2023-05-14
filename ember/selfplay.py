from fireplace.game import Game
from fireplace.player import Player
from fireplace.utils import (CardClass, random_draft)
from .agent import (RandomAgent, Ember)
import random

PLAYER_CLASSES = {"Druid": CardClass.DRUID, "Hunter": CardClass.HUNTER, "Mage": CardClass.MAGE,
		 "Paladin": CardClass.PALADIN, "Priest": CardClass.PRIEST, "Rogue": CardClass.ROGUE,
		 "Shaman": CardClass.SHAMAN, "Warlock": CardClass.WARLOCK, "Warrior": CardClass.WARRIOR}

def setup_game(agent1_type, agent2_type, player1Class, player2Class):
	if (player1Class == "Random"):
		player1Class = random.choice(list(PLAYER_CLASSES.keys()))
	if (player2Class == "Random"):
		player2Class = random.choice(list(PLAYER_CLASSES.keys()))

	class1 = PLAYER_CLASSES[player1Class]
	deck1 = random_draft(class1)
	player1 = Player("Player1", deck1, class1.default_hero)

	class2 = PLAYER_CLASSES[player2Class]
	deck2 = random_draft(class2)
	player2 = Player("Player2", deck2, class2.default_hero)

	agent1 = agent1_type(player1)
	agent2 = agent2_type(player2)

	game = Game(players=(player1, player2))
	game.start()

	return game, (agent1, agent2)


def play_turn(game, agents):
	player = game.current_player
	agent1, agent2 = agents

	if agent1.player == player:
		agent = agent1
	else:
		agent = agent2

	# Agent will move until it either cannot play or has indicated end of turn
	ended_turn = agent.move()
	while agent.can_play() and not ended_turn:
		ended_turn = agent.move()

	game.end_turn()
	return game # not necessary


def play_full_game(agent1_type, agent2_type, player1Class, player2Class):
	game, (agent1, agent2) = setup_game(agent1_type, agent2_type, player1Class, player2Class)

	# random mulligan
	for player in game.players:

		print("Can mulligan %r" % (player.choice.cards))
		mull_count = random.randint(0, len(player.choice.cards))
		cards_to_mulligan = random.sample(player.choice.cards, mull_count)
		player.choice.choose(*cards_to_mulligan)

	while True:
		play_turn(game, (agent1, agent2))
	return game # not necessary
