"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Building2,
  DraftingCompass,
  Globe2,
  HardHat,
  Mail,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useLenis } from "./providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;
const articleEase = "easeInOut" as const;

const categories = [
  "All Articles",
  "Export & Import",
  "Architecture",
  "Construction",
  "Real Estate",
  "OTC Exchange",
  "Enterprise",
  "Insights",
  "News"
];

type BlogArticle = {
  category: keyof typeof topicIcons;
  title: string;
  image: string;
  date: string;
  readingTime: string;
  excerpt: string;
  standfirst: string;
  quote: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

const articles: BlogArticle[] = [
  {
    category: "Export & Import",
    title: "The Future of Global Trade Coordination",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=86",
    date: "May 14, 2026",
    readingTime: "6 min read",
    excerpt: "How cargo visibility, supplier readiness and cross-border commerce systems reshape enterprise trade strategy.",
    standfirst:
      "Global trade is moving from reactive shipment tracking to coordinated operational intelligence, where supplier readiness, documentation and cargo movement are understood as one connected system.",
    quote:
      "The next advantage in trade belongs to enterprises that can see readiness before movement begins.",
    sections: [
      {
        heading: "From movement to orchestration",
        body: [
          "The most resilient trade teams no longer treat logistics as a final handoff. They treat every shipment as the visible layer of a deeper operating system: sourcing, compliance, documentation, freight decisions and delivery planning.",
          "That shift changes the role of coordination. Instead of waiting for exceptions, leaders can read signals earlier and remove friction before it reaches the client, port or site."
        ]
      },
      {
        heading: "Visibility that supports decisions",
        body: [
          "Premium visibility is not a dashboard filled with noise. It is a calmer sequence of facts that lets teams understand what is ready, what is moving and what requires attention.",
          "When visibility is designed well, trade operations feel less like crisis management and more like a controlled editorial desk for global movement."
        ]
      },
      {
        heading: "The enterprise layer",
        body: [
          "The future belongs to systems that connect commercial intent with operational detail. Export, import and cargo coordination become stronger when they are designed as part of the enterprise rhythm, not as a separate service layer.",
          "That is where trade coordination becomes strategic: fewer surprises, cleaner communication and a sharper ability to scale across markets."
        ]
      }
    ]
  },
  {
    category: "Architecture",
    title: "Designing Spaces That Drive Human Potential",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=86",
    date: "May 08, 2026",
    readingTime: "5 min read",
    excerpt: "A premium design lens on spatial clarity, material systems and environments built for better decision-making.",
    standfirst:
      "Architecture is most powerful when it gives people a calmer way to think, gather and make decisions. The best spaces do not demand attention; they organize it.",
    quote:
      "A premium space should reduce cognitive noise before it announces its beauty.",
    sections: [
      {
        heading: "Clarity as a spatial material",
        body: [
          "A refined environment begins with hierarchy. Light, proportion, movement and material restraint create an atmosphere where people can understand where they are and what matters next.",
          "This kind of clarity is not minimalism for its own sake. It is an operating principle for spaces that support leadership, hospitality and long-term use."
        ]
      },
      {
        heading: "Material systems with memory",
        body: [
          "Luxury architecture relies on materials that age with confidence. Stone, timber, glass, metal and fabric each carry a different sense of time, and the composition matters more than volume.",
          "The goal is a space that feels composed under daily pressure, where details are precise enough to be trusted and quiet enough to be lived in."
        ]
      },
      {
        heading: "Design as enterprise infrastructure",
        body: [
          "For modern organizations, space is not just a backdrop. It shapes how teams meet, how clients read credibility and how decisions move through a company.",
          "The most successful design frameworks make these invisible behaviors easier, more elegant and more consistent."
        ]
      }
    ]
  },
  {
    category: "Construction",
    title: "Construction Excellence Through Integrated Execution",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=86",
    date: "April 29, 2026",
    readingTime: "7 min read",
    excerpt: "Why disciplined procurement, site visibility and single-accountability delivery define modern construction outcomes.",
    standfirst:
      "Construction excellence comes from alignment before activity. Procurement, site visibility, sequencing and accountability must move as one operational surface.",
    quote:
      "Execution improves when every team can see the same reality at the same time.",
    sections: [
      {
        heading: "The cost of fragmented delivery",
        body: [
          "Many execution problems begin before work reaches the site. A missing decision, delayed procurement signal or unclear approval path can quietly compound into visible friction.",
          "Integrated execution reduces that drift by keeping commercial, technical and site realities connected from the beginning."
        ]
      },
      {
        heading: "Visibility without overload",
        body: [
          "A premium construction system should not overwhelm teams with raw status. It should reveal what has changed, what is blocked and what decision is required next.",
          "This makes progress easier to trust and exceptions easier to resolve."
        ]
      },
      {
        heading: "Single-accountability rhythm",
        body: [
          "When ownership is clear, work moves with less negotiation. Every milestone, vendor dependency and handover point becomes part of a managed rhythm.",
          "The result is not only speed. It is a calmer delivery culture where quality can survive scale."
        ]
      }
    ]
  },
  {
    category: "Enterprise",
    title: "Building Resilient Enterprises for a Global Future",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=86",
    date: "April 22, 2026",
    readingTime: "8 min read",
    excerpt: "Enterprise resilience now depends on connected systems, trusted leadership and operating models that can scale.",
    standfirst:
      "Resilience is becoming a design discipline. Modern enterprises need operating models that can absorb complexity without making teams feel trapped inside it.",
    quote:
      "A resilient enterprise is not louder under pressure. It becomes clearer.",
    sections: [
      {
        heading: "Systems that hold shape",
        body: [
          "Growth often exposes where a company relies on memory, personality or manual rescue. Resilient systems replace those fragile patterns with clear flows, standards and decision points.",
          "That does not mean removing judgment. It means giving judgment a stronger structure to operate inside."
        ]
      },
      {
        heading: "Leadership through calm visibility",
        body: [
          "The best leadership environments reduce noise. They make progress legible, ownership visible and risk easier to discuss before it becomes urgent.",
          "This kind of visibility creates trust because it gives teams a shared view of what is true."
        ]
      },
      {
        heading: "Scaling without losing precision",
        body: [
          "A global future requires companies to expand without diluting standards. The challenge is to keep execution consistent while allowing local realities to be understood.",
          "Resilient enterprises solve this through connected frameworks, disciplined communication and premium attention to the moments where work changes hands."
        ]
      }
    ]
  },
  {
    category: "Insights",
    title: "The Role of Design in Enterprise Transformation",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=86",
    date: "April 15, 2026",
    readingTime: "4 min read",
    excerpt: "Design is no longer only presentation; it is a business instrument for clarity, adoption and transformation.",
    standfirst:
      "Design has become a practical instrument for enterprise transformation because people adopt what they can understand, trust and use without friction.",
    quote:
      "Transformation becomes believable when the experience of work starts to feel simpler.",
    sections: [
      {
        heading: "Designing for adoption",
        body: [
          "Many transformation efforts fail because they focus on the system and forget the moment of use. People need clarity, sequence and confidence before behavior changes.",
          "Design gives transformation a human surface. It turns strategy into something teams can navigate."
        ]
      },
      {
        heading: "The visual layer of trust",
        body: [
          "Interfaces, documents, spaces and operating rituals all communicate whether a company is in control. When those touchpoints are consistent, confidence rises.",
          "That trust is not decoration. It is a measurable part of adoption and decision quality."
        ]
      },
      {
        heading: "A calmer enterprise experience",
        body: [
          "The strongest transformation design removes unnecessary effort. It makes the next step obvious, the status understandable and the standard visible.",
          "This is where design becomes operational: less friction, better clarity and a more elegant path from intent to execution."
        ]
      }
    ]
  },
  {
    category: "News",
    title: "Ractysh Expands Global Operations Network",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=86",
    date: "April 04, 2026",
    readingTime: "3 min read",
    excerpt: "A new operating layer extends Ractysh coordination across export-import, architecture, construction, real estate and OTC exchange networks.",
    standfirst:
      "Ractysh is expanding its operating network to connect trade, architecture, construction, real estate and private OTC coordination through a more coordinated enterprise layer.",
    quote:
      "Expansion is most valuable when it gives clients fewer handoffs and a clearer path to execution.",
    sections: [
      {
        heading: "A connected operating base",
        body: [
          "The expansion strengthens coordination across the ecosystem, with a focus on clearer intake, better project visibility and more consistent communication between teams.",
          "For clients, the intent is simple: make complex work feel easier to start, follow and complete."
        ]
      },
      {
        heading: "Where the network adds value",
        body: [
          "Export-import operations, architectural systems, construction execution, real estate strategy and OTC exchange coordination each carry different rhythms. The network creates a shared layer where those rhythms can align.",
          "That alignment supports faster decisions, cleaner documentation and a stronger client experience."
        ]
      },
      {
        heading: "Built for future scale",
        body: [
          "The next phase focuses on expanding capacity without losing the premium control standards expected from Ractysh.",
          "Every layer is being shaped around a simple idea: enterprise work should feel composed, visible and accountable."
        ]
      }
    ]
  }
];

const topicIcons = {
  "Export & Import": Globe2,
  Architecture: DraftingCompass,
  Construction: HardHat,
  "Real Estate": Building2,
  "OTC Exchange": ShieldCheck,
  Enterprise: Building2,
  Insights: BookOpenText,
  News: Newspaper
};

const topicCounts = [
  { label: "Export & Import", count: 12 },
  { label: "Architecture", count: 18 },
  { label: "Construction", count: 15 },
  { label: "Real Estate", count: 8 },
  { label: "OTC Exchange", count: 5 },
  { label: "Enterprise", count: 9 },
  { label: "Insights", count: 22 },
  { label: "News", count: 6 }
];

export function BlogEnterprisePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageLenis = useLenis();
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory = activeCategory === "All Articles" || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.category} ${article.excerpt}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);
  const featuredArticle = filteredArticles[0] ?? null;
  const secondaryArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles;

  useEffect(() => {
    if (!selectedArticle) return;

    const wasLenisStopped = pageLenis?.isStopped;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    pageLenis?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArticle(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (pageLenis && !wasLenisStopped) {
        pageLenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageLenis, selectedArticle]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-blog-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 38 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-blog-stagger]").forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>("[data-blog-card]", group);

        if (!items.length) return;

        gsap.fromTo(
          items,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 0.86,
            ease: "power3.out",
            stagger: 0.08,
            immediateRender: false,
            scrollTrigger: {
              trigger: group,
              start: "top 82%"
            }
          }
        );
      });

      gsap.to("[data-blog-ambient]", {
        y: -24,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.2
        }
      });
    }, root);

    return () => context.revert();
  }, [activeCategory, query, filteredArticles.length]);

  return (
    <div ref={rootRef} className="relative isolate overflow-hidden bg-[#fbf5e9] text-[#1f1511]">
      <BlogBackground />

      <section className="relative z-10 px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-[8.5rem] xl:px-12">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,0.72fr)] lg:items-end xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, ease }}
            className="max-w-[58rem]"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#d6b45f]" />
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#8b1118]">BLOG & INSIGHTS</p>
            </div>

            <h1
              data-blog-hero-title
              aria-label="Enterprise Editorial Journal"
              className="mt-7 max-w-[57rem] font-display text-[clamp(3.45rem,8vw,8.8rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-[#1d120f]"
            >
              Enterprise
              <br aria-hidden="true" />
              Editorial Journal
            </h1>

            <div className="mt-7 max-w-[47rem]">
              <h2
                data-blog-hero-subheading
                className="font-display text-[clamp(2.05rem,4vw,3.85rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[#241814]"
              >
                Insights That Drive Enterprise Evolution.
              </h2>
              <p
                data-blog-hero-description
                className="mt-5 max-w-[43rem] text-[15px] font-medium leading-[1.85] tracking-normal text-[#5c5149] md:text-[17px]"
              >
                Expert perspectives on Architecture, Construction, Real Estate, Export & Import, OTC Exchange and
                enterprise operations shaping the future.
              </p>
            </div>

            <motion.a
              href="#articles"
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease }}
              className="premium-cta mt-7"
            >
              Explore All Articles
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.12, ease }}
            className="group relative min-h-[25rem] overflow-hidden rounded-[0.45rem] border border-[#d8bd79]/48 bg-[#180c0e] shadow-[0_34px_100px_rgba(72,42,19,0.19)] md:min-h-[32rem]"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1700&q=88"
              alt="Luxury enterprise glass architecture at sunset"
              className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,9,11,0.12),transparent_45%),linear-gradient(180deg,transparent_52%,rgba(20,8,10,0.66))]" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/18 pt-5 text-white">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#d6b45f]">Ractysh Editorial</p>
                <p className="mt-2 font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[#fff7e8]">Enterprise intelligence desk</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b45f]/50 bg-white/[0.06] text-[#d6b45f]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="articles" className="relative z-10 px-5 pb-20 md:px-8 lg:pb-24 xl:px-12">
        <div className="mx-auto max-w-[92rem]">
          <div
            data-blog-reveal
            className="border-y border-[#dcc891]/62 py-6"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Journal filters</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {categories.map((category) => {
                    const active = activeCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold normal-case tracking-normal transition duration-300 ${
                          active
                            ? "border-[#8b1118] bg-[#8b1118] text-[#fff7e8] shadow-[0_14px_34px_rgba(139,17,24,0.18)]"
                            : "border-[#e1cf9f] bg-white/48 text-[#6b5c51] hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-white hover:text-[#8b1118]"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="relative block w-full">
                <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Search archive</span>
                <Search className="pointer-events-none absolute left-4 top-[calc(50%+0.9rem)] h-4 w-4 -translate-y-1/2 text-[#8b1118]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles..."
                  className="h-12 w-full rounded-full border border-[#dfca94] bg-white/74 pl-11 pr-4 text-[14px] font-medium text-[#241814] outline-none shadow-[0_18px_48px_rgba(82,49,20,0.06)] backdrop-blur-xl transition duration-300 placeholder:text-[#9a8d7f] focus:border-[#d6b45f] focus:bg-white"
                />
              </label>
            </div>
          </div>

          <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
            <div className="min-w-0">
              {featuredArticle ? <FeaturedArticle article={featuredArticle} onOpen={setSelectedArticle} /> : null}

              <div className="mt-12 flex items-end justify-between gap-5 border-t border-[#dec995]/70 pt-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Latest Stories</p>
                  <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#20130f]">
                    Current Journal
                  </h2>
                </div>
                <p className="hidden max-w-[13rem] text-right text-[13px] leading-[1.7] text-[#796d62] sm:block">
                  {filteredArticles.length} editorial {filteredArticles.length === 1 ? "story" : "stories"} in this view.
                </p>
              </div>

              {secondaryArticles.length ? (
                <motion.div layout data-blog-stagger className="mt-8 grid gap-x-7 gap-y-10 md:grid-cols-2">
                  {secondaryArticles.map((article, index) => (
                    <BlogCard key={article.title} article={article} index={index} onOpen={setSelectedArticle} />
                  ))}
                </motion.div>
              ) : featuredArticle ? (
                <div className="mt-8 border-y border-[#dec995]/70 py-10 text-[15px] leading-7 text-[#675a4f]">
                  This article is the only story in the selected editorial view.
                </div>
              ) : (
                <div className="mt-8 border-y border-[#dec995]/70 py-10 text-[15px] leading-7 text-[#675a4f]">
                  No articles match the current search.
                </div>
              )}
            </div>

            <aside data-blog-sidebar className="grid gap-7 xl:sticky xl:top-28">
              <PopularTopics activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
              <NewsletterBox />
              <ContributionBox />
            </aside>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-20 md:px-8 lg:pb-24 xl:px-12">
        <motion.div
          data-blog-reveal
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease }}
          className="mx-auto grid max-w-[92rem] gap-7 border-y border-[#d8bd79]/70 bg-[#fffaf0]/54 py-9 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <h2 className="font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#20130f] md:text-[28px] lg:text-[34px]">
              Explore. Learn. Lead.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[14px] leading-[1.7] text-[#675a4f] md:text-[15px]">
              Knowledge is the foundation of every great enterprise.
            </p>
          </div>
          <a
            href="/#enterprise-solutions"
            className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-[#d6b45f]/55 bg-[linear-gradient(135deg,#d6b45f_0%,#b98a2c_38%,#8b1118_100%)] px-5 py-3 text-[0.9rem] font-semibold text-[#fff7e6] shadow-[0_20px_50px_rgba(139,17,24,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_62px_rgba(139,17,24,0.3)]"
          >
            Explore Our Ecosystem
            <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedArticle && <ArticleExperience article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      </AnimatePresence>
    </div>
  );
}

function getArticleId(article: BlogArticle) {
  return article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function FeaturedArticle({ article, onOpen }: { article: BlogArticle; onOpen: (article: BlogArticle) => void }) {
  const articleId = getArticleId(article);

  return (
    <motion.article
      layout
      layoutId={`blog-card-${articleId}`}
      data-featured-article
      data-blog-reveal
      className="group grid overflow-hidden border-y border-[#d8bd79]/72 bg-[#fffaf0]/48 py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-9 lg:py-8"
    >
      <button
        type="button"
        onClick={() => onOpen(article)}
        className="relative block aspect-[1.35] overflow-hidden bg-[#160b0d] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#d6b45f]/26 lg:aspect-[1.18]"
        aria-label={`Read featured article: ${article.title}`}
      >
        <motion.img
          layoutId={`blog-image-${articleId}`}
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(18,8,10,0.56))]" />
        <span className="absolute left-5 top-5 rounded-full border border-white/18 bg-[#13090b]/72 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4d98e] backdrop-blur-xl">
          Featured
        </span>
      </button>

      <div className="flex flex-col justify-center py-7 lg:py-0">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#8b1118]">
          <span>{article.category}</span>
          <span className="text-[#b08a37]">{article.date}</span>
          <span className="text-[#796d62]">{article.readingTime}</span>
        </div>
        <h2 className="mt-5 max-w-[42rem] font-display text-[clamp(2.4rem,5vw,5.6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#20130f]">
          {article.title}
        </h2>
        <p className="mt-6 max-w-[37rem] text-[16px] leading-[1.85] text-[#5f5146] md:text-[18px]">
          {article.standfirst}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpen(article)}
            className="group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#8b1118]/18 bg-[#8b1118] px-5 text-[0.86rem] font-bold uppercase tracking-[0.13em] text-[#fff7e8] shadow-[0_18px_46px_rgba(139,17,24,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(139,17,24,0.26)]"
          >
            Read Feature
            <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
          </button>
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9a8d7f]">Ractysh Editorial</span>
        </div>
      </div>
    </motion.article>
  );
}

