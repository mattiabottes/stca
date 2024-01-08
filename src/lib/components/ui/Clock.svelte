<script>
	import { Hours, Minutes } from '$lib/stores';
</script>

<div>
	{$Hours}<span class="colon">:</span>{$Minutes}
</div>

<style>
	.colon {
		opacity: 0;
		animation: blink 2s steps(1, end) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 1;
		}
	}
</style>
