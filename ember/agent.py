from ..fireplace.player import Player
import random

class Agent(): # Abstract class for agents

    def __init__(self, player):
        # Load model
        pass

    def can_play(self):
        # Returns whether the player is able to make a move
        # Player is not choosing, all cards are not playable, and no characters can attack
        player = self.player
        if player.choice:
            return True
        for card in player.hand:
            if card.is_playable():
                return True
        for character in player.characters:
            if character.can_attack():
                return True
        return False
        
    def move(self):
        # Called when it is the agent's turn to make a move.
        # Repeatedly called until this returns True
        # Should use self.player to make a move in the game
        # Override this method
        ended_turn = True
        return ended_turn



    class Ember(Agent):

        def __init__(self, player):
            self.player = player
            # TODO: Load model

        def move(self):
            # TODO: Get output of model and parse it into its moves
            return True