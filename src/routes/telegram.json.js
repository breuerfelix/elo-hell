export async function post(req, res) {
	const { telegramBot, body } = req;

	if (!telegramBot) {
		res.sendStatus(500);
		return;
	}

	telegramBot.processUpdate(body);
	res.sendStatus(200);
}
