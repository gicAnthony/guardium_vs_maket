// All copy, scores, and diagram source for the Guardium Vendor Arena.
// Derived from VENDOR-COMPARISON.md; keep this file in sync if that doc changes.
window.VA_CONTENT = (function () {

  const AXES = [
    "Authentication",
    "Authorization depth",
    "Governance & PAM",
    "Provisioning reach",
    "Privacy & secrets",
    "Cost efficiency",
    "Vendor maturity",
  ];

  // 0-5 scale, derived qualitatively from VENDOR-COMPARISON.md sections 2-3.
  const VENDORS = [
    {
      key: "guardium",
      name: "Guardium",
      sub: "gic-iam · self-hosted",
      color: 0xf5a623,
      colorHex: "#F5A623",
      pinned: true,
      scores: [4, 5, 5, 3, 5, 5, 2],
      tagline: "One bundled platform (auth, authz, PAM, and governance) at zero license cost.",
      strength: "Only platform here with native governance, PAM, privacy, and SOPS secrets handling bundled in one codebase, at zero license cost.",
      gap: "No vendor SLA/certs, smaller connector catalog, governance/audit still maturing internally.",
    },
    {
      key: "okta",
      name: "Okta",
      sub: "SaaS · per-MAU",
      color: 0x14406b,
      colorHex: "#14406B",
      scores: [4, 3, 2, 5, 2, 2, 5],
      tagline: "Largest pre-built app ecosystem, fastest time-to-production.",
      strength: "Largest ecosystem, fastest time-to-production.",
      gap: "Governance/PAM are separate paid SKUs; cost scales hard with MAUs.",
    },
    {
      key: "ping",
      name: "Ping Identity",
      sub: "SaaS / on-prem",
      color: 0x5b6b7f,
      colorHex: "#5B6B7F",
      scores: [4, 4, 2, 4, 2, 2, 5],
      tagline: "Deepest policy engine for complex legacy and hybrid federation.",
      strength: "Best for complex legacy/hybrid federation, strong policy engine.",
      gap: "Governance is a separate module; enterprise pricing.",
    },
    {
      key: "descope",
      name: "Descope",
      sub: "SaaS · no-code CIAM",
      color: 0x2e9e6b,
      colorHex: "#2E9E6B",
      scores: [5, 2, 1, 3, 2, 3, 2],
      tagline: "Best-in-class passwordless UX, early MCP-native positioning.",
      strength: "Best passwordless/passkey UX, early MCP-native.",
      gap: "Thin on governance, PAM, and privacy: CIAM-only scope.",
    },
    {
      key: "keycloak",
      name: "Keycloak",
      sub: "Open source",
      color: 0xd6453d,
      colorHex: "#D6453D",
      scores: [3, 4, 1, 3, 1, 5, 3],
      tagline: "Free and fully extensible, with strong identity brokering.",
      strength: "Free, fully extensible, strong brokering.",
      gap: "No native governance, PAM, privacy, or secrets handling; no vendor support.",
    },
  ];

  const CATEGORY_DETAIL = {
    "Authentication": "RS256-signed OIDC/OAuth2 (auth-code + PKCE) verified against JWKS, plus native WebAuthn/passkeys, magic links, and device trust, putting it on par with Descope's passwordless flows without a third-party CIAM layer.",
    "Authorization depth": "RBAC and ABAC both run through a real policy decision point: bindings, rules, and an “explain” endpoint that tells you why a decision was made, with PIM, entitlements, and SoD checks on top.",
    "Governance & PAM": "The Boundary module (bastion-style session control) and the governance workflow engine (access requests, maintenance windows, release verification) are bundled, unlicensed, and core; every competitor sells this separately or skips it.",
    "Provisioning reach": "SCIM plus an Azure AD connector framework, pre-built connectors, people-sync, and change-request tracking. Okta still leads on raw catalog breadth (7000+ integrations).",
    "Privacy & secrets": "Native consent + DSAR module as a system of record, plus SOPS secrets encryption (age and PGP recipients) decrypted transparently in CI/CD: a concern every SaaS competitor hides inside their own control plane instead.",
    "Cost efficiency": "No license cost: engineering cost only. Okta scales aggressively past ~50k MAU; Ping's Customer Identity product starts near R630k/yr; Keycloak is free but unsupported.",
    "Vendor maturity": "Actively migrating internally with no vendor SLA yet, versus mature, SLA-backed ecosystems at Okta and Ping that have run at enterprise scale for over a decade.",
  };

  // Full qualitative comparison, row-for-row from VENDOR-COMPARISON.md
  // section 2. Keyed by vendor.key so the table can render any subset of
  // filtered columns.
  const TABLE_ROWS = [
    {
      label: "Deployment",
      guardium: "Self-hosted, custom-built (Spring Boot + PostgreSQL)",
      okta: "SaaS only",
      ping: "SaaS or on-prem (PingOne / PingFederate)",
      descope: "SaaS (no-code)",
      keycloak: "Self-hosted or managed; open source",
    },
    {
      label: "Pricing",
      guardium: "No license cost: engineering cost only",
      okta: "Per-MAU, scales aggressively past ~50k users",
      ping: "Workforce from ~R55/user/mo; Customer Identity from ~R630k/yr",
      descope: "Usage-based SaaS pricing",
      keycloak: "Free (infra cost only)",
    },
    {
      label: "Core protocols",
      guardium: "OAuth2 auth-code+PKCE, OIDC, RS256/JWKS, SAML, WS-Fed",
      okta: "OIDC, SAML, OAuth2",
      ping: "OIDC, SAML, OAuth2, deep legacy SAML/WS-Fed",
      descope: "OIDC, OAuth2, SAML",
      keycloak: "OIDC, SAML, OAuth2",
    },
    {
      label: "SSO / federation",
      guardium: "Shared GIC_SSO cookie across *.gic.co.za; native identity broker for third-party IdPs",
      okta: "Strong, broadest pre-built app catalog",
      ping: "Strong, best for hybrid/on-prem legacy federation",
      descope: "Strong for customer-facing apps",
      keycloak: "Strong, identity brokering + social login built in",
    },
    {
      label: "MFA / passwordless",
      guardium: "WebAuthn + passkeys + magic links + device trust",
      okta: "FIDO2/passkeys, mature",
      ping: "FIDO2/passkeys, adaptive/risk-based MFA",
      descope: "Best-in-class passkey orchestration (visual flow builder), OTP, magic links",
      keycloak: "FIDO2/WebAuthn supported, less polished UX",
    },
    {
      label: "Authorization model",
      guardium: "RBAC + ABAC with a real PDP (policy bindings, “explain” endpoint), PIM, entitlements, SoD",
      okta: "RBAC, ABAC via Okta Fine-Grained Authorization (add-on)",
      ping: "RBAC + ABAC via PingAuthorize (XACML/JSON policy engine)",
      descope: "RBAC, basic ABAC",
      keycloak: "RBAC + fine-grained authorization (Keycloak Authorization Services)",
    },
    {
      label: "Privileged access / sessions",
      guardium: "“Boundary” module (bastion-style target/session control), native",
      okta: "Not core (separate PAM needed)",
      ping: "Not core (separate PAM needed)",
      descope: "Not core",
      keycloak: "Not core",
    },
    {
      label: "Governance",
      guardium: "Native governance workflows, maintenance windows, access requests, release/bundle verification",
      okta: "Okta Identity Governance (separate product/SKU)",
      ping: "PingOne Governance (separate module)",
      descope: "Minimal: CIAM-focused, not governance-heavy",
      keycloak: "Minimal: no native IGA layer",
    },
    {
      label: "Provisioning / lifecycle",
      guardium: "SCIM + Azure AD connector framework, pre-built connectors, people-sync, change requests",
      okta: "SCIM, huge pre-built connector catalog (7000+)",
      ping: "SCIM, strong enterprise connector set",
      descope: "SCIM provisioning",
      keycloak: "SCIM via extensions, smaller catalog",
    },
    {
      label: "Privacy / consent / DSAR",
      guardium: "Native module (system of record)",
      okta: "Limited: needs add-ons",
      ping: "Limited: needs add-ons",
      descope: "Consent management present",
      keycloak: "Not native",
    },
    {
      label: "Secrets management",
      guardium: "Native SOPS support: both age and PGP recipients",
      okta: "N/A (vendor-managed)",
      ping: "N/A (vendor-managed)",
      descope: "N/A (vendor-managed)",
      keycloak: "Not built in: left to operator",
    },
    {
      label: "Audit & compliance certs",
      guardium: "Own audit module (query side dormant pending Phase 2 fan-out, ADR-002)",
      okta: "SOC2, FedRAMP, ISO 27001, etc.",
      ping: "SOC2, FedRAMP, ISO 27001, etc.",
      descope: "SOC2, growing cert list",
      keycloak: "No vendor certs: operator owns compliance",
    },
    {
      label: "Multi-tenancy",
      guardium: "Native (schema-per-domain + TenantResolver)",
      okta: "Native, mature",
      ping: "Native, mature",
      descope: "Native",
      keycloak: "Supported via realms",
    },
    {
      label: "Extensibility",
      guardium: "Full source control: change anything",
      okta: "Limited to APIs/Workflows/Hooks",
      ping: "Limited to APIs + PingAuthorize policies",
      descope: "Limited to Flows builder + APIs",
      keycloak: "Full source control (open source)",
    },
    {
      label: "Maturity / support",
      guardium: "Actively migrating internally; no vendor SLA",
      okta: "Mature, vendor SLA, largest ecosystem",
      ping: "Mature, vendor SLA, enterprise-proven at scale",
      descope: "Newer (founded 2022), fast-moving, smaller track record",
      keycloak: "Mature, community support only (no SLA unless on Red Hat SSO)",
    },
  ];

  const ROADMAP = [
    {
      title: "FIDO2",
      stage: "NEXT UP",
      icon: "key",
      tagline: "Bank-grade fingerprint and security-key login.",
      detail: "Full FIDO2 server-side support (beyond today's WebAuthn/passkey flows), bringing Guardium to parity with Okta's and Ping's certified FIDO2 implementations.",
    },
    {
      title: "MCP server",
      stage: "THEN",
      icon: "network",
      tagline: "Letting AI assistants check identity and permissions safely.",
      detail: "A Model Context Protocol server exposing Guardium's identity and governance primitives to AI agents and tools natively, ahead of Okta, Ping, and Keycloak, and matching Descope's early MCP-native positioning.",
    },
    {
      title: "Native security agents",
      stage: "LATER",
      icon: "radar",
      tagline: "Guardium watches for risk automatically, instead of only reacting at login.",
      detail: "First-party agents for continuous risk and posture signal collection feeding straight into Guardium's existing ABAC/PDP pipeline, rather than relying on third-party risk-signal integrations the way Okta and Ping do today.",
    },
  ];

  // Plain-language executive summary for the Briefing scene. Mirrors the
  // "Where We Are, Where We're Going" management summary, kept separate
  // from the technical CATEGORY_DETAIL/TABLE_ROWS copy above.
  const BRIEFING = {
    whereWeAre: {
      label: "Where we are today",
      points: [
        { title: "Safe sign-in", body: "Passwords, fingerprint or face login, and magic-link emails, all built in." },
        { title: "Smart permissions", body: "Decides who can access what, and can explain why access was denied." },
        { title: "Direct oversight", body: "Controls access to sensitive systems directly, not just the front door." },
        { title: "A paper trail", body: "Tracks and approves access requests, so there is a record of who asked and who approved." },
      ],
      footer: "Built in-house: no licence fee, just engineering time. The trade-off is no outside certification yet and no vendor help desk to call.",
    },
    whereWeWant: {
      label: "Where we want to be",
      points: [
        { title: "Stronger login", body: "Add full fingerprint and security-key support to match the bank-grade standard Okta and Ping already offer." },
        { title: "AI-ready", body: "Let AI assistants check identity and permissions through Guardium safely, something none of our competitors offer yet." },
        { title: "Smarter security", body: "Watch for risky behaviour automatically, instead of only reacting at login." },
        { title: "A complete paper trail", body: "Finish the audit and reporting side, so we can prove compliance as confidently as the big vendors can today." },
      ],
      footer: "See the full roadmap for timing and detail.",
    },
    whyItMatters: [
      { title: "Cost", body: "No recurring per-user licence fees, which for some vendors can run into the hundreds of thousands of Rand a year as we grow." },
      { title: "Risk", body: "We own any problems that come up, but we also fix them on our own timeline instead of waiting on a vendor." },
      { title: "Control", body: "We can change anything in the system instantly, without being boxed in by what a vendor's product allows." },
    ],
  };

  // Mermaid sources. Kept simple/flowchart-friendly so the post-render
  // "animate-in" pass (see ui/modal.js) can stagger nodes and animate edges.
  const DIAGRAMS = {
    requestFlow: {
      title: "How a request reaches Guardium",
      caption: "Every GIC app routes its access checks through Guardium before doing anything privileged, using the same broker pattern Keycloak and Okta use, with a real policy-decision-point “explain” trail baked in.",
      source: `flowchart LR
  A["Browser"] --> B["App UI"]
  B --> C["App API"]
  C --> D{"Guardium\\nPolicy Decision Point"}
  D -- "allowed" --> E["App API completes request"]
  D -- "denied + explain" --> F["App API returns 403"]
  E --> G["Browser"]
  F --> G`,
    },
    governanceFlow: {
      title: "Governance workflow",
      caption: "Access requests, periodic reviews, and segregation-of-duties checks are native; competitors sell this as a separate governance SKU, or don't ship it at all.",
      source: `flowchart TD
  R["Access request"] --> S{"SoD check"}
  S -- "clear" --> P["Provision access"]
  S -- "conflict" --> X["Blocked + escalated"]
  P --> M["Maintenance window applied"]
  M --> V["Periodic access review"]
  V -- "still needed" --> M
  V -- "revoke" --> E["Access removed"]`,
    },
  };

  return { AXES, VENDORS, CATEGORY_DETAIL, TABLE_ROWS, ROADMAP, BRIEFING, DIAGRAMS };
})();
