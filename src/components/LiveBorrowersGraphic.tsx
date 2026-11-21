"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import s from "./LiveBorrowersGraphic.module.css";

// Hero graphic for the lender page: Caleb's "live borrower demand" design
// (lenders-live-borrowers.html, 21 Nov 2026), in the right column of the hero where the
// "Campaign performance" card used to be. The stage is designed at 1040x680 and scaled to the
// width of its column (Caleb's 1040x680 file with its empty 40px margin trimmed to 960x640).

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const STAGE_WIDTH = 960;
const TOAST_MS = 4500;
const BOOKING_URL = "https://socialbloom.io/schedule";

/**
 * Runs as soon as the HTML is parsed, so the first paint is already scaled.
 * The effect below keeps it in step afterwards (resizes, client-side navigation).
 */
const FIT_ON_LOAD = `(function(){var h=document.currentScript&&document.currentScript.previousElementSibling;if(!h||!h.firstElementChild)return;h.firstElementChild.style.transform='scale('+h.clientWidth/${STAGE_WIDTH}+')';})();`;

type Borrower = {
  product: string;
  title: string;
  amount: string;
  size: string;
  region: string;
  when: string;
};

// Caleb's list: edit it to change the borrowers in the feed and the pop-up.
const BORROWERS: Borrower[] = [
  { product: "CRE Acquisition", title: "Property investor acquiring a multifamily building", amount: "$2.0M", size: "Owner / Principal", region: "Southeast", when: "Active now" },
  { product: "Equipment", title: "Manufacturer adding a new production line", amount: "$500K", size: "$5M–$10M revenue", region: "Midwest", when: "Active now" },
  { product: "Working Capital", title: "Contractor taking on two large commercial jobs", amount: "$150K", size: "$2M–$5M revenue", region: "Southeast", when: "1 min ago" },
  { product: "Bridge", title: "Developer closing a gap before permanent financing", amount: "$1.5M", size: "Owner / Principal", region: "Southwest", when: "2 min ago" },
  { product: "Fleet", title: "Trucking operator adding trucks to its fleet", amount: "$300K", size: "20–50 vehicles", region: "Texas", when: "4 min ago" },
  { product: "Invoice Factoring", title: "Staffing agency waiting on net-60 invoices", amount: "$350K", size: "$4M–$8M revenue", region: "California", when: "5 min ago" },
  { product: "Term Loan", title: "B2B service provider expanding into a new region", amount: "$400K", size: "$3M–$7M revenue", region: "Northeast", when: "7 min ago" },
  { product: "Line of Credit", title: "Wholesale distributor stocking up for peak season", amount: "$250K", size: "$8M–$15M revenue", region: "Great Lakes", when: "9 min ago" },
  { product: "MCA", title: "Restaurant group renovating a flagship location", amount: "$75K", size: "$1M–$3M revenue", region: "Florida", when: "12 min ago" },
  { product: "Revenue-Based", title: "Software company funding a new sales team", amount: "$600K", size: "$3M–$6M revenue", region: "New York", when: "15 min ago" },
  { product: "Commercial Vehicle", title: "Landscaping company buying new service trucks", amount: "$180K", size: "$2M–$4M revenue", region: "Georgia", when: "18 min ago" },
  { product: "Equipment", title: "Dental group upgrading imaging across 4 offices", amount: "$420K", size: "$3M–$6M revenue", region: "Arizona", when: "22 min ago" },
];

const PRODUCTS = [
  "Working capital",
  "MCA",
  "Term loans",
  "Lines of credit",
  "Equipment",
  "Fleet",
  "CRE",
  "Bridge",
  "Invoice factoring",
];

const AVATARS = [
  { label: "CRE", background: "#EEEDFF", color: "#3A2BD1" },
  { label: "EQ", background: "#E3F6EC", color: "#12774A" },
  { label: "LOC", background: "#FFF1DB", color: "#8A4B00" },
  { label: "WC", background: "#E2F1FB", color: "#0B5A8A" },
];

function BorrowerCard({ borrower }: { borrower: Borrower }) {
  return (
    <div className={s.borrower}>
      <div className={s.borrowerMain}>
        <div className={s.tags}>
          <span className={s.tag}>{borrower.product}</span>
          <span className={`${s.tag} ${s.isIntent}`}>High intent</span>
          <span className={s.when}>{borrower.when}</span>
        </div>
        <div className={s.borrowerTitle}>{borrower.title}</div>
        <div className={s.meta}>
          {borrower.size} · {borrower.region}
        </div>
      </div>
      <div className={s.borrowerSide}>
        <div className={s.amount}>
          <b>{borrower.amount}</b>
          <span>requested</span>
        </div>
        <span className={s.speak}>Speak now</span>
      </div>
    </div>
  );
}

