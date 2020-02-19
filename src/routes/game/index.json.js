const K = 30;
const F = 400;
const R = 10;

function prob(rating1, rating2) {
	return 1.0 / (1.0 + (10 ** ((rating2 - rating1) / F)));
}

export async function get(req, res) {
	const { db } = req;
	const { amount = 10 } = req.query;

	const games = await db.collection('games')
		.find()
		.sort({ timestamp: -1 })
		.limit(Number(amount))
		.toArray();

	res.writeHead(200, { 'Content-Type': 'application/json' });

	res.end(JSON.stringify(games));
}

export async function post(req, res) {
	const { db, body, telegramBot } = req;

	res.writeHead(200, { 'Content-Type': 'application/json' });

	const {
		usersOne, scoreOne,
		usersTwo, scoreTwo,
	} = body;
	const all = [...usersOne, ...usersTwo];
	const users = await db.collection('users').find({
		$or: all.map(username => ({ username })),
	}).toArray();

	if (users.length != all.length) {
		res.end(JSON.stringify({ error: 'Could not find every user.' }));
		return;
	}

	const gameDate = new Date();

	const mongoGame = await db.collection('games').insertOne({
		...body,
		timestamp: gameDate,
		userVerified: [],
		userDeclined: [],
	});

	const game = mongoGame.ops[0];

	const averageEloOne = users.filter(x => usersOne.includes(x.username))
		.reduce((pv, cv) => pv + cv.elo, 0) / usersOne.length;

	const averageEloTwo = users.filter(x => usersTwo.includes(x.username))
		.reduce((pv, cv) => pv + cv.elo, 0) / usersTwo.length;

	console.log('averageOne', averageEloOne);
	console.log('averageTwo', averageEloTwo);

	const teamOneWon = scoreOne > scoreTwo;
	const diff = Math.abs(scoreOne - scoreTwo);
	console.log('diff', diff);

	const probOne = prob(averageEloOne, averageEloTwo);
	const probTwo = prob(averageEloTwo, averageEloOne);

	console.log('probOne', probOne);
	console.log('probTwo', probTwo);

	let resOne = (diff / R) * (K * ((teamOneWon ? 1 : 0) - probOne));
	let resTwo = (diff / R) * (K * ((teamOneWon ? 0 : 1) - probTwo));

	// if the diff is 10, double the amount of elo
	if (diff == 10) {
		resOne *= 2;
		resTwo *= 2;
		console.log('elo * 2 because score diff is 10');
	}

	// reduce the amount of elo if one user is new to the system
	const lowUsers = users.filter(user => user.games + 1 < 10);
	if (lowUsers.length > 0) {
		resOne /= 2;
		resTwo /= 2;
		console.log('elo / 2 because at least one user got less then 10 games played');
	}

	console.log('resOne', resOne);
	console.log('resTwo', resTwo);

	// TODO prettify this loop
	for (const player of users) {
		if (usersOne.includes(player.username)) {
			player.elo += resOne;
			if (teamOneWon) {
				player.wins += 1;
				player.diff += diff;
			} else {
				player.diff -= diff;
			}
		} else {
			player.elo += resTwo;
			if (!teamOneWon) {
				player.wins += 1;
				player.diff += diff;
			} else {
				player.diff -= diff;
			}
		}

		player.games += 1;

		db.collection('users').updateOne(
			{ username: player.username },
			{
				$set: {
					elo: player.elo,
					wins: player.wins,
					games: player.games,
					diff: player.diff,
					lastUpdate: gameDate,
				},
			},
		);
	}

	if (telegramBot) {
		console.log('all user verified');

		const message = `
A wild new game appeared!
${scoreOne} - ${usersOne.join(', ')}
- vs -
${scoreTwo} - ${usersTwo.join(', ')}
`;

		const data = { gameId: game._id };

		for (const player of users.filter(user => user.verified)) {
			const opts = {
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'yup, saw that...',
								callback_data: JSON.stringify(
									{ ...data, action: 'verify' },
								),
							},
						],
						[
							{
								text: 'never happened!',
								callback_data: JSON.stringify(
									{ ...data, action: 'decline' },
								),
							},
						],
					],
				},
			};

			telegramBot.sendMessage(player.telegramId, message, opts);
		}
	}

	res.end(JSON.stringify({ status: 'ok' }));
}
