<script lang="ts" module>
	import { sound, type MusicName, type SoundEffectName, type SoundName } from '../game/sound';

	export type EmitterEventSound =
		| { type: 'soundMusic'; name: MusicName }
		| { type: 'soundMusicCrossfade'; name: MusicName; duration: number }
		| { type: 'soundOnce'; name: SoundEffectName; forcePlay?: boolean }
		| { type: 'soundLoop'; name: SoundEffectName }
		| { type: 'soundStop'; name: SoundName }
		| { type: 'soundFade'; name: SoundName; from: number; to: number; duration: number }
		| { type: 'soundOnceWithRate'; name: SoundEffectName; rate: number; volume?: number }
		| { type: 'soundScatterCounterIncrease' }
		| { type: 'soundScatterCounterClear' }
		| { type: 'soundBoostMusicOnWin' };
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { waitForTimeout } from 'utils-shared/wait';
	import { SECOND } from 'constants-shared/time';
	import { stateBet, stateSoundDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import { isFreegameType } from '../game/types';

	const context = getContext();

	/**
	 * Quick fade-out of current music, then start the new track.
	 * Since each song's end connects seamlessly to the next song's start,
	 * we just need a short fade to avoid a hard cut, then play immediately.
	 */
	let crossfadeTimerId: ReturnType<typeof setTimeout> | null = null;
	let currentMusic: MusicName | null = null;

	// ── Dynamic music volume ──────────────────────────────────────────────────
	// Music plays quietly by default; briefly boosts when the player wins.
	const BASE_MUSIC_VOL = 0.5;   // normal playback level (50% of slider value)
	const WIN_BOOST_VOL  = 0.72;  // boosted level on a win (~72% of slider)
	let musicBoostTimer: ReturnType<typeof setTimeout> | null = null;

	/** Fade any currently-playing BGM track to the base (quiet) volume. */
	const fadeMusicToBase = () => {
		if (!currentMusic) return;
		sound.fade({ name: currentMusic, from: WIN_BOOST_VOL, to: BASE_MUSIC_VOL, duration: 1500 });
	};

	/**
	 * After a new music track starts, fade it down from full volume to BASE_MUSIC_VOL.
	 * A small initial delay lets Howler register the play before we adjust its volume.
	 */
	const initMusicVolume = (name: MusicName) => {
		setTimeout(() => {
			sound.fade({ name, from: 1, to: BASE_MUSIC_VOL, duration: 700 });
		}, 80);
	};

	/**
	 * Temporarily boost music volume on a win, then fade back to base after 2.5 s
	 * (timer resets if another win arrives first).
	 */
	const boostMusicForWin = () => {
		if (!currentMusic) return;
		// Only boost in base game modes — bonus/free spins music stays at its own level
		if (isFreegameType(context.stateGame.gameType)) return;
		if (musicBoostTimer) { clearTimeout(musicBoostTimer); musicBoostTimer = null; }
		sound.fade({ name: currentMusic, from: BASE_MUSIC_VOL, to: WIN_BOOST_VOL, duration: 500 });
		musicBoostTimer = setTimeout(() => {
			musicBoostTimer = null;
			fadeMusicToBase();
		}, 12000);
	};

	const crossfadeMusic = (name: MusicName, duration: number) => {
		// Skip if the target music is already playing
		if (name === currentMusic) {
			return;
		}
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

		// After the fade-out completes, stop all other tracks then start the new one.
		// Stopping is critical — fade only sets volume to 0 but the loop keeps running
		// silently. Without stop(), multiple instances accumulate across bonus entries/exits
		// and double up when a track is "restarted" (new play + old silent loop = audible doubling).
		crossfadeTimerId = setTimeout(() => {
			crossfadeTimerId = null;
			const allBgm: MusicName[] = ['bgm_main', 'bgm_freespin', 'bgm_bonus_intro', 'bgm_bonus_exit', 'bgm_intro'];
			for (const track of allBgm) {
				if (track !== name) sound.stop({ name: track });
			}
			currentMusic = name;
			sound.players.music.play({ name });
			initMusicVolume(name);
		}, duration);
	};

	context.eventEmitter.subscribeOnMount({
		// ui
		soundBetMode: async ({ betModeKey }) => {
			cancelIntroTimer();
			sound.stop({ name: 'bgm_main' });
			sound.stop({ name: 'bgm_freespin' });
			sound.stop({ name: 'bgm_bonus_intro' });
			sound.stop({ name: 'bgm_bonus_exit' });
			sound.stop({ name: 'bgm_intro' });
			if (betModeKey === 'SUPERSPIN') {
				// check if SUPERSPIN, when changing the bet mode.
				sound.players.once.play({ name: 'sfx_winlevel_end' });
				await waitForTimeout(SECOND);
				currentMusic = 'bgm_freespin';
				sound.players.music.play({ name: 'bgm_freespin' });
				initMusicVolume('bgm_freespin');
			} else {
				currentMusic = 'bgm_main';
				sound.players.music.play({ name: 'bgm_main' });
				initMusicVolume('bgm_main');
			}
		},
		soundBoostMusicOnWin: () => boostMusicForWin(),
		soundPressGeneral: () => sound.players.once.play({ name: 'sfx_btn_general' }),
		soundPressBet: () => sound.players.once.play({ name: 'sfx_btn_spin' }),
		// scatterCounter
		soundScatterCounterIncrease: () => (context.stateGame.scatterCounter = context.stateGame.scatterCounter + 1), // prettier-ignore
		soundScatterCounterClear: () => (context.stateGame.scatterCounter = 0),
		// game
		soundMusic: ({ name }) => {
			cancelIntroTimer();
			const allBgm: MusicName[] = ['bgm_main', 'bgm_freespin', 'bgm_bonus_intro', 'bgm_bonus_exit', 'bgm_intro'];
			for (const track of allBgm) {
				if (track !== name) sound.stop({ name: track });
			}
			currentMusic = name;
			sound.players.music.play({ name });
			initMusicVolume(name);
		},
		soundMusicCrossfade: ({ name, duration }) => crossfadeMusic(name, duration),
		soundLoop: ({ name }) => sound.players.loop.play({ name }),
		soundOnce: ({ name, forcePlay }) => {
			sound.players.once.play({ name, forcePlay });
		},
		soundOnceWithRate: ({ name, rate, volume }) => {
			// Bypass the player wrapper to capture soundId for rate + volume control.
			// Multiply by volumeSoundEffect() so the SFX slider is respected.
			const id = sound.players.once.howl.play(name);
			sound.players.once.howl.rate(rate, id);
			const sfxVol = stateSoundDerived.volumeSoundEffect();
			sound.players.once.howl.volume((volume ?? 1) * sfxVol, id);
		},
		soundStop: ({ name }) => {
			sound.stop({ name });
		},
		soundFade: async ({ name, duration, from, to }) => await sound.fade({ name, duration, from, to }), // prettier-ignore
	});

	/** Whether the intro→loop handoff is still active (can be cancelled on bonus trigger) */
	let introEndActive = false;
	/** The Howler soundId of the playing bgm_intro instance, used to scope the end listener */
	let introSoundId: number | null = null;

	/** Cancel the intro→loop handoff (e.g. when bonus triggers before intro finishes) */
	const cancelIntroTimer = () => {
		if (introEndActive) {
			introEndActive = false;
			if (introSoundId !== null) {
				sound.players.once.howl.stop(introSoundId);
				introSoundId = null;
			}
		}
	};

	onMount(() => {
		if (stateBet.activeBetModeKey === 'SUPERSPIN') {
			currentMusic = 'bgm_freespin';
			sound.players.music.play({ name: 'bgm_freespin' });
			initMusicVolume('bgm_freespin');
		} else {
			currentMusic = 'bgm_intro';
			introEndActive = true;
			// Play bgm_intro directly via the howl to capture its soundId.
			// Using the soundId scopes the 'end' listener to ONLY this specific
			// instance — without it, every sfx_reel_stop / scatter / etc. that
			// ends on the shared once howl would also fire the callback.
			introSoundId = sound.players.once.howl.play('bgm_intro');
			sound.players.once.howl.once('end', function onIntroEnd() {
				if (!introEndActive) return;
				introEndActive = false;
				introSoundId = null;
				currentMusic = 'bgm_main';
				sound.players.music.play({ name: 'bgm_main' });
			}, introSoundId);
		}
	});
</script>
