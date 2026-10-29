import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  IndianRupee,
  Leaf,
  Radar,
  Route as RouteIcon,
  ShieldCheck,
  Truck,
} from "lucide-react";
import heroTruck from "@/assets/hero-truck.jpg";
import { Logo, MatchScore, Stars, VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { lang?: Language } => ({
    lang: search["lang"] === "hi" ? "hi" : "en",
  }),
  head: () => ({
    meta: [
      { title: "CargoLoop — Turn Empty Trips Into Earning Trips" },
      {
        name: "description",
        content:
          "CargoLoop predicts empty return trips and matches spare truck capacity with verified businesses, so transporters earn from backhauls instead of running empty.",
      },
      { property: "og:title", content: "CargoLoop — Turn Empty Trips Into Earning Trips" },
      {
        property: "og:description",
        content:
          "AI empty-return prediction and smart backhaul matching for Indian transporters and verified businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

type Language = "en" | "hi";

const content = {
  en: {
    language: "Language",
    login: "Login",
    getStarted: "Get Started",
    tagline: "Turn Empty Trips Into Earning Trips",
    headline: "Your truck is already going there.",
    headlineAccent: "Why return empty?",
    intro:
      "Nearly 1 in 3 truck-kilometres in India runs empty. CargoLoop predicts your empty return legs and fills them with verified business cargo — without touching your existing customers or routes.",
    extraRevenue: "extra backhaul revenue",
    tripsPrevented: "empty trips prevented",
    co2Saved: "CO₂ saved",
    backhaulFound: "Backhaul found",
    howItWorks: "How it works",
    threeSteps: "Three steps to a paid return trip",
    networkTitle: "We don't replace your logistics network. We monetize what's left over.",
    networkBody:
      "Keep your existing apps, brokers and loyal customers exactly as they are. CargoLoop only activates on the capacity that would otherwise travel empty — after every existing commitment is served.",
    liveDemo: "Live demo lane",
    demoLane: [
      ["Pune → Mumbai", "Delivery in progress for existing customer"],
      ["87% empty probability", "AI flags the Mumbai → Pune return leg"],
      ["96% match found", "ABC Manufacturing · 2 Tons · ₹4,500"],
      ["Accepted & delivered", "₹4,500 additional revenue, 0 empty km"],
    ],
    demoDashboard: "Open the demo dashboard",
    trustItems: [
      "GST & PAN verified counterparties",
      "Lane-level empty return prediction",
      "Ratings, reviews and trust badges",
      "Measurable CO₂ reduction per lane",
    ],
    footer: "© 2026 CargoLoop Technologies Pvt Ltd · Nagpur, India · Demo build with mock data",
    heroAlt: "Indian container truck on a national highway at golden hour",
  },
  hi: {
    language: "भाषा",
    login: "लॉग इन",
    getStarted: "शुरू करें",
    tagline: "खाली ट्रिप को कमाई वाली ट्रिप बनाएं",
    headline: "आपका ट्रक वहाँ जा ही रहा है।",
    headlineAccent: "वापसी में खाली क्यों जाए?",
    intro:
      "भारत में लगभग हर 3 में से 1 ट्रक-किलोमीटर खाली चलता है। CargoLoop आपकी खाली वापसी की पहचान करके उसमें सत्यापित व्यापारिक माल भरता है — आपके मौजूदा ग्राहकों या रूट को बदले बिना।",
    extraRevenue: "अतिरिक्त बैकहॉल कमाई",
    tripsPrevented: "खाली ट्रिप रोकी गईं",
    co2Saved: "CO₂ बचाया",
    backhaulFound: "बैकहॉल मिला",
    howItWorks: "यह कैसे काम करता है",
    threeSteps: "पेड वापसी ट्रिप के तीन चरण",
    networkTitle: "हम आपके लॉजिस्टिक्स नेटवर्क को नहीं बदलते। हम बची हुई क्षमता से कमाई कराते हैं।",
    networkBody:
      "आपके मौजूदा ऐप, ब्रोकर और भरोसेमंद ग्राहक वैसे ही रहें। CargoLoop सिर्फ उस क्षमता का इस्तेमाल करता है जो हर मौजूदा प्रतिबद्धता पूरी होने के बाद खाली लौटती।",
    liveDemo: "लाइव डेमो रूट",
    demoLane: [
      ["पुणे → मुंबई", "मौजूदा ग्राहक के लिए डिलीवरी जारी है"],
      ["87% खाली जाने की संभावना", "AI ने मुंबई → पुणे वापसी रूट पहचाना"],
      ["96% मैच मिला", "ABC Manufacturing · 2 टन · ₹4,500"],
      ["स्वीकार और डिलीवरी पूरी", "₹4,500 अतिरिक्त कमाई, 0 खाली किमी"],
    ],
    demoDashboard: "डेमो डैशबोर्ड खोलें",
    trustItems: [
      "GST और PAN सत्यापित पार्टनर",
      "लेन-स्तर पर खाली वापसी की पहचान",
      "रेटिंग, रिव्यू और भरोसे के बैज",
      "हर लेन पर मापी गई CO₂ बचत",
    ],
    footer: "© 2026 CargoLoop Technologies Pvt Ltd · नागपुर, भारत · मॉक डेटा वाला डेमो बिल्ड",
    heroAlt: "गोल्डन आवर में राष्ट्रीय राजमार्ग पर भारतीय कंटेनर ट्रक",
  },
} as const;

const steps = [
  {
    icon: Radar,
    en: {
      title: "Detect empty return",
      body: "CargoLoop reads your trip plan and predicts when a truck will run back empty — before it happens.",
    },
    hi: {
      title: "खाली वापसी पहचानें",
      body: "CargoLoop आपकी ट्रिप योजना पढ़कर पहले ही बता देता है कि ट्रक कब खाली लौटेगा।",
    },
  },
  {
    icon: Boxes,
    en: {
      title: "Find matching cargo",
      body: "We scan verified business loads on that exact return lane and score them on route, time and capacity fit.",
    },
    hi: {
      title: "मिलता-जुलता माल खोजें",
      body: "हम उसी वापसी लेन पर सत्यापित व्यापारिक माल खोजकर रूट, समय और क्षमता के आधार पर मैच स्कोर करते हैं।",
    },
  },
  {
    icon: IndianRupee,
    en: {
      title: "Earn from return trip",
      body: "Accept a backhaul in one tap. Secure payment, live tracking and POD are handled inside CargoLoop.",
    },
    hi: {
      title: "वापसी ट्रिप से कमाएं",
      body: "एक टैप में बैकहॉल स्वीकार करें। सुरक्षित भुगतान, लाइव ट्रैकिंग और POD CargoLoop में संभाले जाते हैं।",
    },
  },
];

function Landing() {
  const { lang } = Route.useSearch();
  const language: Language = lang ?? "en";
  const t = content[language];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-hero">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <Logo invert />
          <nav className="ml-auto flex items-center gap-2">
            <div
              aria-label={t.language}
              className="flex items-center rounded-md border border-primary-foreground/20 bg-primary-foreground/10 p-0.5"
              role="group"
            >
              {(["en", "hi"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-pressed={language === option}
                  asChild
                  className={language === option ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"}
                >
                  <Link to="/" search={{ lang: option }}>
                    {option === "en" ? "English" : "हिंदी"}
                  </Link>
                </Button>
              ))}
            </div>
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
              <Link to="/auth" search={{ mode: "login" }}>
                {t.login}
              </Link>
            </Button>
            <Button className="bg-accent-gradient text-accent-foreground hover:opacity-90" asChild>
              <Link to="/auth" search={{ mode: "signup" }}>
                {t.getStarted}
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-hero">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-primary-foreground">
              <Truck className="size-3.5" /> {t.tagline}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl">
              {t.headline}{" "}
              <span className="text-gradient-accent">{t.headlineAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/75 sm:text-lg">
              {t.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-accent-gradient text-accent-foreground hover:opacity-90" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>
                  {t.getStarted} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link to="/auth" search={{ mode: "login" }}>
                  {t.login}
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6">
              {[
                ["₹1.9 Cr", t.extraRevenue],
                ["31,400", t.tripsPrevented],
                ["842 T", t.co2Saved],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold text-primary-foreground">{v}</dt>
                  <dd className="text-xs text-primary-foreground/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroTruck}
              alt={t.heroAlt}
              className="shadow-lift w-full rounded-3xl object-cover"
              loading="eager"
            />
            <Card className="shadow-lift absolute -bottom-6 left-2 w-[19rem] max-w-[85%] border-none sm:left-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                     {t.backhaulFound}
                  </p>
                  <MatchScore score={96} />
                </div>
                <p className="font-display mt-2 text-lg font-bold">Mumbai → Pune · 2 Tons</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  ABC Manufacturing <Stars value={4.8} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <VerifiedBadge />
                  <span className="font-display text-xl font-bold text-success">₹4,500</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
           <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t.howItWorks}</p>
           <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t.threeSteps}</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
             <Card key={s.en.title} className="shadow-soft relative overflow-hidden">
              <CardContent className="p-6">
                <span className="font-display absolute right-5 top-4 text-5xl font-bold text-secondary">
                  0{i + 1}
                </span>
                <span className="bg-accent-gradient grid size-11 place-items-center rounded-xl text-accent-foreground">
                  <s.icon className="size-5" />
                </span>
                 <h3 className="mt-4 text-lg font-bold">{s[language].title}</h3>
                 <p className="mt-2 text-sm text-muted-foreground">{s[language].body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary/4 border-y border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
             <h2 className="text-3xl font-bold">{t.networkTitle}</h2>
             <p className="mt-4 text-muted-foreground">{t.networkBody}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
               {[
                 [ShieldCheck, t.trustItems[0]],
                 [RouteIcon, t.trustItems[1]],
                 [BadgeCheck, t.trustItems[2]],
                 [Leaf, t.trustItems[3]],
               ].map(([Icon, label]) => {
                const I = Icon as typeof ShieldCheck;
                return (
                  <div
                    key={label as string}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm font-medium"
                  >
                    <I className="size-4 text-accent" />
                    {label as string}
                  </div>
                );
              })}
            </div>
          </div>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                 {t.liveDemo}
              </p>
              <ol className="mt-4 space-y-4">
                {t.demoLane.map(([title, description], i) => (
                   <li key={title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                       <p className="text-sm font-semibold">{title}</p>
                       <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Button className="mt-6 w-full" asChild>
                 <Link to="/transporter">{t.demoDashboard}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-hero">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 sm:px-6">
          <Logo invert />
          <p className="text-xs text-primary-foreground/60">
             {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
