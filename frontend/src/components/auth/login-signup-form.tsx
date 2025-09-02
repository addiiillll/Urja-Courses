"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function LoginSignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const username = formData.get("username") as string
        const password = formData.get("password") as string

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            localStorage.setItem("token", data.token)
            
            // Redirect based on role
            if (data.user.role === "admin") {
                router.push("/dashboard/admin")
            } else {
                router.push("/dashboard/teacher")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    {isLogin ? "Login to Dashboard" : "Sign Up as Teacher"}
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    {isLogin 
                                        ? "Login to your dashboard here." 
                                        : "Create a teacher account to get started."
                                    }
                                </p>
                            </div>
                            {error && (
                                <div className="text-sm text-red-600 text-center">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********" 
                                        required 
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Loading..." : (isLogin ? "Login" : "Sign Up")}
                            </Button>
                            <div className="text-center text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        setError("")
                                    }}
                                    className="underline underline-offset-4"
                                >
                                    {isLogin ? "Sign up" : "Login"}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <div className="text-center text-primary-foreground">
                                <h2 className="text-2xl font-bold mb-2">Urja Courses</h2>
                                <p className="text-sm opacity-80">Instructor & Admin Portal</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
