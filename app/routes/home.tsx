import { useEffect, useState } from "react";
import { useRevalidator, Link } from "react-router";
import CalendarEntry from "~/components/CalendarEntry";
import UpnextTaskList from "~/components/UpnextTaskList";
import { getBgClass, getLine, type EventData } from "~/util";
import type { Route } from "./+types/home";
import type { Config } from "~/config.server";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Springboard" },
		{ name: "description", content: "Spring into action, every day." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const [calReq, configReq] = await Promise.all([
		fetch("/cal"),
		fetch("/config"),
	]);

	if (!calReq.ok) throw "Failed to fetch calendar data";
	if (!configReq.ok) throw "Failed to fetch config";

	const data = (await calReq.json()) as {
		currentEvent: EventData | null;
		upcomingEvents: EventData[];
	};

	const config = (await configReq.json()) as Config;

	data.upcomingEvents = data.upcomingEvents.map((event) => ({
		...event,
		start: new Date(event.start),
		end: new Date(event.end),
	}));

	if (data.currentEvent) {
		data.currentEvent = {
			...data.currentEvent,
			start: new Date(data.currentEvent.start),
			end: new Date(data.currentEvent.end),
		};
	}

	return { ...data, config };
}

clientLoader.hydrate = true;

export default function Home({ loaderData }: Route.ComponentProps) {
	const [minutes, setMinutes] = useState(new Date().getMinutes());
	const [hours, setHours] = useState(new Date().getHours());
	const [seconds, setSeconds] = useState(new Date().getSeconds());

	const [taskNow, setTaskNow] = useState<{
		status: number;
		data?: EventData;
	}>({ status: -1 });

	const [line, _] = useState(getLine());

	const revalidator = useRevalidator();

	useEffect(() => {
		const int = setInterval(() => {
			const now = new Date();
			setSeconds(now.getSeconds());
			setMinutes(now.getMinutes());
			setHours(now.getHours());

			if (now.getSeconds() === 0 && now.getMinutes() % 15 === 0) {
				revalidator.revalidate();
			}
		}, 1000);

		return () => clearInterval(int);
	}, []);

	useEffect(() => {
		if (!loaderData.currentEvent && loaderData.upcomingEvents.length === 0)
			return setTaskNow({ status: -1 });
		if (!loaderData.currentEvent) return setTaskNow({ status: 0 });
		setTaskNow({ status: 1, data: loaderData.currentEvent });
	}, [minutes]);

	return (
		<main
			className={`${getBgClass()} h-screen flex flex-col items-center justify-center md:flex-row-reverse md:items-center md:justify-center`}
		>
			<div className="md:w-4/10 text-left inline-block">
				<h1 className="text-xl md:text-6xl flex-row ">
					Hey <b>{loaderData.config.userName}</b>, it's{" "}
					<b>
						{hours.toString().padStart(2, "0")}:
						{minutes.toString().padStart(2, "0")}
					</b>
					<span className="text-xl inline pr-2">
						:{seconds.toString().padStart(2, "0")}
					</span>
					<br />
					&mdash; {line}
				</h1>
			</div>
			<div className="md:w-2/5 grid gap-4 p-8">
				{taskNow!.status === -1 && (
					<>
						<h2 className="text-4xl font-bold mb-2">
							Nothing's on your calendar. Enjoy the day!
						</h2>
					</>
				)}
				{taskNow!.status === 0 && (
					<h2 className="text-4xl font-bold mb-2">
						No events for now. Relax!
					</h2>
				)}
				{taskNow!.status === 1 && (
					<>
						<h2 className="text-4xl font-bold mb-2">
							Happening now:
						</h2>
						<CalendarEntry
							key="now"
							summary={taskNow.data!.summary}
							start={taskNow.data!.start}
							end={taskNow.data!.end}
							active
						/>
					</>
				)}
				{taskNow!.status !== -1 && (
					<UpnextTaskList eventData={loaderData.upcomingEvents} />
				)}
				{loaderData.config.nowPlayingTrack &&
					loaderData.config.nowPlayingArtist && (
						<div>
							<p className="text-xl">
								Now playing:{" "}
								<b>{loaderData.config.nowPlayingTrack}</b> by{" "}
								<b>{loaderData.config.nowPlayingArtist}</b>.
							</p>
						</div>
					)}
				<div className="mt-4">
					<Link
						to="/settings"
						className="text-sm opacity-50 hover:opacity-100 transition"
					>
						⚙️ Settings
					</Link>
				</div>
			</div>
		</main>
	);
}
