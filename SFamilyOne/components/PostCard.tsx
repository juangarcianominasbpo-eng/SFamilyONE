
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PostCard({post}:{post:any}){
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  useEffect(()=>{
    const sub = supabase
      .channel('likes-ch')
      .on('postgres_changes', {event: '*', schema: 'public', table:'likes', filter:`post_id=eq.${post.id}`}, payload=>{
        // naive refresh
        fetchLikes()
      }).subscribe()
    fetchLikes()
    return ()=>{ supabase.removeChannel(sub) }
  },[])

  const fetchLikes = async()=>{
    const { data, error } = await supabase.from('likes').select('*', { count: 'exact', head: false }).eq('post_id', post.id)
    if(!error && data) setLikes(data.length)
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      const { data: isLiked } = await supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle()
      setLiked(!!isLiked)
    }
  }

  const toggleLike = async()=>{
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) { alert('Inicia sesión'); return }
    if(liked){ await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id) }
    else { await supabase.from('likes').insert({ post_id: post.id, user_id: user.id }) }
    fetchLikes()
  }

  return (
    <div className="card p-4 space-y-2">
      <div className="text-sm opacity-70">{new Date(post.created_at).toLocaleString()}</div>
      <div className="whitespace-pre-wrap">{post.content}</div>
      {post.media_url && (
        post.media_url.match(/\.(mp4|webm|mov)$/i) ? (
          <video controls className="w-full rounded-lg" src={post.media_url}></video>
        ) : (
          <img className="w-full rounded-lg" src={post.media_url} alt="media"/>
        )
      )}
      <div className="flex items-center gap-3 pt-2">
        <button className={`btn ${liked? 'bg-secondary text-black' : 'bg-slate-800'}`} onClick={toggleLike}>❤ {likes}</button>
      </div>
    </div>
  )
}
