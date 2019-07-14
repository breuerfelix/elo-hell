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
    .box {
        display: flex;
        border: 1px solid grey;
        flex-wrap: wrap;
    }

    .box > .item {
        border: 1px solid lightgrey;
        margin: var(--s-5);
        font-size: var(--s0);
        display: flex;
    }

    .team, .name {
        padding: var(--s-2) var(--s0);
    }

    .team {
        cursor: pointer;
        border: 1px solid lightgrey;
    }

    .team.left {
        border-width: 0 1px 0 0;
    }

    .team.right {
        border-width: 0 0 0 1px;
    }

    .name {
        font-weight: bold;
    }

    .selected {
        background-color: lightgrey;
    }
</style>

<div class='box'>
    {#each users as user}
        <div class='item'>
            <div
                class='team left'
                class:selected={usersOne.includes(user)}
                on:click={() => usersOne = addUser(user, usersOne)}
            >
                #1
            </div>
            <div class='name'>{user}</div>
            <div
                class='team right'
                class:selected={usersTwo.includes(user)}
                on:click={() => usersTwo = addUser(user, usersTwo)}
            >
                #2
            </div>
        </div>
    {/each}
</div>