import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/cal", "routes/calendar.ts"),
	// route("/newinstall", "routes/newinstall.tsx"),
	// route("/i/:installId", "routes/invite.tsx"),
	route("/config", "routes/config.tsx"),
	// route("/spotify/authorize", "routes/spotify/authorize.tsx"),
	// route("/spotify/redirect", "routes/spotify/redirect.tsx"),
	// route("/spotify/now", "routes/spotify/now.tsx"),
] satisfies RouteConfig;
