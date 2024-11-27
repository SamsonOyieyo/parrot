var msAbstractParser = (function()
{
    function MsAbstractParser()
    {
    }

    MsAbstractParser.prototype = {

        parse: function (obj, customArgs)
        {
            console.log("parsing...");

            var args = [];

            var proxyUrl = qtJsNetworkProxyMgr.proxyForUrl(obj.url).url();
            if (proxyUrl)
            {
                proxyUrl = proxyUrl.replace(/^https:\/\//i, 'http://'); // FDM bug workaround
                args.push("--proxy", proxyUrl);
            }

            args.push("download");

            if (customArgs.length)
                args = args.concat(customArgs);

            args.push(obj.url);

            return launchPythonScript(obj.requestId, obj.interactive, "spotdl/__main__.py", args)
            .then(function(obj)
            {
                console.log("Python result: ", obj.output);

                return new Promise(function (resolve, reject)
                {
                    var output = obj.output.trim();
                    if (!output || output.indexOf("Downloaded") === -1)
                    {
                        reject({
							error: "Download Error or unsupported URL",
							isParseError: true,
                               });
                    }
                    else
                    {
                        resolve({
							id: "spotify-track",
							title: "Downloaded Spotify Track",
							formats: [
								{
									url: output,
									ext: "mp3",
									protocol: "file",
								},
							],
						});
                    }
                });
            });
        },

        isSupportedSource: function(url)
        {
            return url.includes("spotify.com");
        },

        supportedSourceCheckPriority: function()
        {
            return 1;
        },

        isPossiblySupportedSource: function(obj)
        {
            if (obj.contentType && !/^text\/html(;.*)?$/.test(obj.contentType))
                return false;
            if (obj.resourceSize !== -1 &&
                    (obj.resourceSize === 0 || obj.resourceSize > 50*1024*1024))
            {
                return false;
            }
            return /^https?:\/\//.test(obj.url);
        },

	overrideUrlPolicy: function(url)
	{
	    return true;
	}
    };

    return new MsAbstractParser();
}());
