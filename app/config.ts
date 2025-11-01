import KeyvSqlite from "@keyv/sqlite";
import Keyv from "keyv";

export interface SpringboardConfig {
	displayName: string;
	calLink: string;
	showSeconds: string;
}

const DBFILE = process.env.DBFILE || "./.runtime/springboard.sqlite";
const db = new Keyv(new KeyvSqlite(`sqlite://${DBFILE}`), {
	namespace: "sb_config",
});

db.on("error", (e) => console.error("Keyv connection error:", e));

export async function getConfig(
	installId: string,
	key: keyof SpringboardConfig,
): Promise<SpringboardConfig[typeof key] | undefined> {
	return db.get(`${installId}:${key}`);
}

export async function setConfig(
	installId: string,
	key: keyof SpringboardConfig,
	value: SpringboardConfig[typeof key],
): Promise<void> {
	const result = await db.set(`${installId}:${key}`, value);
	if (!result) throw new Error("Unknown error when saving setting");
}

export async function newInstall(userName: string): Promise<string> {
	const installId = crypto.randomUUID();
	await setConfig(installId, "displayName", userName);
	return installId;
}

export async function deleteInstall(installId: string): Promise<void> {
	await db.deleteMany([
		`${installId}:name`,
		`${installId}:calLink`,
		`${installId}:showSeconds`,
	]);
}
