import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Bot, Languages, MessageCircle, Package, ShoppingCart, Users, BarChart3, Settings, Send, CheckCircle2, Sparkles, ShieldCheck, Globe2 } from 'lucide-react'
import './styles.css'

type Lang = 'ar'|'en'|'ar-Latn'|'es'|'fr'|'tr'|'de'|'hi'|'ur'|'unknown'
type Product = { id:number; name:string; nameAr:string; price:number; stock:number; category:string; colors:string[]; sizes:string[]; image:string }
type Order = { id:string; product:string; qty:number; total:number; customer:string; lang:Lang; at:string }
type Message = { from:'customer'|'agent'; text:string; lang?:Lang; time:string }

const products: Product[] = [
 {id:1,name:'Black Hoodie',nameAr:'هودي أسود',price:45000,stock:8,category:'clothes',colors:['black','أسود'],sizes:['S','M','L','XL'],image:'🧥'},
 {id:2,name:'White T-Shirt',nameAr:'تيشيرت أبيض',price:18000,stock:15,category:'clothes',colors:['white','أبيض'],sizes:['S','M','L'],image:'👕'},
 {id:3,name:'Blue Jeans',nameAr:'جينز أزرق',price:35000,stock:4,category:'clothes',colors:['blue','أزرق'],sizes:['30','32','34','36'],image:'👖'},
 {id:4,name:'Urban Sneakers',nameAr:'سنيكرز رياضي',price:60000,stock:6,category:'shoes',colors:['white','أبيض','black'],sizes:['40','41','42','43'],image:'👟'},
 {id:5,name:'Classic Cap',nameAr:'كاب كلاسيك',price:12000,stock:20,category:'accessories',colors:['black','أسود','white'],sizes:['free'],image:'🧢'}
]
const initialMessages: Message[] = [{from:'agent',text:'هلا بيك 🌷 أنا Angel، موظف المبيعات الذكي. أگدر أساعدك تختار منتج وتكمل طلبك. جرّب: «أريد هودي أسود»',lang:'ar',time:'الآن'}]

function detectLanguage(input:string): Lang {
 const s=input.trim(); if(!s) return 'unknown'
 if(/[\u0600-\u06ff]/.test(s)) return 'ar'
 if(/[\u0900-\u097f]/.test(s)) return 'hi'
 if(/[\u0400-\u04ff]/.test(s)) return 'unknown'
 if(/[àâçéèêëîïôûùüÿœ]/i.test(s)) return 'fr'
 if(/[äöüß]/i.test(s)) return 'de'
 if(/\b(que|quiero|precio|disponible|hola|necesito)\b/i.test(s)) return 'es'
 if(/\b(merhaba|fiyat|stok|istiyorum)\b/i.test(s)) return 'tr'
 if(/[a-z]/i.test(s) && /\b(hai|chahiye|price|available|want|need|hello|hi)\b/i.test(s)) return 'en'
 if(/[a-z]/i.test(s)) return 'ar-Latn' // Arabizi / unknown Latin: preserve the customer's language family
 return 'unknown'
}
const money=(n:number)=>new Intl.NumberFormat('ar-IQ').format(n)+' د.ع'
const langLabel=(l:Lang)=>({ar:'العربية (عراقي)',en:'English','ar-Latn':'Arabizi / Latin',es:'Español',fr:'Français',tr:'Türkçe',de:'Deutsch',hi:'हिन्दी',ur:'اردو',unknown:'لغة غير معروفة'}[l])

