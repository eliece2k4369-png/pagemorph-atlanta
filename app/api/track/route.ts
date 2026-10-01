import { supabase } from "@/lib/supabase"
export async function POST(req: Request){
  try{
    const body = await req.json()
    console.log("[track] saving to mutations", body)
    const { error } = await supabase.from("mutations").insert([{
      site_id: "demo",
      context: { profile: body.utm || body.industry || "generic", city: body.city || "Atlanta", utm: body.utm },
      mutated: { headline: body.headline || "", subheadline: body.subheadline || "", cta: body.cta || "", latencyMs: body.latencyMs || 0, model: body.model || "fallback" },
      event: "view",
    }])
    if(error) console.error("Supabase mutations error:", error)
    return Response.json({ok:true, saved:!error, error: error?.message})
  }catch(e:any){
    console.error(e)
    return Response.json({ok:false, error: e.message})
  }
}
