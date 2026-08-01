"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ProductTabsProps, TabId, DEFAULT_TABS } from "../types";
import "../style.css";

/* Convert Shopify rich_text_field JSON tree to React elements */
function richTextToReact(node: any, key: number | string = 0): React.ReactNode {
  if (!node) {
    return null;
  }
  if (typeof node === "string") {
    return node;
  }

  if (node.type === "text") {
    let el: React.ReactNode = node.value || "";
    if (node.bold) {
      el = <strong key={key}>{el}</strong>;
    }
    if (node.italic) {
      el = <em key={key}>{el}</em>;
    }
    if (node.underline) {
      el = <u key={key}>{el}</u>;
    }
    if (node.strikethrough) {
      el = <s key={key}>{el}</s>;
    }
    if (node.superscript) {
      el = <sup key={key}>{el}</sup>;
    }
    if (node.subscript) {
      el = <sub key={key}>{el}</sub>;
    }
    return el;
  }

  const children = (node.children || []).map((child: any, i: number) =>
    richTextToReact(child, i)
  );

  switch (node.type) {
    case "root":
      return <>{children}</>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const Tag = `h${node.level || 2}` as keyof React.JSX.IntrinsicElements;
      return <Tag key={key}>{children}</Tag>;
    }
    case "list": {
      const Tag = node.listType === "ordered" ? "ol" : "ul";
      return <Tag key={key}>{children}</Tag>;
    }
    case "list-item":
      return <li key={key}>{children}</li>;
    case "link":
      return (
        <a key={key} href={node.url || "#"} target={node.target || "_self"}>
          {children}
        </a>
      );
    case "image":
      return (
        <Image
          key={key}
          src={node.src || ""}
          alt={node.alt || ""}
          width={600}
          height={400}
        />
      );
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "hr":
    case "horizontal-rule":
      return <hr key={key} />;
    case "break":
    case "hardbreak":
      return <br key={key} />;
    default:
      return <>{children}</>;
  }
}