function BlogCard({
  article,
  index,
  onOpen
}: {
  article: BlogArticle;
  index: number;
  onOpen: (article: BlogArticle) => void;
}) {
  const articleId = getArticleId(article);

  return (
    <motion.article
      layout
      layoutId={`blog-card-${articleId}`}
      data-blog-card
      whileHover={{ y: -7 }}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.32, ease }}
      className="group border-t border-[#dec995]/72 pt-5 transition duration-300"
      style={{ transitionDelay: `${Math.min(index * 35, 180)}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(article)}
        className="relative block aspect-[1.48] w-full overflow-hidden bg-[#160b0d] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#d6b45f]/26"
        aria-label={`Read Article: ${article.title}`}
      >
        <motion.img
          layoutId={`blog-image-${articleId}`}
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(18,8,10,0.42))]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-[#13090b]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#f4d98e] backdrop-blur-xl">
          {article.category}
        </span>
      </button>
      <div className="pt-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.11em] text-[#8a7b6d]">
          <span>{article.date}</span>
          <span>{article.readingTime}</span>
        </div>
        <h3 className="mt-4 font-display text-[clamp(1.65rem,3vw,2.35rem)] font-semibold leading-[1] tracking-[-0.04em] text-[#20130f]">
          {article.title}
        </h3>
        <p className="mt-4 text-[15px] leading-[1.8] text-[#675a4f]">{article.excerpt}</p>
        <button
          type="button"
          onClick={() => onOpen(article)}
          className="mt-5 inline-flex items-center gap-2 rounded-full text-[0.82rem] font-bold uppercase tracking-[0.13em] text-[#8b1118] outline-none transition duration-300 hover:text-[#5f0c11] focus-visible:ring-4 focus-visible:ring-[#d6b45f]/24"
          aria-label={`Read Article: ${article.title}`}
        >
          Read Story
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

function ArticleExperience({ article, onClose }: { article: BlogArticle; onClose: () => void }) {
  const scrollRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const articleId = getArticleId(article);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollYProgress, [0, 0.26], [0, reduceMotion ? 0 : 70]);
  const heroScale = useTransform(scrollYProgress, [0, 0.26], [1.08, 1.01]);
  const transition = reduceMotion ? { duration: 0.01 } : { duration: 0.9, ease: articleEase };

  useEffect(() => {
    if (reduceMotion || !scrollRef.current || !contentRef.current) return;

    const articleLenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
      eventsTarget: scrollRef.current,
      duration: 1.12,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.08,
      overscroll: false
    });

    let frame = 0;
    const update = (time: number) => {
      articleLenis.raf(time);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      articleLenis.destroy();
    };
  }, [reduceMotion]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[300] bg-[#160d08]/32 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        aria-hidden="true"
      />

      <motion.article
        ref={scrollRef}
        layoutId={`blog-card-${articleId}`}
        className="fixed inset-0 z-[310] overflow-y-auto overscroll-contain bg-[#fbf3e7] text-[#211814] shadow-[0_40px_140px_rgba(41,24,12,0.28)] [font-family:var(--font-manrope)]"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        aria-modal="true"
        role="dialog"
        aria-label={article.title}
      >
        <motion.div
          className="fixed left-0 right-0 top-0 z-[335] h-[3px] origin-left bg-[linear-gradient(90deg,#8b1118,#d6b45f,#fff0ba)]"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onClose}
          className="fixed left-4 top-4 z-[340] inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ead8ac]/75 bg-[#fffaf0]/94 px-4 text-[0.86rem] font-bold text-[#241814] shadow-[0_18px_46px_rgba(56,35,18,0.16),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-white hover:shadow-[0_22px_58px_rgba(56,35,18,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6b45f]/26 md:left-7 md:top-7"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.11] [background-image:radial-gradient(circle_at_1px_1px,rgba(61,42,20,0.36)_1px,transparent_0)] [background-size:13px_13px]" />

        <div ref={contentRef} className="relative z-10">
          <header className="relative min-h-[78svh] overflow-hidden bg-[#160b0d] md:min-h-[86svh]">
            <motion.img
              layoutId={`blog-image-${articleId}`}
              src={article.image}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ y: heroY, scale: heroScale }}
              transition={transition}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,5,0.16)_0%,rgba(13,8,5,0.16)_36%,rgba(13,8,5,0.78)_100%),linear-gradient(90deg,rgba(13,8,5,0.42),transparent_52%)]" />
            <motion.div
              className="absolute bottom-0 left-0 right-0 px-5 pb-12 pt-28 md:px-8 md:pb-16 xl:px-12"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.72, delay: 0.28, ease }}
            >
              <div className="mx-auto max-w-[58rem]">
                <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#f4d98e]">
                  <span className="rounded-full border border-white/18 bg-white/[0.08] px-3 py-1.5 backdrop-blur-xl">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                  <span className="h-1 w-1 rounded-full bg-[#d6b45f]" />
                  <span>{article.readingTime}</span>
                </div>
                <h1 className="mt-5 max-w-[52rem] [font-family:var(--font-cormorant)] text-[clamp(3rem,7vw,7.2rem)] font-semibold leading-[0.88] tracking-normal text-[#fff7ea]">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-[43rem] text-[1rem] font-medium leading-[1.8] text-[#fff2dc] [text-shadow:0_2px_18px_rgba(0,0,0,0.34)] md:text-[1.12rem]">
                  {article.standfirst}
                </p>
              </div>
            </motion.div>
          </header>

          <main className="relative bg-[#fbf3e7] px-5 py-14 md:px-8 md:py-20">
            <motion.div
              className="mx-auto max-w-[790px]"
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.75, delay: 0.42, ease }}
            >
              <div className="mb-12 flex items-center gap-4">
                <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#d6b45f)]" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#8b1118]">Ractysh Editorial</span>
                <span className="h-px flex-1 bg-[linear-gradient(90deg,#d6b45f,transparent)]" />
              </div>

              <p className="text-[1.12rem] font-medium leading-[2] text-[#382a20] first-letter:float-left first-letter:mr-3 first-letter:pt-1 first-letter:[font-family:var(--font-cormorant)] first-letter:text-[5.4rem] first-letter:font-semibold first-letter:leading-[0.72] first-letter:text-[#8b1118] md:text-[1.22rem]">
                {article.sections[0].body[0]}
              </p>

              <motion.blockquote
                className="my-12 border-y border-[#ddc58e]/70 py-8 text-center"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 0.65, ease }}
              >
                <p className="[font-family:var(--font-cormorant)] text-[clamp(2rem,4.4vw,3.7rem)] font-semibold leading-[1.04] tracking-normal text-[#241814]">
                  &ldquo;{article.quote}&rdquo;
                </p>
              </motion.blockquote>

              <div className="grid gap-12">
                {article.sections.map((section, sectionIndex) => (
                  <ArticleSection key={section.heading} section={section} sectionIndex={sectionIndex} reduceMotion={Boolean(reduceMotion)} />
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </motion.article>
    </>
  );
}

function ArticleSection({
  section,
  sectionIndex,
  reduceMotion
}: {
  section: BlogArticle["sections"][number];
  sectionIndex: number;
  reduceMotion: boolean;
}) {
  const body = sectionIndex === 0 ? section.body.slice(1) : section.body;

  return (
    <motion.section
      className="border-t border-[#e2cfa0]/70 pt-9"
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.72, ease }}
    >
      <h2 className="[font-family:var(--font-cormorant)] text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-normal text-[#211814]">
        {section.heading}
      </h2>
      <div className="mt-6 grid gap-5">
        {body.map((paragraph) => (
          <p key={paragraph} className="text-[1.02rem] leading-[1.95] text-[#5f5146] md:text-[1.08rem]">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}

function PopularTopics({
  activeCategory,
  onSelectCategory
}: {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  const sidebarTopics = [
    { label: "All Articles", count: articles.length },
    ...topicCounts
  ];

  return (
    <div data-blog-reveal className="border-y border-[#dfca94]/70 py-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Editorial Index</p>
      <div className="mt-5 grid gap-1">
        {sidebarTopics.map((topic) => {
          const Icon = topic.label === "All Articles" ? Newspaper : topicIcons[topic.label as keyof typeof topicIcons];
          const active = activeCategory === topic.label;

          return (
            <button
              key={topic.label}
              type="button"
              onClick={() => onSelectCategory(topic.label)}
              className={`group flex items-center justify-between border-b border-[#ead9ad]/70 py-3 text-left transition duration-300 last:border-b-0 ${
                active ? "text-[#8b1118]" : "text-[#5f5146] hover:text-[#8b1118]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                    active
                      ? "border-[#8b1118]/20 bg-[#8b1118] text-[#fff7e8]"
                      : "border-[#dfca94]/80 bg-white/42 text-[#9a7428] group-hover:border-[#d6b45f] group-hover:bg-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-[14px] font-semibold">{topic.label}</span>
              </span>
              <span className="text-[0.76rem] font-bold text-[#a27b2d]">{topic.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NewsletterBox() {
  return (
    <div data-blog-reveal className="border-y border-[#dfca94]/70 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/38 bg-white/54 text-[#8b1118]">
        <Mail className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-[22px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#20130f]">
        Stay Updated with Ractysh Insights
      </h3>
      <div className="mt-5 flex overflow-hidden rounded-full border border-[#dfca94] bg-white/66 shadow-[0_16px_46px_rgba(82,49,20,0.06)]">
        <input
          type="email"
          placeholder="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 text-[14px] font-medium text-[#241814] outline-none placeholder:text-[#9a8d7f]"
        />
        <button
          type="button"
          aria-label="Subscribe to Ractysh Insights"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8b1118] text-[#fff7e8] transition duration-300 hover:bg-[#6f0e13]"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ContributionBox() {
  return (
    <div data-blog-reveal className="border-y border-[#dfca94]/70 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/45 bg-white/60 text-[#8b1118]">
        <Globe2 className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-[22px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#20130f]">Want to contribute?</h3>
      <p className="mt-3 text-[14px] leading-[1.7] text-[#675a4f] md:text-[15px]">
        We welcome thought leadership from industry experts and innovators.
      </p>
      <a
        href="mailto:hello@ractysh.com?subject=Ractysh%20Insights%20Contribution"
        className="mt-5 inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.13em] text-[#8b1118] transition duration-300 hover:text-[#5f0c11]"
      >
        Submit Your Article
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function BlogBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbf5e9_0%,#f8efe1_56%,#fbf5e9_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(95,73,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(95,73,42,0.065)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div data-blog-ambient className="absolute inset-x-[-8rem] top-[7rem] h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.34),transparent)]" />
      <div data-blog-ambient className="absolute inset-x-[-8rem] top-[38rem] h-px bg-[linear-gradient(90deg,transparent,rgba(139,17,24,0.12),rgba(214,180,95,0.26),transparent)]" />
      <svg className="absolute right-[-11rem] top-[9rem] hidden h-[30rem] w-[46rem] text-[#d6b45f]/26 lg:block" viewBox="0 0 720 480" fill="none">
        <path d="M28 318C158 166 316 118 459 190C574 248 620 332 742 242" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-14 386C142 254 288 228 424 292C555 354 618 398 724 318" stroke="currentColor" strokeWidth="1" opacity="0.56" />
      </svg>
    </div>
  );
}
