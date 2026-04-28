import { useState, useEffect } from "react";

// ─── PLACEHOLDER DATA ───────────────────────────────────────────
const REPS = [
  { id: "r1", name: "Kyle Hoch", role: "Sales Manager", initials: "KH" },
  { id: "r2", name: "Jake Murray", role: "Field Rep", initials: "JM" },
  { id: "r3", name: "Cole Briggs", role: "Field Rep", initials: "CB" },
  { id: "r4", name: "Nate Willis", role: "Account Rep", initials: "NW" },
];

const STAGES = [
  { key: "identified", label: "Identified", color: "#4A7C6F" },
  { key: "contacted", label: "Contacted", color: "#3D6B8E" },
  { key: "proposal_sent", label: "Proposal Sent", color: "#7B6B3A" },
  { key: "follow_up", label: "Follow Up", color: "#8B5E3C" },
  { key: "won", label: "Won", color: "#2E7D4F" },
  { key: "lost", label: "Lost", color: "#9B3B3B" },
];

const LOSS_REASONS = ["Price", "Timeline", "Went with competitor", "Project cancelled", "Unresponsive"];
const LEAD_SOURCES = ["Jobsite visit", "Referral", "Inbound call", "Web inquiry", "Trade event"];
const PROJECT_TYPES = ["General Contractor", "Pipe Fitter", "Paving", "Landscape", "Wholesale", "Flatwork"];

