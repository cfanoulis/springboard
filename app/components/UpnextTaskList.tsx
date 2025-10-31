import type { FC } from "react";
import CalendarEntry from "~/components/CalendarEntry";
import RefreshItem from "~/components/RefreshItem";
import type { EventData } from "~/util";

const UpnextTaskList: FC<{ eventData: EventData[] }> = ({ eventData }) => {
	return (
		<>
			<h2 className="text-lg text-gray-100">Up next:</h2>
			<ul>
				{eventData.map((entry, idx) => (
					<CalendarEntry
						key={idx}
						summary={entry.summary}
						start={entry.start}
						end={entry.end}
					/>
				))}
				<RefreshItem />
			</ul>
		</>
	);
};

export default UpnextTaskList;
