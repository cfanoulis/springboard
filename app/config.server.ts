import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";

// Initialize Keyv with SQLite backend
const keyv = new Keyv({
	store: new KeyvSqlite("sqlite://./config.sqlite"),
	namespace: "springboard",
});

// Error handling
keyv.on("error", (err) => console.error("Keyv connection error:", err));

export interface Config {
	userName: string;
	calendarUrl: string;
	nowPlayingTrack?: string;
	nowPlayingArtist?: string;
}

// Default configuration values
const DEFAULT_CONFIG: Config = {
	userName: "User",
	calendarUrl: process.env.CAL_URL || "",
	nowPlayingTrack: "",
	nowPlayingArtist: "",
};

/**
 * Get all configuration settings
 */
export async function getConfig(): Promise<Config> {
	const storedConfig = await keyv.get("config");
	if (!storedConfig) {
		// Initialize with defaults on first run
		await keyv.set("config", DEFAULT_CONFIG);
		return DEFAULT_CONFIG;
	}
	return { ...DEFAULT_CONFIG, ...storedConfig };
}

/**
 * Update configuration settings
 */
export async function updateConfig(updates: Partial<Config>): Promise<Config> {
	const currentConfig = await getConfig();
	const newConfig = { ...currentConfig, ...updates };
	await keyv.set("config", newConfig);
	return newConfig;
}

/**
 * Reset configuration to defaults
 */
export async function resetConfig(): Promise<Config> {
	await keyv.set("config", DEFAULT_CONFIG);
	return DEFAULT_CONFIG;
}
