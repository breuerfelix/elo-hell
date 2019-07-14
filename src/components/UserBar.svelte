<script>
    export let users;

    function removeUser(user) {
        users = users.filter(x => x != user);
    }
</script>

<style>
    .box {
        display: flex;
        border: 1px solid grey;
        flex-wrap: wrap;
        min-height: var(--s5);
    }

    .box > .item {
        border: 1px solid lightgrey;
        padding: var(--s-4);
        margin: var(--s-5);
        cursor: pointer;
        font-size: var(--s0);
    }
</style>

<div class='box'>
    {#each users as user}
        <div on:click={() => removeUser(user)} class='item'>{user}</div>
    {/each}
</div>