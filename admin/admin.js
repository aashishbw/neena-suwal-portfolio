(()=>{
'use strict';
const $=s=>document.querySelector(s),frame=$('#preview');
const url=(window.NEENA_SUPABASE_URL||'').replace(/\/$/,''),key=window.NEENA_SUPABASE_ANON_KEY||'';
const draftKey='neena-studio-draft';
let token='',expiresAt=0,draft={},baseline={},editor=null,ready=false,dirty=false,timer,loadingVersion=0,busy=false;
const colors={color_primary:['Primary color','#17243b'],color_accent:['Accent color','#bd8c78'],color_background:['Background','#fbf8f5'],color_text:['Text color','#273143']};
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=s=>$('#save-state').textContent=s;
function error(s){$('#workspace-error').textContent=s;$('#workspace-error').hidden=!s;}
function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify(draft));status(dirty?'Draft saved · not published':'Ready to edit');}catch{error('This browser could not save your draft. Download a backup from Settings.');}}
function changed(){window.dispatchEvent(new Event('neena:change'));dirty=true;status('Unpublished changes');clearTimeout(timer);timer=setTimeout(saveDraft,500);}
function headers(){return {apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'};}
function logout(message=''){token='';expiresAt=0;loadingVersion++;ready=false;clearTimeout(timer);if(dirty)saveDraft();frame.removeAttribute('src');frame.hidden=true;$('#workspace').hidden=true;$('#login-screen').hidden=false;$('#password').value='';$('#login-error').textContent=message;editor=null;}
function signedIn(){if(token&&Date.now()<expiresAt)return true;logout('Your session expired. Sign in again to continue.');return false;}
async function getPublished(){const r=await fetch(url+'/rest/v1/neena_site_content?id=eq.neena&select=content',{headers:headers()});if(!r.ok)throw Error('Could not load the published website. Please try signing in again.');const rows=await r.json();if(!Array.isArray(rows)||rows.length!==1)throw Error('The website content record is missing.');return rows[0].content||{};}
$('#login-form').addEventListener('submit',async event=>{
event.preventDefault();$('#login-error').textContent='';const button=$('#login-button');button.disabled=true;button.textContent='Signing in…';
try{if(!url||!key)throw Error('Website publishing has not been connected yet.');
const r=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:$('#email').value.trim(),password:$('#password').value})});const data=await r.json();
if(!r.ok)throw Error(data.error_description||data.msg||'Sign-in failed. Check your email and password.');
const check=await fetch(url+'/rest/v1/neena_admin_users?user_id=eq.'+encodeURIComponent(data.user.id)+'&select=user_id',{headers:{apikey:key,Authorization:'Bearer '+data.access_token}});const members=await check.json();
if(!check.ok||!Array.isArray(members)||members.length!==1)throw Error('This account does not have access to edit Neena’s website.');
token=data.access_token;expiresAt=Date.now()+(Number(data.expires_in)||3600)*1000;
const published=await getPublished();baseline={...published};let local={};try{local=JSON.parse(localStorage.getItem(draftKey)||'{}');if(!local||Array.isArray(local)||typeof local!=='object')local={};}catch{}
draft={...published,...local};dirty=Object.keys(local).some(k=>local[k]!==published[k]);$('#password').value='';$('#login-screen').hidden=true;$('#workspace').hidden=false;error('');status('Loading website…');frame.src=$('#page').value;window.dispatchEvent(new Event('neena:login'));
}catch(e){token='';expiresAt=0;$('#login-error').textContent=e.message||'Unable to sign in. Please try again.';}finally{button.disabled=false;button.textContent='Sign in to edit →';}
});
function valueFor(el,f){return f.type==='html'?el.innerHTML:el.innerText.trim().replace(/\s*↗\s*$/,'');}
async function initialize(){
const version=++loadingVersion;ready=false;frame.hidden=true;$('#loading').hidden=false;
try{if(!signedIn())return;const p=frame.contentWindow?.NEENA_EDITOR;if(!p)throw Error('The website editor could not load. Refresh and try again.');editor=p;
for(const [k,v] of Object.entries(p.initial)){if(baseline[k]===undefined)baseline[k]=v;if(draft[k]===undefined)draft[k]=v;}
p.apply(draft);
const doc=frame.contentDocument;
const style=doc.createElement('style');style.textContent='[data-neena-editable]{cursor:text!important;outline:1px dashed transparent;outline-offset:5px;transition:outline-color .15s}[data-neena-editable]:hover{outline-color:#b67d66}[data-neena-editable]:focus{outline:2px solid #b67d66!important;background:#b67d660c}html{scroll-behavior:smooth}';doc.head.append(style);
const mapped=new Map();
for(const [k,f] of Object.entries(p.fields)){if(f.type==='image'||f.type==='file'){for(const image of doc.querySelectorAll(f.selector)){if(f.type!=='image')continue;image.style.cursor='pointer';image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label','Replace '+f.label);const open=e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('neena:image',{detail:{key:k}}));};image.addEventListener('click',open);image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open(e);});}continue;}if($('#page').value==='/blog.html'?(k!=='blog_title'&&f.page!=='blog'):k==='blog_title')continue;const el=doc.querySelector(f.selector);if(!el)continue;el.dataset.neenaEditable=k;el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','true');el.setAttribute('aria-label','Edit '+f.label);mapped.set(el,{k,f});
el.addEventListener('input',()=>{draft[k]=valueFor(el,f);changed();});
el.addEventListener('blur',()=>{draft[k]=valueFor(el,f);p.apply({[k]:draft[k]});});
el.addEventListener('keydown',e=>{if(e.key==='Escape')el.blur();if(e.key==='Enter'&&f.type!=='html'){e.preventDefault();el.blur();}});
el.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData?.getData('text/plain')||'';const selection=doc.getSelection();if(!selection?.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const node=doc.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);draft[k]=valueFor(el,f);changed();});
}
doc.addEventListener('click',e=>{const edit=e.target.closest('[data-neena-editable]');if(edit){if(e.target.closest('a'))e.preventDefault();return;}const link=e.target.closest('a');if(!link)return;const href=link.getAttribute('href')||'';if(href.startsWith('#'))return;e.preventDefault();if(/(?:^|\/)blog\.html(?:$|#)/.test(href)){$('#page').value='/blog.html';navigate();}else if(/(?:^|\/)index\.html(?:$|#)/.test(href)){$('#page').value='/index.html';navigate();}},true);
if(version!==loadingVersion||!token)return;ready=true;frame.hidden=false;$('#loading').hidden=true;status(dirty?'Draft saved · not published':'Click text to edit');error('');renderSettings();window.dispatchEvent(new Event('neena:ready'));
}catch(e){error(e.message);$('#loading').textContent='Editor unavailable. Refresh to try again.';}
}
frame.addEventListener('load',()=>{if(token)initialize();});
function navigate(){if(!signedIn())return;saveDraft();ready=false;frame.hidden=true;$('#loading').hidden=false;$('#loading').textContent='Loading your website…';frame.src=$('#page').value;}
$('#page').addEventListener('change',navigate);
$('#desktop').onclick=()=>{frame.classList.remove('mobile');$('#desktop').setAttribute('aria-pressed','true');$('#mobile').setAttribute('aria-pressed','false');};
$('#mobile').onclick=()=>{frame.classList.add('mobile');$('#mobile').setAttribute('aria-pressed','true');$('#desktop').setAttribute('aria-pressed','false');};
function renderSettings(){const textFields={page_title:'Page title',meta_description:'Search description'};$('#settings-fields').innerHTML=Object.entries(colors).map(([k,[label,def]])=>'<div class="settings-field"><label for="'+k+'">'+label+'</label><input id="'+k+'" data-key="'+k+'" type="color" value="'+(/^#[0-9a-f]{6}$/i.test(draft[k])?draft[k]:def)+'"></div>').join('')+Object.entries(textFields).map(([k,label])=>'<div class="settings-field"><label for="'+k+'">'+label+'</label><textarea id="'+k+'" data-key="'+k+'">'+escapeHTML(draft[k]||'')+'</textarea></div>').join('');}
$('#settings').onclick=()=>{$('#settings-panel').hidden=!$('#settings-panel').hidden;};
$('#close-settings').onclick=()=>$('#settings-panel').hidden=true;
$('#settings-fields').addEventListener('input',e=>{if(!signedIn()||!e.target.dataset.key)return;draft[e.target.dataset.key]=e.target.value;editor?.apply(draft);changed();});
$('#reset').onclick=async()=>{if(!signedIn()||!confirm('Discard this device’s draft and reload the latest published website?'))return;try{const published=await getPublished();clearTimeout(timer);baseline={...published};draft={...published};dirty=false;try{localStorage.removeItem(draftKey);}catch{}navigate();}catch(e){error(e.message);}};
$('#publish').onclick=async()=>{if(busy||!signedIn())return;if(!ready){error('Wait for the website to finish loading.');return;}frame.contentDocument?.activeElement?.blur();busy=true;$('#publish').disabled=true;status('Publishing…');error('');
try{const r=await fetch(url+'/rest/v1/neena_site_content?id=eq.neena',{method:'PATCH',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify({content:{...draft,blog_posts:Array.isArray(draft.blog_posts)?draft.blog_posts.filter(p=>p.published):[]},updated_at:new Date().toISOString()})});const rows=await r.json();if(!r.ok||!Array.isArray(rows)||rows.length!==1)throw Error('Publishing failed. Your draft is saved; sign in again if your session has expired.');baseline={...draft};dirty=false;clearTimeout(timer);saveDraft();status('Published · website is up to date');}catch(e){saveDraft();error(e.message);}finally{busy=false;$('#publish').disabled=false;}
};
$('#export').onclick=()=>{const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}));link.download='neena-content-draft.json';link.click();URL.revokeObjectURL(link.href);};
$('#import-file').addEventListener('change',async e=>{if(!signedIn()||!editor||!e.target.files?.[0])return;try{const data=JSON.parse(await e.target.files[0].text());if(!data||Array.isArray(data)||typeof data!=='object')throw Error();const allowed=new Set([...Object.keys(editor.fields),...Object.keys(colors),'page_title','meta_description']);if(Array.isArray(data.blog_posts))draft.blog_posts=data.blog_posts.filter(p=>p&&typeof p.title==='string'&&typeof p.body==='string').map(p=>({id:String(p.id||Date.now()),title:p.title,summary:String(p.summary||''),body:p.body,published:!!p.published}));for(const [k,v] of Object.entries(data))if(allowed.has(k)&&typeof v==='string')draft[k]=v;editor.apply(draft);changed();renderSettings();}catch{error('Choose a valid Neena draft JSON backup.');}e.target.value='';});
$('#signout').onclick=()=>logout();

window.NEENA_ADMIN={
getDraft:()=>draft,getFields:()=>editor?.fields||{},isSignedIn:()=>!!token&&Date.now()<expiresAt,
update(k,v){if(!signedIn())return;draft[k]=v;editor?.apply({[k]:v});changed();},
navigate(page){$('#page').value=page;navigate();},
async upload(file,target){if(!signedIn())throw Error('Sign in to upload.');const pdf=target==='cv_link';if(pdf?file.type!=='application/pdf':!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error(pdf?'Choose a PDF for your CV.':'Choose a PNG, JPG, or WebP image.');if(file.size>10*1024*1024)throw Error('Maximum file size is 10 MB.');const name=Date.now()+'-'+crypto.randomUUID()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const response=await fetch(url+'/storage/v1/object/neena-media/'+name,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':file.type,'x-upsert':'false'},body:file});if(!response.ok){let message='Upload failed';try{const d=await response.json();message=d.message||d.error||message;}catch{}throw Error(message);}const asset=url+'/storage/v1/object/public/neena-media/'+encodeURIComponent(name);this.update(target,asset);return asset;}
};

window.addEventListener('beforeunload',()=>{if(dirty)saveDraft();});
})();


