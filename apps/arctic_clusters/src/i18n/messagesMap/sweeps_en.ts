/**
 * Sweeps / Social Casino language overrides (sweeps_en)
 *
 * When ?social=true, these phrases replace the default en translations
 * to comply with US jurisdiction requirements that prohibit gambling terminology.
 *
 * Restricted terms → replacement terms per the compliance table.
 */
export default {
	// ── Core UI labels ──
	BET: 'PLAY',
	'TOTAL BET': 'TOTAL PLAY',
	BALANCE: 'BALANCE',
	WIN: 'WIN',
	STAKE: 'PLAY AMOUNT',

	// ── Buttons / actions ──
	'BUY BONUS': 'GET BONUS',
	'BUY SUPER BONUS': 'GET SUPER BONUS',
	BUY: 'PLAY',
	PURCHASE: 'PLAY',
	ACTIVATE: 'ACTIVATE',
	'PLAY BONUS': 'GET BONUS',

	// ── Bet modes ──
	'BET MODES': 'PLAY MODES',
	'ANTE BET': 'ANTE PLAY',
	'STANDARD MODE': 'STANDARD MODE',

	// ── Game info / rules ──
	'All pays are multiplied by total bet. Minimum cluster size: 5 symbols.':
		'All wins are multiplied by total play. Minimum cluster size: 5 symbols.',
	'Normal gameplay at 1x bet cost. All cell multipliers start at 1x.':
		'Normal gameplay at 1x play cost. All cell multipliers start at 1x.',
	'Costs <strong>2.5x</strong> the standard bet. Significantly increases the chance of triggering Free Spins. One Scatter is guaranteed on the grid each spin.':
		'For <strong>2.5x</strong> the standard play. Significantly increases the chance of triggering Free Spins. One Scatter is guaranteed on the grid each spin.',
	'Costs <strong>100x</strong> the standard bet. Instantly triggers <strong>8 Free Spins</strong>, skipping the base game entirely.':
		'For <strong>100x</strong> the standard play. Instantly triggers <strong>8 Free Spins</strong>, skipping the base game entirely.',
	'Maximum win per spin is capped at <strong>25,000x</strong> the bet. If the cap is reached, remaining tumbles are stopped.':
		'Maximum win per spin is capped at <strong>25,000x</strong> the play. If the cap is reached, remaining tumbles are stopped.',
	'Start every cell at a higher multiplier for an increased bet cost. All wins benefit from amplified multipliers from the very first tumble.':
		'Start every cell at a higher multiplier for an increased play cost. All wins benefit from amplified multipliers from the very first tumble.',

	// ── Buy bonus modal ──
	'Extra chance to trigger the bonus each spin.':
		'Extra chance to trigger the bonus each spin.',
	'Instantly trigger the free spins bonus round.':
		'Instantly trigger the free spins bonus round.',
	'Trigger the enhanced free spins with higher multipliers.':
		'Trigger the enhanced free spins with higher multipliers.',

	// ── Paytable ──
	'Bet Cost': 'Play Cost',
	'BET COST': 'PLAY COST',

	// ── Currency / money terms ──
	CASH: 'COINS',
	MONEY: 'COINS',
	CREDIT: 'BALANCE',
	CURRENCY: 'TOKEN',
	FUND: 'BALANCE',

	// ── Misc gambling terms ──
	GAMBLE: 'PLAY',
	WAGER: 'PLAY',
	DEPOSIT: 'GET COINS',
	WITHDRAW: 'REDEEM',
	REBET: 'RESPIN',
	BETTING: 'PLAYING',
	'BONUS BUY': 'BONUS',
};