function productMatch(text:string){
 const q=text.toLowerCase(); return products.find(p=>[p.name,p.nameAr,p.category,...p.colors].some(x=>q.includes(x.toLowerCase())) || (q.includes('هودي')&&p.id===1) || (q.includes('جينز')&&p.id===3) || (q.includes('سنيكر')&&p.id===4))
}
function replyFor(text:string, lang:Lang, setPending:(p:Product)=>void):string {
 const p=productMatch(text); const wantsStock=/متوفر|موجود|stock|available|disponible|stok/i.test(text)
 if(/human|agent|موظف|موظف بشري|شكوى|refund|استرجاع|استرجاع/i.test(text)){ return lang==='en'?'I’m handing this conversation to our team now. A human teammate will follow up shortly.':'أحوّل المحادثة للفريق هسه 🌷 راح يتابع وياك موظف بشري.' }
 if(p){ setPending(p); if(lang==='en') return `${p.name} is ${p.stock>0?'available':'out of stock'}. Price: ${money(p.price)}. Available sizes: ${p.sizes.join(', ')}. Would you like to order?`; if(lang==='es') return `${p.name} está ${p.stock>0?'disponible':'agotado'}. Precio: ${money(p.price)}. ¿Quieres hacer un pedido?`; return `${p.nameAr} ${p.stock>0?'متوفر':'حالياً غير متوفر'} 🌷 السعر ${money(p.price)}. المقاسات: ${p.sizes.join('، ')}. تحب نكمل الطلب؟` }
 if(/price|سعر|شكد|كم|cost|precio|فقط/i.test(text)) return lang==='en'?'Please tell me which product you mean, and I’ll check the live store price.':'أرسللي اسم المنتج وأشيّكلك السعر الحقيقي من المخزون 🌷'
 if(/delivery|توصيل|يوصل|shipping/i.test(text)) return lang==='en'?'Delivery to Baghdad is 5,000 د.ع. This fee comes from the store delivery settings.':'التوصيل لبغداد 5,000 د.ع حسب إعدادات المتجر 🌷'
 if(wantsStock) return lang==='en'?'Tell me the product name and I’ll check live availability.':'اذكر اسم المنتج وأشيّكلك التوفر الحقيقي من المخزون.'
 if(lang==='en') return 'I can search products, check live stock, calculate delivery and create your order. What are you looking for?'
 if(lang==='es') return 'Puedo buscar productos, comprobar stock y crear tu pedido. ¿Qué estás buscando?'
 if(lang==='fr') return 'Je peux chercher les produits, vérifier le stock et créer votre commande. Que cherchez-vous ?'
 return 'أفهم طلبك وأبحث بالكتالوج الحقيقي. شنو المنتج اللي تدور عليه؟'
}

