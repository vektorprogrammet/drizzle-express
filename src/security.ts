import cors, { type CorsOptions } from "cors";
import type { RequestHandler } from "express";

/*
    from https://helmetjs.github.io/faq/you-might-not-need-helmet/ at september 5. 2024
    web archive: https://web.archive.org/web/20240905164611/https://helmetjs.github.io/faq/you-might-not-need-helmet/

    UPDATE THIS COMMENT IF YOU UPDATE THE SECURITY HEADERS
*/
const SECURITY_HEADERS = {
	//
	"Content-Security-Policy":
		"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
	"Cross-Origin-Opener-Policy": "same-origin",
	"Cross-Origin-Resource-Policy": "same-origin",
	"Origin-Agent-Cluster": "?1",
	"Referrer-Policy": "no-referrer",
	"Strict-Transport-Security": "max-age=15552000; includeSubDomains",
	"X-Content-Type-Options": "nosniff",
	"X-DNS-Prefetch-Control": "off",
	"X-Download-Options": "noopen",
	"X-Frame-Options": "SAMEORIGIN",
	"X-Permitted-Cross-Domain-Policies": "none",
	"X-XSS-Protection": "0",
};

export const customHelmetSecurity: RequestHandler = (req, res, next) => {
	res.set(SECURITY_HEADERS);
	next();
};

const corsOptions: CorsOptions = {
	// origin: 'http://example.com',
	optionsSuccessStatus: 200,
};

export const customCors = () => {
	return cors(corsOptions);
};
