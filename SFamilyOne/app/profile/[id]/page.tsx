
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import MusicPlayer from '@/components/MusicPlayer'

export default function Profile({ params }:{ params: { id: string } }){
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(()=>{ load() },[params.id])
  const load = async()=>{
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', params.id).maybeSingle()
    setProfile(prof)
    const { data: p } = await supabase.from('posts').select('*').eq('author_id', params.id).order('created_at', { ascending: false })
    setPosts(p||[])
  }

  return (
    <div className="space-y-4">
      {profile && (
        <div className="card p-4">
          <div className="flex items-center gap-4">
            {profile.avatar_url && <img src={profile.avatar_url} className="w-20 h-20 rounded-full"/>}
            <div>
              <h2 className="text-xl font-bold">{profile.display_name||'Usuario'}</h2>
              <p className="opacity-80">{profile.bio}</p>
            </div>
          </div>
        </div>
      )}
      <MusicPlayer url={profile?.song_url||undefined} />
      <div className="space-y-3">
        {posts.map(p=> (
          <div key={p.id} className="card p-4">
            <div className="opacity-70 text-sm">{new Date(p.created_at).toLocaleString()}</div>
            <div className="whitespace-pre-wrap">{p.content}</div>
            {p.media_url && (p.media_url.match(/\.(mp4|webm|mov)$/i) ? <video controls className="w-full rounded-lg" src={p.media_url}></video> : <img className="w-full rounded-lg" src={p.media_url} />)}
          </div>
        ))}
      </div>
    </div>
  )
}
