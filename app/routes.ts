import { type RouteConfig, index, route } from "@react-router/dev/routes";
import "dotenv/config";

export default [
	index("routes/home.tsx"),
	route("/cal", "routes/calendar.ts"),
] satisfies RouteConfig;
