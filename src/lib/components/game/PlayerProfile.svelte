<script lang="ts">
    export let player: any;
</script>

<div class="player-bloc" class:highlight={player.highlight}>
    <div class="player-avatar">
        <img src={player.picture} alt="" />
    </div>
    <div class="player-score">
        {player.score}
    </div>
    <div class="player-name">
        {player.name}
    </div>
</div>

<style>
    .player-bloc {
        position: relative;
        height: 250px;
    }

    .player-avatar {
        width: 230px;
        height: 230px;

        overflow: hidden;
    }

    .player-avatar img {
        width: 230px;
        height: 230px;
        border-radius: 240px;
        object-fit: cover;
        object-position: center;
        background-color: #2d3142;
        border: 1rem solid #2d3142;
    }

    .player-bloc.highlight .player-avatar img {
        background-color: #db6f57;
        border-color: #db6f57;
    }

    .player-score {
        position: absolute;
        top: -0.5rem;
        right: -0.25rem;
        width: 5rem;
        height: 5rem;
        background: #dd735b;
        border: 0.5rem solid #c85c44;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Archivo';
        font-size: 1.5rem;
        font-weight: 700;
    }

    .player-name {
        position: absolute;
        bottom: 0.25rem;
        height: 3.25rem;
        width: 220px;
        border-radius: 0.375rem;
        background-color: #2d3142;
        text-align: center;
        font-family: 'Archivo';
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        left: 5px;
    }

    .player-bloc.highlight .player-name {
        background-color: #db6f57;
    }
</style>
