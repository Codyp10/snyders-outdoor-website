/**
 * Sitewide lead tracking for GA4 (property 548567912) via the existing GTM
 * container (GTM-MPHWD5MR). Pushes to dataLayer and calls gtag() when present.
 * Safe if GTM / gtag have not loaded yet.
 */
type EventParams = Record<string, string | undefined>;

function trackEvent(name: string, params: EventParams): void {
  try {
    const w = window as Window & {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: name, ...params });
    if (typeof w.gtag === 'function') {
      w.gtag('event', name, params);
    }
  } catch {
    // Tracking must never break the page.
  }
}

function linkLocation(el: Element): string {
  const marked = el.closest('[data-track-location]')?.getAttribute('data-track-location');
  if (marked) return marked;
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  return 'content';
}

document.addEventListener(
  'click',
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    const params = {
      link_url: href,
      page_path: location.pathname,
      link_location: linkLocation(anchor),
    };
    if (href.startsWith('tel:')) {
      trackEvent('phone_click', params);
    } else if (href.startsWith('mailto:')) {
      trackEvent('email_click', params);
    }
  },
  true
);

function fireLead(formName: string): void {
  trackEvent('generate_lead', {
    form_name: formName,
    page_path: location.pathname,
    page_location: location.href,
  });
}

document.addEventListener(
  'submit',
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;
    const name =
      form.getAttribute('data-form-name') ||
      form.getAttribute('name') ||
      form.id ||
      'contact_form';
    fireLead(name);
  },
  true
);

function isJobberOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'getjobber.com' ||
      host.endsWith('.getjobber.com') ||
      host === 'jobber.com' ||
      host.endsWith('.jobber.com')
    );
  } catch {
    return false;
  }
}

function looksLikeJobberLead(data: unknown): boolean {
  if (data == null) return false;
  const raw = typeof data === 'string' ? data : JSON.stringify(data);
  if (!raw) return false;
  if (/resize|setHeight|setWidth|scroll/i.test(raw) && !/submit|success|thank|lead|complete/i.test(raw)) {
    return false;
  }
  return /submit|success|thank|lead|complete|confirmation|work_request_submitted|request.?submitted/i.test(
    raw
  );
}

let jobberLeadFired = false;
function fireJobberLeadOnce(): void {
  if (jobberLeadFired) return;
  jobberLeadFired = true;
  fireLead('jobber_work_request');
}

window.addEventListener('message', (event) => {
  if (!isJobberOrigin(event.origin)) return;
  if (looksLikeJobberLead(event.data)) fireJobberLeadOnce();
});
