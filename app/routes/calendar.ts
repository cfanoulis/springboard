import "dotenv/config";
import ical from "ical.js";

export async function loader() {
	console.log("hit!");
	const now = new Date();

	const req = await fetch(process.env.CAL_URL!);
	if (!req.ok) throw await req.text();
	const icsText = await req.text();

	const jcalData = ical.parse(icsText);
	const vcalendar = new ical.Component(jcalData);

	// const vtzs = vcalendar.getAllSubcomponents("vtimezone");
	// vtzs.forEach((vtz) => {
	//   const tz = new ical.Timezone(vtz);
	//   ical.TimezoneService.register(tz);
	// });

	const vevents = vcalendar.getAllSubcomponents("vevent");
	const thisday = vevents
		.map((e) => {
			const event = new ical.Event(e);
			// event.startDate = event.startDate.convertToZone(
			//   ical.TimezoneService.get("Europe/Athens")
			// );
			// event.endDate = event.endDate.convertToZone(
			//   ical.TimezoneService.get("Europe/Athens")
			// );
			return event;
		})
		.filter((event) => {
			const dayEnd = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				23,
				59,
				59,
				999,
			);
			return (
				(event.endDate.toJSDate() <= dayEnd &&
					event.startDate.toJSDate() >= now) ||
				(event.startDate.toJSDate() <= now &&
					event.endDate.toJSDate() >= now)
			);
		})
		.sort((a, b) => {
			return (
				a.startDate.toJSDate().getTime() -
				b.startDate.toJSDate().getTime()
			);
		});

	if (thisday.length === 0) {
		console.log("No events for today.");
		return [];
	}

	const data = thisday.map((event) => {
		return {
			summary: event.summary,
			start: event.startDate.toJSDate(),
			end: event.endDate.toJSDate(),
		};
	});

	if (data[0].start.valueOf() <= now.valueOf())
		console.log("Current event:", data[0]);
	const currentEvent =
		data[0].start.valueOf() <= now.valueOf() ? data.shift()! : null;

	return new Response(
		JSON.stringify({
			currentEvent,
			upcomingEvents: data,
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}
