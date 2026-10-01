export async function POST(req: Request){
  try{
    const body = await req.json()
    console.log("[track]", body)
  }catch{}
  return Response.json({ok:true})
}
