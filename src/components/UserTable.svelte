<script>
    export let users;
    export let usersOne;
    export let usersTwo;

    function addUser(user, list) {
        if (list.includes(user)) {
            // remove user if already in there
            return list.filter(x => x != user);
        }

        // do nothing if user exists in other list
        if (usersOne.includes(user) || usersTwo.includes(user)) return list;

        return [...list, user];
    }
</script>

<style>
    .flex {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .box {
        display     : flex;
        border      : 1px solid grey;
        flex-wrap   : wrap;
    }

    .box > .item {
        border: 1px solid lightgrey;
        margin: var(--s-5);
        font-size: var(--s0);
        display: flex;
    }

    .team {
        padding: var(--s-2) var(--s0);
        cursor: pointer;
        border: 1px solid lightgrey;
    }

    .team.left {
        border-width: 0 1px 0 0;
    }

    .team.right {
        border-width: 0 0 0 1px;
    }

    .username {
        font-weight: bold;
        padding: var(--s-2) var(--s0);
        margin: 0 auto;
    }

    .selected {
        background-color: lightgrey;
    }
</style>

<div class='box flex'>
    {#each users as user}
        <div class='item'>
            <div
                class='team left red'
                class:bg-red-selected={usersOne.includes(user)}
                on:click={() => usersOne = addUser(user, usersOne)}
            >
                #1
            </div>
            <div class='username'>{user}</div>
            <div
                class='team right red'
                class:bg-red-selected={usersTwo.includes(user)}
                on:click={() => usersTwo = addUser(user, usersTwo)}
            >
                #2
            </div>
        </div>
    {/each}
</div>