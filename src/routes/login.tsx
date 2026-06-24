import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChefHat, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Saffron" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "owner@saffron.app", password: "demo1234", remember: true },
  });

  const onSubmit = (v: FormValues) => {
    toast.success(`Welcome back, ${v.email.split("@")[0]}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left – visual */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-accent-foreground/60 lg:block">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">Saffron</span>
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight">
              Run your restaurant<br />with elegance.
            </h1>
            <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
              Menu, orders, tables, staff and billing in one calm, modern dashboard.
            </p>
            <div className="mt-10 flex gap-6 text-sm">
              <div><p className="font-display text-2xl font-bold">2.4k</p><p className="text-primary-foreground/70">Orders / mo</p></div>
              <div><p className="font-display text-2xl font-bold">98%</p><p className="text-primary-foreground/70">Uptime</p></div>
              <div><p className="font-display text-2xl font-bold">4.9★</p><p className="text-primary-foreground/70">Owner rating</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right – form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">Saffron</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your restaurant dashboard.</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9" {...form.register("email")} />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" className="pl-9" {...form.register("password")} />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch("remember")}
                  onCheckedChange={(c) => form.setValue("remember", c === true)}
                />
                Remember me
              </label>
              <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot?</a>
            </div>
            <Button type="submit" className="h-11 w-full">Sign in</Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Demo build · <Link to="/dashboard" className="text-primary hover:underline">skip to dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
