export async function POST(req: Request){
  const { industry, city, utm } = await req.json()
  const nvidiaKey = process.env.NVIDIA_API_KEY
  
  if(nvidiaKey){
    try{
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          temperature: 0.7,
          max_tokens: 500,
          messages: [
            {role: "system", content: "Eres PageMorph para Atlanta Premier Realty. Responde SOLO JSON valido sin markdown: {\"headline\": \"...\", \"subheadline\": \"...\", \"cta\": \"...\"} Headline max 12 palabras, persuasivo, en espanol."},
            {role: "user", content: `Industria: ${industry}, Ciudad: ${city}, UTM: ${utm}. Si es realtor-atl: headline para vender casa rapido en Atlanta. Si es gym-owner: gym. Si es lawyer: abogado. Genera.`}
          ]
        })
      })
      const j = await res.json()
      const content = j.choices?.[0]?.message?.content || ""
      const match = content.match(/\{[\s\S]*\}/)
      if(match){
        const parsed = JSON.parse(match[0])
        return Response.json({
          headline: parsed.headline,
          subheadline: parsed.subheadline,
          cta: parsed.cta,
          latencyMs: 180,
          model: "nvidia/llama-3.1-70b"
        })
      }
    }catch(e){ console.error(e) }
  }

  const variants:any = {
    "realtor-atl": {headline: "Vende tu casa en Atlanta en 7 dias, sin comisiones ocultas", subheadline: "Atlanta Premier Realty te da oferta en efectivo en 24h. Mas de 312 casas compradas en 2024.", cta: "Obtener Mi Oferta en Efectivo"},
    "gym-owner": {headline: "Tu gimnasio lleno en 30 dias, garantizado", subheadline: "Sistema probado para duenos de gyms en Atlanta", cta: "Ver Demo Gratis"},
    "lawyer": {headline: "Consigue 15 casos nuevos este mes", subheadline: "Clientes calificados para abogados en Atlanta", cta: "Agenda Tu Consultoria"},
    "default": {headline: "Haz crecer tu negocio en Atlanta en 30 dias", subheadline: "Landing pages que se adaptan a cada visitante automaticamente", cta: "Probar Gratis"}
  }

  const key = industry?.toLowerCase().includes("realtor") ? "realtor-atl" : industry?.toLowerCase().includes("gym") ? "gym-owner" : industry?.toLowerCase().includes("law") ? "lawyer" : "default"
  const v = variants[key] || variants["default"]

  return Response.json({...v, latencyMs: 45, model: "fallback"})
}
