from fireplace.player import Player
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


class RandomAgent(Agent):

    def __init__(self, player):
        self.player = player
    
    def move(self):
        player = self.player
        heropower = player.hero.power
        if heropower.is_usable() and random.random() < 0.1:
            if heropower.requires_target():
                heropower.use(target=random.choice(heropower.targets))
            else:
                heropower.use()

        # iterate over our hand and play whatever is playable
        for card in player.hand:
            if card.is_playable() and random.random() < 0.5:
                target = None
                if card.must_choose_one:
                    card = random.choice(card.choose_cards)
                if card.requires_target():
                    target = random.choice(card.targets)
                print("Playing %r on %r" % (card, target))
                card.play(target=target)

                if player.choice:
                    choice = random.choice(player.choice.cards)
                    print("Choosing card %r" % (choice))
                    player.choice.choose(choice)

        # Randomly attack with whatever can attack
        for character in player.characters:
            if character.can_attack():
                character.attack(random.choice(character.targets))

class EndTurnAgent(Agent):

    def __init__(self, player):
        self.player = player

    def move(self): # Always ends turn
        return True


class Ember(Agent):

    def __init__(self, player):
        self.player = player
        # TODO: Load model

    def move(self):
        # TODO: Get output of model, parse it into its move, and do the move
        return True