export function V1({ data, className }: ProductTabsProps) {
  const rawData = data as any;
  const productData = rawData?.data ?? rawData;

  const description = useMemo(() => {
    return productData?.description || "";
  }, [productData]);

  const manufacturingDetailsInfo = useMemo(() => {
    const info = productData?.metadata?.manufacturing_details_information;
    if (info?.data_type === "rich_text_field" && info?.value) {
      return richTextToReact(info.value);
    }
    return null;
  }, [productData]);

  const manufacturingDetails = useMemo(() => {
    return productData?.metadata?.manufacturing_details?.value || "";
  }, [productData]);

  const cautionStorageInfo = useMemo(() => {
    const info = productData?.metadata?.["caution_&_storage_information"];
    if (info?.data_type === "rich_text_field" && info?.value) {
      return richTextToReact(info.value);
    }
    return null;
  }, [productData]);

  const cautionStorage = useMemo(() => {
    const val = productData?.metadata?.["caution_&_storage"]?.value || "";
    return val;
  }, [productData]);

  /* --- Desktop tab state --- */
  const [activeTab, setActiveTab] = useState<TabId>("description-tab");

  /* --- Mobile accordion state --- */
  const [openAccordion, setOpenAccordion] = useState<TabId | null>(null);

  const toggleAccordion = (id: TabId) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      className={
        "nintara-pt__chevron" + (isOpen ? " nintara-pt__chevron--open" : "")
      }
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#092a33"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  /* --- Render Description (HTML from API) --- */
  const renderDescription = () => (
    <div
      className="nintara-pt__details nintara-pt__html-content"
      // eslint-disable-next-line react/no-danger, no-restricted-syntax
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );

  /* --- Render Manufacturing Details --- */
  const renderManufacturing = () => {
    if (manufacturingDetailsInfo) {
      return (
        <div className="nintara-pt__details nintara-pt__html-content">
          {manufacturingDetailsInfo}
        </div>
      );
    }
    return (
      <div className="nintara-pt__details">
        {manufacturingDetails
          .split("\n")
          .filter(Boolean)
          .map((line: string, idx: number) => (
            <p key={idx} className="nintara-pt__detail-row">
              {line.trim()}
            </p>
          ))}
      </div>
    );
  };

  /* --- Render Caution & Storage --- */
  const renderCaution = () => {
    if (cautionStorageInfo) {
      return (
        <div className="nintara-pt__details nintara-pt__html-content">
          {cautionStorageInfo}
        </div>
      );
    }
    return (
      <div className="nintara-pt__details">
        {cautionStorage
          .split("\n")
          .filter(Boolean)
          .map((line: string, idx: number) => (
            <p key={idx} className="nintara-pt__detail-row">
              {line.trim()}
            </p>
          ))}
      </div>
    );
  };

  const renderContent = (tabId: TabId) => {
    switch (tabId) {
      case "description-tab":
        return renderDescription();
      case "manufacturing-details":
        return renderManufacturing();
      case "caution-storage":
        return renderCaution();
      default:
        return null;
    }
  };

  return (
    <div className={"nintara-pt " + (className ?? "")}>
      {/* Doodle decorations */}
      <Image
        src="/assets/momsco/images/product/Doodle-4.png"
        alt=""
        width={150}
        height={150}
        className="nintara-pt__doodle nintara-pt__doodle--left"
        aria-hidden="true"
      />
      <Image
        src="/assets/momsco/images/product/Doodle-3.png"
        alt=""
        width={150}
        height={120}
        className="nintara-pt__doodle nintara-pt__doodle--right"
        aria-hidden="true"
      />
      {/* === DESKTOP: Tabbed Card (>=1025px) === */}
      <section className="nintara-pt__desktop" aria-label="Product Tabs">
        <div className="nintara-pt__card">
          {/* Tab bar */}
          <ul
            className="nintara-pt__tab-bar"
            role="tablist"
            data-testid="momsco-product-tab-bar"
          >
            {DEFAULT_TABS.map((tab) => (
              <li
                key={tab.id}
                className={
                  "nintara-pt__tab" +
                  (activeTab === tab.id ? " nintara-pt__tab--active" : "")
                }
                role="tab"
                aria-selected={activeTab === tab.id}
                data-testid={
                  activeTab === tab.id
                    ? "momsco-product-tab-active"
                    : "momsco-product-tab"
                }
                tabIndex={0}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {/* Tab content area */}
          <div className="nintara-pt__tab-contents">
            {DEFAULT_TABS.map((tab) => (
              <div
                key={tab.id}
                className={
                  "nintara-pt__tab-panel" +
                  (activeTab === tab.id
                    ? tab.id === "description-tab"
                      ? " nintara-pt__tab-panel--active-flex"
                      : " nintara-pt__tab-panel--active"
                    : "")
                }
                role="tabpanel"
                aria-hidden={activeTab !== tab.id}
                data-testid={
                  activeTab === tab.id ? "momsco-product-tab-panel" : undefined
                }
              >
                {renderContent(tab.id)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === MOBILE: Accordion (<=1024px) === */}
      <section className="nintara-pt__mobile" aria-label="Product Information">
        {DEFAULT_TABS.map((tab) => {
          const isOpen = openAccordion === tab.id;
          return (
            <div key={tab.id} className="nintara-pt__acc-wrapper">
              <button
                className={
                  "nintara-pt__acc-btn" +
                  (isOpen ? " nintara-pt__acc-btn--active" : "")
                }
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(tab.id)}
              >
                <span>{tab.label}</span>
                <ChevronIcon isOpen={isOpen} />
              </button>
              <div
                className={
                  "nintara-pt__acc-panel" +
                  (isOpen ? " nintara-pt__acc-panel--open" : "")
                }
              >
                {renderContent(tab.id)}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export { V1 as default };