const initialLeads = [
  { id: "L001", company: "Boise Valley Construction", contact: "Mark Peterson", phone: "(208) 555-0142", email: "mark@bvconst.com", stage: "identified", rep: "r2", accountRep: "", source: "Jobsite visit", projectType: "General Contractor", estVolume: "2,500 tons", notes: [{ date: "2025-03-28", text: "Met Mark at the St. Luke's expansion site. They're pouring foundations next month.", by: "JM" }], autoFollowUp: false, quoteValue: null, quoteSent: null, quoteExpires: null, quoteViewed: null, lossReason: "" },
  { id: "L002", company: "Treasure Valley Paving", contact: "Dan Kowalski", phone: "(208) 555-0198", email: "dan@tvpaving.com", stage: "contacted", rep: "r3", accountRep: "", source: "Referral", projectType: "Paving", estVolume: "4,000 tons", notes: [{ date: "2025-03-25", text: "Referral from Mike at Eagle Excavation. Called Dan, he's interested in road mix pricing.", by: "CB" }, { date: "2025-03-27", text: "Dan confirmed they have 3 projects starting in May. Wants quotes on 3/4 road mix and pit run.", by: "CB" }], autoFollowUp: false, quoteValue: null, quoteSent: null, quoteExpires: null, quoteViewed: null, lossReason: "" },
  { id: "L003", company: "Meridian Flatwork Co", contact: "Lisa Cheng", phone: "(208) 555-0234", email: "lisa@meridianflat.com", stage: "proposal_sent", rep: "r2", accountRep: "r4", source: "Trade event", projectType: "Flatwork", estVolume: "1,200 tons", notes: [{ date: "2025-03-20", text: "Met at AGC mixer. They do residential and light commercial flatwork across the valley.", by: "JM" }, { date: "2025-03-22", text: "Called Lisa. Needs concrete sand and 3/4 clean. Current supplier has delivery issues.", by: "JM" }, { date: "2025-03-24", text: "Quote sent via FastWeigh. $18.50/ton delivered for sand, $16.75/ton for 3/4 clean.", by: "JM" }], autoFollowUp: true, quoteValue: 22350, quoteSent: "2025-03-24", quoteExpires: "2025-04-23", quoteViewed: "2025-03-25", lossReason: "" },
  { id: "L004", company: "Gem State Landscaping", contact: "Rob Hayward", phone: "(208) 555-0311", email: "rob@gemlandscape.com", stage: "proposal_sent", rep: "r3", accountRep: "r4", source: "Web inquiry", projectType: "Landscape", estVolume: "800 tons", notes: [{ date: "2025-03-18", text: "Came in through website form. Needs landscape rock for HOA common areas in Star.", by: "CB" }, { date: "2025-03-20", text: "Site visit. 6 common areas, mix of 1.5\" basalt and river rock.", by: "CB" }, { date: "2025-03-22", text: "Quote sent. $24/ton basalt, $28/ton river rock, delivered.", by: "CB" }], autoFollowUp: true, quoteValue: 20800, quoteSent: "2025-03-22", quoteExpires: "2025-04-21", quoteViewed: null, lossReason: "" },
  { id: "L005", company: "Allied Pipe & Utility", contact: "Steve Brennan", phone: "(208) 555-0178", email: "steve@alliedpipe.com", stage: "follow_up", rep: "r2", accountRep: "r4", source: "Jobsite visit", projectType: "Pipe Fitter", estVolume: "6,000 tons", notes: [{ date: "2025-03-10", text: "Big operation. Sewer line replacement project for City of Nampa.", by: "JM" }, { date: "2025-03-12", text: "Sent over trench backfill specs and bedding sand pricing.", by: "JM" }, { date: "2025-03-15", text: "Steve viewed the quote same day. No response yet.", by: "NW" }, { date: "2025-03-20", text: "Called Steve. He's comparing with another supplier. Said we're close on price but they need faster turnaround on spec submittals.", by: "NW" }, { date: "2025-03-25", text: "Sent revised submittal docs. Waiting to hear back.", by: "NW" }], autoFollowUp: true, quoteValue: 96000, quoteSent: "2025-03-12", quoteExpires: "2025-04-11", quoteViewed: "2025-03-12", lossReason: "" },
  { id: "L006", company: "Summit Builders", contact: "Amy Torres", phone: "(208) 555-0299", email: "amy@summitbuild.com", stage: "won", rep: "r3", accountRep: "r4", source: "Referral", projectType: "General Contractor", estVolume: "3,200 tons", notes: [{ date: "2025-03-01", text: "Referred by Lane. Commercial retail build in Eagle.", by: "CB" }, { date: "2025-03-05", text: "Quote sent. Base, sub-base, and drain rock.", by: "CB" }, { date: "2025-03-10", text: "Accepted! First delivery March 18.", by: "NW" }], autoFollowUp: false, quoteValue: 44800, quoteSent: "2025-03-05", quoteExpires: "2025-04-04", quoteViewed: "2025-03-06", lossReason: "" },
  { id: "L007", company: "High Desert Grading", contact: "Tom Rourke", phone: "(208) 555-0356", email: "tom@hdgrading.com", stage: "won", rep: "r2", accountRep: "r4", source: "Jobsite visit", projectType: "Paving", estVolume: "5,500 tons", notes: [{ date: "2025-02-28", text: "Met Tom at the Ten Mile interchange project. Needs road mix and base.", by: "JM" }, { date: "2025-03-02", text: "Quote sent. Competitive on base, slightly higher on road mix.", by: "JM" }, { date: "2025-03-08", text: "Won. Tom said delivery reliability tipped the scale.", by: "NW" }], autoFollowUp: false, quoteValue: 71500, quoteSent: "2025-03-02", quoteExpires: "2025-04-01", quoteViewed: "2025-03-03", lossReason: "" },
  { id: "L008", company: "Canyon County Concrete", contact: "Bill Marsh", phone: "(208) 555-0412", email: "bill@canyonconcrete.com", stage: "lost", rep: "r3", accountRep: "r4", source: "Inbound call", projectType: "Flatwork", estVolume: "900 tons", notes: [{ date: "2025-03-05", text: "Called in looking for concrete sand. Job in Caldwell.", by: "CB" }, { date: "2025-03-07", text: "Quote sent.", by: "CB" }, { date: "2025-03-14", text: "Went with Idaho Materials. Price was $1.50/ton lower.", by: "NW" }], autoFollowUp: false, quoteValue: 12600, quoteSent: "2025-03-07", quoteExpires: "2025-04-06", quoteViewed: "2025-03-08", lossReason: "Price" },
  { id: "L009", company: "Valley Wide Utilities", contact: "Jeff Dolan", phone: "(208) 555-0189", email: "jeff@valleyutil.com", stage: "identified", rep: "r2", accountRep: "", source: "Trade event", projectType: "Pipe Fitter", estVolume: "3,000 tons", notes: [{ date: "2025-03-29", text: "Met at Idaho AGC safety dinner. Does waterline work across the valley.", by: "JM" }], autoFollowUp: false, quoteValue: null, quoteSent: null, quoteExpires: null, quoteViewed: null, lossReason: "" },
  { id: "L010", company: "Greenscape Idaho", contact: "Maria Sandoval", phone: "(208) 555-0267", email: "maria@greenscapeid.com", stage: "contacted", rep: "r3", accountRep: "", source: "Referral", projectType: "Landscape", estVolume: "600 tons", notes: [{ date: "2025-03-26", text: "Referral from Gem State Landscaping. Does commercial landscape installs.", by: "CB" }, { date: "2025-03-28", text: "Talked to Maria. Interested in decorative rock and drain rock. Sending specs.", by: "CB" }], autoFollowUp: false, quoteValue: null, quoteSent: null, quoteExpires: null, quoteViewed: null, lossReason: "" },
];

