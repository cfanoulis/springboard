import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/cal", "routes/calendar.ts"),
	route("/config", "routes/config.ts"),
	route("/settings", "routes/settings.tsx"),
] satisfies RouteConfig;
