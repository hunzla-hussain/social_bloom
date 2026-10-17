'use client';

import { useState, type CSSProperties } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import s from "./page.module.css";

const cx = (...names: (string | false)[]) =>
  names
    .filter(Boolean)
    .map((n) => s[n as string])
    .join(" ");

const WIN_RATE = 0.25;
const FEE_PER_APPOINTMENT = 250;

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

// Same client list, links, and icons as the logo banner on socialbloom.io
const CLIENTS = [
  { name: "BEST Lending Co", href: "https://bestlendingco.com/", domain: "bestlendingco.com" },
  { name: "Advertise Purple", href: "https://www.advertisepurple.com/", domain: "advertisepurple.com" },
  { name: "Bifrost AI", href: "https://www.bifrost.ai/", domain: "bifrost.ai" },
  { name: "Ardent Blue", href: "https://ardentblue.com/", domain: "ardentblue.com" },
  { name: "Yandex Self-Driving", href: "https://yandex.com/company/news/2021-12-21", domain: "yandex.com" },
  { name: "Surefoot", href: "https://surefoot.me/", domain: "surefoot.me" },
  { name: "Spacebar Studios", href: "https://www.spacebarstudios.co/", domain: "spacebarstudios.co" },
  { name: "Revolt Digital", href: "https://revolt.digital/", domain: "revolt.digital" },
  { name: "CloudTask", href: "https://cloudtask.com/", domain: "cloudtask.com" },
] as const;

const BEST_LENDING_VIDEO =
  "https://pub-73fda59ea9644b9eaa960e7dad5f2fd6.r2.dev/socialbloom-videos/Best%20Lending%20Testimonial%20_%20%241M%2B%20in%20Pipeline%20Generated%20with%20SocialBloom%20(1).mp4";

const INDUSTRIES = [
  {
    icon: "↗",
    title: "Working Capital & MCA",
    body: "Reach business owners whose industries and company profiles match your working capital or revenue-based financing offer.",
  },
  {
    icon: "▤",
    title: "Business Loans & Lines of Credit",
    body: "Start conversations with company decision-makers about term loans, expansion financing, and revolving credit options.",
  },
  {
    icon: "⚙",
    title: "Equipment Financing",
    body: "Target equipment-heavy businesses across transportation, manufacturing, construction, and related industries.",
  },
  {
    icon: "▥",
    title: "Commercial Real Estate",
    body: "Connect with real estate investors, commercial operators, and developers who fit your funding programs.",
  },
  {
    icon: "⇄",
    title: "Invoice Factoring",
    body: "Build campaigns for companies in industries where receivables financing may solve a genuine cash-flow problem.",
  },
  {
    icon: "◎",
    title: "Specialty Commercial Finance",
    body: "Have a specialized lending product? We shape the targeting and messaging around your specific market.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    icon: "◎",
    title: "Define the target",
    body: "We map your financing products to an approved Ideal Customer Profile: industries, regions, company size, decision-makers, and other criteria.",
  },
  {
    n: "02",
    icon: "↗",
    title: "Launch the engine",
    body: "We build prospect lists, manage sending infrastructure, personalize your offer, and launch targeted cold email campaigns.",
  },
  {
    n: "03",
    icon: "✉",
    title: "Handle the replies",
    body: "Our team follows up with interested prospects, evaluates agreed qualification criteria, and coordinates the meeting.",
  },
  {
    n: "04",
    icon: "✓",
    title: "Take the meeting",
    body: "Your team meets the prospect, assesses financing eligibility, handles underwriting, and works toward funding.",
  },
] as const;

const ICP_LINES = [
  ["Financing vertical", "Working Capital"],
  ["Target business", "Established SMBs"],
  ["Geography", "Approved states"],
  ["Target contact", "Owner / CFO / Finance Lead"],
  ["Revenue requirements", "Set with lender"],
  ["Qualification standard", "Approved ICP Matrix"],
] as const;

const PRICE_ITEMS = [
  "Custom ICP setup",
  "Business targeting",
  "Campaign infrastructure",
  "Personalized outreach",
  "Reply management",
  "Calendar booking",
  "Campaign optimization",
  "Reporting & support",
] as const;

