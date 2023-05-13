import os
from pkg_resources import resource_filename
from hearthstone import cardxml
from hearthstone.enums import CardType
from ..logging import log
from ..utils import get_script_definition


class CardDB(dict):
	def __init__(self):
		self.initialized = False

	@staticmethod
	def merge(id, card, cardscript=None):
		"""
		Find the xmlcard and the card definition of \a id
		Then return a merged class of the two
		"""
		if card is None:
			card = cardxml.CardXML(id)

		if cardscript is None:
			cardscript = get_script_definition(id)

		if (cardscript is None 
      		and "HERO" not in id
			and id != "CS2_121"
			and id != "EX1_021"
			and id != "EX1_023"
			and id != "EX1_110"
			and id != "EX1_390"
			and id != "CS2_179"
			and id != "CS2_tk1"
			and id != "EX1_598"
			and id != "skele21"
			and id != "EX1_025t"
			and id != "CS2_152"
			and id != "CS2_mirror"
			and id != "EX1_598"
			and id != "EX1_506a"
			and id != "EX1_614t"
			and id != "EX1_584e"
			and id != "EX1_398t"
			and id != "PRO_001at"
			and id != "EX1_116t"
			and id != "NEW1_040t"
			and id != "EX1_110t"
			and id != "Mekka4t"
			and id != "ds1_whelptoken"
			and id != "CS2_boar"
			and id != "EX1_tk29"
			and id != "EX1_tk28"
			and id != "NEW1_026t"
			and id != "EX1_409t"
			and id != "tt_010a"
			and id != "CS2_022e"
			and id != "EX1_246e"
			and id != "EX1_345t"
			and id != "GAME_006"
			and id != "LOEA04_27"
			and id != "Mekka4e"
			and id != "NEW1_025e"
			and id != "TU4c_005"
			and id != "TU4c_007"
			and id != "CS2_236e"
			and id != "EX1_304e"
			and id != "LOE_030e"
			and id != "NEW1_018e"):
			return None

		if cardscript:
			card.scripts = type(id, (cardscript, ), {})
		else:
			card.scripts = type(id, (), {})

		scriptnames = (
			"activate", "combo", "deathrattle", "draw", "inspire", "play",
			"enrage", "update", "powered_up", "outcast", "awaken"
		)

		for script in scriptnames:
			actions = getattr(card.scripts, script, None)
			if actions is None:
				# Set the action by default to avoid runtime hasattr() calls
				setattr(card.scripts, script, [])
			elif not callable(actions):
				if not hasattr(actions, "__iter__"):
					# Ensure the actions are always iterable
					setattr(card.scripts, script, (actions, ))

		for script in ("events", "secret"):
			events = getattr(card.scripts, script, None)
			if events is None:
				setattr(card.scripts, script, [])
			elif not hasattr(events, "__iter__"):
				setattr(card.scripts, script, [events])

		if not hasattr(card.scripts, "cost_mod"):
			card.scripts.cost_mod = None

		if not hasattr(card.scripts, "Hand"):
			card.scripts.Hand = type("Hand", (), {})

		if not hasattr(card.scripts.Hand, "events"):
			card.scripts.Hand.events = []

		if not hasattr(card.scripts.Hand.events, "__iter__"):
			card.scripts.Hand.events = [card.scripts.Hand.events]

		if not hasattr(card.scripts.Hand, "update"):
			card.scripts.Hand.update = ()

		if not hasattr(card.scripts.Hand.update, "__iter__"):
			card.scripts.Hand.update = (card.scripts.Hand.update, )

		# Set choose one cards
		if hasattr(cardscript, "choose"):
			card.choose_cards = cardscript.choose[:]
		else:
			card.choose_cards = []

		if hasattr(cardscript, "tags"):
			for tag, value in cardscript.tags.items():
				card.tags[tag] = value

		if hasattr(cardscript, "requirements"):
			card.powers.append({"requirements": cardscript.requirements})
		else:
			card.powers.append({"requirements": {}})

		if hasattr(cardscript, "entourage"):
			card.entourage = cardscript.entourage

		if hasattr(cardscript, "dormant"):
			card.dormant = cardscript.dormant
		else:
			card.dormant = 0

		return card

	def initialize(self, locale="enUS"):
		log.info("Initializing card database")
		self.initialized = True
		db, xml = cardxml.load(locale=locale)
		for id, card in db.items():
			tempCard = self.merge(id, card)
			if (tempCard != None):
				self[id] = tempCard

		log.info("Merged %i cards", len(self))

	def filter(self, **kwargs):
		"""
		Returns a list of card IDs matching the given filters. Each filter, if not
		None, is matched against the registered card database.
		cards.
		Examples arguments:
		\a collectible: Whether the card is collectible or not.
		\a type: The type of the card (hearthstone.enums.CardType)
		\a race: The race (tribe) of the card (hearthstone.enums.Race)
		\a rarity: The rarity of the card (hearthstone.enums.Rarity)
		\a cost: The mana cost of the card
		"""
		if not self.initialized:
			self.initialize()

		cards = self.values()

		if "type" not in kwargs:
			kwargs["type"] = [CardType.SPELL, CardType.WEAPON, CardType.MINION]

		for attr, value in kwargs.items():
			if value is not None:
				# What? this doesn't work?
				# cards = __builtins__["filter"](lambda c: getattr(c, attr) == value, cards)

				if attr == "card_class":
					cards = [card for card in cards if value in card.classes]
				else:
					cards = [
						card for card in cards if (
							isinstance(value, list) and getattr(card, attr) in value) or
						getattr(card, attr) == value
					]

		return [card.id for card in cards]


# Here we import every card from every set and load the cardxml database.
# For every card, we will "merge" the class with its Python definition if
# it exists.
if "db" not in globals():
	db = CardDB()
	filter = db.filter
