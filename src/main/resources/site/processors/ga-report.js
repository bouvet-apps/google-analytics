const libs = {
  portal: require('/lib/xp/portal')
};

const getDefaultScript = (measurementID, enableAnonymization) => {
  const snippet = `window.dataLayer = window.dataLayer || []; \
    function gtag(){dataLayer.push(arguments);} \
    gtag('js', new Date()); \
    gtag('config', '${measurementID}');
    ${enableAnonymization ? `gtag('config','${measurementID}',{'anonymize_ip':true});` : ""}`;
  return snippet;
};

const getConsentRequiredScript = (script, defaultDisable, measurementID) => {
  const snippet = `var ga4Script = "${script}"; \
    window.__RUN_ON_COOKIE_CONSENT__ = window.__RUN_ON_COOKIE_CONSENT__ || {}; \
    window.__RUN_ON_COOKIE_CONSENT__["${defaultDisable}"] = function () { \
      var s = document.createElement("script"); \
      var gtagScript = document.createElement("script"); \
      gtagScript.async = true; \
      gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=${measurementID}"; \
      s.id = "google-analytics-GA4-consent"; \
      s.innerText = ga4Script; \
      document.getElementsByTagName("head")[0].appendChild(gtagScript); \
      document.getElementsByTagName("head")[0].appendChild(s); \
    }`;
  return snippet;
};

//TODO check if tracking is enabled or not

exports.responseProcessor = function (req, res) {
  if (req.mode !== 'live') {
    return res;
  }

  const site = libs.portal.getSite();
  const defaultDisable = app.name.replace(/\./g, "-") + "_disabled";

  if (site && site._path) {
    const siteConfig = libs.portal.getSiteConfig() || {};

    const measurementID = siteConfig?.measurementId || '';
    const enableTracking = siteConfig?.enableTracking || false;
    const enableAnonymization = siteConfig?.enableAnonymization || false;

    if (!measurementID || !enableTracking) {
      return res;
    }

    let script = getDefaultScript(measurementID, enableAnonymization);
    script = getConsentRequiredScript(script, defaultDisable, measurementID);

    const snippet = `<!-- Global site tag (gtag.js) - Google Analytics --> \
        <script> \
        ${script} \
        </script> \
        <!-- End Global site tag (gtag.js) - Google Analytics -->`;


    const headEnd = res.pageContributions.headEnd;
    if (!headEnd) {
      res.pageContributions.headEnd = [];
    }
    else if (typeof (headEnd) == 'string') {
      res.pageContributions.headEnd = [headEnd];
    }

    res.pageContributions.headEnd.push(snippet);
  }

  return res;
};
