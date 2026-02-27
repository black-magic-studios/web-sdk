<script lang="ts" module>
	import { sound, type MusicName, type SoundEffectName, type SoundName } from '../game/sound';

	export type EmitterEventSound =
		| { type: 'soundMusic'; name: MusicName }
		| { type: 'soundMusicCrossfade'; name: MusicName; duration: number }
		| { type: 'soundOnce'; name: SoundEffectName; forcePlay?: boolean }
		| { type: 'soundLoop'; name: SoundEffectName }
		| { type: 'soundStop'; name: SoundName }
		| { type: 'soundFade'; name: SoundName; from: number; to: number; duration: number }
		| { type: 'soundScatterCounterIncrease' }
		| { type: 'soundScatterCounterClear' };
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { waitForTimeout } from 'utils-shared/wait';
	import { SECOND } from 'constants-shared/time';
	import { stateBet } from 'state-shared';

	import { getContext } from '../game/context';

	const context = getContext();

	/**
	 * Quick fade-out of current music, then start the new track.
	 * Since each song's end connects seamlessly to the next song's start,
	 * we just need a short fade to avoid a hard cut, then play immediately.
	 */
	let crossfadeTimerId: ReturnType<typeof setTimeout> | null = null;
	let currentMusic: MusicName | null = null;

	const crossfadeMusic = (name: MusicName, duration: number) => {
		// Skip if the target music is already playing
		if (name === currentMusic) {
			console.log(`[🎵 MUSIC] crossfade → ${name} SKIPPED (already playing)`);
			return;
		}
		console.log(`[🎵 MUSIC] crossfade → ${name} (fade-out: ${duration}ms)`);
		// Cancel intro timer if still pending
		cancelIntroTimer();
		// Cancel any pending crossfade play from a previous crossfade
		if (crossfadeTimerId) {
			clearTimeout(crossfadeTimerId);
			crossfadeTimerId = null;
		}
		// Fade out all currently playing music tracks
		sound.fade({ name: 'bgm_main' as any, from: 1, to: 0, duration });
		sound.fade({ name: 'bgm_freespin' as any, from: 1, to: 0, duration });
		sound.fade({ name: 'bgm_bonus_intro' as any, from: 1, to: 0, duration });
		sound.fade({ name: 'bgm_bonus_exit' as any, from: 1, to: 0, duration });
		sound.fade({ name: 'bgm_intro' as any, from: 1, to: 0, duration });

		// After the fade-out completes, start the new track at full volume
		crossfadeTimerId = setTimeout(() => {
			crossfadeTimerId = null;
			console.log(`[🎵 MUSIC] crossfade fade done → playing ${name}`);
			currentMusic = name;
			sound.players.music.play({ name });
		}, duration);
	};

	context.eventEmitter.subscribeOnMount({
		// ui
		soundBetMode: async ({ betModeKey }) => {
			console.log(`[🎵 MUSIC] soundBetMode: ${betModeKey}`);
			if (betModeKey === 'SUPERSPIN') {
				// check if SUPERSPIN, when changing the bet mode.
				sound.players.once.play({ name: 'sfx_winlevel_end' });
				await waitForTimeout(SECOND);
				console.log(`[🎵 MUSIC] betMode → playing bgm_freespin`);
				currentMusic = 'bgm_freespin';
				sound.players.music.play({ name: 'bgm_freespin' });
			} else {
				console.log(`[🎵 MUSIC] betMode → playing bgm_main`);
				currentMusic = 'bgm_main';
				sound.players.music.play({ name: 'bgm_main' });
			}
		},
		soundPressGeneral: () => sound.players.once.play({ name: 'sfx_btn_general' }),
		soundPressBet: () => sound.players.once.play({ name: 'sfx_btn_spin' }),
		// scatterCounter
		soundScatterCounterIncrease: () => (context.stateGame.scatterCounter = context.stateGame.scatterCounter + 1), // prettier-ignore
		soundScatterCounterClear: () => (context.stateGame.scatterCounter = 0),
		// game
		soundMusic: ({ name }) => {
			console.log(`[🎵 MUSIC] soundMusic → ${name}`);
			currentMusic = name;
			sound.players.music.play({ name });
		},
		soundMusicCrossfade: ({ name, duration }) => crossfadeMusic(name, duration),
		soundLoop: ({ name }) => sound.players.loop.play({ name }),
		soundOnce: ({ name, forcePlay }) => sound.players.once.play({ name, forcePlay }),
		soundStop: ({ name }) => {
			console.log(`[🎵 MUSIC] soundStop → ${name}`);
			sound.stop({ name });
		},
		soundFade: async ({ name, duration, from, to }) => await sound.fade({ name, duration, from, to }), // prettier-ignore
	});

	/** Whether the intro→loop handoff is still active (can be cancelled on bonus trigger) */
	let introEndActive = false;

	/** Cancel the intro→loop handoff (e.g. when bonus triggers before intro finishes) */
	const cancelIntroTimer = () => {
		if (introEndActive) {
			introEndActive = false;
			console.log('[🎵 MUSIC] intro→loop CANCELLED');
		}
	};

	onMount(() => {
		console.log(`[🎵 MUSIC] onMount — activeBetModeKey=${stateBet.activeBetModeKey}`);
		if (stateBet.activeBetModeKey === 'SUPERSPIN') {
			console.log(`[🎵 MUSIC] onMount → playing bgm_freespin`);
			currentMusic = 'bgm_freespin';
			sound.players.music.play({ name: 'bgm_freespin' });
		} else {
			console.log(`[🎵 MUSIC] onMount → playing bgm_intro, waiting for onend to start bgm_main`);
			currentMusic = 'bgm_intro';
			introEndActive = true;
			sound.players.once.play({ name: 'bgm_intro' });
			// Listen for Howler's 'end' event — fires exactly when the sprite finishes
			sound.players.once.howl.on('end', function onIntroEnd(soundId: number) {
				// Only react if this is our intro sound and we haven't been cancelled
				if (!introEndActive) return;
				introEndActive = false;
				// Remove this one-shot listener
				sound.players.once.howl.off('end', onIntroEnd, soundId);
				console.log(`[🎵 MUSIC] bgm_intro ended (event-driven) → playing bgm_main`);
				currentMusic = 'bgm_main';
				sound.players.music.play({ name: 'bgm_main' });
			});
		}
	});
</script>
