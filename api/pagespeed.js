export default async function handler(req, res) {
  const { url, strategy } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a url parameter.' });
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Server is missing GOOGLE_API_KEY.' });
  }

  const chosenStrategy = strategy === 'desktop' ? 'desktop' : 'mobile';

  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}` +
    `&strategy=${chosenStrategy}` +
    `&category=performance&category=accessibility&category=best-practices&category=seo` +
    `&key=${key}`;

  try {
    const upstream = await fetch(apiUrl);
    const data = await upstream.json();

    if (!upstream.ok) {
      const message = data?.error?.message || 'PageSpeed API request failed.';
      return res.status(upstream.status).json({ error: message });
    }

    const lighthouse = data.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    const scoreOf = (cat) =>
      categories[cat]?.score == null ? null : Math.round(categories[cat].score * 100);

    const valueOf = (audit) => audits[audit]?.displayValue ?? '—';

    res.status(200).json({
      requestedUrl: url,
      finalUrl: lighthouse.finalUrl,
      strategy: chosenStrategy,
      fetchedAt: new Date().toISOString(),
      scores: {
        performance: scoreOf('performance'),
        accessibility: scoreOf('accessibility'),
        bestPractices: scoreOf('best-practices'),
        seo: scoreOf('seo'),
      },
      metrics: {
        fcp: valueOf('first-contentful-paint'),
        lcp: valueOf('largest-contentful-paint'),
        tbt: valueOf('total-blocking-time'),
        cls: valueOf('cumulative-layout-shift'),
        speedIndex: valueOf('speed-index'),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not reach the PageSpeed API. Try again.' });
  }
}
