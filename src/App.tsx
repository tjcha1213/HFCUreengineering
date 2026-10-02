import { useState, type CSSProperties } from 'react'
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Headphones,
  Home,
  Landmark,
  ReceiptText,
  Search,
  ShieldCheck,
  Stamp,
  UploadCloud,
  Video,
} from 'lucide-react'

type RequestType = 'branch' | 'loan' | 'notary'
type NotaryType = 'affidavit' | 'loan' | 'poa'
type MainTab = 'home' | 'docs' | 'notary' | 'help'
type StatusTarget = 'home' | 'docs' | 'notary' | 'help'
type NotaryStep = 'overview' | 'verify' | 'session' | 'receipt'

const requests = {
  branch: {
    id: 'HFCU-2048',
    label: 'In service queue',
    title: 'Branch visit check-in',
    etaLabel: 'Desk ready in',
    eta: '18 min',
    progress: 58,
    stepNumber: 3,
    nextAction: 'Stay nearby. The service desk is almost ready for you.',
    primaryAction: 'Text me when ready',
    actionTarget: 'help',
    helper: 'Keep your phone nearby and stay in the branch lobby.',
    documentNote: 'Photo ID and member number are ready.',
    owner: 'Member services desk',
    steps: ['Request received', 'Identity confirmed', 'Waiting for specialist', 'Service completed'],
  },
  loan: {
    id: 'HFCU-3316',
    label: 'Under review',
    title: 'Personal loan review',
    etaLabel: 'Review update',
    eta: '1 day',
    progress: 72,
    stepNumber: 3,
    nextAction: 'Upload the latest paystub so review can continue.',
    primaryAction: 'Upload paystub',
    actionTarget: 'docs',
    helper: 'PDF, JPG, and PNG files are accepted.',
    documentNote: 'Government ID and application are matched. Latest paystub is missing.',
    owner: 'Credit review team',
    steps: ['Application received', 'Documents matched', 'Credit team reviewing', 'Decision sent'],
  },
  notary: {
    id: 'HFCU-4407',
    label: 'Ready to schedule',
    title: 'Remote notarization',
    etaLabel: 'Can complete',
    eta: 'Today',
    progress: 84,
    stepNumber: 3,
    nextAction: 'Choose a notary slot and upload the document before the session.',
    primaryAction: 'Schedule notary',
    actionTarget: 'notary',
    helper: 'A government ID, camera, and quiet space are required.',
    documentNote: 'ID verification passed. Document upload is still needed.',
    owner: 'Remote notary team',
    steps: ['Request received', 'ID verified', 'Choose notary session', 'Stamped document returned'],
  },
} satisfies Record<RequestType, {
  id: string
  label: string
  title: string
  etaLabel: string
  eta: string
  progress: number
  stepNumber: number
  nextAction: string
  primaryAction: string
  actionTarget: StatusTarget
  helper: string
  documentNote: string
  owner: string
  steps: string[]
}>

const notaryFlows = {
  affidavit: {
    title: 'Affidavit notarization',
    eligibility: 'Eligible in your state',
    etaLabel: 'Can meet',
    eta: 'Today',
    progress: 76,
    upload: 'Affidavit uploaded',
    session: 'Choose a live notary slot',
    panel: 'Your affidavit is ready for remote notarization. Bring your government ID and join from a quiet, well-lit place.',
    readiness: 'ID verified, document uploaded, slot still needed',
  },
  loan: {
    title: 'Loan document notarization',
    eligibility: 'HFCU review required',
    etaLabel: 'Ready after review',
    eta: '1 day',
    progress: 62,
    upload: 'Loan packet uploaded',
    session: 'Waiting on document review',
    panel: 'HFCU needs to confirm the signer, document version, and witness requirements before the session opens.',
    readiness: 'ID verified, HFCU document review pending',
  },
  poa: {
    title: 'Power of attorney',
    eligibility: 'Witness check needed',
    etaLabel: 'Earliest session',
    eta: '2 days',
    progress: 48,
    upload: 'POA draft uploaded',
    session: 'Confirm witness requirements',
    panel: 'Power of attorney requests include an extra witness check before a remote session can be scheduled.',
    readiness: 'ID verified, witness requirements pending',
  },
} satisfies Record<NotaryType, {
  title: string
  eligibility: string
  etaLabel: string
  eta: string
  progress: number
  upload: string
  session: string
  panel: string
  readiness: string
}>

