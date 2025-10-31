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
		const newConfig = await updateConfig(updates);
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
