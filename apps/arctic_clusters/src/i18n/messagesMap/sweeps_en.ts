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

	// ── Game info page — tab labels & headings ──
	'Paytable': 'Win Table',
	'Bet Modes': 'Play Modes',
	'High Pay Symbols': 'High Win Symbols',
	'Low Pay Symbols': 'Low Win Symbols',
	'Bet Adjust': 'Play Adjust',
	'Buy Feature': 'Get Feature',
	'Buy Bonus': 'Get Bonus',
	'Bet Cost': 'Play Amount',
	'Costs': 'For',
	'Standard': 'Standard',
	'Extra Chance': 'Extra Chance',

	// ── Game info page — paytable section ──
	'All values shown are multiplied by the total bet.':
		'All values shown are multiplied by the total play amount.',
	'A cluster must contain at least 5 matching symbols to pay.':
		'A cluster must contain at least 5 matching symbols to win.',

	// ── Game info page — special symbols ──
	'Substitutes for all paying symbols. Does not replace Bonus or Super Bonus symbols. Wilds only appear through the Aurora Feature.':
		'Substitutes for all winning symbols. Does not replace Bonus or Super Bonus symbols. Wilds only appear through the Aurora Feature.',

	// ── Game info page — tumble feature steps ──
	'All clusters on the grid are evaluated and paid.':
		'All clusters on the grid are evaluated and won.',
	'Symbols that formed part of a paying cluster are removed.':
		'Symbols that formed part of a winning cluster are removed.',
	'Remaining symbols fall downward to fill empty spaces.':
		'Remaining symbols fall downward to fill empty spaces.',
	'New symbols drop in from the top of each column.':
		'New symbols drop in from the top of each column.',
	'This repeats until no new paying clusters are formed.':
		'This repeats until no new winning clusters are formed.',

	// ── Game info page — cell multipliers ──
	"When calculating a cluster's payout, the multipliers of all cells in that cluster with an active multiplier are added together, and the total is applied to the base pay. If no cells in the cluster have an active multiplier, only the base pay applies.":
		"When calculating a cluster's win, the multipliers of all cells in that cluster with an active multiplier are added together, and the total is applied to the base win. If no cells in the cluster have an active multiplier, only the base win applies.",

	// ── Game info page — aurora feature ──
	'When a paying cluster forms on a cell marked as Aurora, the Aurora cell activates and generates 1 to 3 Wild symbols as pending.':
		'When a winning cluster forms on a cell marked as Aurora, the Aurora cell activates and generates 1 to 3 Wild symbols as pending.',
	'Pending Wilds are not placed immediately. Tumbles continue until no further clusters form, at which point all pending Wilds are placed onto the board, replacing paying symbols only.':
		'Pending Wilds are not placed immediately. Tumbles continue until no further clusters form, at which point all pending Wilds are placed onto the board, replacing winning symbols only.',

	// ── Game info page — aurora collection ──
	'When Aurora cells activate and place Wilds on the grid, any placed Wild that becomes part of a paying cluster is added to the collection.':
		'When Aurora cells activate and place Wilds on the grid, any placed Wild that becomes part of a winning cluster is added to the collection.',
	'After all Bonus spins are completed, a Final Aurora Spin occurs: a fresh board is dealt using only paying symbols (no Bonus, Super Bonus, or Wild symbols can appear). All collected Wilds are then placed onto this board. Cell multipliers from the Bonus Round carry into this spin, and a full tumble sequence plays out.':
		'After all Bonus spins are completed, a Final Aurora Spin occurs: a fresh board is generated using only winning symbols (no Bonus, Super Bonus, or Wild symbols can appear). All collected Wilds are then placed onto this board. Cell multipliers from the Bonus Round carry into this spin, and a full tumble sequence plays out.',

	// ── Game info page — controls section ──
	'Starts a spin using the current bet amount. Press again during a spin to skip animations.':
		'Starts a spin using the current play amount. Press again during a spin to skip animations.',
	'Increase or decrease the bet amount per spin. The total cost is shown in the bet display.':
		'Increase or decrease the play amount per spin. The total amount is shown in the play display.',
	'Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or buy directly into a bonus round.':
		'Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or play directly into a bonus round.',
	'Displays the total cost of the current spin, including any active bet mode modifiers.':
		'Displays the total amount of the current spin, including any active play mode modifiers.',
	'Shows the total win amount for the current spin, including all tumble payouts.':
		'Shows the total win amount for the current spin, including all tumble wins.',

	// ── Game info page — rules section ──
	'5 or more matching symbols connected horizontally or vertically form a paying cluster. Diagonal connections do not count.':
		'5 or more matching symbols connected horizontally or vertically form a winning cluster. Diagonal connections do not count.',
	'Each paying symbol can only belong to one cluster. Wilds are the exception and can be shared across all adjacent clusters they connect.':
		'Each winning symbol can only belong to one cluster. Wilds are the exception and can be shared across all adjacent clusters they connect.',
	'Bonus and Super Bonus symbols are evaluated before tumbles begin. They do not need to form a cluster.':
		'Bonus and Super Bonus symbols are evaluated before tumbles begin. They do not need to form a cluster.',
	'All payouts from a single spin, including tumbles and any triggered Bonus Round, are combined into one total amount.':
		'All wins from a single spin, including tumbles and any triggered Bonus Round, are combined into one total amount.',
	'The maximum payout per spin is capped at':
		'The maximum win per spin is capped at',
	'the total bet. If this cap is reached during tumbles, remaining tumbles are skipped.':
		'the total play amount. If this cap is reached during tumbles, remaining tumbles are skipped.',
	'Cluster payouts use the paytable value for sizes up to 20. Clusters larger than 20 symbols use the same value as 20.':
		'Cluster wins use the win table value for sizes up to 20. Clusters larger than 20 symbols use the same value as 20.',

	// ── Game info page — bet modes section ──
	'Default gameplay at the standard bet cost. All cell multipliers start at 1x. No additional modifiers are applied.':
		'Default gameplay at the standard play amount. All cell multipliers start at 1x. No additional modifiers are applied.',
	'the standard bet. Bonus symbols appear more frequently, and a Bonus symbol is guaranteed on the last reel each spin. This significantly increases the chance of triggering a Bonus Round.':
		'the standard play amount. Bonus symbols appear more frequently, and a Bonus symbol is guaranteed on the last reel each spin. This significantly increases the chance of triggering a Bonus Round.',
	'the standard bet. A trigger spin is played with 3 or more Bonus symbols guaranteed on the grid. The trigger spin plays out fully, including all tumbles, before entering the Bonus or Super Bonus Round. Spins awarded are determined by the standard trigger tables.':
		'the standard play amount. A trigger spin is played with 3 or more Bonus symbols guaranteed on the grid. The trigger spin plays out fully, including all tumbles, before entering the Bonus or Super Bonus Round. Spins awarded are determined by the standard trigger tables.',
	'These modes set a starting multiplier for every cell on the grid. The higher the starting multiplier, the higher the bet cost. In the base game, multipliers reset to the selected level at the start of each spin. In Bonus and Super Bonus Rounds, multipliers persist and accumulate from the selected starting level.':
		'These modes set a starting multiplier for every cell on the grid. The higher the starting multiplier, the higher the play amount. In the base game, multipliers reset to the selected level at the start of each spin. In Bonus and Super Bonus Rounds, multipliers persist and accumulate from the selected starting level.',

	// ── Game info page — disclaimer ──
	'Malfunction voids all wins and bets. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many rounds. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.':
		'Malfunction voids all wins and plays. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many plays. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.',

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
