
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import EmojiToggle from '@/components/EmojiToggle'

export default function PostComposer(){
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async ()=>{
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user){ alert('Inicia sesión'); setLoading(false); return }
    let media_url = null
    if(file){
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('media').upload(path, file)
      if(error){ alert(error.message); setLoading(false); return }
      const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
      media_url = pub.publicUrl
    }
    const { error: e2 } = await supabase.from('posts').insert({
      author_id: user.id,
      content,
      media_url
    })
    if(e2) alert(e2.message)
    setContent(''); setFile(null); setLoading(false)
  }

  return (
    <div className="card p-4">
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="¿Qué estás pensando?"/>
      <div className="flex items-center gap-3 mt-2">
        <EmojiToggle onPick={(e)=>setContent(prev=>prev + e)} />
        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading? 'Publicando...' : 'Publicar'}</button>
      </div>
    </div>
  )
}