const FAQS = [
  {
    q: "Who is Lender Bloom designed for?",
    a: "Business lenders, MCA and working capital providers, commercial real estate financing companies, equipment lenders, and other companies selling financing products to businesses—not consumer mortgage or personal loan marketers.",
  },
  {
    q: "Are these exclusive business borrower appointments?",
    a: "We build targeted campaigns for your financing offer and schedule resulting appointments with your team. This is not a shared lead-resale marketplace. Specific exclusivity terms should be confirmed in the signed agreement.",
  },
  {
    q: "Can you target my underwriting criteria?",
    a: "We can target around agreed, reasonably available business attributes such as industry, geography, company size, and identified decision-makers. We cannot independently verify every underwriting requirement before a lender performs due diligence.",
  },
  {
    q: "Do you pre-approve prospects or guarantee funded loans?",
    a: "No. Social Bloom is an outbound appointment-setting service, not a lender or underwriting provider. Your team handles documentation, credit assessment, eligibility, offers, and funding decisions.",
  },
  {
    q: "What counts as a qualified appointment?",
    a: "The applicable qualification criteria come from your approved ICP Matrix and governing agreement. Qualification, attendance, disputes, and credits follow the agreement rather than a generic website definition.",
  },
  {
    q: "How does pricing work?",
    a: "The advertised standard performance fee is $250 per qualified appointment, plus an agreed one-time setup fee. Exact charges, billing events, guarantees, and any custom pricing are documented in the signed agreement.",
  },
  {
    q: "How fast can we launch?",
    a: "Timing depends on onboarding, ICP and messaging approval, and outbound infrastructure readiness. Your team will receive a campaign-specific launch timeline.",
  },
] as const;

