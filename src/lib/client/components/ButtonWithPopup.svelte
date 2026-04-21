<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		popupPosition = 'top',
		popupAlignment = 'center',
		popup,
		children,
		class: buttonClass,
		...rest
	}: {
		popupPosition?: 'top' | 'bottom' | 'left' | 'right';
		popupAlignment?: 'start' | 'center' | 'end';
		popup: Snippet;
		children: Snippet;
	} & HTMLButtonAttributes = $props();
</script>

<button class={`button-with-popup ${buttonClass}`} {...rest}>
	{@render children()}

	<div
		class="button-popup"
		class:top={popupPosition === 'top'}
		class:bottom={popupPosition === 'bottom'}
		class:left={popupPosition === 'left'}
		class:right={popupPosition === 'right'}
		class:align-start={popupAlignment === 'start'}
		class:align-center={popupAlignment === 'center'}
		class:align-end={popupAlignment === 'end'}
	>
		{@render popup()}
	</div>
</button>

<style>
	:where(.button-with-popup) {
		position: relative;
	}

	.button-with-popup:disabled {
		color: var(--text-disabled);
	}

	.button-with-popup:disabled:hover {
		background-color: unset;
		cursor: not-allowed;
	}

	.button-with-popup:hover .button-popup:not(:hover) {
		visibility: visible;
	}

	.button-popup {
		--popup-offset: 4px;

		visibility: hidden;

		position: absolute;

		width: max-content;

		padding: 8px;
		border: var(--border);
		border-radius: 4px;
	}

	:is(.top, .bottom).align-start {
		left: 0;
	}

	:is(.top, .bottom).align-center {
		left: 50%;
		transform: translateX(-50%);
	}

	:is(.top, .bottom).align-end {
		left: 100%;
		transform: translateX(-100%);
	}

	.top {
		bottom: calc(100% + var(--popup-offset));
	}

	.bottom {
		top: calc(100% + var(--popup-offset));
	}

	.left {
		top: 50%;
		right: calc(100% + var(--popup-offset));
		transform: translateY(-50%);
	}

	.right {
		top: 50%;
		left: calc(100% + var(--popup-offset));
		transform: translateY(-50%);
	}
</style>
