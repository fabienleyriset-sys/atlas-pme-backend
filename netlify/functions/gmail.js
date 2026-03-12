Index · HTML
Copier

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Atlas PME</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:#080808;}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pu{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
.rh:hover{background:#141414!important;cursor:pointer}
.hv:hover{opacity:.8!important}
.ei:hover{background:#121212!important}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState } = React;
 
const MOCK_EMAILS = [
  { id: 1, from: "comptabilite@acier-pro.fr", sender: "Acier Pro SARL", subject: "Facture N°2024-0892 – Livraison matériaux", preview: "Veuillez trouver ci-joint notre facture...", date: "Aujourd'hui 09:14", type: "facture", amount: 4820.00, urgent: true, body: "Bonjour,\n\nVeuillez trouver ci-joint notre facture N°2024-0892 d'un montant de 4 820,00 € TTC pour la livraison de matériaux du 12 novembre 2024.\n\nÉchéance : 30 jours nets — soit le 12 décembre 2024.\nIBAN : FR76 3000 6000 0112 3456 7890 189\n\nCordialement,\nService Comptabilité — Acier Pro SARL" },
  { id: 2, from: "m.dupont@clientele-nord.com", sender: "Martin Dupont", subject: "Demande de devis urgente – Projet extension", preview: "Nous souhaitons obtenir un devis pour l'extension...", date: "Aujourd'hui 08:47", type: "commercial", urgent: true, body: "Bonjour,\n\nNous avons besoin d'un devis pour l'extension de nos locaux (environ 200m²) avant fin novembre. Budget indicatif : 150 000 €.\n\nPouvez-vous nous contacter rapidement ?\n\nMartin Dupont\nDirecteur — Clientèle Nord" },
  { id: 3, from: "noreply@urssaf.fr", sender: "URSSAF", subject: "Avis de paiement – Cotisations T4 2024", preview: "Votre avis de paiement est disponible...", date: "Hier 16:30", type: "document", amount: 12340.00, urgent: false, body: "Madame, Monsieur,\n\nVotre avis de paiement des cotisations sociales T4 2024 est disponible.\n\nMontant dû : 12 340,00 €\nÉchéance : 15 janvier 2025\nRéférence : URSSAF-2024-T4-00891\n\nPaiement par prélèvement automatique." },
  { id: 4, from: "contact@fournitures-bureau.fr", sender: "Office & Co", subject: "RE: Commande #8821 – Confirmation expédition", preview: "Votre commande a été expédiée ce jour...", date: "Hier 11:02", type: "commande", urgent: false, body: "Bonjour,\n\nVotre commande #8821 a été expédiée ce jour par Colissimo.\nNuméro de suivi : 6A12345678901\nLivraison prévue : vendredi 15 novembre.\n\nCordialement,\nService client — Office & Co" },
  { id: 5, from: "c.martin@fidelite-client.com", sender: "Claire Martin", subject: "Satisfaction travaux – Merci !", preview: "Je tenais à vous remercier pour la qualité...", date: "15/11", type: "client", urgent: false, body: "Bonjour,\n\nJe tenais à vous remercier pour l'excellente qualité des travaux réalisés dans nos bureaux la semaine dernière.\n\nNous ferons à nouveau appel à vos services.\n\nClaire Martin" },
];
 
const INIT_INVOICES = [
  { id: "FAC-2024-0892",  supplier: "Acier Pro SARL",    email: "comptabilite@acier-pro.fr",        amount: 4820.00,  tva: 803.33,  ht: 4016.67,  due: "12/12/2024", iban: "FR76 3000 6000 0112 3456 7890 189", mobile: "+33 6 12 34 56 78", status: "à_valider",    category: "Matériaux" },
  { id: "FAC-2024-0931",  supplier: "TransPort Express", email: "facturation@transport-express.fr", amount: 2150.00,  tva: 358.33,  ht: 1791.67,  due: "20/12/2024", iban: null,                                mobile: "+33 7 98 76 54 32", status: "rib_manquant", category: "Transport" },
  { id: "URSSAF-T4-2024", supplier: "URSSAF",            email: "noreply@urssaf.fr",                amount: 12340.00, tva: 0,       ht: 12340.00, due: "15/01/2025", iban: "FR76 1820 6000 2000 1234 5678 900", mobile: null,                status: "à_valider",    category: "Charges sociales" },
  { id: "PRESTA-2024-44", supplier: "Agence Web Nova",   email: "compta@agence-nova.fr",            amount: 980.00,   tva: 163.33,  ht: 816.67,   due: "30/11/2024", iban: null,                                mobile: null,                status: "rib_manquant", category: "Prestation" },
  { id: "EDF-PRO-1123",   supplier: "EDF Pro",           email: "pros@edf.fr",                      amount: 1240.50,  tva: 206.75,  ht: 1033.75,  due: "30/11/2024", iban: "FR76 3000 4000 0300 1234 5678 900", mobile: "+33 6 55 44 33 22", status: "planifié",     category: "Énergie" },
  { id: "SFR-B2B-0992",   supplier: "SFR Business",      email: "pro@sfr.fr",                       amount: 289.00,   tva: 48.17,   ht: 240.83,   due: "05/12/2024", iban: "FR76 3000 5000 0400 9876 5432 100", mobile: "+33 6 11 22 33 44", status: "planifié",     category: "Télécom" },
  { id: "LOYER-NOV-24",   supplier: "SCI Bâtiment Nord", email: "sci@batiment-nord.fr",             amount: 3800.00,  tva: 0,       ht: 3800.00,  due: "01/12/2024", iban: "FR76 2004 1000 0100 5678 9012 300", mobile: "+33 6 77 88 99 00", status: "payé",         category: "Immobilier" },
];
 
const TRANSACTIONS = [
  { id: 1, date: "14/11", label: "Virement client SARL Dubois",       type: "recette", amount:  18500.00, category: "Chantier",         tva: 3083.33, ok: true },
  { id: 2, date: "13/11", label: "Prélèvement EDF Pro Octobre",       type: "dépense", amount:  -1240.50, category: "Énergie",          tva: 206.75,  ok: true },
  { id: 3, date: "12/11", label: "Paiement fournisseur Acier Dupont", type: "dépense", amount:  -6200.00, category: "Matériaux",        tva: 1033.33, ok: false },
  { id: 4, date: "10/11", label: "Virement client Martin & Fils",     type: "recette", amount:   7400.00, category: "Prestation",       tva: 1233.33, ok: true },
  { id: 5, date: "08/11", label: "Salaires novembre 2024",            type: "dépense", amount: -22400.00, category: "Salaires",         tva: 0,       ok: true },
  { id: 6, date: "05/11", label: "Loyer local commercial",            type: "dépense", amount:  -3800.00, category: "Immobilier",       tva: 0,       ok: true },
  { id: 7, date: "04/11", label: "Virement client Bâtiment Sud",      type: "recette", amount:  12000.00, category: "Chantier",         tva: 2000.00, ok: true },
  { id: 8, date: "01/11", label: "Charges URSSAF T3",                 type: "dépense", amount: -11800.00, category: "Charges sociales", tva: 0,       ok: true },
];
 
const fmt = n => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);
const TYPE_CFG   = { facture:{l:"Facture",c:"#FF9F47"}, commercial:{l:"Commercial",c:"#47C8FF"}, document:{l:"Document",c:"#E847FF"}, commande:{l:"Commande",c:"#47FF8A"}, client:{l:"Client",c:"#7EFF47"} };
const STATUS_CFG = { à_valider:{l:"À valider",c:"#FF9F47",bg:"rgba(255,159,71,.10)"}, planifié:{l:"Planifié",c:"#47C8FF",bg:"rgba(71,200,255,.10)"}, payé:{l:"Payé",c:"#47FF8A",bg:"rgba(71,255,138,.10)"}, rib_manquant:{l:"⚠ RIB manquant",c:"#FF4747",bg:"rgba(255,71,71,.12)"}, rib_demandé:{l:"RIB demandé",c:"#E847FF",bg:"rgba(232,71,255,.10)"}, rib_reçu:{l:"RIB reçu ✓",c:"#47FF8A",bg:"rgba(71,255,138,.10)"} };
const GMAIL_PROXY = "https://atlas-pme.netlify.app/.netlify/functions/gmail";
 
async function fetchGmailEmails() {
  const res = await fetch(GMAIL_PROXY);
  if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.error || `Erreur ${res.status}`); }
  return res.json();
}
 
async function callAI(prompt, system) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:prompt}]})});
    const d = await r.json();
    return d.content?.map(b=>b.text||"").join("")||"";
  } catch { return "Erreur de connexion."; }
}
 
