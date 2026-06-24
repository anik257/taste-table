import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Saffron" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <AppLayout>
      <PageHeader title="Settings" description="Configure your restaurant & preferences" />

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant information</CardTitle>
              <CardDescription>Shown on invoices and customer-facing screens</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }}>
                <div className="grid gap-1.5 sm:col-span-2"><Label>Restaurant name</Label><Input defaultValue="Saffron" /></div>
                <div className="grid gap-1.5"><Label>Phone</Label><Input defaultValue="+1 (555) 0100" /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" defaultValue="hello@saffron.app" /></div>
                <div className="grid gap-1.5 sm:col-span-2"><Label>Address</Label><Textarea rows={2} defaultValue="123 Spice Lane, New York, NY 10001" /></div>
                <div className="grid gap-1.5"><Label>Tax rate (%)</Label><Input type="number" defaultValue={8} /></div>
                <div className="grid gap-1.5"><Label>Currency</Label><Input defaultValue="USD" /></div>
                <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarImage src="https://i.pravatar.cc/150?u=owner" /><AvatarFallback>OB</AvatarFallback></Avatar>
                <div><Button variant="outline" size="sm">Change avatar</Button><p className="mt-1 text-xs text-muted-foreground">JPG/PNG · max 2MB</p></div>
              </div>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
                <div className="grid gap-1.5"><Label>Full name</Label><Input defaultValue="Olivia Bennett" /></div>
                <div className="grid gap-1.5"><Label>Role</Label><Input defaultValue="Owner" /></div>
                <div className="grid gap-1.5 sm:col-span-2"><Label>Email</Label><Input defaultValue="olivia@saffron.app" /></div>
                <div className="sm:col-span-2"><Button type="submit">Update profile</Button></div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Choose how Saffron looks</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
                    <p className="text-xs text-muted-foreground">Toggle the interface theme</p>
                  </div>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggle} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>What you want to be alerted about</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "New orders", desc: "Notify on every new order received" },
                { label: "Order ready", desc: "When an order is ready to be served" },
                { label: "Payments", desc: "Receipts and refunds" },
                { label: "Low stock alerts", desc: "When an ingredient is running low" },
                { label: "Daily summary", desc: "End-of-day report email" },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
