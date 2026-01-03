# Tracking & Retargeting Setup

## 1. Google Analytics 4 (GA4)

Add to `<head>` of landing page:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 2. Google Ads Conversion Tracking

```html
<!-- Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

<!-- Track CTA clicks -->
<script>
document.querySelectorAll('a[href*="stripe.com"]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/YYYYY'});
  });
});
</script>
```

## 3. Meta (Facebook/Instagram) Pixel

```html
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'XXXXXXXXXXXXXXXXX');
fbq('track', 'PageView');
</script>

<!-- Track lead form submissions -->
<script>
document.querySelector('.lead-form').addEventListener('submit', () => {
  fbq('track', 'Lead');
});
</script>
```

## 4. LinkedIn Insight Tag

```html
<!-- LinkedIn -->
<script type="text/javascript">
_linkedin_partner_id = "XXXXXXX";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
```

## 5. Hotjar (Session Recording)

```html
<!-- Hotjar -->
<script>
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:XXXXXXX,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## Retargeting Audiences to Create

### Google Ads
1. **All visitors** (last 30 days)
2. **Pricing page viewers** (last 14 days)
3. **Form starters** (last 7 days)
4. **Stripe page visitors** (last 3 days)

### Meta Ads
1. **Website visitors** (180 days)
2. **Engaged visitors** (>30 sec on site)
3. **Form submitters**
4. **Lookalike: Form submitters** (1%, US)

### LinkedIn
1. **Website visitors** (90 days)
2. **Engaged visitors** (multiple pages)

---

## Priority Setup Order
1. ✅ Google Analytics 4
2. ✅ Google Ads conversion tracking
3. ✅ Meta Pixel
4. LinkedIn Insight Tag
5. Hotjar
