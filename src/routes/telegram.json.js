export async function post(req, res) {
    const { telegramBot, body } = req;

    res.writeHead(200);

    if (!telegramBot) {
        res.end();
        return;
    }

    telegramBot.processUpdate(body);
    res.end();
}
