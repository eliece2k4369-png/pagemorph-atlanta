"use client"
import { useState } from 'react'

export default function Home(){
  const [log, setLog] = useState<string[]>(["[Sistema] Listo para probar PageMorph..."])
  const [headline, setHeadline] = useState("Tu web que se reescribe sola con IA")
  const [sub, setSub] = useState("Detecta quién entra y cambia headline, CTA y prueba social en 100ms")
  const [cta, setCta] = useState("Probar Demo Gratis")
  
  const addLog = (m:string) => setLog(l => [...l, `${new Date().toLocaleTimeString()} ${m}`])

  const simulate = async (profile:string) => {
    setLog([])
    addLog(`[morph.js] Capturando contexto... utm=${profile}`)
    addLog(`[morph.js] POST /api/morph {industry: ${profile.split('-')[0]}}`)
    
    await new Promise(r=>setTimeout(r, 400))
    addLog(`[Edge] Cache MISS -> Llamando Claude Haiku...`)
    
    const res = await fetch('/api/morph', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ industry: profile, city: 'Atlanta', utm: profile })
    })
    const data = await res.json()
    
    addLog(`[AI] Generado: ${JSON.stringify(data).slice(0,80)}...`)
    addLog(`[morph.js] Mutando DOM con fade...`)
    
    await new Promise(r=>setTimeout(r, 300))
    setHeadline(data.headline)
    setSub(data.subheadline)
    setCta(data.cta)
    addLog(`[morph.js] ✅ Mutación completa en ${data.latencyMs}ms`)
    addLog(`[Track] Evento view guardado`)

    // track
    fetch('/api/track', {method:'POST', body: JSON.stringify({siteId:'demo', event:'view', context:{profile}, mutated:data})})
  }

  return (
    <div style={{minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 360px'}}>
      <div style={{padding:40}}>
        <div style={{display:'flex', gap:8, marginBottom:24}}>
          {['realtor-atl','gym-owner','lawyer','generic'].map(p=>(
            <button key={p} onClick={()=>simulate(p)} style={{padding:'10px 16px', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:8, cursor:'pointer'}}>UTM: {p}</button>
          ))}
        </div>
        <div style={{background:'white', color:'black', borderRadius:16, padding:0, overflow:'hidden', border:'8px solid #222'}}>
          <div style={{background:'#f5f5f5', padding:'8px 16px', display:'flex', gap:6, borderBottom:'1px solid #ddd'}}>
            <span style={{width:12,height:12,background:'#ff5f56',borderRadius:12, display:'inline-block'}}></span>
            <span style={{width:12,height:12,background:'#ffbd2e',borderRadius:12, display:'inline-block'}}></span>
            <span style={{width:12,height:12,background:'#27c93f',borderRadius:12, display:'inline-block'}}></span>
            <span style={{marginLeft:12, fontSize:12, color:'#666'}}>atlantapremierrealty.com?utm_campaign={"{profile}"}</span>
          </div>
          <div style={{padding:48}}>
            <h1 id="pm-headline" style={{fontSize:42, fontWeight:800, lineHeight:1.1, margin:0, transition:'all .5s'}}>{headline}</h1>
            <p id="pm-sub" style={{fontSize:18, color:'#555', marginTop:16, transition:'all .5s'}}>{sub}</p>
            <button id="pm-cta" onClick={()=>addLog('[Track] CTA Click -> Lead guardado!')} style={{marginTop:24, padding:'16px 28px', background:'#8b5cf6', color:'white', border:0, borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer'}}>{cta}</button>
          </div>
        </div>
      </div>
      <div style={{background:'#0a0a0a', borderLeft:'1px solid #222', padding:16, fontFamily:'monospace', fontSize:12}}>
        <div style={{color:'#8b5cf6', fontWeight:700, marginBottom:12}}>● CONSOLE - PageMorph LIVE</div>
        {log.map((l,i)=><div key={i} style={{color:'#aaa', marginBottom:4, lineHeight:1.4}}>{l}</div>)}
      </div>
    </div>
  )
}