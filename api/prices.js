const {DEFAULT_PRODUCTS,redisGet,redisSet,redisConfig}=require('./_redis');

function validProducts(v){
  return Array.isArray(v)&&v.length>0&&v.length<=50&&v.every(p=>p&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=80&&typeof p.denom==='string'&&p.denom.length<=30&&Number.isFinite(Number(p.buy))&&Number(p.buy)>=0&&Number(p.buy)<=10000000&&Number.isFinite(Number(p.sell))&&Number(p.sell)>=0&&Number(p.sell)<=10000000);
}

module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store, max-age=0');
  if(req.method==='GET'){
    try{const saved=await redisGet('magok:prices');return res.status(200).json({products:saved||DEFAULT_PRODUCTS,storageConfigured:!!redisConfig()})}
    catch{return res.status(200).json({products:DEFAULT_PRODUCTS,storageConfigured:false})}
  }
  if(req.method==='POST'){
    if(!process.env.ADMIN_PASSWORD)return res.status(503).json({error:'관리자 비밀번호가 아직 설정되지 않았습니다.'});
    if(req.headers['x-admin-password']!==process.env.ADMIN_PASSWORD)return res.status(401).json({error:'관리자 비밀번호가 맞지 않습니다.'});
    const products=req.body?.products;
    if(!validProducts(products))return res.status(400).json({error:'가격 데이터 형식이 올바르지 않습니다.'});
    if(!redisConfig())return res.status(503).json({error:'공용 가격 저장소가 아직 연결되지 않았습니다.'});
    const clean=products.map(p=>({name:p.name.trim(),denom:String(p.denom||'10만원권').trim()||'10만원권',buy:Math.round(Number(p.buy)),sell:Math.round(Number(p.sell))}));
    try{await redisSet('magok:prices',clean);return res.status(200).json({ok:true})}
    catch{return res.status(500).json({error:'가격 저장 중 오류가 발생했습니다.'})}
  }
  res.setHeader('Allow','GET, POST');return res.status(405).end();
};
