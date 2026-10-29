import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, Lock, Truck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSession, type SessionUser } from "@/lib/session";
import type { Role } from "@/lib/mock-data";

type Mode = "login" | "signup";

const demoAccounts = {
  transporter: {
    email: "demo.transporter@cargoloop.in",
    password: "CargoLoopDemo2026!",
    name: "Mahesh Deshmukh",
    company: "Shivneri Roadlines Pvt Ltd",
    city: "Pune",
    mobile: "+91 98XXXXXX21",
  },
  business: {
    email: "demo.business@cargoloop.in",
    password: "CargoLoopDemo2026!",
    name: "Anita Rao",
    company: "ABC Manufacturing",
    city: "Mumbai",
    mobile: "+91 98XXXXXX42",
  },
} as const;

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "login" ? "login" : "signup",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create your CargoLoop account" },
      {
        name: "description",
        content:
          "Register as a transporter or business on CargoLoop and start trading backhaul capacity.",
      },
      { property: "og:title", content: "Join CargoLoop" },
      {
        property: "og:description",
        content: "Onboarding for Indian transporters and shippers.",
      },
    ],
  }),
  component: AuthPage,
});

function Field({
  label,
  id,
  ...props
}: { label: string; id: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <Input id={id} {...props} />
    </div>
  );
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [role, setRole] = useState<Role | null>(null);
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const isLogin = mode === "login";

  function val(fd: FormData, k: string) {
    return String(fd.get(k) ?? "").trim();
  }

  function enterDashboard(profile: SessionUser) {
    signIn(profile);
    navigate({ to: profile.role === "transporter" ? "/transporter" : "/business" });
  }

  function fillDemoCredentials(chosen: keyof typeof demoAccounts) {
    setRole(chosen);
    setLoginEmail(demoAccounts[chosen].email);
    setLoginPassword(demoAccounts[chosen].password);
  }

  async function login(chosen: Role, form: HTMLFormElement) {
    const fd = new FormData(form);
    const email = val(fd, "email");
    const password = val(fd, "password");
    const demoAccount = Object.entries(demoAccounts).find(
      ([, account]) => account.email === email.toLowerCase(),
    );
    if (demoAccount) {
      const [demoRole, account] = demoAccount;
      if (password !== account.password) {
        toast.error("Incorrect demo password. Use the password shown above the login form.");
        return;
      }
      if (chosen !== demoRole) {
        toast.error(`Select the ${demoRole} role for this demo account.`);
        return;
      }

      toast.success(`Welcome to the ${demoRole} demo`);
      enterDashboard({
        id: `demo-${demoRole}`,
        name: account.name,
        company: account.company,
        role: demoRole,
        isDemo: true,
        gst: "",
        pan: "",
        verified: true,
        city: account.city,
        mobile: account.mobile,
        email: account.email,
      });
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        toast.error(error?.message ?? "Login failed — check your email and password.");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (!profile) {
        toast.error("Account profile not found. Please create an account first.");
        await supabase.auth.signOut();
        return;
      }
      if (profile.role !== chosen) {
        toast.error(`This account is registered as a ${profile.role}. Select the correct role.`);
        await supabase.auth.signOut();
        return;
      }
      toast.success(`Welcome back, ${profile.name}`);
      enterDashboard({
        id: data.user.id,
        name: profile.name,
        company: profile.company,
        role: profile.role as Role,
        gst: "",
        pan: "",
        verified: true,
        city: profile.city ?? "",
        mobile: profile.mobile ?? "",
        email: profile.email ?? email,
      });
    } finally {
      setBusy(false);
    }
  }

  async function signup(chosen: Role, form: HTMLFormElement) {
    const fd = new FormData(form);
    const name = val(fd, "name");
    const company = val(fd, "company");
    const mobile = val(fd, "mobile");
    const city = val(fd, "city");
    const email = val(fd, "email");
    const password = val(fd, "password");
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error || !data.user) {
        toast.error(error?.message ?? "Could not create account.");
        return;
      }
      const { error: pErr } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        role: chosen,
        name,
        company,
        city,
        mobile,
        email,
      });
      if (pErr) {
        toast.error("Account created but profile could not be saved. Try logging in.");
        return;
      }
      toast.success(`Account created for ${company}`);
      enterDashboard({
        id: data.user.id,
        name,
        company,
        role: chosen,
        gst: "",
        pan: "",
        verified: true,
        city,
        mobile,
        email,
      });
    } finally {
      setBusy(false);
    }
  }

  async function sendReset(form: HTMLFormElement) {
    const fd = new FormData(form);
    const email = val(fd, "resetid");
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth?mode=login",
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password reset link sent to your email. Check your inbox.");
      setForgot(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between">
          <Logo invert />
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
            <Link to="/" search={{ lang: "en" }}>
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
        </div>

        <Card className="shadow-lift mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isLogin ? "Login to CargoLoop" : "Create your CargoLoop account"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Login with the email and password you registered with."
                : "Register once — your account and details are saved securely."}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                I am a
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["transporter", "Transporter", "Fleet owner with return capacity", Truck],
                    ["business", "Business", "Shipper needing verified trucks", Building2],
                  ] as const
                ).map(([value, label, desc, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      role === value
                        ? "border-accent bg-accent/10 shadow-soft"
                        : "border-border hover:border-accent/60"
                    }`}
                  >
                    <Icon className="mt-0.5 size-5 text-accent" />
                    <span>
                      <span className="block font-semibold">{label}</span>
                      <span className="block text-xs text-muted-foreground">{desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {role && isLogin ? (
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void login(role, e.currentTarget);
                }}
              >
                <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 sm:col-span-2">
                  <p className="text-sm font-semibold">Demo account · no real sign-up required</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Public sample credentials for trying the transporter and business dashboards.
                    These accounts are not secure and should never contain real information.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fillDemoCredentials("transporter")}
                    >
                      Use transporter demo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fillDemoCredentials("business")}
                    >
                      Use business demo
                    </Button>
                  </div>
                  <p className="mt-2 break-all text-xs text-muted-foreground">
                    Email: {demoAccounts[role === "transporter" ? "transporter" : "business"].email}
                    {" · "}Password: {demoAccounts.transporter.password}
                  </p>
                </div>
                <Field
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="ops@shivneri.in"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                />
                <Field
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  required
                />
                <Button type="submit" className="sm:col-span-2" disabled={busy}>
                  <Lock className="size-4" /> {busy ? "Please wait…" : `Login as ${role}`}
                </Button>
                <div className="flex justify-between sm:col-span-2">
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline"
                    onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
                  >
                    New to CargoLoop? Create an account
                  </button>
                  <button
                    type="button"
                    className="text-xs font-medium text-accent underline"
                    onClick={() => setForgot(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            ) : null}

            {role && isLogin && forgot ? (
              <form
                className="grid gap-4 rounded-xl border border-accent/40 bg-accent/5 p-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendReset(e.currentTarget);
                }}
              >
                <p className="text-sm font-semibold sm:col-span-2">Reset your password</p>
                <Field
                  id="reset-email"
                  name="resetid"
                  label="Registered Email"
                  type="email"
                  placeholder="ops@shivneri.in"
                  required
                />
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Button type="submit" disabled={busy}>
                    {busy ? "Sending…" : "Email me a reset link"}
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline"
                    onClick={() => setForgot(false)}
                  >
                    Back to login
                  </button>
                </div>
              </form>
            ) : null}

            {role && !isLogin ? (
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void signup(role, e.currentTarget);
                }}
              >
                <Field
                  id="fullname"
                  name="name"
                  label={role === "transporter" ? "Your Name" : "Contact Person"}
                  placeholder={role === "transporter" ? "Mahesh Deshmukh" : "Anita Rao"}
                  required
                />
                <Field
                  id="company"
                  name="company"
                  label={role === "transporter" ? "Transport company name" : "Business Name"}
                  placeholder={role === "transporter" ? "Shivneri Roadlines" : "ABC Manufacturing"}
                  required
                />
                <Field
                  id="mobile"
                  name="mobile"
                  label="Mobile Number"
                  placeholder="+91 98XXXXXX21"
                  required
                />
                <Field id="city" name="city" label="City" placeholder="Nagpur" required />

                <Field
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="ops@shivneri.in"
                  required
                />
                <Field
                  id="pwd"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />

                <Button type="submit" className="sm:col-span-2" disabled={busy}>
                  {busy ? "Creating account…" : `Create ${role} account`}
                </Button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline sm:col-span-2"
                  onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
                >
                  Already registered? Login
                </button>
              </form>
            ) : null}

            {!role ? (
              <p className="text-sm text-muted-foreground">Select a role above to continue.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
