'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleAction(formData: FormData, action: 'login' | 'signup') {
        setLoading(true)
        console.log(`[Client] Attempting ${action}...`)

        try {
            const fn = action === 'login' ? login : signup
            const result = await fn(formData)
            console.log(`[Client] ${action} result:`, result)

            if (result.error) {
                toast.error(result.error)
            } else {
                if (action === 'login' || result.apiAutoLogin) {
                    toast.success('Welcome! Redirecting...')
                    router.push('/')
                    router.refresh()
                } else {
                    toast.success('Check your email to confirm sign up!')
                }
            }
        } catch (e: any) {
            console.error(`[Client] ${action} unexpected error:`, e)
            toast.error("An unexpected error occurred: " + e?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-slate-50 min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={(e) => {
                            e.preventDefault()
                            // Default handling if needed, but buttons handle specific actions
                        }}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        const form = e.currentTarget.closest('form')
                                        if (form?.checkValidity()) {
                                            handleAction(new FormData(form), 'login')
                                        } else {
                                            form?.reportValidity()
                                        }
                                    }}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Login
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        const form = e.currentTarget.closest('form')
                                        if (form?.checkValidity()) {
                                            handleAction(new FormData(form), 'signup')
                                        } else {
                                            form?.reportValidity()
                                        }
                                    }}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
