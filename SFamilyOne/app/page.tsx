
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import PostComposer from '@/components/PostComposer'
import PostCard from '@/components/PostCard'

export default function Home(){
  const [posts, setPosts] = useState<any[]>([])
  useEffect(()=>{
    load()
    const ch = supabase
      .channel('posts-ch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload=>{ load() })
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])
  const load = async()=>{
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50)
    setPosts(data||[])
  }
  return (
    <div className="space-y-4">
      <PostComposer />
      {posts.map(p=> <PostCard key={p.id} post={p}/>) }
    </div>
  )
}
