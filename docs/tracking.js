// MedSpa RevAI - Unified Tracking Script
// Add this to all pages: <script src="tracking.js"></script>

(function() {
    // Configuration - Replace with your actual IDs
    const CONFIG = {
        GA4_ID: 'G-XXXXXXXXXX',           // Google Analytics 4
        GTAG_ADS_ID: 'AW-XXXXXXXXXX',     // Google Ads
        FB_PIXEL_ID: 'XXXXXXXXXXXXXXXXX', // Facebook Pixel
        HOTJAR_ID: 'XXXXXXX'              // Hotjar (optional)
    };

    // Google Analytics 4 + Google Ads
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA4_ID}`;
    document.head.appendChild(gtagScript);

    gtag('config', CONFIG.GA4_ID);
    gtag('config', CONFIG.GTAG_ADS_ID);

    // Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CONFIG.FB_PIXEL_ID);
    fbq('track', 'PageView');

    // Track utility functions
    window.MedSpaTrack = {
        // Track lead capture
        leadCapture: function(email, source) {
            gtag('event', 'generate_lead', {
                'event_category': 'Lead',
                'event_label': source || 'website'
            });
            gtag('event', 'conversion', {
                'send_to': CONFIG.GTAG_ADS_ID + '/lead',
            });
            fbq('track', 'Lead', { content_name: source || 'website' });
        },

        // Track demo call initiated
        demoCall: function() {
            gtag('event', 'demo_call', {
                'event_category': 'Engagement',
                'event_label': 'phone_demo'
            });
            fbq('track', 'Contact');
        },

        // Track signup started
        signupStart: function() {
            gtag('event', 'begin_checkout', {
                'currency': 'USD',
                'value': 497
            });
            fbq('track', 'InitiateCheckout', { value: 497, currency: 'USD' });
        },

        // Track purchase completed (call from success page)
        purchase: function(transactionId) {
            gtag('event', 'purchase', {
                'transaction_id': transactionId,
                'value': 497,
                'currency': 'USD'
            });
            gtag('event', 'conversion', {
                'send_to': CONFIG.GTAG_ADS_ID + '/purchase',
                'value': 497,
                'currency': 'USD',
                'transaction_id': transactionId
            });
            fbq('track', 'Purchase', { value: 497, currency: 'USD' });
        },

        // Track ROI calculator usage
        roiCalculator: function(results) {
            gtag('event', 'roi_calculator', {
                'event_category': 'Engagement',
                'monthly_recovery': results.monthlyRecovery
            });
            fbq('track', 'CustomizeProduct');
        },

        // Track CTA clicks
        ctaClick: function(ctaName) {
            gtag('event', 'cta_click', {
                'event_category': 'Engagement',
                'event_label': ctaName
            });
        }
    };

    // Auto-track phone number clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="tel:"]');
        if (link) {
            MedSpaTrack.demoCall();
        }
    });

    // Auto-track signup button clicks
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('a[href*="signup"], button[type="submit"]');
        if (btn && btn.textContent.toLowerCase().includes('trial')) {
            MedSpaTrack.signupStart();
        }
    });
})();
