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
	'SELECT YOUR BET': 'SELECT YOUR PLAY',

	// ── Buttons / actions ──
	'BUY BONUS': 'GET BONUS',
	'BUY SUPER BONUS': 'GET SUPER BONUS',
	BUY: 'GET',
	PURCHASE: 'PLAY',
	ACTIVATE: 'ACTIVATE',
	'PLAY BONUS': 'GET BONUS',
	'CONFIRM PURCHASE': 'CONFIRM SELECTION',

	// ── Bet modes ──
	'BET MODES': 'PLAY MODES',
	'ANTE BET': 'ANTE PLAY',
	'STANDARD MODE': 'STANDARD MODE',

	// ── Game info / rules ──
	'All pays are multiplied by total bet. Minimum cluster size: 5 symbols.':
		'All wins are multiplied by total play. Minimum cluster size: 5 symbols.',
	'Normal gameplay at 1x bet cost. All cell multipliers start at 1x.':
		'Normal gameplay at 1x play amount. All cell multipliers start at 1x.',
	'Costs <strong>2.5x</strong> the standard bet. Significantly increases the chance of triggering Free Spins. One Scatter is guaranteed on the grid each spin.':
		'For <strong>2.5x</strong> the standard play. Significantly increases the chance of triggering Free Spins. One Scatter is guaranteed on the grid each spin.',
	'Costs <strong>100x</strong> the standard bet. Instantly triggers <strong>8 Free Spins</strong>, skipping the base game entirely.':
		'For <strong>100x</strong> the standard play. Instantly triggers <strong>8 Free Spins</strong>, skipping the base game entirely.',
	'Maximum win per spin is capped at <strong>25,000x</strong> the bet. If the cap is reached, remaining tumbles are stopped.':
		'Maximum win per spin is capped at <strong>25,000x</strong> the play. If the cap is reached, remaining tumbles are stopped.',
	'Start every cell at a higher multiplier for an increased bet cost. All wins benefit from amplified multipliers from the very first tumble.':
		'Start every cell at a higher multiplier for an increased play amount. All wins benefit from amplified multipliers from the very first tumble.',

	// ── Buy bonus modal ──
	'Extra chance to trigger the bonus each spin.':
		'Extra chance to trigger the bonus each spin.',
	'Instantly trigger the free spins bonus round.':
		'Instantly trigger the free spins bonus round.',
	'Trigger the enhanced free spins with higher multipliers.':
		'Trigger the enhanced free spins with higher multipliers.',

	// ── Paytable ──
	'Bet Cost': 'Play Amount',
	'BET COST': 'PLAY AMOUNT',

	// ── Currency / money terms ──
	CASH: 'COINS',
	MONEY: 'COINS',
	CREDIT: 'BALANCE',
	CURRENCY: 'TOKEN',
	FUND: 'BALANCE',
	FUNDS: 'TOKENS',

	// ── Misc gambling terms ──
	GAMBLE: 'PLAY',
	WAGER: 'PLAY',
	DEPOSIT: 'GET COINS',
	WITHDRAW: 'REDEEM',
	REBET: 'RESPIN',
	BETTING: 'PLAYING',
	'BONUS BUY': 'BONUS',

	// ── Autoplay / notification messages ──
	'INSUFFICIENT FUNDS TO PLACE THIS BET. PLEASE ADD FUNDS TO YOUR ACCOUNT OR LOWER THE BET LEVEL.':
		'INSUFFICIENT TOKENS TO PLACE THIS PLAY. PLEASE ADD TOKENS TO YOUR ACCOUNT OR LOWER THE PLAY LEVEL.',
	'AUTO PLAY HAS STOPPED DUE TO': 'AUTO PLAY HAS STOPPED DUE TO',
	NOTIFICATION: 'NOTIFICATION',
	'AUTO SPINS': 'AUTO SPINS',
	'LOSS LIMIT': 'COIN DECREASE LIMIT',
	'SINGLE WIN LIMIT': 'SINGLE WIN LIMIT',
	'LOSS LIMIT REACHED': 'LOSS LIMIT REACHED',
	'SINGLE WIN LIMIT REACHED': 'SINGLE WIN LIMIT REACHED',

	// ── Payout / win related ──
	'PAY OUT': 'WIN / WON',
	'PAID OUT': 'WIN',
	'PAYS OUT': 'WON',
	PAY: 'WIN',
	PAYS: 'WINS',
	PAID: 'WON',

	// ── Bet-related naming ──
	'TOTAL BET': 'TOTAL PLAY',
	BETS: 'PLAYS',
	'BET LEVEL': 'PLAY LEVEL',
	'BET REPLAY': 'PLAY REPLAY',
	'Bet Replay': 'Play Replay',
	'Base Bet': 'Base Play',
	'Cost Multiplier': 'Feature Multiplier',
	'Payout Multiplier': 'Final Multiplier',
	'Total Bet Cost': 'Total Play Amount',
	'WIN UP TO 25,000 X BET': 'WIN UP TO 25,000 X PLAY',

	// ── Bonus purchase ──
	'Buy Bonus': 'Get Bonus',
	'BUY BONUS': 'GET BONUS',
	BOUGHT: 'INSTANTLY TRIGGERED',
	'AT THE COST OF': 'FOR',
	'COST OF': 'CAN BE PLAYED FOR',

	// ── Other restricted terms ──
	PAYER: 'WINNER',
	'WIN FEATURE': 'PLAY FEATURE',
	'PLACE YOUR BETS': 'COME AND PLAY / JOIN IN THE GAME',
	'will be deducted from your balance': 'will be deducted from your balance',
	'will be the cost per spin': 'will be the play amount per spin',
};
