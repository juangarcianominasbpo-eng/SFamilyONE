
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Upload(){
  const [file, setFile] = useState<File|null>(null)
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const upload = async()=>{
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user){ alert('Inicia sesión'); setLoading(false); return }
    if(!file){ alert('Selecciona un archivo'); setLoading(false); return }
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if(error){ alert(error.message); setLoading(false); return }
    const { data: pub } = await supabase.storage.from('media').getPublicUrl(path)
    await supabase.from('posts').insert({ author_id: user.id, content: desc, media_url: pub.publicUrl })
    setFile(null); setDesc(''); setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Subir foto/video</h1>
      <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <textarea placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button className="btn btn-primary" onClick={upload} disabled={loading}>{loading? 'Subiendo...' : 'Publicar'}</button>
    </div>
  )
}
