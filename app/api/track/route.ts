import { supabase } from "@/lib/supabase"
export async function POST(req: Request){
  try{
    const body = await req.json()
    console.log("[track] saving to existing table", body)
    const { error } = await supabase.from("leads").insert([{
      utm: body.utm || body.industry || "generic",
      headline: body.headline || "",
      city: body.city || "Atlanta",
      latency_ms: body.latencyMs || 0,
      model: body.model || "fallback",
      created_at: new Date().toISOString()
    }])
    if(error) console.error("Supabase error:", error)
    return Response.json({ok:true, saved:!error})
  }catch(e){
    console.error(e)
    return Response.json({ok:false})
  }
}
