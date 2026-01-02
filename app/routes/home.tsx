import { useEffect, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import CalendarEntry from "~/components/CalendarEntry";
import UpnextTaskList from "~/components/UpnextTaskList";
import { getBgClass, getLine, type EventData } from "~/util";
import type { Route } from "./+types/home";

//todo: move to types file
interface Config {
	username: string;
	calendarUrl: string;
	showSeconds: boolean;
}
interface ManyEventsData {
	currentEvent: EventData | null;
	upcomingEvents: EventData[];
}
interface LoaderData {
	config: Config;
	data: ManyEventsData | { currentEvent: -1; upcomingEvents: -1 };
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Springboard" },
		{ name: "description", content: "Spring into action, every day." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const configStr =
		localStorage.getItem("sb-config") ??
		'{"username":"","calendarUrl":"","showSeconds":true}';

	const config = JSON.parse(configStr) as {
		username: string;
		calendarUrl: string;
		showSeconds: boolean;
	};

	const req = await fetch(
		"/cal?url=" + encodeURIComponent(config.calendarUrl),
	);
	if (!req.ok) throw "Failed to fetch calendar data";

	const data = (await req.json()) as
		| {
				currentEvent: EventData | null;
				upcomingEvents: EventData[];
		  }
		| { currentEvent: -1; upcomingEvents: -1 };

	if (data.currentEvent === -1 && data.upcomingEvents === -1) {
		return window.location.replace("/config");
	}

	if (!data.upcomingEvents)
		return { config, data: { currentEvent: null, upcomingEvents: [] } };
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

	return { config, data } as LoaderData;
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { config, data } =
		JSON.stringify(loaderData) === "{}"
			? ({
					config: {
						username: "",
						calendarUrl: "",
						showSeconds: true,
					},
					data: { currentEvent: null, upcomingEvents: [] },
				} as LoaderData)
			: (loaderData as LoaderData);

	const [minutes, setMinutes] = useState(new Date().getMinutes());
	const [hours, setHours] = useState(new Date().getHours());
	const [seconds, setSeconds] = useState(new Date().getSeconds());

	const [taskNow, setTaskNow] = useState<{
		status: number;
		data?: EventData;
	}>({ status: -1 });
	const [line] = useState(getLine());

	const revalidator = useRevalidator();
	const nav = useNavigate();

	useEffect(() => {
		if (!config || data.currentEvent === -1) nav("/config");

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
		if (!data.currentEvent && data.upcomingEvents.length === 0)
			return setTaskNow({ status: -1 });
		if (!data.currentEvent) return setTaskNow({ status: 0 });
		setTaskNow({ status: 1, data: data.currentEvent as EventData });
	}, [minutes]);

	return (
		<main
			className={`${getBgClass()} h-screen flex flex-col items-center justify-center md:flex-row-reverse md:items-center md:justify-center`}
		>
			<div className="md:w-4/10 text-left inline-block">
				<h1 className="text-xl md:text-6xl flex-row ">
					Hey <b>{config.username ?? "friend"}</b>, it's{" "}
					<b>
						{hours.toString().padStart(2, "0")}:
						{minutes.toString().padStart(2, "0")}
					</b>
					{config.showSeconds && (
						<span className="text-xl inline pr-2">
							:{seconds.toString().padStart(2, "0")}
						</span>
					)}
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
					<UpnextTaskList
						eventData={data.upcomingEvents as EventData[]}
					/>
				)}
				<div>
					<p className="text-xl">
						Now playing: <b>Alitiki Agapi</b> by <b>Lex, Ortiz</b>.
					</p>
				</div>
			</div>
		</main>
	);
}
