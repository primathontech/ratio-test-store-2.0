"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function LimeChatScript() {
  const pathname = usePathname();

  if (pathname?.startsWith("/editor")) {
    return null;
  }

  return (
    <Script strategy="afterInteractive" id="limechat-integration">
      {`
        (function(d,t) {
          var BASE_URL="https://app.limechat.ai";
          var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
          g.src="https://s3.ap-south-1.amazonaws.com/cdn.limechat.ai/packs/js/LC_sdk/v1/sdk.js";
          g.defer = true;
          s.parentNode.insertBefore(g,s);
          g.onload=function(){
            window.chatwootSDK.run({
              websiteToken: 'DtL44DZeVnPdYUqxxycykdAv',
              baseUrl: BASE_URL
            })
          }
        })(document,"script");

        $('.lmchatwoot_order').on('click', function(){
          window.$chatwoot.toggle();
        });

        const style = document.createElement('style');
        style.textContent = \`
          @media (max-width: 910px) {
            .woot--bubble-holder {
              bottom: 9% !important;
            }
          }
         .woot--bubble-holder {
            z-index: 2999 !important;
          }

          .woot-widget-bubble,
          .woot--bubble-holder,
          .woot-widget-bubble-icon {
            width: 50px !important;
            height: 50px !important;
            min-width: 50px !important;
            min-height: 50px !important;
            max-width: 50px !important;
            max-height: 50px !important;
          }

          .woot-widget-bubble img,
          .woot--bubble-holder img,
          .woot-widget-bubble-icon img,
          .woot-widget-bubble svg,
          .woot--bubble-holder svg {
            width: 50px !important;
            height: 50px !important;
          }

          .woot-widget-bubble-content,
          .woot--bubble-holder-content {
            width: 50px !important;
            height: 50px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        \`;
        document.head.appendChild(style);
      `}
    </Script>
  );
}
