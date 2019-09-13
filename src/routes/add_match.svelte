<script context='module'>
	export async function preload(page, session) {
		const res = await this.fetch('user.json?amount=0');
		const users = await res.json();
		return { users: users.map(user => user.username) };
	}
</script>

<script>
    import {goto} from      '@sapper/app';
    import Bracket from     '../components/Bracket.svelte';
    import Cover from       '../components/Cover.svelte';
	import Stack from       '@silvancodes/svelte-the-stack';
    import ScoreBar from    '../components/ScoreBar.svelte';
    import UserBar from     '../components/UserBar.svelte';
    import UserTable from   '../components/UserTable.svelte';

    export let users;
    let usersOne = [];
    let usersTwo = [];

    let activeScoreOne = 10;
    let activeScoreTwo = 10;

    async function submitMatch() {
        if (!usersOne.length || !usersTwo.length) {
            alert('Teams cannot be empty!');
            return;
        }

        if (activeScoreOne == activeScoreTwo) {
            alert('Scores must be different!');
            return;
        }

        const body = {
            usersOne,
            usersTwo,
            scoreOne: activeScoreOne,
            scoreTwo: activeScoreTwo
        };

        const res = await fetch('game.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // reset UI
        usersOne = [],
        usersTwo = [],
        activeScoreOne = 10;
        activeScoreTwo = 10;
        alert('Match added');
        goto('/');
    }
</script>

<style>
    .vertical-line {
        border: 1px solid lightgrey;
        height: 100%;
    }

    .slot {
        width: 40vw;
    }

    .center {
        text-align: center;
    }
</style>

<h1>Add Match</h1>

<Cover>
    <div slot='above'>
        <Bracket>
            <div class='slot' slot='left'>
                <Stack>
                    <h2>Heimmanschaft</h2>
                    <ScoreBar bind:activeScore={activeScoreOne}></ScoreBar>
                    <UserBar bind:users={usersOne}></UserBar>
                </Stack>
            </div>

            <div class='vertical-line' slot='center'></div>

            <div class='slot' slot='right'>
                <Stack>
                    <h2>Gastmanschaft</h2>
                    <ScoreBar bind:activeScore={activeScoreTwo}></ScoreBar>
                    <UserBar bind:users={usersTwo}></UserBar>
                </Stack>
            </div>
        </Bracket>
    </div>

    <div slot='center'>
        <UserTable bind:users bind:usersOne bind:usersTwo></UserTable>
    </div>

    <div class='center' slot='below'>
        <button class="btn btn-red" on:click={submitMatch}>Submit</button>
    </div>
</Cover>
