
'use client'
import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ url }:{ url?:string }){
  const audioRef = useRef<HTMLAudioElement|null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(()=>{
    const a = audioRef.current
    if(!a || !url) return
    const tryPlay = async()=>{
      try{ await a.play(); setPlaying(true) }catch{ setPlaying(false) }
    }
    const onUserGesture = ()=>{ if(!playing) tryPlay() }
    document.addEventListener('click', onUserGesture, { once: true })
    tryPlay()
    return ()=>{ document.removeEventListener('click', onUserGesture) }
  },[url])

  if(!url) return null
  return (
    <div className="card p-3 flex items-center gap-3">
      <audio ref={audioRef} src={url} onCanPlay={()=>setReady(true)} controls />
      {!playing && <button className="btn btn-primary" onClick={()=>{ audioRef.current?.play(); setPlaying(true) }}>▶ Reproducir</button>}
    </div>
  )
}
