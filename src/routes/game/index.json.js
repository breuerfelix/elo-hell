const K = 30.0;
const F = 400.0;
const R = 10.0;

function eloAlgorithm(rating1, rating2) {
    return 1.0 / (1.0 + (10 ** ((rating2 - rating1) / F)));
}

export function calculateElo(eloWinner, eloLoser, diff, users) {
    const probRes = eloAlgorithm(eloWinner, eloLoser);

    let resultElo = (diff / R) * (K * (1.0 - probRes));

    // if the diff is 10, double the amount of elo
    if (diff == 10) {
        resultElo *= 2.0;
    }

    // reduce the amount of elo if one user is new to the system
    if (users.filter(user => user.games + 1 < 10).length > 0) {
        resultElo /= 2.0;
    }

    return resultElo;
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

    const winner = (scoreOne > scoreTwo) ? [...usersOne] : [...usersTwo];
    const scoreWinner = (scoreOne > scoreTwo) ? scoreOne : scoreTwo;
    const loser = (scoreOne > scoreTwo) ? [...usersTwo] : [...usersOne];
    const scoreLoser = (scoreOne > scoreTwo) ? scoreTwo : scoreOne;

    function averageElo(players) {
        return users.filter(x => players.includes(x.username))
            .reduce((pv, cv) => pv + cv.elo, 0) / players.length;
    }

    const averageEloWinner = averageElo(winner);
    const averageEloLoser = averageElo(loser);

    const diff = Math.abs(scoreWinner - scoreLoser);

    const elo = calculateElo(averageEloWinner, averageEloLoser, diff, users);

    const gameDate = new Date();

    const mongoGame = await db.collection('games').insertOne({
        elo,
        usersOne: winner,
        scoreOne: scoreWinner,
        usersTwo: loser,
        scoreTwo: scoreLoser,
        timestamp: gameDate,
        userVerified: [],
        userDeclined: [],
    });

    const game = mongoGame.ops[0];

    for (const player of users) {
        if (winner.includes(player.username)) {
            player.elo += elo;
            player.wins += 1;
            player.diff += diff;
        }

        if (loser.includes(player.username)) {
            player.elo -= elo;
            player.diff -= diff;
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
