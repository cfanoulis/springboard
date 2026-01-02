import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import type { Route } from "./+types/invite";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Springboard - You're invited!" },
		{ name: "description", content: "Generates a new installation ID." },
	];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	console.log("wow, new install!");

	const installId = params.installId;
	if (
		!installId ||
		typeof installId !== "string" ||
		installId.trim() === ""
	) {
		throw new Response("Invalid install ID", { status: 400 });
	}

	return installId;
}

export default function Invite({ loaderData }: Route.ComponentProps) {
	const [error, setError] = useState(false);
	const redirect = useNavigate();
	const [localInstallId, setInstallId] = useLocalStorage("sbsinstallid", "");

	useEffect(() => {
		if (!loaderData) {
			setError(true);
			return;
		}

		if (localInstallId) {
			if (localInstallId === loaderData) {
				redirect("/");
				return;
			} else {
				console.log("Tried updating install ID, that won't fly hun");
				setError(true);
				return;
			}
		}

		setInstallId(loaderData);
		redirect("/");
		return;
	}, []);
	return <></>;
}
