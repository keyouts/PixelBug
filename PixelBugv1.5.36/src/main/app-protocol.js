const { net, protocol } = require("electron");
const { pathToFileURL } = require("url");
const { cleanRelativePath, isAllowedResource, targetPath } = require("./protocol-paths");

const SCHEME = "pixelbug";
const APP_HOST = "app";
const MOD_HOST = "mod";
const APP_URL = `${SCHEME}://${APP_HOST}/index.html`;
const MOD_URL = `${SCHEME}://${MOD_HOST}/runner.html`;

function registerScheme() {
  protocol.registerSchemesAsPrivileged([{
    scheme: SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: false,
      stream: true
    }
  }]);
}

function registerHandler(srcRoot) {
  protocol.handle(SCHEME, request => {
    const url = new URL(request.url);
    const relativePath = cleanRelativePath(url);
    if (isAllowedResource(url.hostname, relativePath)) return net.fetch(pathToFileURL(targetPath(srcRoot, relativePath)).toString());
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  });
}

module.exports = { APP_URL, MOD_URL, registerHandler, registerScheme };
