
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function Login(){
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const loginGoogle = async()=>{
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: (process.env.NEXT_PUBLIC_SITE_URL||'') + '/login' } })
  }
  const sendOtp = async()=>{
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if(!error) setOtpSent(true); else alert(error.message)
  }
  const verifyOtp = async()=>{
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if(error) alert(error.message)
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Entrar a SFamilyOne</h1>
      <button className="btn btn-primary w-full" onClick={loginGoogle}>Continuar con Google</button>
      <div className="card p-4 space-y-2">
        <label className="text-sm opacity-70">Número de teléfono (con código de país, ej. +52...)</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+52..."/>
        {!otpSent ? (
          <button className="btn btn-primary" onClick={sendOtp}>Enviar código</button>
        ) : (
          <div className="space-y-2">
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Código SMS"/>
            <button className="btn btn-primary" onClick={verifyOtp}>Verificar</button>
          </div>
        )}
      </div>
    </div>
  )
}