function BookingLink({
  variant,
  style,
}: {
  variant: "white" | "dark";
  style?: CSSProperties;
}) {
  return (
    <a
      href="https://socialbloom.io/schedule"
      target="_blank"
      rel="noopener"
      className={cx("btn", variant)}
      style={style}
    >
      Get Guaranteed Meetings ↗
    </a>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [meetings, setMeetings] = useState(10);
  const [avgLoan, setAvgLoan] = useState("50000");
  const [revenueRate, setRevenueRate] = useState("5");

  const deals = meetings * WIN_RATE;
  const funded = deals * Math.max(0, Number(avgLoan) || 0);
  const gross =
    (funded * Math.min(100, Math.max(0, Number(revenueRate) || 0))) / 100;

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className={s.root} id="top">
        {/* HERO */}
        <section className={s.hero}>
          <div className={cx("wrap", "hero-grid")}>
            <div className={s.reveal}>
              <div className={cx("eyebrow", "mint")}>
                B2B LENDING ACQUISITION · DONE FOR YOU
              </div>
              <h1>
                Your next business borrower is{" "}
                <em>one conversation away.</em>
              </h1>
              <p>
                Stop competing for recycled leads. Social Bloom builds and runs
                your outbound engine—targeting the right companies, starting
                conversations, and booking qualified business financing
                appointments straight onto your calendar.
              </p>
              <div className={s["hero-actions"]}>
                <BookingLink variant="white" />
              </div>
              <div className={s["hero-proof"]}>
                <span>No shared lead lists</span>
                <span>Custom borrower targeting</span>
                <span>Pay per qualified appointment</span>
              </div>
            </div>
            <div className={cx("dash", "reveal")}>
              <div className={s["dash-top"]}>
                <span>✣  Campaign performance</span>
                <span className={s.live}>● LIVE SYSTEM</span>
              </div>
              <div className={s["dash-stats"]}>
                <div className={s.metric}>
                  <small>Qualified appointments</small>
                  <strong>82</strong>
                  <i>✓ Booked conversations</i>
                </div>
                <div className={s.metric}>
                  <small>Pipeline value</small>
                  <strong>$1.4M</strong>
                  <i>↗ In three months</i>
                </div>
              </div>
              <div className={s.chart}>
                <div className={s["chart-head"]}>
                  <span>Pipeline momentum</span>
                  <span style={{ color: "#818ba1" }}>90-day overview</span>
                </div>
                <svg
                  aria-label="Illustrative growth curve"
                  role="img"
                  viewBox="0 0 420 130"
                >
                  <defs>
                    <linearGradient
                      id="lb-pipeline-grad"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop stopColor="#5F5FFF" stopOpacity=".25" />
                      <stop offset="1" stopColor="#5F5FFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 118L43 112L79 102L112 106L151 87L186 93L226 62L263 68L304 43L346 49L383 21L420 9L420 130L0 130Z"
                    fill="url(#lb-pipeline-grad)"
                  />
                  <path
                    d="M0 118L43 112L79 102L112 106L151 87L186 93L226 62L263 68L304 43L346 49L383 21L420 9"
                    fill="none"
                    stroke="#5F5FFF"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
              </div>
              <div className={s.pipeline}>
                <span className={s.avatar}>BL</span>
                <div>
                  <b>Best Lending Co</b>
                  <small>Real client case study • Cold email</small>
                </div>
                <label>82 SQLs</label>
              </div>
              <div className={s["dash-note"]}>
                Real published case-study totals; chart is illustrative, not
                historical time-series data.
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <div className={s.logos}>
          <div className={cx("wrap", "logos-inner")}>
            <p>A proven outbound engine by Social Bloom</p>
            <div className={s.marquee} aria-label="Client companies">
              <div className={s["marquee-track"]}>
                {/* Two identical groups so the loop is seamless at -50% */}
                {[false, true].map((isCopy) => (
                  <div
                    key={String(isCopy)}
                    className={s["marquee-group"]}
                    aria-hidden={isCopy || undefined}
                  >
                    {CLIENTS.map((client) => (
                      <a
                        key={client.name}
                        href={client.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        tabIndex={isCopy ? -1 : undefined}
                        className={s["logo-chip"]}
                      >
                        <span className={s["logo-icon"]}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${client.domain}&sz=64`}
                            alt={isCopy ? "" : client.name}
                            width={32}
                            height={32}
                          />
                        </span>
                        <span className={s["logo-name"]}>{client.name}</span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className={s.stats}>
          <div className={cx("wrap", "stats-grid")}>
            <div className={s.stat}>
              <strong>$250M+</strong>
              <p>Pipeline created across Social Bloom</p>
            </div>
            <div className={s.stat}>
              <strong>25,000+</strong>
              <p>Leads generated across Social Bloom</p>
            </div>
            <div className={s.stat}>
              <strong>100s</strong>
              <p>Clients served across Social Bloom</p>
            </div>
          </div>
        </div>

        {/* WHO WE HELP — id kept as "about" so the existing header/footer links work */}
        <section className={s.sec} id="about">
          <div className={s.wrap}>
            <div className={s.secthead}>
              <div className={s.eyebrow}>WHO WE HELP</div>
              <h2>
                Built for business financing.{" "}
                <span style={{ color: "var(--violet)" }}>
                  Not consumer loans.
                </span>
              </h2>
              <p className={s.lead}>
                Your borrowers are business owners and commercial
                decision-makers. Your acquisition strategy should reflect that.
                We tailor campaigns to the financing products you actually
                offer.
              </p>
            </div>
            <div className={s.cards}>
              {INDUSTRIES.map((item) => (
                <article key={item.title} className={s.service}>
                  <div className={s["service-icon"]}>{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className={cx("sec", "problem")}>
          <div className={cx("wrap", "problem-grid")}>
            <div>
              <div className={cx("eyebrow", "mint")}>
                THE REAL PIPELINE PROBLEM
              </div>
              <h2>
                Your funding team shouldn&apos;t spend all day{" "}
                <span style={{ color: "var(--mint)" }}>hunting for deals.</span>
              </h2>
              <p className={s.lead}>
                Brokers, lead vendors, referrals, and paid ads can all have a
                place. None should be your only engine for getting in front of
                new business borrowers.
              </p>
              <BookingLink variant="white" style={{ marginTop: 25 }} />
            </div>
            <div className={s.comparison}>
              <div className={s.compare}>
                <span className={s.cross}>✕</span>
                <div>
                  <b>Recycled leads and crowded inboxes</b>
                  <p>
                    Paying to chase the same prospects who may already be
                    talking with several competing financing companies.
                  </p>
                </div>
              </div>
              <div className={s.compare}>
                <span className={s.cross}>✕</span>
                <div>
                  <b>Feast-or-famine referrals</b>
                  <p>
                    Depending on unpredictable introductions leaves your sales
                    team vulnerable to pipeline gaps.
                  </p>
                </div>
              </div>
              <div className={cx("compare", "green")}>
                <span className={s.tick}>✓</span>
                <div>
                  <b style={{ color: "var(--mint)" }}>
                    Your own targeted outbound channel
                  </b>
                  <p>
                    Proactively reach relevant business decision-makers with
                    campaigns built around your actual financing criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className={cx("sec", "process")} id="how">
          <div className={s.wrap}>
            <div className={s.secthead}>
              <div className={s.eyebrow}>THE SOCIAL BLOOM SYSTEM</div>
              <h2>
                We build the pipeline.
                <br />
                <span style={{ color: "var(--violet)" }}>
                  You close the deals.
                </span>
              </h2>
              <p className={s.lead}>
                One dedicated system. Four clear steps. We handle the heavy
                lifting between identifying the right companies and getting
                meetings onto your calendar.
              </p>
            </div>
            <div className={s.steps}>
              {STEPS.map((step) => (
                <div key={step.n} className={s.step}>
                  <div className={s["step-number"]}>
                    {step.n} <span>{step.icon}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDY — id kept as "cases" for the existing header/footer links */}
        <section className={cx("sec", "case")} id="cases">
          <div className={cx("wrap", "case-grid")}>
            <div>
              <div className={s.eyebrow}>ACTUAL LENDING CLIENT RESULTS</div>
              <h2>
                Not another lead-generation promise.{" "}
                <span style={{ color: "var(--violet)" }}>
                  Real lending pipeline.
                </span>
              </h2>
              <p className={s.lead}>
                Best Lending Co needed a reliable way to reach repeat real
                estate investors—without pulling its team away from closing.
                Social Bloom built targeted prospecting and personalized cold
                email that carried outreach through to booked calls.
              </p>
              <div className={s["case-list"]}>
                <div>
                  <span className={s.check}>✓</span>
                  <span>
                    <b>142 leads generated</b> through targeted investor
                    prospecting.
                  </span>
                </div>
                <div>
                  <span className={s.check}>✓</span>
                  <span>
                    <b>82 sales-qualified leads</b> generated through the
                    campaign.
                  </span>
                </div>
                <div>
                  <span className={s.check}>✓</span>
                  <span>
                    <b>$1.4 million in pipeline value</b> in three months.
                  </span>
                </div>
              </div>
              <BookingLink variant="dark" />
            </div>
            <div className={s["case-card"]}>
              <div className={s["case-ident"]}>
                <div className={s["case-logo"]}>
                  BEST
                  <br />
                  LENDING
                </div>
                <div>
                  <b>Best Lending Co</b>
                  <small>
                    Real estate investor financing • Client case study
                  </small>
                </div>
              </div>
              <div className={s["case-numbers"]}>
                <div>
                  <strong>$1.4M</strong>
                  <span>Pipeline value</span>
                </div>
                <div>
                  <strong>82</strong>
                  <span>Sales-qualified leads</span>
                </div>
              </div>
              <div className={s["case-bar"]}>
                <b>142 leads generated</b>
                <div className={s.bar}>
                  <span />
                </div>
                <p
                  style={{
                    fontSize: 11,
                    lineHeight: 1.7,
                    color: "#757d94",
                    marginBottom: 0,
                  }}
                >
                  Outreach → positive conversations → qualified investor
                  appointments
                </p>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#7d8699",
                  marginTop: 23,
                  lineHeight: 1.7,
                }}
              >
                Published Social Bloom case study. Historical client-specific
                results are not a funding or appointment guarantee.
              </div>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={s.testimonial}>
              {/* #t=0.1 makes Safari show the first frame instead of a black box */}
              <video controls playsInline preload="metadata">
                <source src={`${BEST_LENDING_VIDEO}#t=0.1`} type="video/mp4" />
              </video>
              <div className={s["testimonial-bar"]}>
                <div>
                  <small>CLIENT TESTIMONIAL</small>
                  <b>Best Lending Co growth story</b>
                </div>
                <span>$1M+ in pipeline generated with Social Bloom</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRECISION TARGETING */}
        <section className={cx("sec", "qual")}>
          <div className={cx("wrap", "qual-grid")}>
            <div>
              <div className={cx("eyebrow", "mint")}>PRECISION TARGETING</div>
              <h2>
                Not just any company.{" "}
                <span style={{ color: "var(--mint)" }}>
                  Your ideal business borrower.
                </span>
              </h2>
              <p className={s.lead}>
                Every lender has different products, restrictions, and target
                customers. That&apos;s why we build outbound around your
                approved ICP Matrix, instead of sending generic blasts to every
                business owner we can find.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 9,
                  marginTop: 28,
                }}
              >
                {[
                  "Industry",
                  "Revenue criteria",
                  "Geography",
                  "Company size",
                  "Decision-maker",
                  "Financing category",
                ].map((pill) => (
                  <span key={pill} className={s.pill}>
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className={s["icp-box"]}>
              <div className={s["icp-title"]}>
                Targeting Profile <span>✓ Example ICP</span>
              </div>
              {ICP_LINES.map(([label, value]) => (
                <div key={label} className={s["icp-line"]}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))}
              <div className={s["icp-foot"]}>
                Sample targeting illustration only. We do not represent
                pre-approved borrowers or guarantee a funding decision.
              </div>
            </div>
          </div>
        </section>

        {/* PRICING — id kept as "guarantee" for the existing header/footer links */}
        <section className={cx("sec", "pricing")} id="guarantee">
          <div className={cx("wrap", "pricing-grid")}>
            <div>
              <div className={s.eyebrow}>SIMPLE, PERFORMANCE-BASED MODEL</div>
              <h2>
                Pay for{" "}
                <span style={{ color: "var(--violet)" }}>
                  qualified opportunities.
                </span>{" "}
                Not just activity.
              </h2>
              <p className={s.lead}>
                A clear, two-part pricing model: a one-time onboarding fee to
                build and launch your outbound system, followed by $250 per
                qualified appointment under your client agreement.
              </p>
              <div className={s.calculator}>
                <div className={s["calc-row"]}>
                  <b>Explore meeting volume</b>
                  <output>{meetings} meetings</output>
                </div>
                <input
                  aria-label="Monthly qualified appointment count"
                  className={s.range}
                  type="range"
                  min={5}
                  max={40}
                  step={5}
                  value={meetings}
                  onChange={(e) => setMeetings(Number(e.target.value))}
                />
                <div className={s["calc-inputs"]}>
                  <div>
                    <label htmlFor="avg-loan">
                      Average funded loan amount
                    </label>
                    <input
                      aria-label="Average funded loan amount in dollars"
                      id="avg-loan"
                      inputMode="decimal"
                      min={0}
                      step={1000}
                      type="number"
                      value={avgLoan}
                      onChange={(e) => setAvgLoan(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="revenue-rate">
                      Your revenue on funded volume
                    </label>
                    <div className={s["percentage-field"]}>
                      <input
                        aria-label="Lender revenue as percentage of funded amount"
                        id="revenue-rate"
                        inputMode="decimal"
                        max={100}
                        min={0}
                        step={0.1}
                        type="number"
                        value={revenueRate}
                        onChange={(e) => setRevenueRate(e.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
                <div className={s["calc-row"]}>
                  <span style={{ fontSize: 12, color: "#738097" }}>
                    Assumed appointment-to-funded-deal win rate
                  </span>
                  <strong style={{ color: "var(--deep)" }}>25%</strong>
                </div>
                <div aria-live="polite" className={s["calc-results"]}>
                  <div className={s["calc-result"]}>
                    <small>Estimated deals closed</small>
                    <output>
                      {deals.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </output>
                  </div>
                  <div className={s["calc-result"]}>
                    <small>Potential funded deal volume</small>
                    <output>{usd(funded)}</output>
                  </div>
                  <div
                    className={cx("calc-result", "highlight")}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <small>
                      Estimated gross lender revenue{" "}
                      <span style={{ fontWeight: 400 }}>
                        (funded volume × your revenue rate)
                      </span>
                    </small>
                    <output>{usd(gross)}</output>
                  </div>
                </div>
                <div className={s["calc-breakdown"]}>
                  <div className={s["calc-row"]}>
                    <span>Performance fees ($250 per qualified appointment)</span>
                    <output>{usd(meetings * FEE_PER_APPOINTMENT)}</output>
                  </div>
                </div>
                <p className={s["calc-note"]}>
                  Illustrative scenario, not a forecast or guarantee. Onboarding
                  is not included in this calculator. 25% is an assumed
                  appointment-to-funded-deal conversion rate; actual results may
                  differ. Fractional deals represent an expected-value estimate,
                  not partially funded loans. Funded deal volume is not lender
                  revenue. Gross lender revenue depends on your actual economics
                  and excludes servicing, funding costs, defaults, and other
                  expenses. Tax and other agreed charges excluded.
                </p>
              </div>
            </div>
            <div className={s["price-card"]}>
              <div className={s["price-tag"]}>
                ONE-TIME ONBOARDING + PERFORMANCE PRICING
              </div>
              <div className={s["onboarding-fee"]}>
                <div className={s["onboarding-label"]}>
                  ONE-TIME ONBOARDING FEE
                </div>
                <div className={s["onboarding-amount"]}>
                  Quoted during your strategy call
                </div>
                <div className={s["onboarding-caption"]}>
                  Campaign setup, ICP development, outreach infrastructure and
                  launch preparation.
                </div>
                <div className={s["fee-divider"]} />
                <div className={s["onboarding-label"]}>
                  ONGOING PERFORMANCE FEE
                </div>
              </div>
              <div className={s["price-large"]}>
                $250<span> / SQL</span>
              </div>
              <p>
                Per qualified appointment (SQL), based on the approved ICP and
                billing provisions in your signed agreement. Onboarding is
                charged separately and only once.
              </p>
              <div className={s["price-items"]}>
                {PRICE_ITEMS.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <BookingLink variant="white" style={{ width: "100%" }} />
              <p className={s["price-disclaimer"]}>
                Qualified meeting definitions, guarantees, credits, no-show
                treatment, and cancellation are governed by your signed
                agreement and applicable partnership terms.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={s.sec} id="faq">
          <div className={cx("wrap", "faq-grid")}>
            <div>
              <div className={s.eyebrow}>FREQUENTLY ASKED QUESTIONS</div>
              <h2>
                Questions?{" "}
                <span style={{ color: "var(--violet)" }}>
                  We have answers.
                </span>
              </h2>
              <p className={s.lead}>
                We work behind the scenes on the sales conversations—your team
                controls lending decisions.
              </p>
              <BookingLink variant="dark" style={{ marginTop: 15 }} />
            </div>
            <div className={s["faq-list"]}>
              {FAQS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={item.q} className={cx("faq-item", open && "open")}>
                    <button
                      type="button"
                      aria-expanded={open}
                      className={s["faq-q"]}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      {item.q}
                      <span>+</span>
                    </button>
                    <div className={s["faq-a"]}>{item.a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className={s.cta}>
          <div className={s.wrap}>
            <div
              className={cx("eyebrow", "mint")}
              style={{ justifyContent: "center" }}
            >
              LET&apos;S BUILD YOUR NEXT PIPELINE
            </div>
            <h2>
              More business conversations.
              <br />
              <span style={{ color: "var(--mint)" }}>
                More opportunities to fund.
              </span>
            </h2>
            <p>
              Your lending team should be spending its time on deals, not
              sourcing its next call. See what a targeted outbound engine could
              look like for your financing product.
            </p>
            <BookingLink variant="white" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
