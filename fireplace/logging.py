import logging
import requests
import json

NUM_BUFFERED_MESSAGES = 999999; 

class RequestsHandler(logging.Handler): 
	messageBuffer = []

	def emit(self, record):
		data = {'message': record.msg, 'arguments': str(record.args)} 
		print(data)
		self.messageBuffer.append(data)
		if (len(self.messageBuffer) >= NUM_BUFFERED_MESSAGES or record.msg == "Game completed normally."):
			outgoingJSON = json.dumps(self.messageBuffer)
			self.messageBuffer = []
			return requests.post('https://c048f8fb-ce6b-4615-9f59-cca27d414531.mock.pstmn.io/gameLogging',
			outgoingJSON, headers={"Content-type": "application/json"}).content


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
