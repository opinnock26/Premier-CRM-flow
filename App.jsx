import { useState } from "react";

const STAGES = [
  {
    id: "prospect",
    label: "01 — PROSPECT IDENTIFIED",
    who: "Field Sales Rep",
    system: "FastWeigh",
    action: "Rep creates new customer/prospect in FastWeigh after meeting at jobsite, referral, or cold outreach.",
    automation: "Power Automate detects new customer record via FastWeigh GraphQL API. Auto-creates lead in Power App pipeline. Stage set to 'Identified.' Notification sent to Sales Manager.",
    bestPractice: "Capture company name, contact name, phone, email, project type, and estimated volume. Tag the lead source (jobsite visit, referral, inbound call, web form). Source tracking is critical for knowing what's actually filling the funnel.",
    gap: "TOP-OF-FUNNEL GAP: Before a prospect ever hits FastWeigh, reps are having conversations at jobsites, trade events, and through referrals. Consider a dead-simple mobile shortcut: rep texts a dedicated number or fills a 3-field form (name, company, phone) that creates the FastWeigh customer automatically. Eliminates the 'I'll log it later' problem.",
    color: "#4A7C6F",
    iconPath: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z",
  },
  {
    id: "contacted",
    label: "02 — FIRST CONTACT MADE",
    who: "Field Sales Rep",
    system: "Power App + FastWeigh",
    action: "Rep makes first call, site visit, or sends intro email. Logs a note in Power App with contact outcome and next step.",
    automation: "If rep sends a quote request in FastWeigh, stage auto-updates to 'Contacted.' Otherwise, rep taps one button in the Power App to move stage. 48-hour timer starts: if no follow-up note is logged, rep gets a push notification.",
    bestPractice: "First contact should include a 'discovery' component. What materials do they need? What's the project timeline? Who makes purchasing decisions? Log this in the notes. It saves the account rep a redundant conversation later.",
    gap: "HANDOFF PREP GAP: Most reps skip the qualification step. Build 4 required fields into the Power App that must be filled before moving to the next stage: Project Type, Estimated Volume, Decision Maker, and Timeline. This forces lightweight qualification without slowing anyone down.",
    color: "#3D6B8E",
    iconPath: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    id: "proposal",
    label: "03 — PROPOSAL SENT",
    who: "Field Sales Rep",
    system: "FastWeigh (auto-syncs)",
    action: "Rep builds and sends quote through FastWeigh's quoting module. Customer receives it digitally and can accept, reject, or comment.",
    automation: "Fully automated. FastWeigh API triggers stage change to 'Proposal Sent' the moment the quote is emailed. Power Automate notifies the assigned Account Rep that a proposal is live. Your agency (GHL) receives the contact for drip campaign enrollment.",
    bestPractice: "Include a personalized cover note with every proposal, not just a price sheet. Even one sentence referencing the conversation ('Per our discussion about the St. Luke's expansion...') dramatically increases close rates in relationship-driven industries.",
    gap: "AGENCY HANDOFF GAP: Define a clean trigger for when you receive the contact in GHL. Options: (1) automated export from FastWeigh on quote-sent, (2) VP builds a scheduled report that emails you a CSV of new proposals weekly, or (3) Power Automate sends a webhook to GHL. Option 3 is cleanest but requires GHL API setup.",
    color: "#7B6B3A",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: "followup",
    label: "04 — FOLLOW UP",
    who: "Account Rep (handoff from Field Rep)",
    system: "Power App + GHL (your agency)",
    action: "Account Rep takes ownership. Follows up on proposal status, handles objections, negotiates terms. Your agency runs drip emails in parallel.",
    automation: "Auto-triggered if proposal sits without response for 3-5 business days. Power Automate moves stage and reassigns lead owner from Field Rep to Account Rep. Sends a notification to both reps so the handoff is visible. Drip sequence fires from GHL: email 1 at day 3, email 2 at day 7, email 3 at day 14.",
    bestPractice: "The handoff is the most fragile moment in this process. Build a 'handoff note' requirement: before the Field Rep's lead transfers, they must log a summary note covering relationship context, key concerns, and anything personal they learned. The Account Rep should never call blind.",
    gap: "FOLLOW-UP CADENCE GAP: Define the rules upfront. How many follow-ups before a lead goes cold? Recommendation: 3 rep touches + 3 drip emails over 21 days. If no response after that, auto-move to 'Nurture' (a parking lot stage for quarterly re-engagement). Never let leads just sit in follow-up forever.",
    color: "#8B5E3C",
    iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    id: "won",
    label: "05 — WON",
    who: "Account Rep",
    system: "FastWeigh → Dynamics",
    action: "Customer accepts proposal in FastWeigh. Quote converts to an active order. Customer record flows to Dynamics for invoicing and accounting.",
    automation: "Fully automated. FastWeigh API detects quote acceptance. Power Automate moves stage to 'Won,' logs the close date and value, and triggers a win notification to the Sales Manager and Field Rep. GHL drip stops automatically.",
    bestPractice: "Trigger a 'welcome sequence' for new commercial accounts. A quick call from the Account Rep confirming delivery logistics, a welcome email with their dedicated contacts, and a 30-day check-in reminder. This is where 'Beyond The Rock' becomes real. First impressions after the sale set the tone for the entire relationship.",
    gap: "POST-SALE GAP: The pipeline shouldn't end at 'Won.' Build a simple post-sale check-in cadence: Day 7 (first delivery follow-up), Day 30 (relationship check), Day 90 (upsell/referral ask). This is where your agency could add serious value with automated nurture that turns buyers into repeat commercial accounts.",
    color: "#2E7D4F",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "lost",
    label: "05 — LOST",
    who: "Account Rep",
    system: "FastWeigh → Power App",
    action: "Customer rejects proposal or goes unresponsive past the follow-up cadence.",
    automation: "FastWeigh rejection auto-triggers 'Lost' stage. For unresponsive leads, Power Automate moves to 'Lost' after the defined follow-up window expires. Rep gets prompted to select a loss reason from a dropdown (price, timeline, went with competitor, project cancelled, unresponsive).",
    bestPractice: "Loss reasons are gold. Reviewing them monthly tells you whether you're losing on price, relationships, or timing. If 'went with competitor' is high, that's a positioning problem. If 'unresponsive' is high, that's a follow-up problem. Different problems, different solutions.",
    gap: "WIN-BACK GAP: Lost doesn't mean gone. Move lost leads to a 'Recycle' list. Your agency runs a quarterly re-engagement email ('New pricing available' or 'Expanded delivery area'). Some of the best commercial accounts started as lost deals that came back 6 months later when a competitor dropped the ball.",
    color: "#9B3B3B",
    iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const SYSTEMS = [
  { name: "FastWeigh", desc: "Source of truth for customers, quotes, orders", color: "#4A7C6F" },
  { name: "Power App", desc: "Pipeline view, notes, handoff management", color: "#3D6B8E" },
  { name: "Power Automate", desc: "Glue layer: listens, triggers, notifies", color: "#7B6B3A" },
  { name: "Dynamics 365", desc: "Accounting, invoicing, ERP", color: "#8B5E3C" },
  { name: "GHL (Agency)", desc: "Drip campaigns, nurture sequences", color: "#9B3B3B" },
];

export default function PremierSalesFlow() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeTab, setActiveTab] = useState("action");
  const stage = STAGES[activeStage];

  const tabs = [
    { key: "action", label: "What Happens" },
    { key: "automation", label: "Automation" },
    { key: "bestPractice", label: "Best Practice" },
    { key: "gap", label: "Gap to Address" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1f1f",
      color: "#EDEADE",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: "24px 16px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto 32px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}>
          <div style={{
            width: 36,
            height: 36,
            background: "#323D3E",
            border: "2px solid #4A7C6F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
          }}>PA</div>
          <span style={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#C0C2C9",
          }}>Premier Aggregates</span>
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          margin: "0 0 6px",
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}>Sales CRM Process Flow</h1>
        <p style={{
          fontSize: 14,
          color: "#C0C2C9",
          margin: 0,
          lineHeight: 1.5,
        }}>
          Through the eyes of the sales rep. FastWeigh as the single entry point,
          Power Apps as the pipeline view, automation handling the rest.
        </p>
      </div>

      {/* System Legend */}
      <div style={{ maxWidth: 800, margin: "0 auto 28px" }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#C0C2C9",
          marginBottom: 10,
        }}>Systems Involved</div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}>
          {SYSTEMS.map((s) => (
            <div key={s.name} style={{
              background: s.color + "18",
              border: `1px solid ${s.color}50`,
              padding: "6px 12px",
              fontSize: 12,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}>
              <span style={{ fontWeight: 600, color: "#EDEADE" }}>{s.name}</span>
              <span style={{ color: "#C0C2C9", fontSize: 10 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Selector - Vertical Timeline */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#C0C2C9",
          marginBottom: 14,
        }}>Pipeline Stages</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
          {STAGES.map((s, i) => {
            const isActive = i === activeStage;
            const isPast = i < activeStage;
            const isOutcome = i >= 4;
            return (
              <button
                key={s.id}
                onClick={() => { setActiveStage(i); setActiveTab("action"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: isActive ? s.color + "25" : "transparent",
                  border: isActive ? `1px solid ${s.color}` : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginLeft: isOutcome ? 32 : 0,
                }}
              >
                {/* Stage indicator */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isActive ? s.color : isPast ? s.color + "40" : "#323D3E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#EDEADE" : "#C0C2C9"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.iconPath} />
                  </svg>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#EDEADE" : "#C0C2C9",
                    letterSpacing: 0.5,
                  }}>{s.label}</div>
                  <div style={{
                    fontSize: 11,
                    color: isActive ? s.color : "#666",
                    marginTop: 1,
                  }}>{s.who} · {s.system}</div>
                </div>
                {/* Connector line */}
                {i === 3 && (
                  <div style={{
                    position: "relative",
                    marginLeft: "auto",
                    fontSize: 10,
                    color: "#666",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}>splits ↓</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail Card */}
        <div style={{
          background: "#232928",
          border: `1px solid ${stage.color}60`,
          marginBottom: 32,
        }}>
          {/* Tab Bar */}
          <div style={{
            display: "flex",
            borderBottom: `1px solid ${stage.color}30`,
            overflow: "auto",
          }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "12px 16px",
                  fontSize: 12,
                  fontWeight: activeTab === t.key ? 700 : 400,
                  color: activeTab === t.key ? "#EDEADE" : "#C0C2C9",
                  background: activeTab === t.key ? stage.color + "20" : "transparent",
                  border: "none",
                  borderBottom: activeTab === t.key ? `2px solid ${stage.color}` : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: 0.5,
                }}
              >{t.label}{t.key === "gap" ? " ⚠" : ""}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "20px 18px" }}>
            <div style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: activeTab === "gap" ? "#E8C47C" : "#EDEADE",
            }}>
              {stage[activeTab]}
            </div>
          </div>
        </div>

        {/* Data Flow Summary */}
        <div style={{
          background: "#232928",
          border: "1px solid #323D3E",
          padding: "20px 18px",
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#C0C2C9",
            marginBottom: 14,
          }}>Data Flow Summary</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { from: "Field Rep @ Jobsite", arrow: "creates record in", to: "FastWeigh", note: "Single point of entry" },
              { from: "FastWeigh API", arrow: "triggers", to: "Power Automate", note: "Listens for new customers, quotes, status changes" },
              { from: "Power Automate", arrow: "creates/updates lead in", to: "Power App (CRM)", note: "Pipeline stages, owner assignments, notifications" },
              { from: "Power Automate", arrow: "sends contacts to", to: "GHL (Your Agency)", note: "Webhook or scheduled export for drip campaigns" },
              { from: "FastWeigh", arrow: "posts invoices to", to: "Dynamics 365", note: "Existing integration, no changes needed" },
            ].map((flow, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "10px 12px",
                background: "#1a1f1f",
                border: "1px solid #323D3E",
              }}>
                <div style={{ fontSize: 13, color: "#EDEADE" }}>
                  <span style={{ fontWeight: 600 }}>{flow.from}</span>
                  <span style={{ color: "#4A7C6F", margin: "0 6px" }}> → </span>
                  <span style={{ color: "#C0C2C9" }}>{flow.arrow}</span>
                  <span style={{ color: "#4A7C6F", margin: "0 6px" }}> → </span>
                  <span style={{ fontWeight: 600 }}>{flow.to}</span>
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>{flow.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          background: "#232928",
          border: "1px solid #323D3E",
          padding: "20px 18px",
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#C0C2C9",
            marginBottom: 14,
          }}>Dashboard Metrics to Track</div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
          }}>
            {[
              { metric: "Leads by Stage", why: "Are deals getting stuck somewhere?" },
              { metric: "Time in Stage", why: "How long from proposal to close?" },
              { metric: "Win Rate", why: "What % of proposals convert?" },
              { metric: "Loss Reasons", why: "Why are deals dying?" },
              { metric: "Rep Activity", why: "Who's filling the funnel?" },
              { metric: "Source Performance", why: "Referrals vs. cold outreach vs. web?" },
              { metric: "Proposals / Week", why: "Your existing KPI, now automated" },
              { metric: "Avg Deal Value", why: "Are you going after the right accounts?" },
            ].map((m, i) => (
              <div key={i} style={{
                padding: "10px 12px",
                background: "#1a1f1f",
                border: "1px solid #323D3E",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#EDEADE", marginBottom: 2 }}>{m.metric}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{m.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          padding: "16px 0 32px",
          fontSize: 11,
          color: "#666",
        }}>
          Prepared by On The Rock Marketing for Premier Aggregates · CRM System Architecture
        </div>
      </div>
    </div>
  );
}
