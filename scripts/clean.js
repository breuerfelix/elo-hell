require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');

const {
    SCRIPTS_MONGO_URL = 'mongodb://mongo:27017',
} = process.env;

const mongoClient = new MongoClient(
    SCRIPTS_MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
);

async function defaultFields(db) {
    const games = await db.collection('games')
        .find()
        .toArray();

    for (const game of games) {
        if (game.userVerified == undefined) {
            await db.collection('games').updateOne(
                { _id: new ObjectID(game._id) },
                {
                    $set: {
                        userVerified: [],
                        userDeclined: [],
                    },
                },
            );
        }
    }
}

async function swapTeams(db) {
    const games = await db.collection('games')
        .find()
        .toArray();

    for (const game of games) {
        if (game.scoreTwo > game.scoreOne) {
            await db.collection('games').updateOne(
                { _id: new ObjectID(game._id) },
                {
                    $set: {
                        usersOne: game.usersTwo,
                        usersTwo: game.usersOne,
                        scoreOne: game.scoreTwo,
                        scoreTwo: game.scoreOne,
                    },
                },
            );
        }
    }
}

mongoClient.connect(async err => {
    if (err) {
        console.error('mongo error:', err);
        return;
    }

    const db = mongoClient.db('elo');

    // await defaultFields(db);
    await swapTeams(db);

    console.log('done');
    mongoClient.close();
});
