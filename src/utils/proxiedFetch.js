const KIE_ORIGIN = "https://tempfile.aiquickdraw.com";

export const toProxyUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.origin === KIE_ORIGIN) {
      return `/kie-image${u.pathname}${u.search}`;
    }
  } catch {}
  return url;
};

export const proxiedFetch = (url, options) =>
  fetch(toProxyUrl(url), options);