// ─── STYLES ─────────────────────────────────────────────────────
const fonts = `'Helvetica Neue', Helvetica, Arial, sans-serif`;
const COLORS = {
  bg: "#F7F6F1",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E2E0D8",
  text: "#323D3E",
  textMuted: "#7A8082",
  soapstone: "#323D3E",
  alabaster: "#EDEADE",
  slate: "#C0C2C9",
  accent: "#4A7C6F",
  accentLight: "#5A9484",
  danger: "#9B3B3B",
  warn: "#8B6914",
  autoGreen: "#2E7D4F",
};

// ─── UTILITIES ──────────────────────────────────────────────────
function daysAgo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date("2025-03-31");
  return Math.floor((now - d) / 86400000);
}

function formatMoney(n) {
  if (!n) return "--";
  return "$" + n.toLocaleString();
}

function getRep(id) {
  return REPS.find(r => r.id === id) || { name: "Unassigned", initials: "??" };
}

function getStage(key) {
  return STAGES.find(s => s.key === key) || STAGES[0];
}

// ─── COMPONENTS ─────────────────────────────────────────────────

function Avatar({ initials, size = 32, color = COLORS.accent }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "30", border: `1.5px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color, flexShrink: 0,
      fontFamily: fonts,
    }}>{initials}</div>
  );
}

function StageBadge({ stage, small }) {
  const s = getStage(stage);
  return (
    <span style={{
      display: "inline-block", padding: small ? "2px 8px" : "3px 10px",
      background: s.color + "20", border: `1px solid ${s.color}50`,
      color: s.color, fontSize: small ? 10 : 11, fontWeight: 700,
      letterSpacing: 0.5, fontFamily: fonts, whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function QuoteStatus({ lead }) {
  if (!lead.quoteSent) return null;
  const days = daysAgo(lead.quoteSent);
  const viewed = lead.quoteViewed;
  const expDays = daysAgo(lead.quoteExpires);
  const expiring = expDays !== null && expDays > -8 && expDays <= 0;

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
      {viewed ? (
        <span style={{ fontSize: 10, padding: "2px 6px", background: "#2E7D4F20", color: "#5A9484", fontWeight: 600, fontFamily: fonts }}>VIEWED</span>
      ) : (
        <span style={{ fontSize: 10, padding: "2px 6px", background: "#B8960C15", color: "#B8960C", fontWeight: 600, fontFamily: fonts }}>NOT VIEWED</span>
      )}
      <span style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: fonts }}>{days}d ago</span>
      {expiring && (
        <span style={{ fontSize: 10, padding: "2px 6px", background: "#9B3B3B20", color: "#D46A6A", fontWeight: 600, fontFamily: fonts }}>EXPIRING SOON</span>
      )}
      {lead.autoFollowUp && (
        <span style={{ fontSize: 10, padding: "2px 6px", background: "#4A7C6F15", color: "#4A7C6F", fontWeight: 600, fontFamily: fonts }}>AUTO FOLLOW-UP ON</span>
      )}
    </div>
  );
}

function NavBar({ view, setView }) {
  const items = [
    { key: "pipeline", icon: "M4 6h16M4 10h16M4 14h16M4 18h16", label: "Pipeline" },
    { key: "quotes", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Quotes" },
    { key: "dashboard", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Dashboard" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#FFFFFF", borderTop: `1px solid ${COLORS.border}`,
      display: "flex", justifyContent: "space-around", padding: "6px 0 14px", zIndex: 100,
      boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
    }}>
      {items.map(it => (
        <button key={it.key} onClick={() => setView(it.key)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          color: view === it.key ? COLORS.accent : COLORS.textMuted,
          fontFamily: fonts, fontSize: 10, fontWeight: view === it.key ? 700 : 400,
          padding: "4px 16px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.icon} />
          </svg>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Header({ title, subtitle, right }) {
  return (
    <div style={{
      padding: "16px 16px 12px", borderBottom: `1px solid ${COLORS.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4, fontFamily: fonts }}>PREMIER AGGREGATES</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: fonts }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, fontFamily: fonts }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── PIPELINE VIEW ──────────────────────────────────────────────
