<script lang="ts">
	type Props = {
		ondone: () => void;
	};

	const props: Props = $props();

	let videoEl: HTMLVideoElement | undefined = $state();
	let audioEl: HTMLAudioElement | undefined = $state();
	let finished = false;
	let fadeStarted = false;

	// Safety timeout — if video fails to load or play, skip after 10s
	let timer: ReturnType<typeof setTimeout> | undefined;

	function finish() {
		if (finished) return;
		finished = true;
		if (timer) clearTimeout(timer);
		timer = undefined;
		// Stop audio if still playing
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		props.ondone();
	}

	/** Smoothly fade out the intro audio over the given duration (ms). */
	function fadeOutAudio(duration: number) {
		if (!audioEl || fadeStarted) return;
		fadeStarted = true;
		const steps = 20;
		const interval = duration / steps;
		const startVol = audioEl.volume;
		let step = 0;
		const id = setInterval(() => {
			step++;
			if (!audioEl || step >= steps) {
				clearInterval(id);
				if (audioEl) audioEl.volume = 0;
				return;
			}
			audioEl.volume = startVol * (1 - step / steps);
		}, interval);
	}

	$effect(() => {
		timer = setTimeout(finish, 10000);
		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	// Attempt to play audio alongside video (may be blocked by browser autoplay policy)
	$effect(() => {
		if (audioEl) {
			audioEl.play().catch(() => {
				// Autoplay audio blocked — that's fine, video still plays muted
			});
		}
	});

	function handleEnded() {
		// Small delay so the last frame lingers briefly
		setTimeout(finish, 200);
	}

	function handleTimeUpdate() {
		// Start fading audio 1.5s before video ends
		if (videoEl && videoEl.duration > 0 && videoEl.currentTime >= videoEl.duration - 1.5) {
			fadeOutAudio(1400);
		}
	}

	function handleError() {
		// If video can't play (e.g. codec issue), skip intro immediately
		finish();
	}
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<div class="studio-intro">
	<video
		bind:this={videoEl}
		class="intro-video"
		autoplay
		muted
		playsinline
		onended={handleEnded}
		ontimeupdate={handleTimeUpdate}
		onerror={handleError}
	>
		<source src="./assets/video/studio_intro.webm" type="video/webm" />
		<source src="./assets/video/studio_intro.mp4" type="video/mp4" />
	</video>

	<audio bind:this={audioEl} preload="auto">
		<source src="./assets/audio/intro.mp3" type="audio/mpeg" />
	</audio>
</div>

<style lang="scss">
	.studio-intro {
		position: fixed;
		inset: 0;
		z-index: 1100;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	.intro-video {
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #000;
	}
</style>
