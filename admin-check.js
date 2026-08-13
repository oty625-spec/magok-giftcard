module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store, max-age=0');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end()}
  if(!process.env.ADMIN_PASSWORD)return res.status(503).json({ok:false,error:'관리자 비밀번호 미설정'});
  if(req.headers['x-admin-password']!==process.env.ADMIN_PASSWORD)return res.status(401).json({ok:false});
  return res.status(200).json({ok:true});
};
