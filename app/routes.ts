import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/cal", "routes/calendar.ts"),
] satisfies RouteConfig;
