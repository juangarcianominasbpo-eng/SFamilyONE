
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Messages(){
  const [user, setUser] = useState<any>(null)
  const [recipient, setRecipient] = useState('')
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState<any[]>([])

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data.user)) },[])
  useEffect(()=>{
    if(!user || !recipient) return
    const room = [user.id, recipient].sort().join('-')
    let sub: any
    ;(async()=>{
      const { data } = await supabase.from('messages').select('*').eq('room_id', room).order('created_at', { ascending: true }).limit(200)
      setMsgs(data||[])
      sub = supabase
        .channel(`room-${room}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room}` }, (payload:any)=>{
          setMsgs(m=>[...m, payload.new])
        })
        .subscribe()
    })()
    return ()=>{ if(sub) supabase.removeChannel(sub) }
  },[user, recipient])

  const send = async()=>{
    if(!user || !recipient || !text.trim()) return
    const room = [user.id, recipient].sort().join('-')
    await supabase.from('messages').insert({ room_id: room, sender_id: user.id, recipient_id: recipient, content: text })
    setText('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mensajes</h1>
      <input placeholder="ID del destinatario" value={recipient} onChange={e=>setRecipient(e.target.value)} />
      <div className="card p-3 h-80 overflow-y-auto space-y-2">
        {msgs.map((m,i)=> (
          <div key={i} className={`p-2 rounded ${m.sender_id===user?.id? 'bg-primary/30 ml-auto max-w-[70%]':'bg-slate-800 max-w-[70%]'}`}>{m.content}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe un mensaje"/>
        <button className="btn btn-primary" onClick={send}>Enviar</button>
      </div>
    </div>
  )
}
