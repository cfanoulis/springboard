import type { Route } from "./+types/config";
import { getConfig, updateConfig } from "~/config.server";

export async function loader() {
	const config = await getConfig();
	return new Response(JSON.stringify(config), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function action({ request }: Route.ActionArgs) {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	try {
		const updates = await request.json();

		// Validate the updates object
		if (typeof updates !== "object" || updates === null) {
			return new Response(
				JSON.stringify({ error: "Invalid request body" }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// Validate field types if provided
		const validatedUpdates: Partial<{
			userName: string;
			calendarUrl: string;
			nowPlayingTrack: string;
			nowPlayingArtist: string;
		}> = {};

		if ("userName" in updates && typeof updates.userName === "string") {
			validatedUpdates.userName = updates.userName;
		}
		if (
			"calendarUrl" in updates &&
			typeof updates.calendarUrl === "string"
		) {
			validatedUpdates.calendarUrl = updates.calendarUrl;
		}
		if (
			"nowPlayingTrack" in updates &&
			typeof updates.nowPlayingTrack === "string"
		) {
			validatedUpdates.nowPlayingTrack = updates.nowPlayingTrack;
		}
		if (
			"nowPlayingArtist" in updates &&
			typeof updates.nowPlayingArtist === "string"
		) {
			validatedUpdates.nowPlayingArtist = updates.nowPlayingArtist;
		}

		const newConfig = await updateConfig(validatedUpdates);
		return new Response(JSON.stringify(newConfig), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to update config" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
