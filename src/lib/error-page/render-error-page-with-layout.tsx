import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";
import type { PageConfig } from "@shopkit/builder";
import React from "react";
import "./error-page.css";

/**
 * Renders a 404 error page with header and footer layout
 */
export async function renderErrorPageWithLayout() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
    fetchAPITemplate: false,
  };

  let messages: Record<string, any> = {};
  try {
    messages = await getRouteTranslations({
      themeName,
      routeContext,
      language: locale,
    });
  } catch (e) {
    console.error("Failed to load messages for error page:", e);
  }

  const errorPageConfig: PageConfig = {
    id: "error-page",
    dataSources: {
      collectionDataAll: {
        type: DATA_SOURCE_TYPES.COLLECTIONS,
        params: { first: 50 },
        required: false,
      },
    },
    sections: [
      {
        id: "announcement-bar-section",
        name: "AnnouncementBar",
        type: SECTION_TYPES.CONTENT_SECTION,
        settings: {
          layout: SECTION_LAYOUT_OPTIONS.FULL,
          responsive: {
            mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          },
        },
        widgets: [
          {
            id: "nintarababy-announcement-bar",
            name: "AnnouncementBar",
            type: WIDGET_TYPES.AnnouncementBar,
            settings: {
              variant: "v1",
              autoPlayInterval: 4500,
              pauseOnHover: true,
              transitionDuration: 600,
              messages: "t:common.announcement_bar.messages",
            },
          },
        ],
      },
      {
        id: "header-section",
        name: "Header",
        type: SECTION_TYPES.HEADER_SECTION,
        settings: {
          layout: SECTION_LAYOUT_OPTIONS.FULL,
          responsive: {
            mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          },
        },
        widgets: [
          {
            id: "dawn-header",
            name: "Header",
            type: WIDGET_TYPES.Header,
            dataSourceKey: "collectionDataAll",
            settings: {
              variant: "v1",
              logoPath: "t:common.header.logoPath",
              isSticky: "t:common.header.isSticky",
              hideOnScrollDown: "t:common.header.hideOnScrollDown",
              searchPlaceholder: "t:common.header.searchPlaceholder",
              whatsappHref: "t:common.header.whatsappHref",
              cartHref: "t:common.header.cartHref",
              navLinks: "t:common.header.navLinks",
              dropdownItems: "t:common.header.dropdownItems",
            },
          },
        ],
      },
      {
        id: "footer-section",
        name: "Footer",
        type: SECTION_TYPES.FOOTER_SECTION,
        settings: {
          layout: SECTION_LAYOUT_OPTIONS.FULL,
          responsive: {
            mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
            tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
            desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          },
        },
        widgets: [
          {
            id: "dawn-footer",
            name: "Footer",
            type: WIDGET_TYPES.Footer,
            dataSourceKey: "collectionDataAll",
            settings: {
              variant: "v1",
              seoHeading: "t:common.footer.seoHeading",
              contactAddress: "t:common.footer.contactAddress",
              contactWhatsapp: "t:common.footer.contactWhatsapp",
              contactEmail: "t:common.footer.contactEmail",
              categoriesHeading: "t:common.footer.categoriesHeading",
              helpHeading: "t:common.footer.helpHeading",
              otherLinksHeading: "t:common.footer.otherLinksHeading",
              newsletterHeading: "t:common.footer.newsletterHeading",
              facebookUrl: "t:common.footer.facebookUrl",
              instagramUrl: "t:common.footer.instagramUrl",
              helpLinks: "t:common.footer.helpLinks",
              otherLinks: "t:common.footer.otherLinks",
              categoryLinks: "t:common.footer.categoryLinks",
            },
          },
        ],
      },
      {
        id: "bottom-bar-section",
        name: "BottomBar",
        type: SECTION_TYPES.CONTENT_SECTION,
        settings: {
          layout: SECTION_LAYOUT_OPTIONS.FULL,
          responsive: {
            mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
            desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          },
        },
        widgets: [
          {
            id: "nintarababy-bottom-bar",
            name: "BottomBar",
            type: WIDGET_TYPES.BottomBar,
            settings: {
              variant: "v1",
              copyrightText: "t:common.bottom_bar.copyrightText",
            },
          },
        ],
      },
    ],
  };

  const pageBuildingEngine = createPageBuildingEngine();

  const errorPageContent = await pageBuildingEngine.renderPage({
    merchantName: themeName,
    pageConfig: errorPageConfig,
    routeContext,
    locale,
    messages,
  });

  const pageContainer = React.isValidElement(errorPageContent)
    ? errorPageContent
    : null;

  const sections =
    pageContainer && pageContainer.props?.children
      ? React.Children.toArray(pageContainer.props.children)
      : [];

  const announcementSection = sections[0] || null;
  const headerSection = sections[1] || null;
  const footerSection = sections[2] || null;
  const bottomBarSection = sections[3] || null;

  return (
    <div className="error-page">
      {announcementSection}
      {headerSection}

      <div className="error-page__content">
        <div className="error-page__inner">
          <h1 className="error-page__title">404</h1>
          <h2 className="error-page__subtitle">Oops...That link is broken.</h2>
          <p className="error-page__description">
            Sorry for the inconvenience. Go to our homepage to check out our
            latest offerings.
          </p>
          <a href="/" className="error-page__button">
            Shop now
          </a>
        </div>
      </div>

      {footerSection && <div>{footerSection}</div>}
      {bottomBarSection && <div>{bottomBarSection}</div>}
    </div>
  );
}
