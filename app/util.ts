const LINES = {
	midnight: ["go sleep!", "get some rest!", "time to recharge!"],
	morning: [
		"have a great day!",
		"make the most of it!",
		"let's get this ball rolling",
		"up-up and away!",
	],
	midday: ["WOOOOAH, we're half-way the-ere!", "did you cook yet?"],
	afternoon: [
		"go grab a coffee, you deserve it",
		"is it too late for a drink?",
	],
	evening: ["the night is still young!", "enjoy your evening!"],
};

const BREAKPOINTS = {
	morning: 5 * 60 * 60 * 1000 + 30 * 60 * 1000, // 5:30
	midday: 10 * 60 * 60 * 1000 + 31 * 60 * 1000, // 10:31
	afternoon: 16 * 60 * 60 * 1000 + 31 * 60 * 1000, // 16:31
	evening: 20 * 60 * 60 * 1000 + 1 * 60 * 1000, // 20:01
};

export function getLine() {
	const now = new Date();
	const today = new Date().setHours(0, 0, 0, 0);
	const moment = now.valueOf() - today;

	if (moment < BREAKPOINTS.morning) {
		return LINES.midnight[
			Math.floor(Math.random() * LINES.midnight.length)
		];
	}
	if (moment >= BREAKPOINTS.morning && moment < BREAKPOINTS.midday) {
		return LINES.morning[Math.floor(Math.random() * LINES.morning.length)];
	}

	if (moment >= BREAKPOINTS.midday && moment < BREAKPOINTS.afternoon) {
		return LINES.midday[Math.floor(Math.random() * LINES.midday.length)];
	}

	if (moment >= BREAKPOINTS.afternoon && moment < BREAKPOINTS.evening) {
		return LINES.afternoon[
			Math.floor(Math.random() * LINES.afternoon.length)
		];
	}

	if (moment >= BREAKPOINTS.evening) {
		return LINES.evening[Math.floor(Math.random() * LINES.evening.length)];
	}

	return "huh, an edge-case? wow";
}

export function fmtTime(date: Date): string {
	return `${date.getHours().toString().padStart(2, "0")}:${date
		.getMinutes()
		.toString()
		.padStart(2, "0")}`;
}

export interface EventData {
	summary: string;
	start: Date;
	end: Date;
}
