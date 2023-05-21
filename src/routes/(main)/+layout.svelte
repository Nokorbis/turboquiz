<script lang="ts">
    // The ordering of these imports is critical to your app working properly
import '@skeletonlabs/skeleton/themes/theme-modern.css';
// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
import '@skeletonlabs/skeleton/styles/all.css';
// Most of your app wide CSS should be put in this file
import '$lib/../app.postcss';

import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
import { Toast, Modal, storePopup } from '@skeletonlabs/skeleton';

storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Modal zIndex="z-[600]"></Modal>
<Toast></Toast>
<slot></slot>