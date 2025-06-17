"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "success" | "error">("testing")
  const [error, setError] = useState<string>("")

  const testConnection = async () => {
    try {
      setConnectionStatus("testing")
      setError("")

      // Simple test query
      const { data, error } = await supabase.from("projects").select("count", { count: "exact" })

      if (error) {
        throw error
      }

      setConnectionStatus("success")
    } catch (err: any) {
      setConnectionStatus("error")
      setError(err.message)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectionStatus === "testing" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Testing connection...</p>
            </div>
          )}

          {connectionStatus === "success" && (
            <div className="text-center text-green-600">
              <div className="text-2xl">✅</div>
              <p className="font-semibold">Connection Successful!</p>
              <p className="text-sm text-muted-foreground">Your database is ready to use.</p>
            </div>
          )}

          {connectionStatus === "error" && (
            <div className="text-center text-red-600">
              <div className="text-2xl">❌</div>
              <p className="font-semibold">Connection Failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={testConnection} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
