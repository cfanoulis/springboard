import { type FC } from "react";
import { fmtTime, type EventData } from "~/util";

interface CalendarEntryProps extends EventData {
	active?: boolean;
}

const CalendarEntry: FC<CalendarEntryProps> = ({
	summary,
	start,
	end,
	active,
}) => {
	return active ? (
		<p className="text-2xl mb-4">
			<span className="text-xl">
				{fmtTime(start)} - {fmtTime(end)}:
			</span>{" "}
			{summary}
		</p>
	) : (
		<li className="text-md text-gray-400">
			{fmtTime(start)} - {fmtTime(end)}: {summary}
		</li>
	);
};

export default CalendarEntry;
