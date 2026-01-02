import { newInstall } from "~/config";
import type { Route } from "./+types/home";
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
