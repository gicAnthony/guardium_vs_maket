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

  const FEATURE_SECTIONS = [
    { title: "Executive Summary", rows: TABLE_ROWS },
    {
      title: "Product Shape",
      rows: [
        {
          label: "Product type",
          guardium: "Full enterprise IAM platform (self-hostable)",
          okta: "Enterprise SaaS IAM / Workforce + Customer Identity",
          ping: "Enterprise IAM suite (SaaS and self-hosted components)",
          descope: "SaaS CIAM with visual flow builder as flagship feature",
          keycloak: "Open-source IAM / SSO server",
        },
        {
          label: "Core focus",
          guardium: "Policy, governance, auth, audit, and risk",
          okta: "SSO, MFA, lifecycle automation, governance, app integrations",
          ping: "Federation, orchestration, policy authorization, hybrid identity",
          descope: "Customer identity user journeys",
          keycloak: "Federation, SSO, identity brokering, realm administration",
        },
        {
          label: "Pricing model",
          guardium: "Owned / on-prem",
          okta: "Subscription by product and user / MAU tier",
          ping: "Enterprise subscription by product and deployment",
          descope: "Per-MAU subscription",
          keycloak: "Free open source; support through operator or Red Hat build",
        },
      ],
    },
    {
      title: "Visual Flow / Workflow Builder",
      rows: [
        {
          label: "Visual editor",
          guardium: "Yes: policies-flow powered by LiteGraph node canvas",
          okta: "Yes for automation via Okta Workflows; not a primary auth journey canvas",
          ping: "Yes via PingOne DaVinci orchestration canvas",
          descope: "Yes: proprietary drag-and-drop canvas",
          keycloak: "Authentication flow editor in admin console; not node-canvas based",
        },
        {
          label: "Node library",
          guardium: "all-nodes.ts policy/workflow node set",
          okta: "Workflow connectors, actions, and OIN app events",
          ping: "DaVinci connectors, functions, identity and risk nodes",
          descope: "Pre-built auth, MFA, risk, screen, connector nodes",
          keycloak: "Built-in authenticators, executions, conditions, and SPIs",
        },
        {
          label: "Conditional branching",
          guardium: "Yes: policy nodes and ABAC decisions",
          okta: "Yes: Workflows conditions plus sign-on/access policies",
          ping: "Yes: orchestration rules and policy decisions",
          descope: "Yes",
          keycloak: "Yes: conditional authentication flows",
        },
        {
          label: "Custom screens / branded UI",
          guardium: "Branding service (branding/)",
          okta: "Hosted sign-in branding and embeddable Sign-In Widget",
          ping: "Hosted templates, DaVinci UI nodes, and branded journeys",
          descope: "Built-in screen designer",
          keycloak: "Themes and templates",
        },
        {
          label: "Debugger",
          guardium: "Yes: workflow-debugger component",
          okta: "Workflow execution history and System Log",
          ping: "DaVinci flow testing and logs",
          descope: "Run/test in console",
          keycloak: "Event logs plus server logs; no full journey debugger",
        },
        {
          label: "Version control",
          guardium: "Code-based Git workflow JSON in repo",
          okta: "API/Terraform/export patterns; console-first for many flows",
          ping: "Promote/export journey config; enterprise change process",
          descope: "JSON export, Git-friendly",
          keycloak: "Realm JSON export/import; GitOps possible by operator",
        },
        {
          label: "Onboarding wizard",
          guardium: "Manual / onboarding module",
          okta: "OIN templates, app wizard, lifecycle setup",
          ping: "Journey templates and guided product setup",
          descope: "Auto-generated starter flows",
          keycloak: "Manual realm/client setup and templates",
        },
      ],
    },
    {
      title: "Authentication Methods",
      rows: [
        {
          label: "Password / OTP",
          guardium: "Yes: authservice and OTP",
          okta: "Yes",
          ping: "Yes",
          descope: "Yes",
          keycloak: "Yes",
        },
        {
          label: "Magic link",
          guardium: "Yes: MagicLinkController",
          okta: "Yes via email authenticator / passwordless flows",
          ping: "Yes via email-based passwordless journeys",
          descope: "Yes",
          keycloak: "Not native; extension or custom authenticator",
        },
        {
          label: "TOTP",
          guardium: "Yes: TotpUtil",
          okta: "Yes",
          ping: "Yes",
          descope: "Yes",
          keycloak: "Yes",
        },
        {
          label: "WebAuthn / Passkeys",
          guardium: "Yes: webauthn/",
          okta: "Yes: FIDO2/WebAuthn and passkeys",
          ping: "Yes: FIDO2/WebAuthn and passkeys",
          descope: "Yes",
          keycloak: "Yes: WebAuthn and passkeys",
        },
        {
          label: "SSO (SAML / OIDC)",
          guardium: "Yes: federationservice, oidc, oauth2",
          okta: "Yes",
          ping: "Yes",
          descope: "Yes",
          keycloak: "Yes",
        },
        {
          label: "Social login",
          guardium: "Via OAuth2 module",
          okta: "Yes: social and external IdP federation",
          ping: "Yes: social and external IdP federation",
          descope: "Yes: built-in connectors",
          keycloak: "Yes: social identity providers",
        },
        {
          label: "One Tap / device-bound",
          guardium: "Limited",
          okta: "Yes: FastPass/device assurance patterns",
          ping: "Yes: PingID/passkey/device signals",
          descope: "Yes",
          keycloak: "Limited; custom flow/provider work",
        },
        {
          label: "Kerberos",
          guardium: "Yes: kerberos/",
          okta: "Yes for desktop SSO/IWA patterns",
          ping: "Yes via PingFederate Kerberos integration",
          descope: "No",
          keycloak: "Yes",
        },
      ],
    },
    {
      title: "Authorization & Policy",
      rows: [
        {
          label: "RBAC",
          guardium: "Yes: rbac and roles",
          okta: "Yes: groups, roles, and admin roles",
          ping: "Yes",
          descope: "Basic roles",
          keycloak: "Yes: realm/client roles and groups",
        },
        {
          label: "ABAC",
          guardium: "Yes: abac decisions + explain",
          okta: "Partial through policies/profile rules; deeper via FGA add-on",
          ping: "Yes via PingAuthorize",
          descope: "Limited",
          keycloak: "Yes through authorization services and policies",
        },
        {
          label: "Policy engine",
          guardium: "Dedicated policyservice",
          okta: "Policy framework plus Okta FGA for relationship authorization",
          ping: "Dedicated PingAuthorize policy engine",
          descope: "Flow-embedded conditions",
          keycloak: "Authorization Services policy engine",
        },
        {
          label: "Delegated admin",
          guardium: "Yes: delegations/",
          okta: "Yes: admin roles and delegated administration",
          ping: "Yes: delegated administration patterns",
          descope: "Limited",
          keycloak: "Yes: fine-grained admin permissions",
        },
        {
          label: "Memberships / orgs / tenants",
          guardium: "Yes: organizations, tenant, memberships",
          okta: "Yes: groups, orgs, tenants depending product",
          ping: "Yes: populations, directories, and organizations",
          descope: "Tenants supported",
          keycloak: "Yes: realms, groups, and organizations",
        },
      ],
    },
    {
      title: "Risk, MFA & Trust",
      rows: [
        {
          label: "Risk engine",
          guardium: "Yes: riskservice, risk-policies, risk-events",
          okta: "Yes: risk engine / behavior detection / identity threat signals",
          ping: "Yes: PingOne Protect and risk signals",
          descope: "Risk-based MFA via connectors",
          keycloak: "No native risk engine; extension/operator owned",
        },
        {
          label: "Step-up MFA",
          guardium: "Yes: mfa/",
          okta: "Yes",
          ping: "Yes",
          descope: "Yes",
          keycloak: "Yes through authentication flows / ACR",
        },
        {
          label: "Bot protection",
          guardium: "Via connectors",
          okta: "Yes through threat/risk integrations and CAPTCHA patterns",
          ping: "Yes through risk/protect integrations",
          descope: "Yes: built in",
          keycloak: "Limited: reCAPTCHA and custom integrations",
        },
        {
          label: "Identity verification",
          guardium: "Custom integration",
          okta: "Yes through vendor integrations",
          ping: "Yes through vendor integrations",
          descope: "Connector marketplace",
          keycloak: "Custom integration",
        },
        {
          label: "Device trust",
          guardium: "Yes: deviceservice and device-keys",
          okta: "Yes: device assurance/FastPass",
          ping: "Yes: device signals and PingID",
          descope: "Limited",
          keycloak: "Custom integration",
        },
      ],
    },
    {
      title: "Secrets, Crypto & Enterprise",
      rows: [
        {
          label: "Secret store / vault",
          guardium: "Yes: vault, vaultservice, secrets",
          okta: "Vendor-managed; no customer vault layer",
          ping: "Vendor-managed SaaS or operator-managed self-hosted secrets",
          descope: "No",
          keycloak: "Config vault support; not a full enterprise secret store",
        },
        {
          label: "Encryption primitives",
          guardium: "Age, PGP, PKCS12, SOPS",
          okta: "Managed by vendor",
          ping: "Managed by vendor/operator",
          descope: "Managed by vendor",
          keycloak: "TLS, realm keys, keystore/vault integrations",
        },
        {
          label: "Credential stores",
          guardium: "Yes: credential-stores",
          okta: "Vendor-managed identity store and directory integrations",
          ping: "PingDirectory / external directories",
          descope: "No",
          keycloak: "User credential store and external federation",
        },
        {
          label: "Host catalogs / boundaries",
          guardium: "Yes: boundaryservice, host-catalogs",
          okta: "Separate privileged access product needed",
          ping: "Separate privileged access / access gateway pattern needed",
          descope: "No",
          keycloak: "No",
        },
        {
          label: "Control fabric",
          guardium: "Yes: controlfabric",
          okta: "Policy and workflow fabric across Okta products",
          ping: "Identity orchestration and policy fabric across Ping products",
          descope: "No",
          keycloak: "No",
        },
      ],
    },
    {
      title: "Audit, Compliance & Provisioning",
      rows: [
        {
          label: "Audit log",
          guardium: "Yes: auditservice + SIEM export",
          okta: "Yes: System Log and reports",
          ping: "Yes: audit/logging and reporting",
          descope: "Yes",
          keycloak: "Yes: events and admin events",
        },
        {
          label: "Compliance export",
          guardium: "Yes: ComplianceExportController",
          okta: "Reports, System Log API, and governance reports",
          ping: "Reports and API/log export",
          descope: "Reports in console",
          keycloak: "Custom export/operator reporting",
        },
        {
          label: "SCIM provisioning",
          guardium: "Yes: scim/",
          okta: "Yes: broad SCIM/OIN catalog",
          ping: "Yes: SCIM and connector provisioning",
          descope: "Yes",
          keycloak: "Extension/operator-owned; not core in most deployments",
        },
        {
          label: "Consents",
          guardium: "Yes: consents/",
          okta: "Limited; app/OAuth consent and add-ons",
          ping: "Available through CIAM/consent integrations",
          descope: "Yes",
          keycloak: "Yes: OAuth client consent",
        },
        {
          label: "Connector framework",
          guardium: "Yes: connectorframework and connectorplugins",
          okta: "Okta Integration Network and Workflows connectors",
          ping: "Connector marketplace and DaVinci connectors",
          descope: "Connector marketplace",
          keycloak: "SPIs, identity providers, federation providers",
        },
      ],
    },
    {
      title: "Developer Experience",
      rows: [
        {
          label: "SDKs",
          guardium: "Backend REST + Angular frontend",
          okta: "Web/mobile SDKs, Sign-In Widget, APIs",
          ping: "SDKs, APIs, adapters, and federation toolkits",
          descope: "Web/mobile SDKs (JS, React, iOS, Android, etc.)",
          keycloak: "Adapters, JS SDK, admin client, community libraries",
        },
        {
          label: "Time-to-first-login",
          guardium: "Days (self-host + config)",
          okta: "Minutes to hours for common SaaS integrations",
          ping: "Hours to days depending hybrid complexity",
          descope: "~15 min vendor claim",
          keycloak: "Hours to days depending deployment and realm setup",
        },
        {
          label: "Customization depth",
          guardium: "Full source access",
          okta: "API/widget/policy customization; product boundaries apply",
          ping: "Deep enterprise customization across suite",
          descope: "Flow-level + theming",
          keycloak: "Full source access plus themes and SPIs",
        },
        {
          label: "i18n",
          guardium: "Yes: i18n/",
          okta: "Yes",
          ping: "Yes",
          descope: "Yes: localization connectors",
          keycloak: "Yes: internationalization and themes",
        },
      ],
    },
    {
      title: "Win / Loss Notes",
      rows: [
        {
          label: "Where Guardium wins",
          guardium: "Breadth: ABAC + policy engine, secrets/vault, Kerberos, control fabric, host/boundary model, self-hostable, audit/SIEM depth.",
          okta: "Guardium wins on bundled PAM/secrets and source control; Okta wins catalog maturity.",
          ping: "Guardium wins on bundled ownership/cost; Ping wins enterprise federation maturity.",
          descope: "Guardium wins on enterprise breadth and control depth.",
          keycloak: "Guardium wins on governance/PAM/privacy/secrets bundled above core OSS IAM.",
        },
        {
          label: "Where the competitor wins",
          guardium: "Guardium loses on vendor SLA, external certs, and ready-made ecosystem breadth.",
          okta: "Largest app ecosystem, mature support, fastest enterprise SaaS rollout.",
          ping: "Deep hybrid federation and mature policy products.",
          descope: "Onboarding speed, polished hosted flow canvas, connector marketplace, mobile/web SDK breadth, zero-ops.",
          keycloak: "Open-source maturity, community adoption, and lower platform lock-in.",
        },
      ],
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

  return { AXES, VENDORS, CATEGORY_DETAIL, TABLE_ROWS, FEATURE_SECTIONS, ROADMAP, BRIEFING, DIAGRAMS };
})();
