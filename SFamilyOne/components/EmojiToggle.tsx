
'use client'
import { useState } from 'react'

const emojis = ['😀','😁','😂','😍','🤩','😎','😭','🙏','🔥','🎉','👍','👎']
export default function EmojiToggle({ onPick }:{ onPick:(e:string)=>void }){
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button className="btn" onClick={()=>setOpen(!open)}>😊 Emojis</button>
      {open && (
        <div className="absolute z-20 mt-2 p-2 grid grid-cols-6 gap-2 bg-slate-900 border border-slate-700 rounded-lg">
          {emojis.map(e=> (
            <button key={e} className="text-2xl" onClick={()=>{ onPick(e); setOpen(false) }}>{e}</button>
          ))}
        </div>
      )}
    </div>
  )
}