function PipelineView({ leads, onSelect, filter, setFilter }) {
  const activeStages = STAGES.filter(s => s.key !== "won" && s.key !== "lost");
  const closedStages = STAGES.filter(s => s.key === "won" || s.key === "lost");
  const showStages = filter === "active" ? activeStages : filter === "closed" ? closedStages : STAGES;

  return (
    <div>
      <Header title="Pipeline" subtitle={`${leads.length} total leads`}
        right={
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{
            background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}`,
            padding: "6px 10px", fontSize: 12, fontFamily: fonts, marginTop: 8,
          }}>
            <option value="active">Active</option>
            <option value="closed">Won / Lost</option>
            <option value="all">All</option>
          </select>
        }
      />

      <div style={{ padding: "12px 16px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {showStages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.key);
          if (stageLeads.length === 0 && filter !== "all") return null;
          return (
            <div key={stage.key}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
              }}>
                <div style={{ width: 3, height: 16, background: stage.color, borderRadius: 2 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, letterSpacing: 0.5, fontFamily: fonts }}>
                  {stage.label.toUpperCase()}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: stage.color, background: stage.color + "18",
                  padding: "1px 8px", borderRadius: 10, fontFamily: fonts,
                }}>{stageLeads.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {stageLeads.map(lead => (
                  <button key={lead.id} onClick={() => onSelect(lead.id)} style={{
                    background: COLORS.card, border: `1px solid ${COLORS.border}`,
                    borderLeft: `3px solid ${stage.color}`,
                    padding: "12px 14px", cursor: "pointer", textAlign: "left",
                    width: "100%", fontFamily: fonts, display: "block",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{lead.company}</div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{lead.contact} · {lead.projectType}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {lead.quoteValue && <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{formatMoney(lead.quoteValue)}</div>}
                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{getRep(lead.rep).initials}{lead.accountRep ? ` → ${getRep(lead.accountRep).initials}` : ""}</div>
                      </div>
                    </div>
                    <QuoteStatus lead={lead} />
                    {lead.stage === "lost" && lead.lossReason && (
                      <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4, fontFamily: fonts }}>Lost: {lead.lossReason}</div>
                    )}
                  </button>
                ))}
                {stageLeads.length === 0 && (
                  <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "8px 14px", fontStyle: "italic", fontFamily: fonts }}>No leads</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LEAD DETAIL VIEW ───────────────────────────────────────────
function LeadDetail({ lead, onBack, onUpdate }) {
  const [newNote, setNewNote] = useState("");
  const stage = getStage(lead.stage);
  const rep = getRep(lead.rep);
  const acctRep = lead.accountRep ? getRep(lead.accountRep) : null;

  function addNote() {
    if (!newNote.trim()) return;
    const updated = {
      ...lead,
      notes: [...lead.notes, { date: "2025-03-31", text: newNote.trim(), by: rep.initials }],
    };
    onUpdate(updated);
    setNewNote("");
  }

  function moveStage(newStage) {
    onUpdate({ ...lead, stage: newStage });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accent, fontFamily: fonts, fontSize: 14, padding: "4px 0" }}>
          ← Back
        </button>
        <StageBadge stage={lead.stage} />
      </div>

      <div style={{ padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Company Info */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: fonts }}>{lead.company}</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontFamily: fonts }}>{lead.id}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[
              { label: "Contact", value: lead.contact },
              { label: "Phone", value: lead.phone },
              { label: "Email", value: lead.email },
              { label: "Source", value: lead.source },
              { label: "Project Type", value: lead.projectType },
              { label: "Est. Volume", value: lead.estVolume },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts }}>{f.label}</div>
                <div style={{ fontSize: 13, color: COLORS.text, marginTop: 2, fontFamily: fonts }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reps */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontFamily: fonts }}>ASSIGNED</div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar initials={rep.initials} size={28} />
              <div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, fontFamily: fonts }}>{rep.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fonts }}>{rep.role}</div>
              </div>
            </div>
            {acctRep && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar initials={acctRep.initials} size={28} color="#8B5E3C" />
                <div>
                  <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, fontFamily: fonts }}>{acctRep.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fonts }}>{acctRep.role}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quote Info */}
        {lead.quoteSent && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontFamily: fonts }}>QUOTE DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, fontFamily: fonts }}>Value</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, fontFamily: fonts }}>{formatMoney(lead.quoteValue)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, fontFamily: fonts }}>Sent</div>
                <div style={{ fontSize: 13, color: COLORS.text, fontFamily: fonts }}>{lead.quoteSent} ({daysAgo(lead.quoteSent)}d ago)</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, fontFamily: fonts }}>Expires</div>
                <div style={{ fontSize: 13, color: COLORS.text, fontFamily: fonts }}>{lead.quoteExpires}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, fontFamily: fonts }}>Status</div>
                <QuoteStatus lead={lead} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 16, height: 16, border: `2px solid ${lead.autoFollowUp ? COLORS.autoGreen : COLORS.textMuted}`,
                background: lead.autoFollowUp ? COLORS.autoGreen : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }} onClick={() => onUpdate({ ...lead, autoFollowUp: !lead.autoFollowUp })}>
                {lead.autoFollowUp && <span style={{ color: "#FFFFFF", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 12, color: COLORS.text, fontFamily: fonts }}>Auto follow-up emails enabled</span>
            </div>
          </div>
        )}

        {/* Stage Actions */}
        {lead.stage !== "won" && lead.stage !== "lost" && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontFamily: fonts }}>MOVE STAGE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {STAGES.filter(s => s.key !== lead.stage).map(s => (
                <button key={s.key} onClick={() => moveStage(s.key)} style={{
                  padding: "6px 12px", background: s.color + "15", border: `1px solid ${s.color}40`,
                  color: s.color, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: fonts,
                }}>{s.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontFamily: fonts }}>
            NOTES ({lead.notes.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lead.notes.map((note, i) => (
              <div key={i} style={{ padding: "10px 12px", background: "#F2F1EB", borderLeft: `2px solid ${COLORS.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.accent, fontFamily: fonts }}>{note.by}</span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fonts }}>{note.date}</span>
                </div>
                <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5, fontFamily: fonts }}>{note.text}</div>
              </div>
            ))}
          </div>

          {/* Add Note */}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note..."
              style={{
                flex: 1, background: "#F2F1EB", border: `1px solid ${COLORS.border}`,
                color: COLORS.text, padding: "8px 10px", fontSize: 13, fontFamily: fonts,
                resize: "vertical", minHeight: 40,
              }}
            />
            <button onClick={addNote} style={{
              padding: "8px 16px", background: COLORS.accent, border: "none",
              color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: fonts, fontSize: 12,
              alignSelf: "flex-end",
            }}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUOTES VIEW ────────────────────────────────────────────────
