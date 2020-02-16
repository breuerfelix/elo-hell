import TelegramBot from 'node-telegram-bot-api';
import { ObjectID } from 'mongodb';
import {
	checkUser,
	addUser,
} from './routes/user/index.json';

function setupTelegram(token, url, dev, db) {
	// use polling in dev mode
	const options = { polling: dev };

	const bot = new TelegramBot(token, options);
	if (!dev) bot.setWebHook(url);

	bot.onText(/\/help/, msg => {
		const message = `
/help - may or may not help you
/link <username> - links <username> to this telegram account
/register <username> - adds <username> to elo-hell and links to telegram
`;

		bot.sendMessage(msg.chat.id, message);
	});

	bot.onText(/\/link/, async msg => {
		const { id } = msg.chat;
		const text = msg.text.replace('/link', '').trim().replace(' ', '_');
		if (!text) {
			bot.sendMessage(id, 'Invalid username.');
			return;
		}

		const user = await checkUser(db, text);

		if (!user) {
			bot.sendMessage(id, `Unable to find username: ${text}`);
			return;
		}

		if (user.verified) {
			bot.sendMessage(id, `User: ${text} is already verified.`);
			return;
		}

		const foundId = await db.collection('users').findOne({ telegramId: id });
		if (foundId) {
			bot.sendMessage(id, 'You are already linked to an account.');
			return;
		}

		await db.collection('users').updateOne(
			{ username: user.username },
			{
				$set: {
					verified: true,
					telegramId: id,
					lastUpdate: new Date(),
				},
			},
		);

		bot.sendMessage(id, 'User updated.');
	});

	bot.onText(/\/register/, async msg => {
		const { id } = msg.chat;
		const text = msg.text.replace('/register', '').trim().replace(' ', '_');
		if (!text) {
			bot.sendMessage(id, 'Invalid username.');
			return;
		}

		const user = await checkUser(db, text);

		if (user) {
			bot.sendMessage(id, `Username: ${text} already taken.`);
			return;
		}

		const foundId = await db.collection('users').findOne({ telegramId: id });
		if (foundId) {
			bot.sendMessage(id, 'You are already linked to an account.');
			return;
		}

		await addUser(db, text, id);

		bot.sendMessage(id, `User: ${text} added and linked.`);
	});

	bot.on('callback_query', async callbackQuery => {
		const { data, message: { text, message_id, chat: { id } } } = callbackQuery;
		const { action, gameId } = JSON.parse(data);

		const opts = {
			message_id,
			chat_id: id,
		};

		bot.editMessageReplyMarkup(null, opts);
		bot.editMessageText(`${text}\nAction: ${action}`, opts);

		const field = action == 'verify' ? 'userVerified' : 'userDeclined';

		const user = await db.collection('users').findOne({ telegramId: id });
		db.collection('games').updateOne(
			{ _id: new ObjectID(gameId) },
			{ $push: { [field]: user.username } },
		);
	});

	return bot;
}

export {
	setupTelegram,
};