function Badge({s}) { const c=STATUS_CFG[s]||{l:s,c:"#888",bg:"#1a1a1a"}; return <span style={{padding:"2px 8px",borderRadius:"20px",fontSize:"0.63rem",fontWeight:600,color:c.c,background:c.bg}}>{c.l}</span>; }
function Pill({t}) { const c=TYPE_CFG[t]||{l:t,c:"#888"}; return <span style={{padding:"2px 7px",borderRadius:"4px",fontSize:"0.62rem",fontWeight:700,color:c.c,border:`1px solid ${c.c}33`}}>{c.l.toUpperCase()}</span>; }
function Kpi({label,value,sub,accent,up}) { return <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:"11px",padding:"15px 17px",flex:1,minWidth:0}}><div style={{fontSize:"0.6rem",color:"#555",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"7px"}}>{label}</div><div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.55rem",fontWeight:700,color:accent||"#fff",lineHeight:1,marginBottom:"3px"}}>{value}</div>{sub&&<div style={{fontSize:"0.67rem",color:up===true?"#47FF8A":up===false?"#FF6B47":"#555"}}>{sub}</div>}</div>; }
 
function App() {
  const [tab, setTab]             = useState("emails");
  const [gmailEmails, setGmailEmails] = useState([]);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError]   = useState("");
  const [gmailSynced, setGmailSynced] = useState(false);
  const [useGmail, setUseGmail]       = useState(false);
  const [company, setCompany]     = useState("Votre Entreprise");
  const [editCo, setEditCo]       = useState(false);
  const [coDraft, setCoDraft]     = useState("Votre Entreprise");
  const [invoices, setInvoices]   = useState(INIT_INVOICES);
  const [selEmail, setSelEmail]   = useState(null);
  const [selInv, setSelInv]       = useState(null);
  const [filterT, setFilterT]     = useState("all");
  const [eAnalysis, setEAnalysis] = useState({});
  const [eLoading, setELoading]   = useState({});
  const [actions, setActions]     = useState([
    {id:1,src:"Email",  label:"Répondre devis Martin Dupont — Projet extension", due:"Urgent",       done:false,c:"#FF9F47"},
    {id:2,src:"Facture",label:"Valider paiement Acier Pro — 4 820 €",            due:"12/12",         done:false,c:"#47C8FF"},
    {id:3,src:"Compta", label:"Rapprocher transaction Acier Dupont",              due:"Cette semaine", done:false,c:"#E847FF"},
    {id:4,src:"RIB",    label:"RIB manquant — TransPort Express (2 150 €)",       due:"Urgent",        done:false,c:"#FF4747"},
    {id:5,src:"RIB",    label:"RIB manquant — Agence Web Nova (980 €)",           due:"Urgent",        done:false,c:"#FF4747"},
  ]);
  const [aiPanel, setAiPanel]     = useState(false);
  const [aiTxt, setAiTxt]         = useState("");
  const [aiLoad, setAiLoad]       = useState(false);
  const [ribEMod, setRibEMod]     = useState(null);
  const [ribDraft, setRibDraft]   = useState("");
  const [ribLoad, setRibLoad]     = useState(false);
  const [ribPMod, setRibPMod]         = useState(null);
  const [ribStep, setRibStep]         = useState("upload");
  const [ribPhone, setRibPhone]       = useState(null);
  const [ribFile, setRibFile]         = useState(null);
  const [ribFilePreview, setRibFilePreview] = useState(null);
  const [otpGen, setOtpGen]           = useState("");
  const [otpVal, setOtpVal]           = useState("");
  const [otpErr, setOtpErr]           = useState(false);
  const [ribSaved, setRibSaved]       = useState({});
 
  const openPortal = (inv) => {
    setRibPMod(inv); setRibFile(null); setRibFilePreview(null);
    setOtpVal(""); setOtpErr(false);
    setOtpGen(Math.floor(100000 + Math.random() * 900000).toString());
    setRibPhone(inv.mobile || null); setRibStep("upload");
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0]; if (!f) return; setRibFile(f);
    if (f.type.startsWith("image/")) { const reader = new FileReader(); reader.onload = ev => setRibFilePreview(ev.target.result); reader.readAsDataURL(f); }
    else setRibFilePreview(null);
  };
  const submitUpload = () => { if (!ribFile) return; setRibStep("otp"); };
  const submitOtp = (id) => {
    if (otpVal !== otpGen) { setOtpErr(true); return; }
    setRibSaved(p => ({ ...p, [id]: { file: ribFile?.name, phone: ribPhone } }));
    upd(id, "rib_reçu"); setRibStep("success");
    setTimeout(() => setRibPMod(null), 3500);
  };
  const upd = (id,status) => setInvoices(p=>p.map(i=>i.id===id?{...i,status}:i));
  const totalPay = invoices.filter(i=>i.status!=="payé").reduce((s,i)=>s+i.amount,0);
  const rec  = TRANSACTIONS.filter(t=>t.type==="recette").reduce((s,t)=>s+t.amount,0);
  const dep  = Math.abs(TRANSACTIONS.filter(t=>t.type==="dépense").reduce((s,t)=>s+t.amount,0));
  const tvac = TRANSACTIONS.filter(t=>t.type==="recette").reduce((s,t)=>s+t.tva,0);
  const tvad = TRANSACTIONS.filter(t=>t.type==="dépense").reduce((s,t)=>s+(t.tva||0),0);
 
  const TABS = [
    {id:"emails",    icon:"✉", label:"Emails",      cnt:MOCK_EMAILS.filter(e=>e.urgent).length},
    {id:"factures",  icon:"⊞", label:"Factures",    cnt:invoices.filter(i=>["à_valider","rib_manquant"].includes(i.status)).length},
    {id:"paiements", icon:"◈", label:"Paiements"},
    {id:"compta",    icon:"≡", label:"Comptabilité"},
  ];
 
  const syncGmail = async () => {
    setGmailLoading(true); setGmailError("");
    try {
      const emails = await fetchGmailEmails();
      setGmailEmails(emails); setGmailSynced(true); setUseGmail(true);
    } catch(e) { setGmailError(e.message || "Erreur de connexion Gmail"); }
    setGmailLoading(false);
  };
 
  const emails = (useGmail ? gmailEmails : MOCK_EMAILS).filter(e => filterT === "all" || e.type === filterT);
 
  const analyzeEmail = async (email) => {
    if (eAnalysis[email.id]) return;
    setELoading(p=>({...p,[email.id]:true}));
 
    // ── Étape 1 : extraction Regex sur le corps de l'email ──
    const body = email.body || "";
    const clean = body.replace(/\s+/g, " ");
 
    const regexExtract = () => {
      const amountPatterns = [
        /total\s+ttc[^\d]*?([\d\s]+[.,]\d{2})\s*€?/i,
        /montant\s+ttc[^\d]*?([\d\s]+[.,]\d{2})\s*€?/i,
        /net\s+[àa]\s+payer[^\d]*?([\d\s]+[.,]\d{2})\s*€?/i,
        /total[^\d]*?([\d\s]{1,10}[.,]\d{2})\s*€/i,
        /([\d\s]{1,10}[.,]\d{2})\s*€?\s*ttc/i,
        /montant[^\d]*?([\d\s]+[.,]\d{2})\s*€/i,
        /d['']un montant de[^\d]*?([\d\s]+[.,]\d{2})\s*€?/i,
      ];
      let amount = null;
      for (const re of amountPatterns) {
        const m = clean.match(re);
        if (m) { amount = m[1].replace(/\s/g,"").replace(",","."); break; }
      }
 
      const ibanMatch = clean.match(/[A-Z]{2}\d{2}[\s\d]{10,32}/);
      const iban = ibanMatch ? ibanMatch[0].replace(/\s/g,"") : null;
 
      const duePatterns = [
        /[eé]ch[eé]ance[^\d]*([\d]{1,2}[\/\-.][\d]{1,2}[\/\-.]\d{2,4})/i,
        /soit le ([\d]{1,2}[\/\-.]?[\d]{1,2}[\/\-.]\d{2,4})/i,
        /avant le ([\d]{1,2}[\/\-.][\d]{1,2}[\/\-.]\d{2,4})/i,
        /payable le ([\d]{1,2}[\/\-.][\d]{1,2}[\/\-.]\d{2,4})/i,
        /30 jours[^\d]*([\d]{1,2}[\/\-.][\d]{1,2}[\/\-.]\d{2,4})/i,
      ];
      let dueDate = null;
      for (const re of duePatterns) {
        const m = clean.match(re);
        if (m) { dueDate = m[1]; break; }
      }
 
      const invPatterns = [
        /facture\s+n[°o]?\s*:?\s*([\w\-\/]+)/i,
        /invoice\s+n[°o]?\s*:?\s*([\w\-\/]+)/i,
        /r[eé]f[eé]rence\s*:?\s*([\w\-\/]{4,20})/i,
      ];
      let invoiceNumber = null;
      for (const re of invPatterns) {
        const m = clean.match(re);
        if (m) { invoiceNumber = m[1]; break; }
      }
 
      return { amount, iban, dueDate, invoiceNumber };
    };
 
    // ── Étape 2 : check si les pièces jointes ont déjà des données (depuis backend) ──
    const attachmentData = email.attachments?.[0]?.invoiceData || null;
 
    // Merge : on priorise les données des pièces jointes
    const regex = regexExtract();
    const extracted = {
      amount:        attachmentData?.amount        || (regex.amount ? parseFloat(regex.amount) : null),
      iban:          attachmentData?.iban          || regex.iban,
      dueDate:       attachmentData?.dueDate       || regex.dueDate,
      invoiceNumber: attachmentData?.invoiceNumber || regex.invoiceNumber,
      amountHT:      attachmentData?.amountHT      || null,
      tva:           attachmentData?.tva           || null,
    };
 
    const hasRegexData = extracted.amount || extracted.iban || extracted.dueDate || extracted.invoiceNumber;
 
    // ── Étape 3 : fallback IA si regex n'a rien trouvé ──
    let aiText = "";
    if (!hasRegexData) {
      aiText = await callAI(
        `Analyse cet email professionnel reçu par une PME.\n\nDe : ${email.from}\nSujet : ${email.subject}\nCorps :\n${email.body}\n\nFournis une analyse structurée :\n1. RÉSUMÉ (2 lignes)\n2. TYPE (facture / commande / devis / document / commercial / client)\n3. MONTANT (si mentionné)\n4. ÉCHÉANCE (si mentionnée)\n5. IBAN (si présent)\n6. ACTIONS REQUISES (liste courte)\n7. PRIORITÉ (🔴 Urgent / 🟡 Normal / 🟢 Faible)\n8. TON (neutre / positif / relance / réclamation)`,
        "Tu es un assistant financier PME expert. Réponds en français, de façon structurée et concise. Sois direct et actionnable."
      );
    }
 
    // ── Résultat final ──
    setEAnalysis(p=>({
      ...p,
      [email.id]: {
        hasRegexData,
        extracted,
        aiText,
        source: hasRegexData ? "regex" : "ia",
      }
    }));
    setELoading(p=>({...p,[email.id]:false}));
  };
 
  const runAI = async (type) => {
    setAiLoad(true); setAiPanel(true); setAiTxt("");
    const sys="Tu es un conseiller financier expert PME. Réponds en français, structuré et actionnable.";
    let p="";
    if(type==="treso") p=`Trésorerie PME:\n- Recettes: ${fmt(rec)}\n- Dépenses: ${fmt(dep)}\n- Résultat: ${fmt(rec-dep)}\n- À payer: ${fmt(totalPay)}\n\n1) Situation, 2) Risques, 3) Recommandations`;
    else if(type==="tva") p=`TVA:\n- Collectée: ${fmt(tvac)}\n- Déductible: ${fmt(tvad)}\n- À déclarer: ${fmt(tvac-tvad)}\n\nRésumé et étapes.`;
    else p=`Rapport novembre 2024 pour expert-comptable:\n- Recettes: ${fmt(rec)}\n- Dépenses: ${fmt(dep)}\n- Factures en attente: ${fmt(totalPay)}\n- TVA collectée/déduite: ${fmt(tvac)}/${fmt(tvad)}\n\nFormate professionnellement.`;
    const r=await callAI(p,sys); setAiTxt(r); setAiLoad(false);
  };
 
  const openRibEmail = async (inv) => {
    setRibEMod(inv); setRibDraft(""); setRibLoad(true);
    const token=Math.random().toString(36).substring(2,14).toUpperCase();
    const link=`https://portail.atlas-pme.fr/rib/${token}`;
    const r=await callAI(
      `Rédige un email professionnel demandant le RIB à ce fournisseur:\n- Fournisseur: ${inv.supplier}\n- Facture: ${inv.id} — ${fmt(inv.amount)} — échéance ${inv.due}\n- Signataire: ${company}\n- Lien portail sécurisé: ${link}\n\nL'email doit:\n• Être courtois et rassurant\n• Expliquer que le paiement est en attente faute d'IBAN\n• Inviter à déposer le RIB via ce portail sécurisé\n• Préciser qu'un code de confirmation sera envoyé par SMS ET par email\n• Être signé au nom de: ${company}\n\nFormat:\nObjet: ...\n\n[corps complet]`,
      "Tu es un assistant de gestion PME. Rédige uniquement l'email, sans commentaire."
    );
    setRibDraft(r); setRibLoad(false);
  };
 
  const sendRibEmail = (inv) => {
    upd(inv.id,"rib_demandé");
    setActions(p=>p.map(a=>a.src==="RIB"&&a.label.includes(inv.supplier)?{...a,done:true}:a));
    setRibEMod(null);
  };
 
  const S = {
    input: (extra={}) => ({width:"100%",padding:"8px 11px",background:"#111",border:"1px solid #1e1e1e",borderRadius:"6px",color:"#D0C8BD",fontSize:"0.76rem",fontFamily:"inherit",outline:"none",...extra}),
    btn: (active, extra={}) => ({padding:"8px 14px",background:active?"#C8FF47":"#1a1a1a",border:active?"none":"1px solid #222",borderRadius:"6px",color:active?"#080808":"#444",fontSize:"0.74rem",fontWeight:active?700:400,cursor:active?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .15s",...extra}),
  };
 
  return (
    <div style={{display:"flex",height:"100vh",background:"#080808",color:"#D8D0C5",fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
 
      {/* NAV */}
      <div style={{width:"54px",background:"#080808",borderRight:"1px solid #141414",display:"flex",flexDirection:"column",alignItems:"center",padding:"13px 0",gap:"4px",flexShrink:0,zIndex:10}}>
        <div style={{width:"31px",height:"31px",background:"#C8FF47",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#080808",fontSize:"0.88rem",marginBottom:"13px"}}>A</div>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} title={t.label} style={{width:"37px",height:"37px",background:tab===t.id?"#1A1A1A":"transparent",border:tab===t.id?"1px solid #252525":"1px solid transparent",borderRadius:"8px",color:tab===t.id?"#C8FF47":"#555",fontSize:"0.9rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"all .15s",marginBottom:"2px"}}>
            {t.icon}{t.cnt>0&&<span style={{position:"absolute",top:"3px",right:"3px",width:"12px",height:"12px",background:"#FF4747",borderRadius:"50%",fontSize:"0.48rem",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700}}>{t.cnt}</span>}
          </button>
        ))}
        <div style={{flex:1}}/>
        <div style={{position:"relative"}}>
          <button onClick={()=>setTab("actions")} title="Actions" style={{width:"37px",height:"37px",background:tab==="actions"?"#1A1A1A":"transparent",border:tab==="actions"?"1px solid #252525":"1px solid transparent",borderRadius:"8px",color:tab==="actions"?"#FF9F47":"#555",fontSize:"0.9rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>◉</button>
          {actions.filter(a=>!a.done).length>0&&<span style={{position:"absolute",top:"3px",right:"3px",width:"12px",height:"12px",background:"#FF9F47",borderRadius:"50%",fontSize:"0.48rem",display:"flex",alignItems:"center",justifyContent:"center",color:"#080808",fontWeight:700}}>{actions.filter(a=>!a.done).length}</span>}
        </div>
      </div>
 
      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
 
        {/* TOP BAR */}
        <div style={{height:"50px",borderBottom:"1px solid #141414",display:"flex",alignItems:"center",padding:"0 18px",gap:"14px",flexShrink:0}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.85rem",color:"#fff",letterSpacing:".05em"}}>
            {tab==="emails"&&"✉ Analyse des Emails"}{tab==="factures"&&"⊞ Gestion des Factures"}{tab==="paiements"&&"◈ Paiements"}{tab==="compta"&&"≡ Comptabilité"}{tab==="actions"&&"◉ Actions"}
          </div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",gap:"14px",alignItems:"center"}}>
            <div>
              <div style={{fontSize:"0.52rem",color:"#383838",letterSpacing:".1em",marginBottom:"1px"}}>ENTREPRISE</div>
              {editCo
                ? <div style={{display:"flex",gap:"4px"}}>
                    <input value={coDraft} onChange={e=>setCoDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setCompany(coDraft);setEditCo(false);}}} style={{...S.input({width:"120px",fontSize:"0.7rem",padding:"1px 6px"})}} autoFocus/>
                    <button onClick={()=>{setCompany(coDraft);setEditCo(false);}} style={{background:"#C8FF47",border:"none",borderRadius:"3px",color:"#080808",fontSize:"0.55rem",padding:"2px 5px",cursor:"pointer",fontWeight:700}}>✓</button>
                  </div>
                : <div onClick={()=>{setCoDraft(company);setEditCo(true);}} style={{cursor:"pointer",display:"flex",gap:"4px",alignItems:"center"}}>
                    <span style={{fontSize:"0.76rem",fontWeight:600,color:"#C8FF47"}}>{company}</span>
                    <span style={{fontSize:"0.52rem",color:"#383838"}}>✎</span>
                  </div>
              }
            </div>
            <div style={{width:"1px",height:"20px",background:"#1a1a1a"}}/>
            <div style={{textAlign:"right"}}><div style={{fontSize:"0.52rem",color:"#383838",letterSpacing:".1em"}}>À PAYER</div><div style={{fontSize:"0.76rem",fontWeight:600,color:"#FF9F47"}}>{fmt(totalPay)}</div></div>
            <div style={{width:"1px",height:"20px",background:"#1a1a1a"}}/>
            <div style={{textAlign:"right"}}><div style={{fontSize:"0.52rem",color:"#383838",letterSpacing:".1em"}}>RÉSULTAT</div><div style={{fontSize:"0.76rem",fontWeight:600,color:rec-dep>=0?"#47FF8A":"#FF4747"}}>{fmt(rec-dep)}</div></div>
            <div style={{width:"1px",height:"20px",background:"#1a1a1a"}}/>
            <div style={{display:"flex",gap:"5px",alignItems:"center",padding:"4px 9px",background:"#111",borderRadius:"5px",border:"1px solid #1a1a1a"}}>
              <div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#47FF8A",animation:"pu 2s infinite"}}/>
              <span style={{fontSize:"0.6rem",color:"#555"}}>Atlas PME IA</span>
            </div>
          </div>
        </div>
 
        {/* CONTENT */}
        <div style={{flex:1,overflow:"hidden",display:"flex"}}>
 
          {/* EMAILS */}
          {tab==="emails"&&(
            <>
              <div style={{width:selEmail?"355px":"100%",borderRight:selEmail?"1px solid #141414":"none",display:"flex",flexDirection:"column",transition:"width .3s",flexShrink:0}}>
                <div style={{padding:"9px 13px",borderBottom:"1px solid #141414",display:"flex",gap:"5px",flexWrap:"wrap",flexShrink:0,alignItems:"center"}}>
                  {["all","facture","commercial","document"].map(f=>(
                    <button key={f} onClick={()=>setFilterT(f)} style={{padding:"3px 9px",borderRadius:"5px",background:filterT===f?"#1E1E1E":"transparent",border:`1px solid ${filterT===f?"#2A2A2A":"transparent"}`,color:filterT===f?"#fff":"#555",fontSize:"0.67rem",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                      {f==="all"?"Tous":TYPE_CFG[f]?.l}
                    </button>
                  ))}
                  <div style={{flex:1}}/>
                  <button onClick={syncGmail} disabled={gmailLoading}
                    style={{display:"flex",alignItems:"center",gap:"5px",padding:"3px 10px",background:gmailSynced?"rgba(71,255,138,.08)":"rgba(200,255,71,.08)",border:`1px solid ${gmailSynced?"#47FF8A30":"#C8FF4730"}`,borderRadius:"5px",color:gmailSynced?"#47FF8A":"#C8FF47",fontSize:"0.65rem",cursor:gmailLoading?"not-allowed":"pointer",fontFamily:"inherit",opacity:gmailLoading?.6:1}}>
                    {gmailLoading
                      ?<><span style={{width:"8px",height:"8px",borderRadius:"50%",border:"1.5px solid #C8FF47",borderTopColor:"transparent",display:"inline-block",animation:"spin .7s linear infinite"}}/>Sync...</>
                      :gmailSynced?<>✓ Gmail ({gmailEmails.length})</>:<>⟳ Connecter Gmail</>}
                  </button>
                  {useGmail&&<button onClick={()=>setUseGmail(false)} style={{padding:"3px 8px",background:"transparent",border:"1px solid #252525",borderRadius:"5px",color:"#555",fontSize:"0.6rem",cursor:"pointer",fontFamily:"inherit"}}>Démo</button>}
                </div>
                {gmailError&&<div style={{padding:"7px 13px",background:"rgba(255,71,71,.07)",borderBottom:"1px solid #FF474720",fontSize:"0.64rem",color:"#FF8080"}}>⚠ {gmailError}</div>}
                <div style={{flex:1,overflowY:"auto"}}>
                  {emails.map((em,i)=>(
                    <div key={em.id} className="ei" onClick={()=>{setSelEmail(em);analyzeEmail(em);}} style={{padding:"12px 13px",borderBottom:"1px solid #0f0f0f",background:selEmail?.id===em.id?"#141414":"transparent",cursor:"pointer",animation:`fi .2s ease ${i*.05}s both`,transition:"background .1s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                          {em.urgent&&<div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#FF4747",flexShrink:0}}/>}
                          <span style={{fontSize:"0.78rem",fontWeight:em.urgent?600:400,color:"#D0C8BD"}}>{em.sender}</span>
                        </div>
                        <span style={{fontSize:"0.6rem",color:"#444"}}>{em.date}</span>
                      </div>
                      <div style={{fontSize:"0.73rem",color:"#777",marginBottom:"5px"}}>{em.subject}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><Pill t={em.type}/>{em.amount&&<span style={{fontSize:"0.68rem",color:"#FF9F47",fontWeight:600}}>{fmt(em.amount)}</span>}</div>
                    </div>
                  ))}
                </div>
              </div>
              {selEmail&&(
                <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",animation:"fi .2s ease"}}>
                  <div style={{padding:"13px 17px",borderBottom:"1px solid #141414",display:"flex",justifyContent:"space-between"}}>
                    <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.86rem",color:"#fff",marginBottom:"3px"}}>{selEmail.subject}</div><div style={{fontSize:"0.65rem",color:"#555"}}>De : {selEmail.from}</div></div>
                    <button onClick={()=>setSelEmail(null)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer"}}>✕</button>
                  </div>
                  <div style={{flex:1,display:"flex",overflow:"hidden"}}>
                    <div style={{flex:1,padding:"17px",overflowY:"auto",borderRight:"1px solid #141414"}}><pre style={{fontSize:"0.78rem",lineHeight:1.75,color:"#A0988D",whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{selEmail.body}</pre></div>
                    <div style={{width:"270px",padding:"13px",overflowY:"auto",background:"#0C0C0C"}}>
                      <div style={{fontSize:"0.6rem",color:"#555",letterSpacing:".1em",marginBottom:"9px"}}>ANALYSE IA</div>
                      {eLoading[selEmail.id]
                        ? <div style={{display:"flex",gap:"4px",padding:"8px 0",alignItems:"center"}}>
                            {[0,1,2].map(d=><div key={d} style={{width:"5px",height:"5px",borderRadius:"50%",background:"#C8FF47",animation:`pu 1s ${d*.2}s infinite`}}/>)}
                            <span style={{fontSize:"0.62rem",color:"#555",marginLeft:"6px"}}>Analyse…</span>
                          </div>
                        : eAnalysis[selEmail.id]
                          ? (() => {
                              const a = eAnalysis[selEmail.id];
                              return (
                                <div style={{animation:"fi .2s ease"}}>
                                  {/* Badge source */}
                                  <div style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"2px 7px",borderRadius:"20px",background:a.source==="regex"?"rgba(71,255,138,.08)":"rgba(200,255,71,.08)",border:`1px solid ${a.source==="regex"?"#47FF8A30":"#C8FF4730"}`,marginBottom:"10px"}}>
                                    <div style={{width:"4px",height:"4px",borderRadius:"50%",background:a.source==="regex"?"#47FF8A":"#C8FF47"}}/>
                                    <span style={{fontSize:"0.55rem",color:a.source==="regex"?"#47FF8A":"#C8FF47",fontWeight:600}}>{a.source==="regex"?"Extraction directe":"Analyse IA"}</span>
                                  </div>
 
                                  {/* Données structurées si regex */}
                                  {a.hasRegexData && (
                                    <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"10px"}}>
                                      {a.extracted.invoiceNumber && (
                                        <div style={{background:"#111",borderRadius:"5px",padding:"7px 9px"}}>
                                          <div style={{fontSize:"0.52rem",color:"#555",marginBottom:"2px"}}>N° FACTURE</div>
                                          <div style={{fontSize:"0.72rem",color:"#C8FF47",fontFamily:"monospace",fontWeight:600}}>{a.extracted.invoiceNumber}</div>
                                        </div>
                                      )}
                                      {a.extracted.amount && (
                                        <div style={{background:"#111",borderRadius:"5px",padding:"7px 9px"}}>
                                          <div style={{fontSize:"0.52rem",color:"#555",marginBottom:"2px"}}>MONTANT TTC</div>
                                          <div style={{fontSize:"0.85rem",color:"#FF9F47",fontWeight:700}}>{fmt(a.extracted.amount)}</div>
                                          {a.extracted.amountHT&&<div style={{fontSize:"0.6rem",color:"#555",marginTop:"2px"}}>HT : {fmt(a.extracted.amountHT)} · TVA : {fmt(a.extracted.tva)}</div>}
                                        </div>
                                      )}
                                      {a.extracted.dueDate && (
                                        <div style={{background:"#111",borderRadius:"5px",padding:"7px 9px"}}>
                                          <div style={{fontSize:"0.52rem",color:"#555",marginBottom:"2px"}}>ÉCHÉANCE</div>
                                          <div style={{fontSize:"0.72rem",color:"#47C8FF",fontWeight:600}}>{a.extracted.dueDate}</div>
                                        </div>
                                      )}
                                      {a.extracted.iban && (
                                        <div style={{background:"#111",borderRadius:"5px",padding:"7px 9px"}}>
                                          <div style={{fontSize:"0.52rem",color:"#555",marginBottom:"2px"}}>IBAN</div>
                                          <div style={{fontSize:"0.63rem",color:"#888",fontFamily:"monospace"}}>{a.extracted.iban}</div>
                                        </div>
                                      )}
                                    </div>
                                  )}
 
                                  {/* Texte IA si fallback */}
                                  {a.aiText && (
                                    <div style={{fontSize:"0.72rem",lineHeight:1.75,color:"#888",whiteSpace:"pre-wrap",marginBottom:"10px"}}>{a.aiText}</div>
                                  )}
 
                                  <button className="hv" onClick={()=>setActions(p=>[...p,{id:Date.now(),src:"Email",label:`Traiter: ${selEmail.subject.slice(0,38)}`,due:"À faire",done:false,c:"#47C8FF"}])} style={{width:"100%",padding:"6px",background:"#1A1A1A",border:"1px solid #252525",borderRadius:"5px",color:"#C8FF47",fontSize:"0.68rem",cursor:"pointer",fontFamily:"inherit"}}>+ Créer une action</button>
                                </div>
                              );
                            })()
                          : <div style={{fontSize:"0.7rem",color:"#444"}}>Analyse en cours à l'ouverture…</div>
                      }
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
 
          {/* FACTURES */}
          {tab==="factures"&&(
            <div style={{flex:1,overflowY:"auto",padding:"13px"}}>
              <div style={{display:"flex",gap:"9px",marginBottom:"13px"}}>
                <Kpi label="Total reçu" value={fmt(invoices.reduce((s,i)=>s+i.amount,0))} sub={`${invoices.length} factures`}/>
                <Kpi label="RIB manquants" value={invoices.filter(i=>i.status==="rib_manquant").length} sub="Paiement bloqué" accent="#FF4747"/>
                <Kpi label="À valider" value={invoices.filter(i=>i.status==="à_valider").length} sub="En attente" accent="#FF9F47"/>
                <Kpi label="Payé ce mois" value={fmt(invoices.filter(i=>i.status==="payé").reduce((s,i)=>s+i.amount,0))} accent="#47FF8A"/>
              </div>
              <div style={{background:"#0C0C0C",border:"1px solid #161616",borderRadius:"10px",overflow:"hidden",marginBottom:"11px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr .8fr .8fr .9fr .7fr .7fr",padding:"8px 13px",borderBottom:"1px solid #161616",fontSize:"0.56rem",color:"#444",letterSpacing:".08em",textTransform:"uppercase"}}>
                  <span>Référence</span><span>Fournisseur</span><span>TTC</span><span>HT</span><span>Échéance</span><span>Catégorie</span><span>Statut</span>
                </div>
                {invoices.map((inv,i)=>(
                  <div key={inv.id} className="rh" onClick={()=>setSelInv(selInv?.id===inv.id?null:inv)} style={{display:"grid",gridTemplateColumns:"1fr 1.1fr .8fr .8fr .9fr .7fr .7fr",padding:"10px 13px",borderBottom:i<invoices.length-1?"1px solid #0f0f0f":"none",fontSize:"0.74rem",background:selInv?.id===inv.id?"#141414":"transparent",transition:"background .1s",animation:`fi .2s ease ${i*.04}s both`,alignItems:"center"}}>
                    <span style={{color:"#C8FF47",fontFamily:"'Syne',sans-serif",fontSize:"0.68rem",fontWeight:600}}>{inv.id}</span>
                    <span style={{color:"#D0C8BD"}}>{inv.supplier}</span>
                    <span style={{color:"#fff",fontWeight:600}}>{fmt(inv.amount)}</span>
                    <span style={{color:"#777"}}>{fmt(inv.ht)}</span>
                    <span style={{color:"#777"}}>{inv.due}</span>
                    <span style={{color:"#666",fontSize:"0.66rem"}}>{inv.category}</span>
                    <Badge s={inv.status}/>
                  </div>
                ))}
              </div>
              {selInv&&(()=>{
                const inv=selInv; const st=inv.status; const saved=ribSaved[inv.id];
                return (
                  <div style={{background:"#0C0C0C",border:`1px solid ${st==="rib_manquant"?"#FF474730":"#1E1E1E"}`,borderRadius:"10px",padding:"15px",animation:"fi .2s ease"}}>
                    {st==="rib_manquant"&&(
                      <div style={{background:"rgba(255,71,71,.07)",border:"1px solid #FF474728",borderRadius:"8px",padding:"11px 13px",marginBottom:"13px",display:"flex",alignItems:"center",gap:"11px"}}>
                        <span style={{fontSize:"1rem"}}>⚠</span>
                        <div style={{flex:1}}><div style={{fontSize:"0.74rem",color:"#FF8080",fontWeight:600,marginBottom:"2px"}}>RIB / IBAN manquant</div><div style={{fontSize:"0.65rem",color:"#FF474780"}}>Le paiement est bloqué. Envoyez une demande sécurisée au fournisseur.</div></div>
                        <button className="hv" onClick={()=>openRibEmail(inv)} style={{padding:"7px 12px",background:"#FF4747",border:"none",borderRadius:"6px",color:"#fff",fontSize:"0.68rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"opacity .15s"}}>✉ Demander le RIB</button>
                      </div>
                    )}
                    {st==="rib_demandé"&&(
                      <div style={{background:"rgba(232,71,255,.05)",border:"1px solid #E847FF22",borderRadius:"8px",padding:"10px 13px",marginBottom:"13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:"0.71rem",color:"#E847FF",fontWeight:600,marginBottom:"2px"}}>Email envoyé — En attente du fournisseur</div><div style={{fontSize:"0.62rem",color:"#E847FF44"}}>Lien sécurisé transmis à {inv.email}</div></div>
                        <button className="hv" onClick={()=>openPortal(inv)} style={{padding:"5px 10px",background:"transparent",border:"1px solid #E847FF40",borderRadius:"5px",color:"#E847FF",fontSize:"0.64rem",cursor:"pointer",fontFamily:"inherit",transition:"opacity .15s"}}>Simuler réception</button>
                      </div>
                    )}
                    {st==="rib_reçu"&&saved&&(
                      <div style={{background:"rgba(71,255,138,.04)",border:"1px solid #47FF8A20",borderRadius:"8px",padding:"11px 13px",marginBottom:"13px"}}>
                        <div style={{fontSize:"0.68rem",color:"#47FF8A",fontWeight:600,marginBottom:"7px"}}>✓ RIB reçu · Identité vérifiée</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
                          {[["Fichier",saved.file,false],["Canal",saved.phone?"SMS ("+saved.phone+")":"Email",false]].map(([l,v])=>(
                            <div key={l} style={{background:"#0A0A0A",borderRadius:"5px",padding:"6px 9px"}}>
                              <div style={{fontSize:"0.55rem",color:"#555",marginBottom:"2px"}}>{l}</div>
                              <div style={{fontSize:"0.7rem",color:"#C8C0B5"}}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"13px"}}>
                      <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",marginBottom:"2px"}}>{inv.supplier}</div><div style={{fontSize:"0.65rem",color:"#555"}}>{inv.id}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.25rem",fontWeight:700,color:"#fff"}}>{fmt(inv.amount)}</div><div style={{fontSize:"0.6rem",color:"#555"}}>Échéance : {inv.due}</div></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px",marginBottom:"13px"}}>
                      {[["HT",fmt(inv.ht)],["TVA",fmt(inv.tva)],["IBAN",(inv.iban||saved?.iban)?"✓ Disponible":"✗ Manquant"]].map(([l,v])=>(
                        <div key={l} style={{background:"#111",borderRadius:"5px",padding:"8px 10px"}}><div style={{fontSize:"0.56rem",color:"#555",marginBottom:"3px"}}>{l}</div><div style={{fontSize:"0.77rem",color:l==="IBAN"?((inv.iban||saved?.iban)?"#47FF8A":"#FF4747"):"#D0C8BD",fontWeight:500}}>{v}</div></div>
                      ))}
                    </div>
                    {(inv.iban||saved?.iban)&&<div style={{background:"#111",borderRadius:"5px",padding:"7px 10px",marginBottom:"13px"}}><div style={{fontSize:"0.56rem",color:"#555",marginBottom:"2px"}}>IBAN</div><div style={{fontSize:"0.73rem",color:"#888",fontFamily:"monospace"}}>{inv.iban||saved?.iban}</div></div>}
                    <div style={{display:"flex",gap:"6px"}}>
                      {(st==="à_valider"||st==="rib_reçu")&&<button className="hv" onClick={()=>upd(inv.id,"planifié")} style={{padding:"7px 13px",background:"#C8FF47",border:"none",borderRadius:"6px",color:"#080808",fontSize:"0.73rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"opacity .15s"}}>✓ Valider le paiement</button>}
                      <button className="hv" onClick={()=>setActions(p=>[...p,{id:Date.now(),src:"Facture",label:`Vérifier: ${inv.id} — ${inv.supplier}`,due:inv.due,done:false,c:"#FF9F47"}])} style={{padding:"7px 13px",background:"transparent",border:"1px solid #252525",borderRadius:"6px",color:"#888",fontSize:"0.73rem",cursor:"pointer",fontFamily:"inherit",transition:"opacity .15s"}}>+ Créer une tâche</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
 
          {/* PAIEMENTS */}
          {tab==="paiements"&&(
            <div style={{flex:1,overflowY:"auto",padding:"13px"}}>
              <div style={{display:"flex",gap:"9px",marginBottom:"15px"}}>
                <Kpi label="Total à payer" value={fmt(totalPay)} accent="#FF9F47"/>
                <Kpi label="RIB bloqués" value={invoices.filter(i=>["rib_manquant","rib_demandé"].includes(i.status)).length} sub="En attente RIB" accent="#FF4747"/>
                <Kpi label="Prêts au virement" value={invoices.filter(i=>i.status==="planifié").length} accent="#47C8FF"/>
              </div>
              <div style={{background:"#0C0C0C",border:"1px solid #161616",borderRadius:"10px",overflow:"hidden",marginBottom:"9px"}}>
                <div style={{padding:"10px 13px",borderBottom:"1px solid #141414",fontSize:"0.6rem",color:"#555",letterSpacing:".08em"}}>SYNTHÈSE — PAIEMENTS À EFFECTUER</div>
                {invoices.filter(i=>i.status!=="payé").map((inv,i)=>(
                  <div key={inv.id} style={{display:"flex",alignItems:"center",padding:"11px 13px",borderBottom:"1px solid #0f0f0f",gap:"11px",animation:`fi .2s ease ${i*.05}s both`}}>
                    <div style={{flex:1}}><div style={{fontSize:"0.78rem",color:"#D0C8BD",fontWeight:500}}>{inv.supplier}</div><div style={{fontSize:"0.62rem",color:"#555",marginTop:"2px"}}>{inv.id} · {inv.due}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:"#fff"}}>{fmt(inv.amount)}</div><div style={{fontSize:"0.58rem",color:"#555"}}>{inv.category}</div></div>
                    <Badge s={inv.status}/>
                    {inv.status==="à_valider"&&<button className="hv" onClick={()=>upd(inv.id,"planifié")} style={{padding:"5px 9px",background:"#C8FF47",border:"none",borderRadius:"4px",color:"#080808",fontSize:"0.63rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Valider</button>}
                    {inv.status==="planifié"&&<button className="hv" onClick={()=>upd(inv.id,"payé")} style={{padding:"5px 9px",background:"transparent",border:"1px solid #252525",borderRadius:"4px",color:"#47FF8A",fontSize:"0.63rem",cursor:"pointer",fontFamily:"inherit"}}>Enregistrer</button>}
                    {["rib_manquant","rib_demandé"].includes(inv.status)&&<button className="hv" onClick={()=>openRibEmail(inv)} style={{padding:"5px 9px",background:"transparent",border:"1px solid #FF474740",borderRadius:"4px",color:"#FF4747",fontSize:"0.63rem",cursor:"pointer",fontFamily:"inherit"}}>RIB requis</button>}
                  </div>
                ))}
              </div>
              <div style={{background:"#0C0C0C",border:"1px solid #161616",borderRadius:"10px",padding:"12px 13px"}}>
                <div style={{fontSize:"0.6rem",color:"#555",letterSpacing:".08em",marginBottom:"9px"}}>VIREMENTS PRÉPARÉS</div>
                {invoices.filter(i=>i.status==="planifié").map(inv=>(
                  <div key={inv.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #111",fontSize:"0.74rem"}}>
                    <div><div style={{color:"#D0C8BD",marginBottom:"2px"}}>{inv.supplier}</div><div style={{fontFamily:"monospace",fontSize:"0.63rem",color:"#555"}}>{inv.iban||ribSaved[inv.id]?.iban}</div></div>
                    <div style={{textAlign:"right"}}><div style={{color:"#fff",fontWeight:600}}>{fmt(inv.amount)}</div><div style={{fontSize:"0.58rem",color:"#47FF8A"}}>✓ IBAN vérifié</div></div>
                  </div>
                ))}
                {invoices.filter(i=>i.status==="planifié").length===0&&<div style={{fontSize:"0.71rem",color:"#444"}}>Aucun virement planifié.</div>}
              </div>
            </div>
          )}
 
          {/* COMPTABILITÉ */}
          {tab==="compta"&&(
            <div style={{flex:1,overflowY:"auto",padding:"13px"}}>
              <div style={{display:"flex",gap:"9px",marginBottom:"13px"}}>
                <Kpi label="Recettes nov." value={fmt(rec)} sub="↑ +12% vs oct." accent="#47FF8A" up={true}/>
                <Kpi label="Dépenses nov." value={fmt(dep)} sub="↑ +4% vs oct." accent="#FF6B47" up={false}/>
                <Kpi label="Résultat net" value={fmt(rec-dep)} accent={rec-dep>=0?"#47FF8A":"#FF4747"}/>
                <Kpi label="TVA à déclarer" value={fmt(tvac-tvad)} sub={`Coll. ${fmt(tvac)}`} accent="#E847FF"/>
              </div>
              <div style={{display:"flex",gap:"7px",marginBottom:"13px",flexWrap:"wrap"}}>
                {[{k:"treso",l:"Analyse trésorerie",c:"#47FF8A"},{k:"tva",l:"Rapport TVA",c:"#E847FF"},{k:"expert",l:"Préparer pour expert-comptable",c:"#47C8FF"}].map(b=>(
                  <button key={b.k} className="hv" onClick={()=>runAI(b.k)} style={{padding:"6px 11px",background:"#111",border:`1px solid ${b.c}33`,borderRadius:"6px",color:b.c,fontSize:"0.7rem",cursor:"pointer",fontFamily:"inherit"}}>◈ {b.l}</button>
                ))}
              </div>
              {aiPanel&&(
                <div style={{background:"#0C0C0C",border:"1px solid #1E1E1E",borderRadius:"10px",padding:"13px",marginBottom:"11px",animation:"fi .2s ease",position:"relative"}}>
                  <button onClick={()=>setAiPanel(false)} style={{position:"absolute",top:"10px",right:"11px",background:"transparent",border:"none",color:"#555",cursor:"pointer"}}>✕</button>
                  <div style={{fontSize:"0.6rem",color:"#C8FF47",letterSpacing:".1em",marginBottom:"9px"}}>ANALYSE IA</div>
                  {aiLoad?<div style={{display:"flex",gap:"5px"}}>{[0,1,2].map(d=><div key={d} style={{width:"5px",height:"5px",borderRadius:"50%",background:"#C8FF47",animation:`pu 1s ${d*.2}s infinite`}}/>)}</div>
                    :<pre style={{fontSize:"0.75rem",lineHeight:1.75,color:"#A0988D",whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{aiTxt}</pre>}
                </div>
              )}
              <div style={{background:"#0C0C0C",border:"1px solid #161616",borderRadius:"10px",overflow:"hidden"}}>
                <div style={{padding:"8px 13px",borderBottom:"1px solid #141414",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:"0.6rem",color:"#555",letterSpacing:".08em"}}>OPÉRATIONS — NOVEMBRE 2024</span>
                  <span style={{fontSize:"0.58rem",color:"#555"}}>{TRANSACTIONS.filter(t=>!t.ok).length} à rapprocher</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:".7fr 2fr .5fr 1fr .7fr .5fr",padding:"7px 13px",borderBottom:"1px solid #111",fontSize:"0.55rem",color:"#444",letterSpacing:".08em",textTransform:"uppercase"}}>
                  <span>Date</span><span>Libellé</span><span>Type</span><span>Montant</span><span>Catégorie</span><span>Rappr.</span>
                </div>
                {TRANSACTIONS.map((tx,i)=>(
                  <div key={tx.id} className="rh" style={{display:"grid",gridTemplateColumns:".7fr 2fr .5fr 1fr .7fr .5fr",padding:"9px 13px",borderBottom:i<TRANSACTIONS.length-1?"1px solid #0f0f0f":"none",fontSize:"0.73rem",animation:`fi .2s ease ${i*.03}s both`}}>
                    <span style={{color:"#555",fontSize:"0.65rem"}}>{tx.date}</span>
                    <span style={{color:"#C0B8B0"}}>{tx.label}</span>
                    <span style={{color:tx.type==="recette"?"#47FF8A":"#FF6B47",fontWeight:600,fontSize:"0.63rem"}}>{tx.type==="recette"?"↑":"↓"}</span>
                    <span style={{color:tx.type==="recette"?"#47FF8A":"#FF6B47",fontWeight:600}}>{tx.type==="recette"?"+":""}{fmt(tx.amount)}</span>
                    <span style={{color:"#666",fontSize:"0.65rem"}}>{tx.category}</span>
                    <span style={{color:tx.ok?"#47FF8A":"#FF9F47"}}>{tx.ok?"✓":"⚠"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* ACTIONS */}
          {tab==="actions"&&(
            <div style={{flex:1,overflowY:"auto",padding:"13px"}}>
              <div style={{marginBottom:"12px",fontSize:"0.72rem",color:"#555"}}>{actions.filter(a=>!a.done).length} actions en attente</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {actions.map((a,i)=>(
                  <div key={a.id} style={{background:"#0C0C0C",border:"1px solid #161616",borderRadius:"7px",padding:"12px 13px",display:"flex",alignItems:"center",gap:"10px",opacity:a.done?.4:1,animation:`fi .2s ease ${i*.04}s both`,transition:"opacity .2s"}}>
                    <button onClick={()=>setActions(p=>p.map(x=>x.id===a.id?{...x,done:!x.done}:x))} style={{width:"16px",height:"16px",borderRadius:"3px",border:`1px solid ${a.done?"#2A2A2A":a.c}`,background:a.done?"#1A1A1A":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:a.c,fontSize:"0.62rem"}}>{a.done?"✓":""}</button>
                    <div style={{flex:1}}><div style={{fontSize:"0.78rem",color:a.done?"#555":"#D0C8BD",textDecoration:a.done?"line-through":"none"}}>{a.label}</div><div style={{fontSize:"0.62rem",color:"#444",marginTop:"2px"}}>Source : {a.src}</div></div>
                    <div style={{padding:"2px 8px",borderRadius:"4px",background:`${a.c}11`,border:`1px solid ${a.c}33`,fontSize:"0.6rem",color:a.c}}>{a.due}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
 
        </div>
      </div>
 
      {/* MODAL RIB EMAIL */}
      {ribEMod&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,animation:"fi .2s ease"}}>
          <div style={{background:"#0D0D0D",border:"1px solid #252525",borderRadius:"14px",width:"640px",maxWidth:"95vw",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 19px",borderBottom:"1px solid #1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",fontSize:"0.86rem"}}>✉ Email automatique — Demande de RIB</div>
                <div style={{fontSize:"0.63rem",color:"#555",marginTop:"2px"}}>Généré par IA · Signé : <span style={{color:"#C8FF47"}}>{company}</span> · Pour : {ribEMod.supplier}</div>
              </div>
              <button onClick={()=>setRibEMod(null)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 19px"}}>
              {[["De :", company, "#C8FF47"],["À :", ribEMod.email, "#888"]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",gap:"9px",alignItems:"center",marginBottom:"8px"}}>
                  <span style={{fontSize:"0.62rem",color:"#555",width:"38px",flexShrink:0}}>{l}</span>
                  <div style={{flex:1,padding:"6px 10px",background:"#0A0A0A",border:"1px solid #1a1a1a",borderRadius:"5px",fontSize:"0.74rem",color:c}}>{v}</div>
                </div>
              ))}
              {ribLoad
                ? <div style={{display:"flex",gap:"6px",alignItems:"center",padding:"20px 0"}}>{[0,1,2].map(d=><div key={d} style={{width:"6px",height:"6px",borderRadius:"50%",background:"#C8FF47",animation:`pu 1s ${d*.2}s infinite`}}/>)}<span style={{fontSize:"0.68rem",color:"#555",marginLeft:"7px"}}>Rédaction en cours...</span></div>
                : ribDraft&&(
                  <div style={{animation:"fi .25s ease"}}>
                    <div style={{display:"flex",gap:"9px",alignItems:"center",marginBottom:"11px"}}>
                      <span style={{fontSize:"0.62rem",color:"#555",width:"38px",flexShrink:0}}>Objet :</span>
                      <div style={{flex:1,padding:"6px 10px",background:"#0A0A0A",border:"1px solid #1a1a1a",borderRadius:"5px",fontSize:"0.74rem",color:"#D0C8BD",fontWeight:500}}>{ribDraft.split("\n")[0].replace(/^Objet\s*:\s*/i,"").trim()}</div>
                    </div>
                    <div style={{background:"#060606",border:"1px solid #141414",borderRadius:"8px",padding:"14px 15px",marginBottom:"9px"}}>
                      <pre style={{fontSize:"0.76rem",lineHeight:1.85,color:"#A0988D",whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{ribDraft.split("\n").slice(2).join("\n").trim()}</pre>
                    </div>
                    <div style={{padding:"9px 12px",background:"rgba(200,255,71,.04)",border:"1px solid #C8FF4716",borderRadius:"7px",display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <div style={{width:"20px",height:"20px",background:"#C8FF47",borderRadius:"4px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#080808",fontSize:"0.6rem",flexShrink:0}}>A</div>
                      <span style={{fontSize:"0.64rem",color:"#C8FF47",fontStyle:"italic",lineHeight:1.5}}>Cet e-mail a été généré automatiquement par <strong>ATLAS PME</strong> pour le compte de <strong>{company}</strong></span>
                    </div>
                  </div>
                )
              }
            </div>
            {ribDraft&&!ribLoad&&(
              <div style={{padding:"10px 19px",borderTop:"1px solid #1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"0.6rem",color:"#444"}}>Signataire : {company}</span>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>setRibEMod(null)} style={{padding:"7px 13px",background:"transparent",border:"1px solid #222",borderRadius:"6px",color:"#777",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
                  <button className="hv" onClick={()=>sendRibEmail(ribEMod)} style={{padding:"7px 15px",background:"#C8FF47",border:"none",borderRadius:"6px",color:"#080808",fontSize:"0.72rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"opacity .15s"}}>✉ Envoyer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
 
      {/* MODAL PORTAIL RIB */}
      {ribPMod&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,animation:"fi .2s ease"}}>
          <div style={{background:"#0A0A0A",border:"1px solid #47C8FF22",borderRadius:"16px",width:"480px",maxWidth:"95vw",overflow:"hidden",boxShadow:"0 0 80px rgba(71,200,255,.04)"}}>
            <div style={{background:"rgba(71,200,255,.05)",padding:"11px 18px",borderBottom:"1px solid #47C8FF14"}}>
              <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"6px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"4px",padding:"2px 7px",background:"rgba(71,255,138,.08)",borderRadius:"20px",border:"1px solid #47FF8A16"}}>
                  <div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#47FF8A"}}/>
                  <span style={{fontSize:"0.53rem",color:"#47FF8A",fontWeight:700,letterSpacing:".08em"}}>CONNEXION SÉCURISÉE</span>
                </div>
                <span style={{fontSize:"0.54rem",color:"#2e2e2e"}}>portail.atlas-pme.fr/rib/{ribPMod.id.toLowerCase()}</span>
                {ribStep!=="success"&&<button onClick={()=>setRibPMod(null)} style={{marginLeft:"auto",background:"transparent",border:"none",color:"#2e2e2e",cursor:"pointer",fontSize:"0.76rem"}}>✕</button>}
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",fontSize:"0.9rem"}}>Portail de dépôt RIB sécurisé</div>
              <div style={{fontSize:"0.62rem",color:"#555",marginTop:"2px"}}>Demandé par <strong style={{color:"#C8FF47"}}>{company}</strong> · {ribPMod.id} · {fmt(ribPMod.amount)}</div>
              {ribStep!=="success"&&(()=>{
                const steps=[["upload","1","Déposer le RIB"],["otp","2",ribPhone?"Code SMS":"Code email"]];
                const cur=steps.findIndex(([s])=>s===ribStep);
                return(
                  <div style={{display:"flex",alignItems:"center",marginTop:"11px"}}>
                    {steps.map(([s,n,lbl],idx)=>{
                      const active=ribStep===s; const done=idx<cur;
                      return(
                        <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                            <div style={{width:"18px",height:"18px",borderRadius:"50%",background:done?"#47FF8A":active?"#47C8FF":"#1a1a1a",border:`1px solid ${done?"#47FF8A44":active?"#47C8FF":"#252525"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.53rem",color:(active||done)?"#080808":"#555",fontWeight:700,flexShrink:0,transition:"all .3s"}}>{done?"✓":n}</div>
                            <span style={{fontSize:"0.58rem",color:active?"#47C8FF":done?"#47FF8A":"#555",whiteSpace:"nowrap"}}>{lbl}</span>
                          </div>
                          {idx<steps.length-1&&<div style={{flex:1,height:"1px",background:idx<cur?"#47FF8A30":"#1a1a1a",margin:"0 7px",transition:"background .3s"}}/>}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
 
            {ribStep==="upload"&&(
              <div style={{padding:"20px 18px"}}>
                {ribPhone
                  ? <div style={{padding:"8px 12px",background:"rgba(71,255,138,.05)",border:"1px solid #47FF8A20",borderRadius:"7px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                      <span>📱</span>
                      <div><div style={{fontSize:"0.64rem",color:"#47FF8A",fontWeight:600}}>Code OTP envoyé par SMS à</div><div style={{fontSize:"0.71rem",color:"#C8C0B5",fontFamily:"monospace"}}>{ribPhone}</div></div>
                    </div>
                  : <div style={{padding:"8px 12px",background:"rgba(71,200,255,.05)",border:"1px solid #47C8FF20",borderRadius:"7px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                      <span>✉</span>
                      <div><div style={{fontSize:"0.64rem",color:"#47C8FF",fontWeight:600}}>Code OTP envoyé par email à</div><div style={{fontSize:"0.71rem",color:"#C8C0B5"}}>{ribPMod.email}</div></div>
                    </div>
                }
                <div style={{fontSize:"0.63rem",color:"#555",marginBottom:"12px",lineHeight:1.65}}>Déposez le document RIB. Formats : <strong style={{color:"#C8C0B5"}}>PDF, JPG, PNG</strong> — max 10 Mo.</div>
                <label htmlFor="rib-file" style={{display:"block",cursor:"pointer"}}>
                  <div style={{border:`2px dashed ${ribFile?"#47FF8A44":"#252525"}`,borderRadius:"10px",padding:"22px 16px",textAlign:"center",background:ribFile?"rgba(71,255,138,.04)":"#0D0D0D",transition:"all .2s",marginBottom:"11px"}}>
                    {ribFile?(
                      <div>
                        {ribFilePreview?<img src={ribFilePreview} alt="aperçu" style={{maxHeight:"88px",maxWidth:"100%",borderRadius:"6px",marginBottom:"7px",objectFit:"contain"}}/>:<div style={{fontSize:"2.2rem",marginBottom:"6px"}}>📄</div>}
                        <div style={{fontSize:"0.74rem",color:"#47FF8A",fontWeight:600}}>{ribFile.name}</div>
                        <div style={{fontSize:"0.59rem",color:"#47C8FF",marginTop:"5px"}}>Cliquer pour remplacer</div>
                      </div>
                    ):(
                      <div>
                        <div style={{fontSize:"2rem",marginBottom:"7px",opacity:.4}}>📎</div>
                        <div style={{fontSize:"0.74rem",color:"#888",marginBottom:"3px"}}>Cliquer pour sélectionner votre RIB</div>
                        <div style={{fontSize:"0.61rem",color:"#555"}}>PDF · JPG · PNG</div>
                      </div>
                    )}
                  </div>
                </label>
                <input id="rib-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{display:"none"}}/>
                <div style={{padding:"7px 10px",background:"rgba(71,200,255,.03)",border:"1px solid #47C8FF0e",borderRadius:"5px",marginBottom:"13px",fontSize:"0.59rem",color:"#47C8FF55",lineHeight:1.6}}>
                  🔒 Fichier chiffré en transit · Stocké de façon sécurisée
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>setRibPMod(null)} style={{flex:1,padding:"8px",background:"transparent",border:"1px solid #1e1e1e",borderRadius:"6px",color:"#777",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
                  <button className="hv" onClick={submitUpload} disabled={!ribFile} style={{...S.btn(!!ribFile,{flex:2})}}>
                    {ribPhone?"Envoyer le code SMS →":"Envoyer le code par email →"}
                  </button>
                </div>
              </div>
            )}
 
            {ribStep==="otp"&&(
              <div style={{padding:"20px 18px"}}>
                <div style={{textAlign:"center",marginBottom:"16px"}}>
                  <div style={{fontSize:"2rem",marginBottom:"8px"}}>{ribPhone?"📱":"✉"}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",fontSize:"0.86rem",marginBottom:"5px"}}>Code envoyé par {ribPhone?"SMS":"email"}</div>
                  <div style={{fontSize:"0.64rem",color:"#666",lineHeight:1.7}}>
                    {ribPhone?<>Code envoyé au <strong style={{color:"#C8C0B5",fontFamily:"monospace"}}>{ribPhone}</strong></>
                      :<>Code envoyé à <strong style={{color:"#C8C0B5"}}>{ribPMod.email}</strong></>}
                  </div>
                </div>
                <div style={{padding:"7px 11px",background:"rgba(200,255,71,.04)",border:"1px solid #C8FF4714",borderRadius:"6px",marginBottom:"12px",textAlign:"center"}}>
                  <div style={{fontSize:"0.52rem",color:"#C8FF4750",marginBottom:"2px"}}>CODE {ribPhone?"SMS":"EMAIL"} (démonstration)</div>
                  <div style={{fontFamily:"monospace",fontSize:"1.35rem",letterSpacing:"0.35em",color:"#C8FF47",fontWeight:700}}>{otpGen}</div>
                </div>
                <label style={{fontSize:"0.64rem",color:"#888",display:"block",marginBottom:"5px"}}>Saisissez le code à 6 chiffres</label>
                <input value={otpVal} onChange={e=>{setOtpVal(e.target.value.replace(/\D/g,"").slice(0,6));setOtpErr(false);}} placeholder="_ _ _ _ _ _" maxLength={6}
                  style={{...S.input({border:`1px solid ${otpErr?"#FF4747":"#1e1e1e"}`,fontSize:"1.2rem",fontFamily:"monospace",textAlign:"center",letterSpacing:"0.35em",padding:"10px",marginBottom:"7px"})}}/>
                {otpErr&&<div style={{fontSize:"0.62rem",color:"#FF4747",marginBottom:"9px"}}>⚠ Code incorrect.</div>}
                <div style={{display:"flex",gap:"6px",marginTop:"4px"}}>
                  <button onClick={()=>setRibStep("upload")} style={{flex:1,padding:"8px",background:"transparent",border:"1px solid #1e1e1e",borderRadius:"6px",color:"#777",fontSize:"0.71rem",cursor:"pointer",fontFamily:"inherit"}}>← Retour</button>
                  <button className="hv" onClick={()=>submitOtp(ribPMod.id)} disabled={otpVal.length!==6} style={{...S.btn(otpVal.length===6,{flex:2})}}>🔒 Valider et déposer le RIB</button>
                </div>
              </div>
            )}
 
            {ribStep==="success"&&(
              <div style={{padding:"32px 18px",textAlign:"center"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"50%",background:"rgba(71,255,138,.08)",border:"2px solid #47FF8A30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",margin:"0 auto 12px"}}>✓</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#47FF8A",fontSize:"0.96rem",marginBottom:"5px"}}>RIB déposé avec succès</div>
                <div style={{fontSize:"0.66rem",color:"#666",lineHeight:1.75,marginBottom:"16px"}}>
                  Identité vérifiée · Fichier enregistré de manière sécurisée<br/>
                  <strong style={{color:"#C8FF47"}}>{company}</strong> peut désormais procéder au paiement.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
 
    </div>
  );
}
 
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
