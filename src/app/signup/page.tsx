'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSignup(formData: FormData) {
        setLoading(true)
        try {
            const result = await signup(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Account created! Check your email to confirm.')
                router.push('/login')
            }
        } catch (e: any) {
            toast.error("An unexpected error occurred: " + e?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-gradient-to-br from-indigo-50 to-blue-100 min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="shadow-xl border-t-4 border-t-indigo-500">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-slate-800">Sign Up</CardTitle>
                        <CardDescription className="text-slate-600">
                            Create a new account to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSignup} className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="focus-visible:ring-indigo-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="focus-visible:ring-indigo-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-6">
                        <div className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                                Login here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
