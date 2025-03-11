"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import dynamic from "next/dynamic"

// Import the map component dynamically to avoid SSR issues
const HeatmapLayer = dynamic(() => import("@/components/maps/heatmap-layer"), { ssr: false })

interface AnalyticsData {
  complaints: {
    total: number
    resolved: number
    pending: number
    categories: { [key: string]: number }
    trend: Array<{ date: string; count: number }>
  }
  performance: {
    avgResolutionTime: number
    staffEfficiency: { [key: string]: number }
    stationWorkload: Array<{ station: string; workload: number }>
  }
  predictions: {
    nextWeek: Array<{ date: string; predicted: number }>
    categories: Array<{ category: string; trend: "up" | "down" | "stable" }>
    maintenance: Array<{
      location: string
      issue: string
      probability: number
    }>
  }
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, []) // Removed unnecessary dependency: timeRange

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analyticsData) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights and predictions</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Distribution</CardTitle>
                <CardDescription>By category and status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(analyticsData.complaints.categories).map(([category, count]) => ({
                      category,
                      count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complaint Trend</CardTitle>
                <CardDescription>Daily complaint volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.complaints.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
                <CardDescription>Station-wise complaint density</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <HeatmapLayer data={analyticsData.performance.stationWorkload} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Predicted Complaint Volume</CardTitle>
                <CardDescription>Next 7 days forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.predictions.nextWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predicted" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
                <CardDescription>Predicted changes in complaint categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.predictions.categories.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-2 border rounded">
                      <span>{category.category}</span>
                      <span
                        className={
                          category.trend === "up"
                            ? "text-red-500"
                            : category.trend === "down"
                              ? "text-green-500"
                              : "text-yellow-500"
                        }
                      >
                        {category.trend === "up"
                          ? "↑ Increasing"
                          : category.trend === "down"
                            ? "↓ Decreasing"
                            : "→ Stable"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Preventive Maintenance Alerts</CardTitle>
              <CardDescription>AI-predicted maintenance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.predictions.maintenance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">{item.location}</h4>
                      <p className="text-sm text-muted-foreground">{item.issue}</p>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        item.probability > 0.7
                          ? "text-red-500"
                          : item.probability > 0.4
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {(item.probability * 100).toFixed(1)}% probability
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

