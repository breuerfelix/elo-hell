<script context='module'>
    export async function preload(page, session) {
        const res_user = await this.fetch('all_users.json');
        const users = await res_user.json();

        return { users };
    }
</script>

<script>
    export let users;
</script>

<style>
    table {
        font-size: var(--s0);
    }

    th {
        padding: var(--s1) var(--s3);
    }

    td {
        padding-bottom: var(--s-5);
    }

    td, th {
        text-align: center;
        vertical-align: middle;
    }


</style>

<table>
    <tr class="red">
        <th># rank</th>
        <th># username</th>
        <th># elo</th>
        <th># wins</th>
        <th># games</th>
        <th># TD</th>
    </tr>
    {#each users as user, rank}
    <tr>
        <td>{rank + 1}</td>
        <td>{user.username}</td>
        <td>{user.elo}</td>
        <td>{user.wins}</td>
        <td>{user.games}</td>
    </tr>
    {/each}
</table>