export function LiveBorrowersGraphic() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [toastIndex, setToastIndex] = useState(0);
  const [cycling, setCycling] = useState(false);

  // Scale the 960x640 stage to the column width.
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const fit = () => {
      stage.style.transform = `scale(${root.clientWidth / STAGE_WIDTH})`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Swap the "New borrower wants to talk" pop-up only while the graphic is on screen,
  // and not at all for visitors who ask for reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => setCycling(inView && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(root);
    motion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(
      () => setToastIndex((i) => (i + 1) % BORROWERS.length),
      TOAST_MS,
    );
    return () => window.clearInterval(id);
  }, [cycling]);

  const toast = BORROWERS[toastIndex];

  return (
    <>
      <div
        aria-label="Live feed of business borrowers looking for financing and asking to speak with a lender now"
        className={`${s.root} ${jakarta.variable}`}
        ref={rootRef}
        role="group"
      >
        <div className={s.stage} ref={stageRef} suppressHydrationWarning>
          {/* Main live feed */}
          <div className={`${s.card} ${s.feedCard}`}>
            <div aria-hidden className={s.head}>
              <div>
                <div className={s.live}>
                  <span className={s.dot} />
                  LIVE
                </div>
                <div className={s.title}>Business borrowers looking for financing</div>
              </div>
              <div className={s.badge}>Updated in real time</div>
            </div>
            <div aria-hidden className={s.feed}>
              {/* Listed twice so the scroll loops seamlessly */}
              <div className={s.track}>
                {BORROWERS.concat(BORROWERS).map((borrower, i) => (
                  <BorrowerCard borrower={borrower} key={i} />
                ))}
              </div>
            </div>
            <div className={s.foot}>
              <div aria-hidden className={s.footText}>
                Every borrower has replied and asked to talk.
              </div>
              <a className={s.cta} href={BOOKING_URL} rel="noopener" target="_blank">
                Speak with borrowers now
                <svg
                  aria-hidden
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.6"
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>

          <div className={s.disclaimer}>
            Illustrative examples. Social Bloom is not a lender and does not pre-approve borrowers.
          </div>

          {/* "New borrower wants to talk": the key remounts it so the entrance replays on every swap */}
          <div aria-hidden className={`${s.card} ${s.toast}`} key={toastIndex}>
            <div className={s.row}>
              <div className={s.bell}>
                <svg
                  fill="none"
                  height="15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                  viewBox="0 0 24 24"
                  width="15"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
              </div>
              <div className={s.toastHead}>New borrower wants to talk</div>
              <div className={s.toastTime}>Just now</div>
            </div>
            <div className={s.toastTitle}>{toast.title}</div>
            <div className={s.toastFoot}>
              <div className={s.wants}>
                Requesting <b>{toast.amount}</b> · {toast.product}
              </div>
              <div className={s.region}>{toast.region}</div>
            </div>
          </div>

          {/* Matched products */}
          <div aria-hidden className={`${s.card} ${s.match}`}>
            <div className={s.matchHead}>
              <svg
                fill="none"
                height="16"
                stroke="#4F3FF0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1" />
              </svg>
              Matched to the products you fund
            </div>
            <div className={s.chips}>
              {PRODUCTS.map((product) => (
                <span className={s.chip} key={product}>
                  {product}
                </span>
              ))}
            </div>
          </div>

          {/* Ready today */}
          <div aria-hidden className={`${s.card} ${s.ready}`}>
            <div className={s.readyLabel}>Borrowers ready to speak with a lender today</div>
            <div className={s.row} style={{ gap: 14 }}>
              {/* Caleb's placeholder number: replace 24 with the real daily count when there is one */}
              <div className={s.big}>24</div>
              <div className={s.avatars}>
                {AVATARS.map((a) => (
                  <span
                    key={a.label}
                    style={{ background: a.background, color: a.color, fontSize: 10 }}
                  >
                    {a.label}
                  </span>
                ))}
                <span style={{ width: "auto", padding: "0 9px", background: "#F2F2F8", color: "#3B3F52" }}>
                  +20
                </span>
              </div>
            </div>
            <div className={s.active}>
              <i />
              Active right now
            </div>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: FIT_ON_LOAD }} />
    </>
  );
}
