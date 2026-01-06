'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login error:", error)
        return { error: error.message, apiAutoLogin: false }
    }

    console.log("Login success for:", email)
    console.log("Session set:", !!data.session)

    return { success: true, apiAutoLogin: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.error("Signup error:", error)
        return { error: error.message, apiAutoLogin: false }
    }

    return { success: true, apiAutoLogin: !!data.session }
}
