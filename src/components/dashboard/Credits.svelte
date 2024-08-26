<div class="credits">
	<div class="line">
		Made with <span title="...and lots of screaming at TypeScript...">❤️</span> by
		<a href="https://github.com/userNu11ified">null</a>.
	</div>
	<div class="line">
		Licensed under <a href="https://github.com/userNu11ified/purkynka-library/blob/main/LICENSE">MIT</a>. Source code
		available
		<a href="https://github.com/userNu11ified/purkynka-library">here</a>.
	</div>
</div>

<style>
	.credits {
		display: flex;
		flex-direction: column;
		align-items: end;

		position: absolute;
		right: 16px;
		bottom: 16px;

		width: max-content;
		height: max-content;

		color: var(--text-color);

		transition: var(--base-transition);
	}

	.line {
		opacity: 0.25;
	}

	.credits:has(.line:hover) .line {
		opacity: 1;
	}
</style>
