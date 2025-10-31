import { useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/settings";
import { getConfig } from "~/config.server";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Settings - Springboard" },
		{ name: "description", content: "Configure your Springboard" },
	];
}

export async function loader() {
	const config = await getConfig();
	return config;
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const updates = {
		userName: formData.get("userName") as string,
		calendarUrl: formData.get("calendarUrl") as string,
		nowPlayingTrack: formData.get("nowPlayingTrack") as string,
		nowPlayingArtist: formData.get("nowPlayingArtist") as string,
	};

	// Update config via API
	const response = await fetch(new URL("/config", request.url).toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updates),
	});

	if (!response.ok) {
		throw new Error("Failed to update config");
	}

	return { success: true };
}

export default function Settings({ loaderData }: Route.ComponentProps) {
	const config = loaderData;
	const navigate = useNavigate();
	const [saved, setSaved] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const response = await fetch("/config", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userName: formData.get("userName"),
				calendarUrl: formData.get("calendarUrl"),
				nowPlayingTrack: formData.get("nowPlayingTrack"),
				nowPlayingArtist: formData.get("nowPlayingArtist"),
			}),
		});

		if (response.ok) {
			setSaved(true);
			setTimeout(() => setSaved(false), 3000);
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
			<div className="max-w-2xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold">Settings</h1>
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
					>
						Back to Home
					</button>
				</div>

				<Form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-semibold mb-4">
							Personal Information
						</h2>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="userName"
									className="block text-sm font-medium mb-2"
								>
									Your Name
								</label>
								<input
									type="text"
									id="userName"
									name="userName"
									defaultValue={config.userName}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your name"
								/>
							</div>
						</div>
					</div>

					<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-semibold mb-4">
							Calendar Integration
						</h2>

						<div>
							<label
								htmlFor="calendarUrl"
								className="block text-sm font-medium mb-2"
							>
								iCal URL
							</label>
							<input
								type="url"
								id="calendarUrl"
								name="calendarUrl"
								defaultValue={config.calendarUrl}
								className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="https://calendar.google.com/calendar/ical/..."
							/>
							<p className="mt-2 text-sm text-gray-400">
								Get this from your calendar provider's settings
								(Google Calendar, Outlook, etc.)
							</p>
						</div>
					</div>

					<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-semibold mb-4">
							Now Playing
						</h2>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="nowPlayingTrack"
									className="block text-sm font-medium mb-2"
								>
									Track Name
								</label>
								<input
									type="text"
									id="nowPlayingTrack"
									name="nowPlayingTrack"
									defaultValue={config.nowPlayingTrack}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter track name"
								/>
							</div>

							<div>
								<label
									htmlFor="nowPlayingArtist"
									className="block text-sm font-medium mb-2"
								>
									Artist Name
								</label>
								<input
									type="text"
									id="nowPlayingArtist"
									name="nowPlayingArtist"
									defaultValue={config.nowPlayingArtist}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter artist name"
								/>
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<button
							type="submit"
							className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
						>
							Save Changes
						</button>
					</div>

					{saved && (
						<div className="p-4 bg-green-600 rounded-lg text-center">
							Settings saved successfully!
						</div>
					)}
				</Form>
			</div>
		</main>
	);
}
