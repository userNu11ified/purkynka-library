import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export const trapFocus =
	(startFocusIndex: number = 0): Attachment<HTMLElement> =>
	(node) => {
		console.log(node);

		const focusedBeforeTrap = document.activeElement as HTMLElement | undefined;

		function getFocusableElements(): HTMLElement[] {
			return Array.from(
				node.querySelectorAll(
					':is(button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])):not(:disabled)'
				)
			);
		}

		function onKeyDown(e: KeyboardEvent) {
			if (e.code !== 'Tab') return;

			const current = document.activeElement;
			const elements = getFocusableElements();
			const first = elements.at(0);
			const last = elements.at(-1);

			if (e.shiftKey && current === first) {
				last?.focus();
				e.preventDefault();
			} else if (!e.shiftKey && current === last) {
				first?.focus();
				e.preventDefault();
			}
		}

		const autofocusElement = getFocusableElements().at(startFocusIndex);
		autofocusElement?.focus();

		const unregisterEventListener = on(node, 'keydown', onKeyDown);

		return () => {
			unregisterEventListener();
			focusedBeforeTrap?.focus();
		};
	};
