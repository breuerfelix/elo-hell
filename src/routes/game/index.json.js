const K = 30;
const F = 400;
const R = 10;

function prob(rating1, rating2) {
	return 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (rating2 - rating1) / F));
}

export async function get(req, res) {
	const { db } = req;
	const { amount = 10 } = req.query;

	const games = await db.collection('games').find().limit(Number(amount)).toArray();

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});


	res.end(JSON.stringify(games));
}

export async function post(req, res) {
	const { db, body } = req;

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	const {
		usersOne, scoreOne,
		usersTwo, scoreTwo
	} = body;
	const all = [...usersOne, ...usersTwo];
	const users = await db.collection('users').find({
		$or: all.map(username => ({ username }))
	}).toArray();

	if (users.length != all.length) {
		res.end(JSON.stringify({ error: 'Could not find every user.' }));
		return;
	}

	await db.collection('games').insertOne({
		...body,
		timestamp: new Date()
	});

	const averageEloOne = users.filter(x => usersOne.includes(x.username))
								.reduce((pv, cv) => pv + cv.elo, 0) / usersOne.length;

	const averageEloTwo = users.filter(x => usersTwo.includes(x.username))
								.reduce((pv, cv) => pv + cv.elo, 0) / usersTwo.length;

	console.log('averageOne', averageEloOne)
	console.log('averageTwo', averageEloTwo)

	const teamOneWon = scoreOne > scoreTwo;
	const diff = Math.abs(scoreOne - scoreTwo);
	console.log('diff', diff)

	const probOne = prob(averageEloOne, averageEloTwo);
	const probTwo = prob(averageEloTwo, averageEloOne);

	console.log('probOne', probOne)
	console.log('probTwo', probTwo)

	const resOne = (diff / R) * (K * ((teamOneWon ? 1 : 0) - probOne));
	const resTwo = (diff / R) * (K * ((teamOneWon ? 0 : 1) - probTwo));

	console.log('resOne', resOne)
	console.log('resTwo', resTwo)

	console.log(resOne)
	console.log(resTwo)

	for (const player of users) {
		if (usersOne.includes(player.username)) {
			player.elo = player.elo + resOne;
			if (teamOneWon) {
				player.wins = player.wins + 1;
			}
		} else {
			player.elo = player.elo + resTwo;
			if (!teamOneWon) {
				player.wins = player.wins + 1;
			}
		}

		player.games = player.games + 1;

		db.collection('users').updateOne(
			{ username: player.username },
			{ $set: { elo: player.elo, wins: player.wins, games: player.games } }
		);
	}

	res.end(JSON.stringify({ status: 'ok' }));
}