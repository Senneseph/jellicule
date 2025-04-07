# Squad Goals

1. Provide an MCP service definition.
2. Provide MCP service implementation.
3. Provide OpenAPI definition.
4. Provide OpenAPI implementation.
5. Provide PWA service into OpenAPI implementations.
6. Make both api and pwa services standardized.

## Standardized Files
`docker-compose.yml`
Description of a service that can be fully launched with only `docker-compose up -d`.

`Dockerfile`
I don't think this is supposed to be here.

`README.md`
The who, what, where, when, why, and how (though often not in that order) of how to use this.

`DOCUMENTATION`
Description of how the project works and a single man-page-like suage guide.

`LICENSE`
Licensing information. Please be nice.

`INSTALLATION.md`
How to install.

`USAGE.md`
Briefly, how to make it go.

`QUICKSTART.md`
You are a veteran and need only the basics to jog your memory.

`TODO.json`
A standardized format that nearly any TODO app can read. Sorry, no translations.

`CONTRIBUTING.md`
How to help the project out.

`.env.default`
The template for this project's `.env` (which will never be provided) and also a universally safe default configuration file that can used as a fallback if `.env` is missing or unneeded. A `.env` file can be created but remember, as always, a `.env` file should never be committed to source control - they contain sensitive information!

`/dist`
Make the pure output of the build process available for download from the repo directly.

`/files`
Bad name for good stuff. This is where the meat of your project would appear. This is where we *want* to be working.

`/meta`
The place where meta information about the project will be provided, theoretically an endpoint, but also an output of the build process and description.

`/pwa-service`
The human-usable user interface into the project. Here the service is to build / host / advertise service for a UI library. So our human-interface into this is a prototype of the UI library in action. In our specific case, we will simulate a UI-building tool.

`/service`
Soon to be `/api-service`. This is the directory where the service will be findable, usually at a web endpoint, but also socket will be possible. Will wrap `/openapi-service` and `/mcp-service`.

Coming Soon:
`/openapi-service`
The machine-usable user interface into the project. Here the service is to build / host / advertise service for a UI library. So our machine-interface into this is a machine-readable description of the UI library. In our specific case, we will simulate a UI-building tool.

`/mcp-service`
The machine-usable user interface into the project. Here the service is to build / host / advertise service for a UI library. So our machine-interface into this is a machine-readable description of the UI library. In our specific case, we will simulate a UI-building tool.

`DIAGNOSTICS.md`
How to diagnose problems. How logs are presented automatically. Setting health-checks and alert conditions.

`HEALTH-CHECK.md`
General description of what the health checks say and why the default alerts are sensible.

`TROUBLESHOOTING.md`
Database of ongoing troubleshooting knowledge (build errors, runtime errors, configuration errors, etc.) This is like stackexchange, but used to create deterministic troubleshooting tools.

`TESTING.md`
Description of how to test the project.