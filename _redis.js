const DEFAULT_PRODUCTS = [
  {name:'신세계백화점',denom:'10만원권',buy:95700,sell:95900},
  {name:'롯데백화점',denom:'10만원권',buy:96650,sell:96800},
  {name:'현대백화점',denom:'10만원권',buy:96550,sell:96700},
  {name:'갤러리아백화점',denom:'10만원권',buy:96450,sell:96600},
  {name:'국민관광상품권',denom:'10만원권',buy:96500,sell:96700},
  {name:'금강제화 상품권',denom:'10만원권',buy:0,sell:74000}
];

function redisConfig(){
  const url=process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token=process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url||!token) return null;
  return {url:url.replace(/\/$/,''),token};
}

async function redisGet(key){
  const cfg=redisConfig(); if(!cfg) return null;
  const r=await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`,{headers:{Authorization:`Bearer ${cfg.token}`}});
  if(!r.ok) throw new Error('redis_get_failed');
  const d=await r.json();
  if(d.result==null) return null;
  try{return JSON.parse(d.result)}catch{return d.result}
}

async function redisSet(key,value){
  const cfg=redisConfig(); if(!cfg) throw new Error('storage_not_configured');
  const body=JSON.stringify(value);
  const r=await fetch(`${cfg.url}/set/${encodeURIComponent(key)}/${encodeURIComponent(body)}`,{headers:{Authorization:`Bearer ${cfg.token}`}});
  if(!r.ok) throw new Error('redis_set_failed');
  return true;
}

module.exports={DEFAULT_PRODUCTS,redisGet,redisSet,redisConfig};
