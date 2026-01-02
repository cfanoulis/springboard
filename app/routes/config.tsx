import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import { getBgClass } from "~/util";
import type { Route } from "./+types/config";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Springboard - New install" },
		{ name: "description", content: "Generates a new installation ID." },
	];
}

export function clientLoader() {
	const configStr =
		localStorage.getItem("sb-config") ??
		'{"username":"","calendarUrl":"","showSeconds":true}';

	return JSON.parse(configStr) as {
		username: string;
		calendarUrl: string;
		showSeconds: boolean;
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	useEffect(() => {
		const username = ((
			document.getElementById("username") as HTMLInputElement
		).value = loaderData.username);
		const calendarUrl = ((
			document.getElementById("calendar") as HTMLInputElement
		).value = loaderData.calendarUrl);
		const showSeconds = ((
			document.getElementById("seconds") as HTMLInputElement
		).checked = loaderData.showSeconds);
	});

	const nav = useNavigate();
	const [_, setConfig, resetConfig] = useLocalStorage("sb-config", {
		username: "",
		calendarUrl: "",
		showSeconds: true,
	});

	const submitSettings = () => {
		const username =
			(document.getElementById("username") as HTMLInputElement).value ??
			"";
		const calendarUrl =
			(document.getElementById("calendar") as HTMLInputElement).value ??
			"";
		const showSeconds =
			(document.getElementById("seconds") as HTMLInputElement).checked ??
			false;

		setConfig({ username, calendarUrl, showSeconds });
	};

	return (
		<main
			className={`${getBgClass()} h-screen flex flex-col items-center justify-center md:flex-row-reverse md:items-center md:justify-center`}
		>
			<div className="md:w-4/10 text-left inline-block">
				<h1 className="text-xl font-bold md:text-6xl flex-row ">
					Make your Springboard <i>yours.</i>
				</h1>
			</div>
			<div className="md:w-2/5 p-8">
				<label htmlFor="username">Your name </label>
				<input
					type="text"
					placeholder="Anakin"
					id="username"
					className="border-b-2 border-gray-200"
				/>
				<br />{" "}
				<label htmlFor="calendar">Your Google calendar is </label>
				<input
					type="text"
					placeholder="https://calendar.google.com"
					id="calendar"
					className="border-b-2 border-gray-200"
				/>
				<br /> <label htmlFor="seconds">Show seconds </label>
				<input
					type="checkbox"
					id="seconds"
					className="border-b-2 border-gray-200"
				/>
				<br />
				<div className="flex mt-4">
					<button
						className="bg-amber-600 mr-2 p-1"
						onClick={() => {
							submitSettings();
							nav("/");
						}}
					>
						Save &gt;
					</button>
					<button
						className="bg-red-600 p-1"
						onClick={(e) => {
							if (
								!window.confirm(
									"Are you sure you want to reset all settings?",
								)
							)
								return;
							resetConfig();
							nav("/config");
						}}
					>
						Reset &gt;
					</button>
				</div>
			</div>
		</main>
	);
}
