"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function LimeChatScript() {
  const pathname = usePathname();

  if (pathname?.startsWith("/editor")) {
    return null;
  }

  return (
    <>
      <Script strategy="afterInteractive" id="limechat-integration">
        {`
          (function(d,t) {
            var BASE_URL="https://app.limechat.ai";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src="https://s3.ap-south-1.amazonaws.com/cdn.limechat.ai/packs/js/LC_sdk/v1/sdk.js";
            g.defer = true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              var pathname = window.location.pathname;
              var isCustomerOrOrderPage = pathname.startsWith('/account') ||
                pathname.includes('order') ||
                pathname.includes('thank-you');
              var websiteToken = isCustomerOrOrderPage
                ? 'DtL44DZeVnPdYUqxxycykdAv'
                : 'Seiake7fu4wfuc441v2XtKwg';

              window.chatwootSDK.run({
                websiteToken: websiteToken,
                baseUrl: BASE_URL
              });

              function handleBubbleVisibility() {
                const isMobile = window.innerWidth <= 910;
                const bubbleSelectors = [
                  '.woot-widget-bubble',
                  '.woot--bubble-holder',
                  '.woot-widget-holder .woot-widget-bubble'
                ];

                bubbleSelectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(element => {
                    if (element) {
                      if (isMobile) {
                        element.style.setProperty('display', 'none', 'important');
                        element.style.setProperty('visibility', 'hidden', 'important');
                        element.style.setProperty('opacity', '0', 'important');
                      } else {
                        element.style.removeProperty('display');
                        element.style.removeProperty('visibility');
                        element.style.removeProperty('opacity');
                      }
                    }
                  });
                });
              }

              setTimeout(handleBubbleVisibility, 300);

              let resizeTimeout;
              window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(handleBubbleVisibility, 100);
              }, { passive: true });

              const observer = new MutationObserver((mutations) => {
                let shouldCheck = false;

                for (const mutation of mutations) {
                  if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                      if (node.nodeType === 1 && (
                        node.classList?.contains('woot-widget-bubble') ||
                        node.classList?.contains('woot--bubble-holder') ||
                        node.querySelector?.('.woot-widget-bubble, .woot--bubble-holder')
                      )) {
                        shouldCheck = true;
                        break;
                      }
                    }
                  }
                  if (shouldCheck) break;
                }

                if (shouldCheck) {
                  handleBubbleVisibility();
                }
              });

              observer.observe(document.body, {
                childList: true,
                subtree: true
              });

              function closeChatIfOpen() {
                if (window.$chatwoot) {
                  const widgetHolder = document.querySelector(
                    '.woot-widget-holder, [data-woot-widget-holder], .woot--widget-holder'
                  );

                  if (widgetHolder) {
                    const chatWindow = widgetHolder.querySelector(
                      '.woot-widget-holder__content, .woot--widget-holder__content, iframe'
                    );

                    if (chatWindow) {
                      const chatWindowStyles = window.getComputedStyle(chatWindow);
                      const holderStyles = window.getComputedStyle(widgetHolder);
                      const isChatWindowVisible =
                        chatWindowStyles.display !== 'none' &&
                        chatWindowStyles.visibility !== 'hidden' &&
                        chatWindowStyles.opacity !== '0';
                      const isHolderVisible =
                        holderStyles.display !== 'none' &&
                        holderStyles.visibility !== 'hidden';

                      if (isChatWindowVisible && isHolderVisible) {
                        window.$chatwoot.toggle();
                      }
                    }
                  }
                }
              }

              const CLOSE_DELAY = 30;

              let currentPathname = window.location.pathname;

              function checkRouteChange() {
                const newPathname = window.location.pathname;
                if (currentPathname !== newPathname) {
                  currentPathname = newPathname;
                  closeChatIfOpen();
                  setTimeout(closeChatIfOpen, CLOSE_DELAY);
                }
              }

              window.addEventListener('popstate', function() {
                checkRouteChange();
                setTimeout(checkRouteChange, CLOSE_DELAY);
              });

              document.addEventListener('click', function(e) {
                const target = e.target;
                const link = target.closest('a[href]');
                if (link && link.href) {
                  const href = link.getAttribute('href');
                  if (href && href.startsWith('/') && !href.startsWith('//')) {
                    closeChatIfOpen();
                    setTimeout(closeChatIfOpen, CLOSE_DELAY);
                  }
                }
              }, true);

              let pathnameCheckInterval = setInterval(function() {
                checkRouteChange();
              }, 300);

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(checkRouteChange, 500);
                });
              } else {
                setTimeout(checkRouteChange, 500);
              }
            };
          })(document,"script");

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
      <Script id="limechat-handlers" strategy="afterInteractive">
        {`
          document.addEventListener('click', function(e) {
            const lmchatwootEl = e.target.closest('.lmchatwoot:not(.lmchatwoot_order)');
            if (lmchatwootEl) {
              if (window.$chatwoot) window.$chatwoot.toggle();
              var menuIcon = document.querySelector('.header__icon[aria-label="Menu"]');
              if (menuIcon) {
                var computed = window.getComputedStyle(menuIcon);
                menuIcon.style.display = computed.display === 'none' ? 'block' : 'none';
              }
            }
            if (e.target.closest('.lmchatwoot_order')) {
              if (window.$chatwoot) window.$chatwoot.toggle();
            }
          });
        `}
      </Script>
    </>
  );
}
