export default {
	// ── Core UI labels ──
	HOME: 'HOME',
	BET: 'BET',
	'TOTAL BET': 'TOTAL BET',
	BALANCE: 'BALANCE',
	WIN: 'WIN',
	BUY: 'BUY',
	'BUY BONUS': 'BUY BONUS',
	'SELECT YOUR BET': 'SELECT YOUR BET',
	'AUTO SPINS': 'AUTO SPINS',
	'LOSS LIMIT': 'LOSS LIMIT',
	'SINGLE WIN LIMIT': 'SINGLE WIN LIMIT',

	// ── Pre-game showcase ──
	'WIN UP TO 25,000 X BET': 'WIN UP TO 25,000 X BET',

	// ── Game info page — tab labels & headings ──
	Paytable: 'Paytable',
	Features: 'Features',
	Controls: 'Controls',
	Rules: 'Rules',
	'Bet Modes': 'Bet Modes',
	Disclaimer: 'Disclaimer',
	'High Pay Symbols': 'High Pay Symbols',
	'Low Pay Symbols': 'Low Pay Symbols',
	'Bet Adjust': 'Bet Adjust',
	'Bet Cost': 'Bet Cost',
	'Buy Feature': 'Buy Feature',
	'Buy Bonus': 'Buy Bonus',
	'Bet Replay': 'Bet Replay',
	Standard: 'Standard',
	'Extra Chance': 'Extra Chance',
	Mode: 'Mode',
	'Starting Multiplier': 'Starting Multiplier',
	Description: 'Description',
	Costs: 'Costs',

	// ── Game info page — paytable ──
	'All values shown are multiplied by the total bet.':
		'All values shown are multiplied by the total bet.',
	'A cluster must contain at least 5 matching symbols to pay.':
		'A cluster must contain at least 5 matching symbols to pay.',

	// ── Game info page — special symbols ──
	'Substitutes for all paying symbols. Does not replace Bonus or Super Bonus symbols. Wilds only appear through the Aurora Feature.':
		'Substitutes for all paying symbols. Does not replace Bonus or Super Bonus symbols. Wilds only appear through the Aurora Feature.',

	// ── Game info page — tumble feature steps ──
	'All clusters on the grid are evaluated and paid.':
		'All clusters on the grid are evaluated and paid.',
	'Symbols that formed part of a paying cluster are removed.':
		'Symbols that formed part of a paying cluster are removed.',
	'Remaining symbols fall downward to fill empty spaces.':
		'Remaining symbols fall downward to fill empty spaces.',
	'New symbols drop in from the top of each column.':
		'New symbols drop in from the top of each column.',
	'This repeats until no new paying clusters are formed.':
		'This repeats until no new paying clusters are formed.',

	// ── Game info page — cell multipliers ──
	"When calculating a cluster's payout, the multipliers of all cells in that cluster with an active multiplier are added together, and the total is applied to the base pay. If no cells in the cluster have an active multiplier, only the base pay applies.":
		"When calculating a cluster's payout, the multipliers of all cells in that cluster with an active multiplier are added together, and the total is applied to the base pay. If no cells in the cluster have an active multiplier, only the base pay applies.",

	// ── Game info page — aurora feature ──
	'When a paying cluster forms on a cell marked as Aurora, the Aurora cell activates and generates 1 to 3 Wild symbols as pending.':
		'When a paying cluster forms on a cell marked as Aurora, the Aurora cell activates and generates 1 to 3 Wild symbols as pending.',
	'Pending Wilds are not placed immediately. Tumbles continue until no further clusters form, at which point all pending Wilds are placed onto the board, replacing paying symbols only.':
		'Pending Wilds are not placed immediately. Tumbles continue until no further clusters form, at which point all pending Wilds are placed onto the board, replacing paying symbols only.',

	// ── Game info page — aurora collection ──
	'When Aurora cells activate and place Wilds on the grid, any placed Wild that becomes part of a paying cluster is added to the collection.':
		'When Aurora cells activate and place Wilds on the grid, any placed Wild that becomes part of a paying cluster is added to the collection.',
	'After all Bonus spins are completed, a Final Aurora Spin occurs: a fresh board is dealt using only paying symbols (no Bonus, Super Bonus, or Wild symbols can appear). All collected Wilds are then placed onto this board. Cell multipliers from the Bonus Round carry into this spin, and a full tumble sequence plays out.':
		'After all Bonus spins are completed, a Final Aurora Spin occurs: a fresh board is dealt using only paying symbols (no Bonus, Super Bonus, or Wild symbols can appear). All collected Wilds are then placed onto this board. Cell multipliers from the Bonus Round carry into this spin, and a full tumble sequence plays out.',

	// ── Game info page — controls section ──
	'Starts a spin using the current bet amount. Press again during a spin to skip animations.':
		'Starts a spin using the current bet amount. Press again during a spin to skip animations.',
	'Increase or decrease the bet amount per spin. The total cost is shown in the bet display.':
		'Increase or decrease the bet amount per spin. The total cost is shown in the bet display.',
	'Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or buy directly into a bonus round.':
		'Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or buy directly into a bonus round.',
	'Displays the total cost of the current spin, including any active bet mode modifiers.':
		'Displays the total cost of the current spin, including any active bet mode modifiers.',
	'Shows the total win amount for the current spin, including all tumble payouts.':
		'Shows the total win amount for the current spin, including all tumble payouts.',

	// ── Game info page — rules section ──
	'5 or more matching symbols connected horizontally or vertically form a paying cluster. Diagonal connections do not count.':
		'5 or more matching symbols connected horizontally or vertically form a paying cluster. Diagonal connections do not count.',
	'Each paying symbol can only belong to one cluster. Wilds are the exception and can be shared across all adjacent clusters they connect.':
		'Each paying symbol can only belong to one cluster. Wilds are the exception and can be shared across all adjacent clusters they connect.',
	'Bonus and Super Bonus symbols are evaluated before tumbles begin. They do not need to form a cluster.':
		'Bonus and Super Bonus symbols are evaluated before tumbles begin. They do not need to form a cluster.',
	'All payouts from a single spin, including tumbles and any triggered Bonus Round, are combined into one total amount.':
		'All payouts from a single spin, including tumbles and any triggered Bonus Round, are combined into one total amount.',
	'The maximum payout per spin is capped at':
		'The maximum payout per spin is capped at',
	'the total bet. If this cap is reached during tumbles, remaining tumbles are skipped.':
		'the total bet. If this cap is reached during tumbles, remaining tumbles are skipped.',
	'Cluster payouts use the paytable value for sizes up to 20. Clusters larger than 20 symbols use the same value as 20.':
		'Cluster payouts use the paytable value for sizes up to 20. Clusters larger than 20 symbols use the same value as 20.',

	// ── Game info page — bet modes section ──
	'Default gameplay at the standard bet cost. All cell multipliers start at 1x. No additional modifiers are applied.':
		'Default gameplay at the standard bet cost. All cell multipliers start at 1x. No additional modifiers are applied.',
	'the standard bet. Bonus symbols appear more frequently, and a Bonus symbol is guaranteed on the last reel each spin. This significantly increases the chance of triggering a Bonus Round.':
		'the standard bet. Bonus symbols appear more frequently, and a Bonus symbol is guaranteed on the last reel each spin. This significantly increases the chance of triggering a Bonus Round.',
	'the standard bet. A trigger spin is played with 3 or more Bonus symbols guaranteed on the grid. The trigger spin plays out fully, including all tumbles, before entering the Bonus or Super Bonus Round. Spins awarded are determined by the standard trigger tables.':
		'the standard bet. A trigger spin is played with 3 or more Bonus symbols guaranteed on the grid. The trigger spin plays out fully, including all tumbles, before entering the Bonus or Super Bonus Round. Spins awarded are determined by the standard trigger tables.',
	'These modes set a starting multiplier for every cell on the grid. The higher the starting multiplier, the higher the bet cost. In the base game, multipliers reset to the selected level at the start of each spin. In Bonus and Super Bonus Rounds, multipliers persist and accumulate from the selected starting level.':
		'These modes set a starting multiplier for every cell on the grid. The higher the starting multiplier, the higher the bet cost. In the base game, multipliers reset to the selected level at the start of each spin. In Bonus and Super Bonus Rounds, multipliers persist and accumulate from the selected starting level.',

	// ── Game info page — disclaimer ──
	'Malfunction voids all wins and bets. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many rounds. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.':
		'Malfunction voids all wins and bets. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many rounds. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.',

	// ── Buy bonus / cost labels ──
	'will be deducted from your balance': 'will be deducted from your balance',
};