function QuotesView({ leads, onSelect }) {
  const quoted = leads.filter(l => l.quoteSent).sort((a, b) => new Date(b.quoteSent) - new Date(a.quoteSent));
  const open = quoted.filter(l => l.stage !== "won" && l.stage !== "lost");
  const totalOpen = open.reduce((s, l) => s + (l.quoteValue || 0), 0);
  const viewedCount = open.filter(l => l.quoteViewed).length;

  return (
    <div>
      <Header title="Quotes" subtitle={`${open.length} open · ${formatMoney(totalOpen)} total value`} />

      {/* Stats bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
        {[
          { label: "Open", value: open.length, color: COLORS.accent },
          { label: "Viewed", value: viewedCount, color: COLORS.autoGreen },
          { label: "Not Viewed", value: open.length - viewedCount, color: COLORS.warn },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "12px 16px", textAlign: "center", borderRight: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: fonts }}>{s.value}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px 100px", display: "flex", flexDirection: "column", gap: 6 }}>
        {quoted.map(lead => {
          const days = daysAgo(lead.quoteSent);
          const isOpen = lead.stage !== "won" && lead.stage !== "lost";
          return (
            <button key={lead.id} onClick={() => onSelect(lead.id)} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderLeft: `3px solid ${isOpen ? (lead.quoteViewed ? COLORS.autoGreen : COLORS.warn) : getStage(lead.stage).color}`,
              padding: "12px 14px", cursor: "pointer", textAlign: "left",
              width: "100%", fontFamily: fonts, opacity: isOpen ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{lead.company}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{lead.contact} · Sent {days}d ago</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{formatMoney(lead.quoteValue)}</div>
                  <StageBadge stage={lead.stage} small />
                </div>
              </div>
              <QuoteStatus lead={lead} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ─────────────────────────────────────────────
function DashboardView({ leads }) {
  const activeStageKeys = ["identified", "contacted", "proposal_sent", "follow_up"];
  const active = leads.filter(l => activeStageKeys.includes(l.stage));
  const won = leads.filter(l => l.stage === "won");
  const lost = leads.filter(l => l.stage === "lost");
  const quoted = leads.filter(l => l.quoteSent);
  const totalWonValue = won.reduce((s, l) => s + (l.quoteValue || 0), 0);
  const totalPipelineValue = leads.filter(l => l.stage === "proposal_sent" || l.stage === "follow_up").reduce((s, l) => s + (l.quoteValue || 0), 0);
  const winRate = quoted.length > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0;

  // Leads by source
  const sourceCounts = {};
  leads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
  const sourceEntries = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  // Leads by rep
  const repCounts = {};
  leads.forEach(l => {
    const r = getRep(l.rep).name;
    if (!repCounts[r]) repCounts[r] = { active: 0, won: 0, lost: 0 };
    if (l.stage === "won") repCounts[r].won++;
    else if (l.stage === "lost") repCounts[r].lost++;
    else repCounts[r].active++;
  });

  // Loss reasons
  const lossReasons = {};
  lost.forEach(l => { if (l.lossReason) lossReasons[l.lossReason] = (lossReasons[l.lossReason] || 0) + 1; });

  return (
    <div>
      <Header title="Dashboard" subtitle="Sales pipeline overview" />

      <div style={{ padding: "12px 16px 100px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Active Leads", value: active.length, color: COLORS.accent },
            { label: "Pipeline Value", value: formatMoney(totalPipelineValue), color: "#7B6B3A" },
            { label: "Won This Month", value: won.length, color: COLORS.autoGreen },
            { label: "Won Value", value: formatMoney(totalWonValue), color: COLORS.autoGreen },
            { label: "Win Rate", value: winRate + "%", color: winRate >= 50 ? COLORS.autoGreen : COLORS.warn },
            { label: "Lost", value: lost.length, color: COLORS.danger },
          ].map((kpi, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color, marginTop: 4, fontFamily: fonts }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontFamily: fonts }}>PIPELINE FUNNEL</div>
          {STAGES.filter(s => s.key !== "lost").map(stage => {
            const count = leads.filter(l => l.stage === stage.key).length;
            const maxCount = Math.max(...STAGES.map(s => leads.filter(l => l.stage === s.key).length), 1);
            const pct = (count / maxCount) * 100;
            return (
              <div key={stage.key} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: COLORS.text, fontFamily: fonts }}>{stage.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: stage.color, fontFamily: fonts }}>{count}</span>
                </div>
                <div style={{ height: 6, background: "#E8E6DE", width: "100%" }}>
                  <div style={{ height: 6, background: stage.color, width: `${pct}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Rep Activity */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontFamily: fonts }}>REP ACTIVITY</div>
          {Object.entries(repCounts).map(([name, counts]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, fontFamily: fonts }}>{name}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 12, color: COLORS.accent, fontFamily: fonts }}>{counts.active} active</span>
                <span style={{ fontSize: 12, color: COLORS.autoGreen, fontFamily: fonts }}>{counts.won} won</span>
                <span style={{ fontSize: 12, color: COLORS.danger, fontFamily: fonts }}>{counts.lost} lost</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Source */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontFamily: fonts }}>LEAD SOURCE</div>
          {sourceEntries.map(([source, count]) => (
            <div key={source} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.text, fontFamily: fonts }}>{source}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, fontFamily: fonts }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Loss Reasons */}
        {Object.keys(lossReasons).length > 0 && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontFamily: fonts }}>LOSS REASONS</div>
            {Object.entries(lossReasons).map(([reason, count]) => (
              <div key={reason} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontFamily: fonts }}>{reason}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.danger, fontFamily: fonts }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────
export default function PremierCRM() {
  const [view, setView] = useState("pipeline");
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState("active");

  function handleSelect(id) {
    setSelectedLead(id);
  }

  function handleBack() {
    setSelectedLead(null);
  }

  function handleUpdate(updatedLead) {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  }

  const lead = leads.find(l => l.id === selectedLead);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: fonts,
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
    }}>
      {selectedLead && lead ? (
        <LeadDetail lead={lead} onBack={handleBack} onUpdate={handleUpdate} />
      ) : view === "pipeline" ? (
        <PipelineView leads={leads} onSelect={handleSelect} filter={filter} setFilter={setFilter} />
      ) : view === "quotes" ? (
        <QuotesView leads={leads} onSelect={handleSelect} />
      ) : (
        <DashboardView leads={leads} />
      )}
      {!selectedLead && <NavBar view={view} setView={setView} />}
    </div>
  );
}
