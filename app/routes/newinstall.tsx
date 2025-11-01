import { useState } from "react";
import { Form, Link } from "react-router";
import { newInstall } from "~/config";
import { getBgClass } from "~/util";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Springboard - New install" },
		{ name: "description", content: "Generates a new installation ID." },
	];
}

export async function action({ request }: Route.ActionArgs) {
	console.log("install hit!");
	let formData = await request.formData();
	let username = formData.get("username");
	if (!username || typeof username !== "string" || username.trim() === "") {
		throw new Response("Invalid name", { status: 400 });
	}
	console.log("new install for ", username);

	let installId = await newInstall(username.trim());
	return installId;
}

export default function Home({ actionData }: Route.ComponentProps) {
	const [username, setUsername] = useState("________");

	return (
		<main
			className={`${getBgClass()} h-screen flex flex-col items-center justify-center md:flex-row-reverse md:items-center md:justify-center`}
		>
			<div className="md:w-4/10 text-left inline-block">
				<h1 className="text-xl md:text-6xl flex-row ">
					Hi <b>{username}</b>, this is your new Springboard.
				</h1>
			</div>
			<div className="md:w-2/5 p-8">
				{actionData ? (
					<>
						<p>
							Your install ID is{" "}
							<i className="text-sm">{actionData}</i>.
						</p>
						<p className="mt-2">
							Join us at{" "}
							<Link
								className="underline text-gray-400"
								to={`/i/${actionData}`}
							>
								springboar.ds/i/{actionData}
							</Link>
						</p>
					</>
				) : (
					<Form method="post">
						<label htmlFor="username">And your name is... </label>
						<input
							type="text"
							placeholder="Anakin"
							name="username"
							className="border-b-2 border-gray-200"
							onChange={(e) => {
								e.preventDefault();
								setUsername(e.target.value);
							}}
						/>
						<br />
						<button type="submit">Start &gt;</button>
					</Form>
				)}
			</div>
		</main>
	);
}
