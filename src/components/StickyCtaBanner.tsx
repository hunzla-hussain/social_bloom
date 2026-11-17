'use client';

import { useEffect, useState } from "react";
import s from "./StickyCtaBanner.module.css";

const BOOKING_URL = "https://socialbloom.io/schedule";

/** How far the visitor scrolls before the banner slides in. */
const SHOW_AFTER_PX = 400;

/**
 * The banner hides again once this element reaches the screen, so it never
 * doubles up with the page's closing call to action or covers the footer.
 */
const STOP_SELECTOR = "[data-sticky-cta-stop]";

/**
 * Fixed call-to-action banner for the lender page (copy from Caleb's mockup).
 * Slides up from the bottom of the screen after a short scroll.
 */
export function StickyCtaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const stop = document.querySelector(STOP_SELECTOR);
      const reachedEnd =
        stop != null && stop.getBoundingClientRect().top < window.innerHeight;
      setVisible(window.scrollY > SHOW_AFTER_PX && !reachedEnd);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside
      className={`${s.banner} ${visible ? s.visible : ""}`}
      aria-label="Book a call"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className={s.text}>
        <p className={s.title}>
          Ready to see who&apos;s looking for business financing right now?
        </p>
        <p className={s.body}>
          Book a call and we&apos;ll show you exactly which borrowers we can put
          in front of you.
        </p>
      </div>
      <a
        className={s.button}
        href={BOOKING_URL}
        target="_blank"
        rel="noopener"
      >
        Speak with borrowers now
      </a>
    </aside>
  );
}
