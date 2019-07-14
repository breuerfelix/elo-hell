<script>
    let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    export let activeScore = 10;

    function setScore(score) {
        return () => { activeScore = score; }
    }
</script>

<style>
    ul {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
    }

    li {
        padding: var(--s-5);
        font-size: var(--s1);
        text-align: center;
        flex-basis: 9%;
        cursor: pointer;
    }

    .activeScore {
        border: 1px solid gray;
    }
</style>

<ul>
    {#each scores as score}
        <li
            class:activeScore={score == activeScore}
            on:click={setScore(score)}
        >
            {score}
        </li>
    {/each}
</ul>