function App(){
 const [tab,setTab]=useState('overview'); const [messages,setMessages]=useState<Message[]>(initialMessages); const [input,setInput]=useState(''); const [pending,setPending]=useState<Product|null>(null); const [orders,setOrders]=useState<Order[]>(()=>JSON.parse(localStorage.getItem('orders')||'[]')); const [lastLang,setLastLang]=useState<Lang>('ar');
 useEffect(()=>localStorage.setItem('orders',JSON.stringify(orders)),[orders]);
 const send=()=>{if(!input.trim())return; const text=input.trim(), lang=detectLanguage(text); setLastLang(lang); setMessages(m=>[...m,{from:'customer',text,time:'الآن',lang},{from:'agent',text:replyFor(text,lang,setPending),time:'الآن',lang}]);setInput('')}
 const createOrder=()=>{if(!pending)return; const lang=lastLang; const order={id:'#DEMO-'+String(Date.now()).slice(-5),product:pending.nameAr,qty:1,total:pending.price+5000,customer:'Demo Customer',lang,at:new Date().toLocaleString('ar-IQ')};setOrders(o=>[order,...o]);setMessages(m=>[...m,{from:'agent',text:lang==='en'?`Order confirmed ✅ ${order.id}. Total: ${money(order.total)}. Our team will contact you for delivery.`:`تم تثبيت الطلب ✅ ${order.id}. المجموع ${money(order.total)}. راح يتواصل وياك الفريق للتوصيل.`,time:'الآن',lang}]);setPending(null)}
 const nav=[['overview','نظرة عامة',BarChart3],['chat','Demo Chat',MessageCircle],['products','المنتجات',Package],['orders','الطلبات',ShoppingCart],['customers','العملاء',Users],['settings','الإعدادات',Settings]] as const
 return <div className="app"><aside><div className="brand"><span className="brandIcon"><Sparkles size={19}/></span><div><b>مبيعاتي AI</b><small>AI Sales Employee</small></div></div><div className="store"><div className="avatar">D</div><div><b>Demo Fashion Store</b><small>متجر تجريبي</small></div></div><nav>{nav.map(([id,label,Icon])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><Icon size={18}/>{label}</button>)}</nav><div className="secure"><ShieldCheck size={17}/><span>بياناتك معزولة وآمنة<br/><small>Demo tenant: store_demo_01</small></span></div></aside><main><header><div><span className="eyebrow">لوحة تحكم المتجر</span><h1>{tab==='chat'?'صندوق المحادثات':'صباح الخير، يوسف 👋'}</h1></div><div className="headerRight"><span className="live"><i/> Agent يعمل الآن</span><div className="avatar user">Y</div></div></header>{tab==='chat'?<Chat messages={messages} input={input} setInput={setInput} send={send} pending={pending} createOrder={createOrder} lastLang={lastLang}/>:tab==='products'?<Products/>:tab==='orders'?<Orders orders={orders}/>:tab==='settings'?<SettingsPage/>:<Overview orders={orders} setTab={setTab}/>}</main></div>
}
function Overview({orders,setTab}:{orders:Order[],setTab:(s:string)=>void}){return <><section className="hero"><div><span className="pill"><Sparkles size={14}/> موظف مبيعاتك الذكي</span><h2>يبيع، يجاوب، ويتابع<br/><em>24/7</em></h2><p>وكيل AI مربوط بمنتجاتك ومخزونك وأسعارك الحقيقية — بدون تخمين.</p><button className="primary" onClick={()=>setTab('chat')}>جرّب Demo Chat <MessageCircle size={17}/></button></div><div className="heroOrb"><Bot size={62}/><span>AI</span></div></section><div className="stats"><Stat icon={MessageCircle} label="محادثات اليوم" value="128" trend="+18%"/><Stat icon={ShoppingCart} label="طلبات مولدة" value={String(orders.length+24)} trend="+12%"/><Stat icon={BarChart3} label="الإيرادات" value="1.84M" trend="+24%"/><Stat icon={Users} label="تدخل بشري" value="8.4%" trend="-3%"/></div><section className="grid2"><div className="card"><div className="cardHead"><h3>أداء الوكيل</h3><span className="success">● ممتاز</span></div><div className="chart"><div className="bars">{[42,60,48,74,67,88,79,96,82,91,100,94].map((h,i)=><i style={{height:`${h}%`}} key={i}/>)}</div><div className="chartLabels"><span>يناير</span><span>يونيو</span><span>اليوم</span></div></div></div><div className="card"><div className="cardHead"><h3>الوكيل يفهم اللغات</h3><Languages size={19}/></div><div className="languageList"><LangRow name="العربية / عراقي" pct="58%" color="purple"/><LangRow name="English" pct="24%" color="blue"/><LangRow name="Arabizi" pct="11%" color="orange"/><LangRow name="لغات أخرى" pct="7%" color="green"/></div></div></section></>}
function Stat({icon:Icon,label,value,trend}:{icon:any,label:string,value:string,trend:string}){return <div className="stat"><div className="statIcon"><Icon size={19}/></div><span>{label}</span><strong>{value}</strong><small className={trend.startsWith('-')?'down':''}>{trend} هذا الأسبوع</small></div>}
function LangRow({name,pct,color}:{name:string,pct:string,color:string}){return <div className="langRow"><span className={`dot ${color}`}/><span>{name}</span><b>{pct}</b><div className="progress"><i className={color} style={{width:pct}}/></div></div>}
function Chat({messages,input,setInput,send,pending,createOrder,lastLang}:{messages:Message[],input:string,setInput:(s:string)=>void,send:()=>void,pending:Product|null,createOrder:()=>void,lastLang:Lang}){return <div className="chatLayout"><div className="chatCard"><div className="chatHead"><div className="botAvatar"><Bot size={20}/></div><div><b>Angel — موظف المبيعات</b><small><i/> متصل الآن · Demo Chat</small></div><span className="demoBadge">DEMO · لا يوجد ربط خارجي</span></div><div className="notice"><ShieldCheck size={16}/><span>كل رد يقرأ من قاعدة بيانات المتجر. لا يتم اختراع الأسعار أو المخزون.</span></div><div className="messages">{messages.map((m,i)=><div className={`msg ${m.from}`} key={i}><div className="bubble">{m.text}</div><small>{m.time}{m.lang&&<span className="detected"> · {langLabel(m.lang)}</span>}</small></div>)}</div><div className="composer"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="اكتب بالعربي، English، أو Arabizi..."/><button onClick={send}><Send size={18}/></button></div></div><div className="sidePanel"><div className="card"><h3><Languages size={18}/> اكتشاف اللغة</h3><div className="detectedBox"><Globe2 size={24}/><div><small>لغة آخر رسالة</small><b>{langLabel(lastLang)}</b></div></div><p>الوكيل يكتشف لغة الزبون تلقائياً من النص، ويفهم العربية العراقية، Arabizi، English واللغات العالمية.</p></div>{pending&&<div className="card orderPrompt"><h3>إكمال الطلب</h3><div className="miniProduct"><span>{pending.image}</span><div><b>{pending.nameAr}</b><small>{money(pending.price)} + توصيل 5,000</small></div></div><button className="primary full" onClick={createOrder}>تأكيد الطلب · {money(pending.price+5000)}</button></div>}</div></div>}
function Products(){return <section><div className="sectionHead"><div><span className="eyebrow">كتالوج المتجر</span><h2>المنتجات <span className="count">{products.length}</span></h2></div><button className="primary">+ إضافة منتج</button></div><div className="productGrid">{products.map(p=><div className="product card" key={p.id}><div className="productImage">{p.image}<span className={p.stock?'inStock':'out'}>{p.stock?'متوفر':'نفد'}</span></div><div className="productInfo"><span>{p.category}</span><h3>{p.nameAr}</h3><b>{money(p.price)}</b><small>{p.stock} قطعة · {p.sizes.join('، ')}</small></div></div>)}</div></section>}
function Orders({orders}:{orders:Order[]}){return <section><div className="sectionHead"><div><span className="eyebrow">المبيعات</span><h2>الطلبات <span className="count">{orders.length+24}</span></h2></div></div><div className="card tableCard"><table><thead><tr><th>رقم الطلب</th><th>العميل</th><th>المنتج</th><th>المجموع</th><th>اللغة</th><th>الحالة</th></tr></thead><tbody>{orders.length?orders.map(o=><tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer}</td><td>{o.product}</td><td>{money(o.total)}</td><td>{langLabel(o.lang)}</td><td><span className="status">جديد</span></td></tr>):<tr><td colSpan={6} className="empty">لم تنشئ طلبات من Demo Chat بعد. جرّب المحادثة لتظهر هنا.</td></tr>}</tbody></table></div></section>}
function SettingsPage(){return <section><span className="eyebrow">إعدادات الوكيل</span><h2>تحكم بموظف المبيعات</h2><div className="settingsGrid"><div className="card setting"><div className="settingIcon"><Languages/></div><div><h3>التعرف التلقائي على اللغة</h3><p>يكتشف لغة كل رسالة ويرد بنفس اللغة، مع دعم Arabizi والعربية العراقية.</p></div><strong className="toggle on">ON</strong></div><div className="card setting"><div className="settingIcon"><ShieldCheck/></div><div><h3>سياسة عدم الاختلاق</h3><p>الأسعار، المخزون، التوصيل والطلبات تُقرأ من أدوات المتجر فقط.</p></div><strong className="toggle on">ON</strong></div></div></section>}

createRoot(document.getElementById('root')!).render(<App />)
