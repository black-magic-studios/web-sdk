import { createAsset } from 'pixi-svelte';

// UI elements atlas (Frame_Tumble, Frame_TumbleWin, Frame_FSCounter, etc.)
import img from './reels_frame.png';
import atlas from './reels_frame.json';

export default createAsset({ img, atlas });
