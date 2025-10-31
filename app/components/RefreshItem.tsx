import type { FC } from "react";
import { useRevalidator } from "react-router";

const RefreshItem: FC = () => {
	const revalidator = useRevalidator();
	return (
		<li className="text-xs text-gray-400 italic">
			{revalidator.state === "idle" ? (
				<>
					something looks off? -{" "}
					<button
						className="underline"
						onClick={() => revalidator.revalidate()}
					>
						refresh
					</button>
				</>
			) : (
				"Give me a second, fetching new data..."
			)}
		</li>
	);
};

export default RefreshItem;
