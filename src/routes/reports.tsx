import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyRevenue, orderStatusDistribution, staff, topFoods, weeklyOrders } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import { BarChart3, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Saffron" }] }),
  component: ReportsPage,
});

const tip = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
};

function ReportsPage() {
  const yearRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const perfData = staff.slice(0, 6).map((s) => ({ name: s.name.split(" ")[0], orders: 30 + Math.floor(Math.random() * 80) }));

  return (
    <AppLayout>
      <PageHeader title="Reports" description="Analytics & business performance" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Yearly revenue" value={formatCurrency(yearRevenue)} icon={<DollarSign className="h-5 w-5" />} delta={14.2} tone="success" />
        <StatsCard title="Total orders" value="3,482" icon={<ShoppingBag className="h-5 w-5" />} delta={9.6} tone="primary" />
        <StatsCard title="Avg ticket" value="$38.10" icon={<TrendingUp className="h-5 w-5" />} delta={3.4} tone="info" />
        <StatsCard title="Best month" value="Dec" hint={formatCurrency(41200)} icon={<BarChart3 className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue trend</CardTitle><CardDescription>Monthly</CardDescription></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue} margin={{ left: -10, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={tip} formatter={(v: number) => formatCurrency(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sales by weekday</CardTitle><CardDescription>This week</CardDescription></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={tip} />
                  <Bar dataKey="orders" fill="var(--color-info)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top selling foods</CardTitle><CardDescription>Units sold</CardDescription></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoods} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={130} />
                  <RTooltip contentStyle={tip} />
                  <Bar dataKey="sold" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Staff performance</CardTitle><CardDescription>Orders handled</CardDescription></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perfData} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={tip} />
                  <Bar dataKey="orders" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Order status distribution</CardTitle><CardDescription>Breakdown</CardDescription></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusDistribution} dataKey="value" nameKey="name" outerRadius={100} label>
                    {orderStatusDistribution.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <RTooltip contentStyle={tip} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
