import logging

playedGames = []
playedActions = []

def clearPlayedGames():
	playedGames.clear()

def clearPlayedActions():
	playedActions.clear()

class RequestsHandler(logging.Handler): 
	messageBuffer = []

	def emit(self, record):
		data = {'message': record.msg, 'arguments': str(record.args), 'formatted': self.format(record)} 
		self.messageBuffer.append(data)
		playedActions.append(data)
		if (record.msg == "Game completed normally."):
			playedGames.append(self.messageBuffer)
			self.messageBuffer = []


def get_logger(name, level=logging.DEBUG):
	logger = logging.getLogger(name)
	logger.setLevel(level)

	if not logger.handlers:
		ch = logging.StreamHandler()
		ch.setLevel(level)

		formatter = logging.Formatter(
			"[%(name)s.%(module)s]: %(message)s",
			datefmt="%H:%M:%S"
		)
		ch.setFormatter(formatter)

		logger.addHandler(ch)
		logger.addHandler(RequestsHandler())

	return logger


log = get_logger("fireplace")
