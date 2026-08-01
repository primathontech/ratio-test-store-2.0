"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogProps, BlogPost, DEFAULT_POSTS } from "../types";
import "../style.css";

const BASE_PATH = "/assets/nintarababy/blog";

/**
 * Primary (large) blog card -- left column on desktop, full-width slide on mobile
 */
function PrimaryCard({ post }: { post: BlogPost }) {
  return (
    <div
      id={post.id}
      className="nintara-blog__card nintara-blog__card--primary"
    >
      <Link
        href={post.url}
        className="nintara-blog__image-wrapper"
        aria-label={post.alt}
      >
        <Image
          src={`${BASE_PATH}/${post.desktopImage}`}
          alt={post.alt}
          width={post.desktopWidth}
          height={post.desktopHeight}
          className="nintara-blog__img"
          loading="lazy"
        />
      </Link>
      <div className="nintara-blog__text-wrapper">
        <div className="nintara-blog__badge-wrapper">
          <span className="nintara-blog__cat-badge">{post.category}</span>
          <div className="nintara-blog__date">
            <p>{post.date}</p>
          </div>
          <div className="nintara-blog__read-time">
            <p>{post.readTime}</p>
          </div>
        </div>
        <div className="nintara-blog__title">
          <h4>
            <Link href={post.url}>{post.title}</Link>
          </h4>
        </div>
        <div className="nintara-blog__description nintara-blog__description--primary">
          <p>{post.excerpt}</p>
        </div>
        <div className="nintara-blog__read-btn">
          <Link href={post.url}>Read more</Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Secondary (smaller) blog card -- right column on desktop
 * Image + text side-by-side in a grid (300px image | 1fr text)
 */
function SecondaryCard({ post }: { post: BlogPost }) {
  return (
    <div
      id={post.id}
      className="nintara-blog__card nintara-blog__card--secondary"
    >
      <Link
        href={post.url}
        className="nintara-blog__image-wrapper nintara-blog__image-wrapper--side"
        aria-label={post.alt}
      >
        <Image
          src={`${BASE_PATH}/${post.desktopImage}`}
          alt={post.alt}
          width={post.desktopWidth}
          height={post.desktopHeight}
          className="nintara-blog__img nintara-blog__img--side"
          loading="lazy"
        />
      </Link>
      <div className="nintara-blog__text-wrapper">
        <div className="nintara-blog__badge-wrapper">
          <span className="nintara-blog__cat-badge">{post.category}</span>
        </div>
        <div className="nintara-blog__title">
          <h4>
            <Link href={post.url}>{post.title}</Link>
          </h4>
        </div>
        <div className="nintara-blog__description nintara-blog__description--secondary">
          <p>{post.excerpt}</p>
        </div>
        <div className="nintara-blog__duration">
          <div className="nintara-blog__date">
            <p>{post.date}</p>
          </div>
          <div className="nintara-blog__read-time">
            <p>{post.readTime}</p>
          </div>
        </div>
        <div className="nintara-blog__read-btn">
          <Link href={post.url}>Read more</Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile slide card -- full-width with mobile image
 */
function MobileSlideCard({ post }: { post: BlogPost }) {
  return (
    <div className="nintara-blog__slide">
      <div className="nintara-blog__slide-inner">
        <Link
          href={post.url}
          className="nintara-blog__image-wrapper"
          aria-label={post.alt}
        >
          <Image
            src={`${BASE_PATH}/${post.mobileImage}`}
            alt={post.alt}
            width={post.mobileWidth}
            height={post.mobileHeight}
            className="nintara-blog__img"
            loading="lazy"
          />
        </Link>
        <div className="nintara-blog__text-wrapper">
          <div className="nintara-blog__badge-wrapper">
            <span className="nintara-blog__cat-badge">{post.category}</span>
            <div className="nintara-blog__date">
              <p>{post.date}</p>
            </div>
            <div className="nintara-blog__read-time">
              <p>{post.readTime}</p>
            </div>
          </div>
          <div className="nintara-blog__title">
            <h4>
              <Link href={post.url}>{post.title}</Link>
            </h4>
          </div>
          <div className="nintara-blog__description nintara-blog__description--primary">
            <p>{post.excerpt}</p>
          </div>
          <div className="nintara-blog__read-btn">
            <Link href={post.url}>Read more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Blog V1 -- "We're Here For You!" section
 */
export function V1({ data, settings, className }: BlogProps) {
  const heading = settings?.heading ?? "We\u2019re Here For You!";
  const seeAllText = settings?.seeAllText ?? "See All";
  const seeAllLink = settings?.seeAllLink ?? "/blogs/blog";

  const posts: BlogPost[] = React.useMemo(() => {
    const st = settings?.posts;
    if (Array.isArray(st) && st.length > 0) {
      return st.map((flat, i) => {
        const match = DEFAULT_POSTS[i];
        const isFullPath = (p: string) =>
          p.startsWith("/") || p.startsWith("http");
        return {
          id: `blog_${i}`,
          cardType: i === 0 ? "primary" : "secondary",
          title: flat.title,
          url: flat.url,
          category: flat.category,
          date: flat.date,
          readTime: flat.readTime,
          excerpt: flat.excerpt,
          desktopImage: isFullPath(flat.desktopImage)
            ? flat.desktopImage.replace(`${BASE_PATH}/`, "")
            : flat.desktopImage,
          mobileImage: isFullPath(flat.mobileImage)
            ? flat.mobileImage.replace(`${BASE_PATH}/`, "")
            : flat.mobileImage,
          alt: flat.title,
          desktopWidth: match?.desktopWidth ?? (i === 0 ? 630 : 380),
          desktopHeight: match?.desktopHeight ?? (i === 0 ? 530 : 320),
          mobileWidth: match?.mobileWidth ?? 500,
          mobileHeight: match?.mobileHeight ?? 292,
        } as BlogPost;
      });
    }
    return data?.posts ?? DEFAULT_POSTS;
  }, [settings?.posts, data?.posts]);

  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1);

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleDotClick = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const slides = track.querySelectorAll(".nintara-blog__slide");
    if (slides[index]) {
      track.scrollTo({
        left: (slides[index] as HTMLElement).offsetLeft,
        behavior: "smooth",
      });
    }
    setActiveSlide(index);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const slides = track.querySelectorAll(".nintara-blog__slide");
        const scrollLeft = track.scrollLeft;
        let closest = 0;
        let minDist = Infinity;
        slides.forEach((slide, i) => {
          const dist = Math.abs((slide as HTMLElement).offsetLeft - scrollLeft);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        setActiveSlide(closest);
      }, 100);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className={`nintara-blog ${className ?? ""}`}>
      <div className="nintara-blog__wrapper">
        {/* Heading row */}
        <div className="nintara-blog__heading-row">
          <h4 className="nintara-blog__heading">{heading}</h4>
          <Link href={seeAllLink} className="nintara-blog__see-all">
            {seeAllText}
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="nintara-blog__grid">
          {/* Left: featured primary card */}
          {primaryPost && <PrimaryCard post={primaryPost} />}

          {/* Right: secondary cards stacked */}
          <div className="nintara-blog__side-stack">
            {secondaryPosts.map((post) => (
              <SecondaryCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Mobile slider */}
        <div className="nintara-blog__mobile-wrapper">
          <div className="nintara-blog__slider-track" ref={trackRef}>
            {posts.map((post) => (
              <MobileSlideCard key={post.id} post={post} />
            ))}
          </div>
          <div className="nintara-blog__pagination">
            {posts.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={`nintara-blog__dot${i === activeSlide ? " nintara-blog__dot--active" : ""}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