const bottomNav = [
  { tab: 'home', label: 'Home', icon: Home },
  { tab: 'docs', label: 'Docs', icon: FileText },
  { tab: 'notary', label: 'Notary', icon: Stamp },
  { tab: 'help', label: 'Help', icon: Headphones },
] as const

function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home')
  const [requestType, setRequestType] = useState<RequestType>('branch')
  const [requestId, setRequestId] = useState(requests.branch.id)
  const [notaryType, setNotaryType] = useState<NotaryType>('affidavit')
  const [notaryStep, setNotaryStep] = useState<NotaryStep>('overview')
  const [slot, setSlot] = useState('10:30 AM')
  const [sessionText, setSessionText] = useState(notaryFlows.affidavit.session)
  const [notaryProgress, setNotaryProgress] = useState(notaryFlows.affidavit.progress)
  const [completedChecks, setCompletedChecks] = useState<number[]>([0, 1])
  const [branchReminder, setBranchReminder] = useState(false)

  const request = requests[requestType]
  const flow = notaryFlows[notaryType]
  const timelineProgress = ((request.stepNumber - 1) / (request.steps.length - 1)) * 100

  const recommendedBody = branchReminder && requestType === 'branch'
    ? 'Reminder is on. HFCU will text you when the desk is ready.'
    : request.nextAction
  const recommendedAction = branchReminder && requestType === 'branch'
    ? 'View help options'
    : request.primaryAction
  const recommendedTarget = branchReminder && requestType === 'branch'
    ? 'help'
    : request.actionTarget

  const notaryPanels = {
    overview: {
      icon: ClipboardList,
      title: 'Readiness summary',
      body: flow.panel,
      action: `Reserve ${slot}`,
    },
    verify: {
      icon: ShieldCheck,
      title: 'Identity check',
      body: 'Government ID, selfie match, signer consent, and camera readiness are grouped before the live session.',
      action: 'Continue to session',
    },
    session: {
      icon: CalendarClock,
      title: 'Selected session',
      body: sessionText,
      action: `Confirm ${slot}`,
    },
    receipt: {
      icon: ReceiptText,
      title: 'After notarization',
      body: 'Download the notarized file, view audit details, and send a copy to HFCU staff.',
      action: 'Back to home',
    },
  } satisfies Record<NotaryStep, {
    icon: typeof ClipboardList
    title: string
    body: string
    action: string
  }>

  const activeNotaryPanel = notaryPanels[notaryStep]
  const ActiveNotaryIcon = activeNotaryPanel.icon
  const notaryChecks = [
    { icon: ShieldCheck, title: 'Verify identity', body: 'Government ID verified' },
    { icon: UploadCloud, title: 'Upload document', body: flow.upload },
    { icon: Video, title: 'Meet notary', body: sessionText },
    { icon: ReceiptText, title: 'Get receipt', body: 'Receive notarized copy' },
  ]
  const currentNotaryStep = notaryChecks.findIndex((_, index) => !completedChecks.includes(index))

  function chooseRequest(type: RequestType) {
    setRequestType(type)
    setRequestId(requests[type].id)
    setBranchReminder(false)
  }

  function lookupRequest() {
    const value = requestId.toLowerCase()
    chooseRequest(value.includes('3316') || value.includes('loan') ? 'loan' : value.includes('4407') || value.includes('notary') ? 'notary' : 'branch')
  }

  function chooseNotary(type: NotaryType) {
    setNotaryType(type)
    setSessionText(notaryFlows[type].session)
    setNotaryProgress(notaryFlows[type].progress)
    setSlot('10:30 AM')
    setNotaryStep('overview')
    setCompletedChecks([0, 1])
  }

  function runRecommendedAction() {
    if (requestType === 'branch' && !branchReminder) {
      setBranchReminder(true)
      return
    }
    setActiveTab(recommendedTarget)
  }

  function reserveSlot(nextSlot = slot) {
    setSlot(nextSlot)
    setSessionText(`Session confirmed for ${nextSlot}`)
    setNotaryProgress(92)
    setNotaryStep('session')
    setCompletedChecks((current) => current.includes(2) ? current : [...current, 2])
  }

  function runNotaryAction() {
    if (notaryStep === 'overview') {
      reserveSlot()
      return
    }
    if (notaryStep === 'verify') {
      setNotaryStep('session')
      return
    }
    if (notaryStep === 'session') {
      setSessionText(`Session confirmed for ${slot}`)
      setNotaryProgress(100)
      setNotaryStep('receipt')
      setCompletedChecks([0, 1, 2, 3])
      return
    }
    setNotaryStep('overview')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <p>HFCU Reengineering</p>
          <h1>Cambridge Branch Service Redesign</h1>
        </div>
        <a href="https://github.com/tjcha1213/HFCUreengineering" target="_blank" rel="noreferrer">GitHub repo</a>
      </header>

      <main className="site-main">
        <section className="landing" aria-label="Cambridge branch reengineering overview">
          <div className="landing-copy">
            <span className="page-label">Cambridge branch reengineering</span>
            <h2>Designing a clearer branch-to-digital service system</h2>
            <p>
              The Cambridge HFCU branch needs a redesigned operating flow that reduces member uncertainty,
              separates simple status checks from staff-intensive work, and routes notarization and document
              services into a cleaner digital handoff.
            </p>
            <div className="action-row">
              <a className="site-action primary-site-action" href="#mvp">View phone MVP</a>
              <a className="site-action secondary-site-action" href="#branch-system">See branch system map</a>
            </div>
          </div>

          <div className="landing-insights" aria-label="Why reengineering is needed">
            <div>
              <strong>Queue opacity</strong>
              <span>Members often need staff help just to understand wait status, next step, or missing documents.</span>
            </div>
            <div>
              <strong>Service mixing</strong>
              <span>Routine questions, notarization prep, lending review, and branch visits compete for the same attention.</span>
            </div>
            <div>
              <strong>Digital handoff gap</strong>
              <span>The app can absorb status, readiness, scheduling, and document guidance before a member reaches staff.</span>
            </div>
          </div>
        </section>

        <section className="prototype-objective">
          <div>
            <h2>Prototype Objective</h2>
            <p>Reduce service uncertainty by giving Cambridge branch members a clear app-based path for request status, document readiness, remote notarization, and support escalation.</p>
          </div>
          <div>
            <span>Target outcome</span>
            <strong>Fewer status calls, clearer digital completion</strong>
          </div>
        </section>

        <section id="branch-system" className="branch-system" aria-label="Hypothetical Cambridge branch system map">
          <div className="section-heading">
            <span className="page-label">Hypothetical branch map</span>
            <h2>Cambridge branch as a service system</h2>
            <p>This placeholder map shows how members, staff, documents, and digital check-ins could move through the branch. Actual dimensions and floor plan details can be added later.</p>
          </div>

          <div className="map-layout">
            <div className="branch-map" role="img" aria-label="Hypothetical map rendering of the HFCU Cambridge branch">
              <div className="map-zone entry-zone">
                <strong>Entrance</strong>
                <span>Member arrival and QR check-in</span>
              </div>
              <div className="map-zone waiting-zone">
                <strong>Waiting area</strong>
                <span>Status board and app prompts</span>
              </div>
              <div className="map-zone teller-zone">
                <strong>Teller pods</strong>
                <span>Fast transactions and simple service</span>
              </div>
              <div className="map-zone consult-zone">
                <strong>Consult rooms</strong>
                <span>Loans, escalations, sensitive requests</span>
              </div>
              <div className="map-zone notary-zone">
                <strong>Notary desk</strong>
                <span>Document check, witness, remote session support</span>
              </div>
              <div className="map-zone staff-zone">
                <strong>Back office</strong>
                <span>Verification, approvals, callbacks</span>
              </div>
              <svg className="map-arrows" viewBox="0 0 1000 520" aria-hidden="true">
                <defs>
                  <marker id="mapArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                    <path d="M0 0 L10 5 L0 10z" />
                  </marker>
                </defs>
                <path d="M120 440 C170 350 220 290 300 250" markerEnd="url(#mapArrow)" />
                <path d="M380 220 C470 190 560 190 650 220" markerEnd="url(#mapArrow)" />
                <path d="M384 280 C520 345 645 350 780 310" markerEnd="url(#mapArrow)" />
                <path d="M810 250 C765 175 720 130 660 90" markerEnd="url(#mapArrow)" />
                <path d="M510 95 C420 125 350 160 300 220" markerEnd="url(#mapArrow)" />
              </svg>
            </div>

            <div className="system-notes">
              <div>
                <strong>System goal</strong>
                <p>Route status checks and readiness questions into the app before the member reaches staff.</p>
              </div>
              <div>
                <strong>Branch bottleneck</strong>
                <p>Specialist capacity is consumed when members arrive without clear queue, document, or appointment status.</p>
              </div>
              <div>
                <strong>Reengineering move</strong>
                <p>Use digital check-in, status visibility, and notarization prep to split low-complexity work from staff-intensive service.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="mvp" className="mvp-stage" aria-label="HFCU phone MVP">
          <div className="section-heading">
            <span className="page-label">Phone screen MVP</span>
            <h2>Member-facing app prototype</h2>
            <p>The phone screen shows the proposed app layer for status checking, document readiness, remote notarization, and support routing.</p>
          </div>
          <div className="app-shell">
            <div className="phone-container" role="application" aria-label="HFCU member service app MVP">
        <main className="screen">
          {activeTab === 'home' && (
            <section className="scroll-area">
              <div className="app-header">
                <p>HFCU</p>
                <span>9:41</span>
              </div>

              <section className="hero-card">
                <span>Hi, Maya</span>
                <h1>{request.title}</h1>
                <p>{request.label}</p>
              </section>

              <section className="status-search">
                <label htmlFor="requestId">Find a request</label>
                <div>
                  <input
                    id="requestId"
                    type="text"
                    value={requestId}
                    onChange={(event) => setRequestId(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Enter') lookupRequest() }}
                  />
                  <button id="lookup" type="button" onClick={lookupRequest} aria-label="Check request">
                    <Search aria-hidden="true" size={18} />
                    Check
                  </button>
                </div>
              </section>

              <div className="section-label">Recent requests</div>
              <section className="chip-grid">
                {(['branch', 'loan', 'notary'] as const).map((type) => (
                  <button
                    key={type}
                    className={`chip${requestType === type ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => chooseRequest(type)}
                  >
                    {type === 'branch' ? <Landmark aria-hidden="true" size={16} /> : type === 'loan' ? <ClipboardList aria-hidden="true" size={16} /> : <Stamp aria-hidden="true" size={16} />}
                    {type === 'branch' ? 'Branch visit' : type === 'loan' ? 'Loan review' : 'Remote notary'}
                  </button>
                ))}
              </section>

              <section className="status-summary">
                <div className="time-panel">
                  <span>{request.etaLabel}</span>
                  <strong>{request.eta}</strong>
                  <small>{request.label}</small>
                </div>
                <div className="step-panel" aria-label={`Step ${request.stepNumber} of ${request.steps.length}`}>
                  <span>Current step</span>
                  <strong>{request.stepNumber}</strong>
                  <small>of {request.steps.length}</small>
                </div>
              </section>

              <section
                className="timeline"
                aria-label="Request progress timeline"
                style={{ '--timeline-progress': `${timelineProgress}%` } as CSSProperties}
              >
                <div className="timeline-heading">
                  <span>Task timeline</span>
                  <b>{request.progress}% complete</b>
                </div>
                <div className="timeline-axis" aria-hidden="true">
                  <i />
                </div>
                <div className="timeline-steps">
                {request.steps.map((step, index) => {
                  const isComplete = index + 1 < request.stepNumber
                  const isCurrent = index + 1 === request.stepNumber
                  return (
                    <div key={step} className={`${isComplete ? 'is-complete' : ''}${isCurrent ? ' is-current' : ''}`}>
                      <span>{isComplete ? <CheckCircle2 aria-hidden="true" size={14} /> : index + 1}</span>
                      <p><strong>{step}</strong><small>{isCurrent ? 'Now' : isComplete ? 'Done' : 'Next'}</small></p>
                    </div>
                  )
                })}
                </div>
              </section>

              <section className="action-card">
                <div className="panel-icon"><Bell aria-hidden="true" size={18} /></div>
                <div>
                  <span>Recommended next step</span>
                  <strong>{recommendedBody}</strong>
                  <p>{request.helper}</p>
                </div>
                <button className="primary-action" type="button" onClick={runRecommendedAction}>
                  {recommendedAction}
                </button>
              </section>
            </section>
          )}

          {activeTab === 'docs' && (
            <section className="scroll-area">
              <div className="screen-title">
                <p>Documents</p>
                <h1>Ready items and missing steps</h1>
              </div>
              <section className="action-card">
                <div className="panel-icon blue"><FileCheck2 aria-hidden="true" size={18} /></div>
                <div>
                  <span>{request.title}</span>
                  <strong>{request.documentNote}</strong>
                  <p>{request.helper}</p>
                </div>
                <button className="primary-action" type="button" onClick={() => setActiveTab('home')}>Back to status</button>
              </section>
              <section className="document-list">
                {[
                  ['Government ID', 'Ready'],
                  ['Member number', 'Ready'],
                  [requestType === 'loan' ? 'Latest paystub' : 'Service form', requestType === 'loan' ? 'Needed' : 'Ready'],
                  [requestType === 'notary' ? 'Notary document' : 'Optional income document', requestType === 'notary' ? 'Needed' : 'Optional'],
                ].map(([name, state]) => (
                  <div key={name} className={state === 'Needed' ? 'needs-attention' : ''}>
                    <FileText aria-hidden="true" size={18} />
                    <p><strong>{name}</strong><small>{state}</small></p>
                  </div>
                ))}
              </section>
            </section>
          )}

          {activeTab === 'notary' && (
            <section className="scroll-area notary-screen">
              <section className="hero-card notary-hero">
                <span>Remote notarization</span>
                <h1>{flow.title}</h1>
                <p>{flow.eligibility}</p>
              </section>

              <div className="section-label">Document type</div>
              <section className="chip-grid">
                {(['affidavit', 'loan', 'poa'] as const).map((type) => (
                  <button
                    key={type}
                    className={`chip${notaryType === type ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => chooseNotary(type)}
                  >
                    <FileText aria-hidden="true" size={16} />
                    {type === 'affidavit' ? 'Affidavit' : type === 'loan' ? 'Loan doc' : 'Power of attorney'}
                  </button>
                ))}
              </section>

              <section className="request-card">
                <div>
                  <span>{flow.etaLabel}</span>
                  <strong>{flow.eta}</strong>
                </div>
                <b>{notaryProgress}% ready</b>
              </section>

              <div className="progress blue-progress"><i style={{ width: `${notaryProgress}%` }} /></div>

              <section className="action-card notary-action">
                <div className="panel-icon blue"><ActiveNotaryIcon aria-hidden="true" size={18} /></div>
                <div>
                  <span>{activeNotaryPanel.title}</span>
                  <strong>{activeNotaryPanel.body}</strong>
                  <p>{flow.readiness}</p>
                </div>
                <button className="primary-action blue-action" type="button" onClick={runNotaryAction}>
                  {activeNotaryPanel.action}
                </button>
              </section>

              <section className="checklist">
                {notaryChecks.map((check, index) => {
                  const CheckIcon = check.icon
                  const isComplete = completedChecks.includes(index)
                  const isCurrent = currentNotaryStep === index
                  return (
                    <button
                      key={check.title}
                      className={`notary-check${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
                      type="button"
                      aria-pressed={isComplete}
                      onClick={() => setCompletedChecks((current) => current.includes(index) ? current : [...current, index])}
                    >
                      <span>{isComplete ? <CheckCircle2 aria-hidden="true" size={18} /> : <CheckIcon aria-hidden="true" size={18} />}</span>
                      <p><strong>{check.title}</strong><small>{check.body}</small></p>
                    </button>
                  )
                })}
              </section>

              <div className="section-label with-value"><span>Available today</span><b>{slot}</b></div>
              <section className="chip-grid">
                {['10:30 AM', '1:15 PM', '4:45 PM'].map((time) => (
                  <button key={time} className={`chip${slot === time ? ' is-active' : ''}`} type="button" onClick={() => reserveSlot(time)}>
                    <CalendarClock aria-hidden="true" size={16} />
                    {time}
                  </button>
                ))}
              </section>
            </section>
          )}

          {activeTab === 'help' && (
            <section className="scroll-area">
              <div className="screen-title">
                <p>Support</p>
                <h1>Get help without starting over</h1>
              </div>
              <section className="support-card">
                <Headphones aria-hidden="true" size={22} />
                <div>
                  <strong>Chat with {request.owner}</strong>
                  <p>Share your request ID and continue from the current step.</p>
                </div>
              </section>
              <section className="support-card">
                <Bell aria-hidden="true" size={22} />
                <div>
                  <strong>Request a callback</strong>
                  <p>HFCU can call when a specialist is available.</p>
                </div>
              </section>
              <section className="support-card">
                <ShieldCheck aria-hidden="true" size={22} />
                <div>
                  <strong>Branch handoff code</strong>
                  <p>Use {request.id} at the desk so staff can find the request instantly.</p>
                </div>
              </section>
            </section>
          )}
        </main>

        <nav className="bottom-nav" aria-label="HFCU app sections">
          {bottomNav.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              className={`bottom-nav-item${activeTab === tab ? ' active' : ''}`}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              <Icon aria-hidden="true" size={22} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
          </div>
          </div>
        </section>
      </main>
      </div>
  )
}

export default App
