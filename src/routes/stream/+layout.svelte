<script lang="ts">
    import '$lib/../stream.postcss';
	import StreamOverlay from "./StreamOverlay.svelte";


</script>
<svelte:head><title>Turbo Quizz Stream</title></svelte:head>

<div class="overlay-layout">
    <div class="game-display">
        <slot/>
        <div class="credits">
            @Nokorbis <br />
            @siixtiine
        </div>
    </div>
    <div>
        <StreamOverlay />
    </div>
</div>

<style>
    .overlay-layout {
        display: grid;
        grid-template-columns: 1fr 390px;
        height: 100%;
        overflow-y: hidden;
    }

    .game-display {
        margin-top: -21px;
        height: calc(100% + 42px);
        background: linear-gradient(116deg, #7c81d0 0.94%, #90dee4 101.27%);
        border: 21px solid white;
        border-left: none;
        border-radius: 0px 50px 50px 0px;
        overflow-y: hidden;
    }

    .credits {
        position: absolute;
        bottom: 0.5rem;
        left: 0.5rem;
        font-family: 'Archivo';
        font-size: 1rem;
        line-height: 1.2;
    }
</style>

