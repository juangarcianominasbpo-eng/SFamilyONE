
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { LogOut } from 'lucide-react'

export default function NavBar(){
  const [user, setUser] = useState<any>(null)
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data.user)) },[])
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-7"/>
          <span className="font-bold text-primary">SFamilyOne</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link className="btn btn-primary" href="/upload">Crear post</Link>
          <Link className="btn" href="/messages">Mensajes</Link>
          {user ? (
            <>
              <Link className="btn" href={`/profile/${user.user_metadata?.username || user.id}`}>Perfil</Link>
              <button className="btn" onClick={()=>supabase.auth.signOut()} title="Salir"><LogOut size={18}/></button>
            </>
          ) : (
            <Link className="btn" href="/login">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
