'use client';

import { useRef, useState } from "react";
import s from "./BorrowerCarousel.module.css";

const BOOKING_URL = "https://socialbloom.io/schedule";

// Sample scenarios from Caleb's carousel design — not real client data.
const BORROWERS = [
  {
    industry: "Commercial Real Estate",
    product: "CRE Acquisition",
    title: "Commercial investor seeking financing for an income-producing property",
    amount: "$2,000,000",
    facts: [
      ["BUSINESS TYPE", "Property investor"],
      ["REGION", "Southeast US"],
      ["FINANCING TYPE", "CRE acquisition loan"],
    ],
    description:
      "A commercial real estate investor evaluating acquisition financing for an additional property in an established portfolio.",
  },
  {
    industry: "Real Estate Development",
    product: "Bridge Financing",
    title: "Commercial developer exploring short-term capital for a new project",
    amount: "$1,500,000",
    facts: [
      ["BUSINESS TYPE", "Property developer"],
      ["REGION", "Southwest US"],
      ["FINANCING TYPE", "Bridge loan"],
    ],
    description:
      "Commercial development firm exploring transitional financing to support an upcoming project milestone or refinance.",
  },
  {
    industry: "Manufacturing",
    product: "Equipment Financing",
    title: "Manufacturer financing new industrial production equipment",
    amount: "$500,000",
    facts: [
      ["ANNUAL REVENUE", "$5M–$10M"],
      ["REGION", "Midwest US"],
      ["FINANCING TYPE", "Equipment loan"],
    ],
    description:
      "Industrial manufacturer looking into additional production capacity and machinery financing for a potential expansion.",
  },
  {
    industry: "Business Services",
    product: "Business Term Loan",
    title: "Established B2B service provider exploring expansion capital",
    amount: "$400,000",
    facts: [
      ["ANNUAL REVENUE", "$3M–$7M"],
      ["REGION", "Northeast US"],
      ["FINANCING TYPE", "Business term loan"],
    ],
    description:
      "Growing service business considering longer-term funding for hiring, operations, and additional locations.",
  },
  {
    industry: "Transportation",
    product: "Fleet Financing",
    title: "Trucking operator evaluating financing for additional vehicles",
    amount: "$300,000",
    facts: [
      ["FLEET SIZE", "20–50 vehicles"],
      ["REGION", "Texas"],
      ["FINANCING TYPE", "Commercial vehicle loan"],
    ],
    description:
      "Regional trucking company evaluating ways to expand its fleet with commercial vehicles and equipment.",
  },
  {
    industry: "Wholesale Distribution",
    product: "Business Line of Credit",
    title: "Wholesale distributor reviewing financing for inventory growth",
    amount: "$250,000",
    facts: [
      ["ANNUAL REVENUE", "$8M–$15M"],
      ["REGION", "Great Lakes US"],
      ["FINANCING TYPE", "Revolving credit"],
    ],
    description:
      "Established distributor managing inventory cycles and payment terms, a relevant fit for revolving commercial credit.",
  },
  {
    industry: "Construction",
    product: "Working Capital",
    title: "Construction contractor evaluating working capital for larger projects",
    amount: "$150,000",
    facts: [
      ["ANNUAL REVENUE", "$2M–$5M"],
      ["REGION", "Southeast US"],
      ["FINANCING TYPE", "Working capital"],
    ],
    description:
      "Commercial contractor with ongoing payroll and materials costs, potentially suited for short-term financing between customer payments.",
  },
  {
    industry: "Hospitality",
    product: "Merchant Cash Advance",
    title: "Restaurant group exploring additional short-term working capital",
    amount: "$75,000",
    facts: [
      ["ANNUAL REVENUE", "$1M–$3M"],
      ["REGION", "Florida"],
      ["FINANCING TYPE", "MCA"],
    ],
    description:
      "Multi-location restaurant group with card-based sales and changing cash flow needs, a relevant target for alternative financing.",
  },
] as const;

const SWIPE_THRESHOLD_PX = 48;

export function BorrowerCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = BORROWERS.length;

  // Arrows wrap around, as in the design (last → first and back)
  const go = (step: number) => setCurrent((i) => (i + step + count) % count);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className={s.section}
      aria-roledescription="carousel"
      aria-label="Sample business borrowers"
    >
      <div className={s.wrap}>
        <div className={s.head}>
          <div className={s.headText}>
            <div className={s.eyebrow}>SAMPLE BUSINESS BORROWERS</div>
            <h2>
              These are the business borrowers <span>we find for you</span>
            </h2>
            <p className={s.lead}>
              Explore the types of businesses we target and the financing
              conversations we help book directly onto your calendar.
            </p>
          </div>
          <div className={s.controls}>
            <span className={s.counter} aria-live="polite">
              <b>{pad(current + 1)}</b> / {pad(count)}
            </span>
            <button
              type="button"
              className={s.arrow}
              onClick={() => go(-1)}
              aria-label="Previous borrower"
              title="Previous borrower"
            >
              ‹
            </button>
            <button
              type="button"
              className={s.arrow}
              onClick={() => go(1)}
              aria-label="Next borrower"
              title="Next borrower"
            >
              ›
            </button>
          </div>
        </div>

        <div
          className={s.viewport}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) go(delta > 0 ? -1 : 1);
          }}
        >
          <div
            className={s.track}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {BORROWERS.map((b, i) => {
              const hidden = i !== current;
              return (
                <div
                  key={b.title}
                  className={s.slide}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={hidden}
                  inert={hidden}
                >
                  <article className={s.card}>
                    <div className={s.main}>
                      <div className={s.tags}>
                        <span className={s.industry}>{b.industry}</span>
                        <span className={s.product}>{b.product}</span>
                      </div>
                      <h3>{b.title}</h3>
                      <p className={s.description}>{b.description}</p>
                      <div className={s.facts}>
                        {b.facts.map(([label, value]) => (
                          <div key={label} className={s.fact}>
                            <div className={s.factLabel}>{label}</div>
                            <div className={s.factValue}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={s.side}>
                      <div className={s.sideBlock}>
                        <div className={s.sideLabel}>
                          SAMPLE FINANCING AMOUNT
                        </div>
                        <div className={s.amount}>{b.amount}</div>
                      </div>
                      <div className={s.divider} />
                      <div className={s.sideBlock}>
                        <div className={`${s.sideLabel} ${s.soft}`}>
                          QUALIFIED APPOINTMENT
                        </div>
                        <div className={s.price}>
                          $250<small> / meeting</small>
                        </div>
                      </div>
                      <a
                        className={s.button}
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener"
                      >
                        Speak with borrowers now ↗
                      </a>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <nav className={s.dots} aria-label="Choose borrower example">
          {BORROWERS.map((b, i) => (
            <button
              key={b.title}
              type="button"
              className={`${s.dot} ${i === current ? s.active : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Show borrower example ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              title={`Show borrower example ${i + 1}`}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
