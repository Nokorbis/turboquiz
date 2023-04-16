<script lang="ts">
    export let imageUrl: string;
    export let highlight = false;
</script>

<div class:highlight>
    <div class="avatar-circle">
        <img src={imageUrl} class="mx-auto" alt="" />
    </div>
</div>

<style>
    .avatar-circle {
    }

    .avatar-circle img {
        width: var(--avatar-size, 16rem);
        height: var(--avatar-size, 16rem);
        border-radius: 999rem;
        object-fit: cover;
        object-position: center;
        background-color: var(--border-color, var(--turbo-darkgray));
        border: 1rem solid var(--border-color, var(--turbo-darkgray));
    }
    .highlight {
        --border-color: var(--turbo-orange);
    }
</style>
