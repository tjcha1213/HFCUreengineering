import { useState } from 'react'
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
  ExternalLink,
} from 'lucide-react'

type RequestType = 'branch' | 'loan' | 'notary'
type NotaryType = 'affidavit' | 'loan' | 'poa'
type StatusTab = 'status' | 'docs' | 'notary' | 'support'
type NotaryTab = 'overview' | 'verify' | 'session' | 'receipt'

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
    actionTab: 'support',
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
    actionTab: 'docs',
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
    actionTab: 'notary',
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
  actionTab: StatusTab
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

const statusNav = [
  { tab: 'status', label: 'Home', icon: Home },
  { tab: 'docs', label: 'Docs', icon: FileText },
  { tab: 'notary', label: 'Notary', icon: Stamp },
  { tab: 'support', label: 'Help', icon: Headphones },
] as const

const notaryNav = [
  { tab: 'overview', label: 'Home', icon: Home },
  { tab: 'verify', label: 'Verify', icon: ShieldCheck },
  { tab: 'session', label: 'Session', icon: Video },
  { tab: 'receipt', label: 'Receipt', icon: ReceiptText },
] as const

function App() {
  const [requestType, setRequestType] = useState<RequestType>('branch')
  const [requestId, setRequestId] = useState(requests.branch.id)
  const [statusTab, setStatusTab] = useState<StatusTab>('status')
  const [notaryType, setNotaryType] = useState<NotaryType>('affidavit')
  const [notaryTab, setNotaryTab] = useState<NotaryTab>('overview')
  const [slot, setSlot] = useState('10:30 AM')
  const [sessionText, setSessionText] = useState(notaryFlows.affidavit.session)
  const [notaryProgress, setNotaryProgress] = useState(notaryFlows.affidavit.progress)
  const [completedChecks, setCompletedChecks] = useState<number[]>([0, 1])
  const [branchReminder, setBranchReminder] = useState(false)
  const request = requests[requestType]
  const flow = notaryFlows[notaryType]

  const statusPanels = {
    status: {
      icon: Bell,
      title: 'Recommended next step',
      body: branchReminder && requestType === 'branch' ? 'Reminder is on. HFCU will text you when the desk is ready.' : request.nextAction,
      action: branchReminder && requestType === 'branch' ? 'View help options' : request.primaryAction,
      target: branchReminder && requestType === 'branch' ? 'support' : request.actionTab,
    },
    docs: {
      icon: FileCheck2,
      title: 'Document readiness',
      body: request.documentNote,
      action: 'Return to home',
      target: 'status',
    },
    notary: {
      icon: Stamp,
      title: 'Remote notary path',
      body: requestType === 'notary' ? request.nextAction : 'Start a remote notary request without calling the branch.',
      action: requestType === 'notary' ? 'Review status' : 'Use notary flow',
      target: 'status',
    },
    support: {
      icon: Headphones,
      title: 'Help options',
      body: `${request.owner} can chat, call back, or create a branch handoff code.`,
      action: 'Return to home',
      target: 'status',
    },
  } satisfies Record<StatusTab, {
    icon: typeof Bell
    title: string
    body: string
    action: string
    target: StatusTab
  }>

  const notaryPanels = {
    overview: {
      icon: ClipboardList,
      title: 'Readiness summary',
      body: flow.panel,
      action: `Reserve ${slot}`,
      target: 'session',
    },
    verify: {
      icon: ShieldCheck,
      title: 'Identity check',
      body: 'Government ID, selfie match, signer consent, and camera readiness are grouped before the live session.',
      action: 'Continue to session',
      target: 'session',
    },
    session: {
      icon: CalendarClock,
      title: 'Selected session',
      body: sessionText,
      action: `Confirm ${slot}`,
      target: 'receipt',
    },
    receipt: {
      icon: ReceiptText,
      title: 'After notarization',
      body: 'Download the notarized file, view audit details, and send a copy to HFCU staff.',
      action: 'Back to home',
      target: 'overview',
    },
  } satisfies Record<NotaryTab, {
    icon: typeof ClipboardList
    title: string
    body: string
    action: string
    target: NotaryTab
  }>

  const activeStatusPanel = statusPanels[statusTab]
  const ActiveStatusIcon = activeStatusPanel.icon
  const activeNotaryPanel = notaryPanels[notaryTab]
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
    setStatusTab('status')
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
    setNotaryTab('overview')
    setCompletedChecks([0, 1])
  }

  function reserveSlot(nextSlot = slot) {
    setSlot(nextSlot)
    setSessionText(`Session confirmed for ${nextSlot}`)
    setNotaryProgress(92)
    setNotaryTab('session')
    setCompletedChecks((current) => current.includes(2) ? current : [...current, 2])
  }

  function runStatusAction() {
    if (statusTab === 'status' && requestType === 'branch' && !branchReminder) {
      setBranchReminder(true)
      return
    }
    if (statusTab === 'notary' && requestType !== 'notary') {
      chooseRequest('notary')
      return
    }
    setStatusTab(activeStatusPanel.target)
  }

  function runNotaryAction() {
    if (notaryTab === 'overview') {
      reserveSlot()
      return
    }
    if (notaryTab === 'session') {
      setSessionText(`Session confirmed for ${slot}`)
      setNotaryProgress(100)
      setNotaryTab('receipt')
      setCompletedChecks([0, 1, 2, 3])
      return
    }
    setNotaryTab(activeNotaryPanel.target)
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand">
          <p className="eyebrow">HFCU Reengineering</p>
          <h1>Member Service App MVP</h1>
        </div>
        <a className="repo-link" href="https://github.com/tjcha1213/HFCUreengineering" target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" size={18} />
          GitHub repo
        </a>
      </header>

      <main>
        <section className="intro">
          <div>
            <h2>One clear path per request</h2>
            <p>The MVP now behaves like a guided service home: members see their current step, the one thing to do next, and the fastest way to get help.</p>
          </div>
          <div className="metric-card">
            <span>MVP focus</span>
            <strong>Less guessing, fewer status calls</strong>
          </div>
        </section>

        <section className="prototype-grid" aria-label="HFCU MVP prototypes">
          <article className="prototype-block">
            <div className="prototype-copy">
              <span className="label">Member app</span>
              <h2>Status checker</h2>
              <p>Members can find a request, understand where it stands, and act on the next useful step without decoding internal queue language.</p>
              <div className="metric-row">
                <div><strong>31%</strong><span>target call deflection</span></div>
                <div><strong>1 tap</strong><span>to next action</span></div>
                <div><strong>4 steps</strong><span>visible journey</span></div>
              </div>
            </div>

            <div className="phone" role="application" aria-label="HFCU waiting status checker prototype">
              <div className="phone-top"><span>9:41</span><span>HFCU</span></div>
              <div className="app-screen">
                <div className="hero">
                  <span>Hi, Maya</span>
                  <h3>{request.title}</h3>
                  <p>{request.label}</p>
                </div>

                <div className="status-search">
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
                </div>

                <div className="section-heading">
                  <span>Recent requests</span>
                </div>
                <div className="chip-grid">
                  {(['branch', 'loan', 'notary'] as const).map((type) => (
                    <button
                      key={type}
                      className={`sample-request${requestType === type ? ' is-active' : ''}`}
                      type="button"
                      onClick={() => chooseRequest(type)}
                    >
                      {type === 'branch' ? <Landmark aria-hidden="true" size={16} /> : type === 'loan' ? <ClipboardList aria-hidden="true" size={16} /> : <Stamp aria-hidden="true" size={16} />}
                      {type === 'branch' ? 'Branch visit' : type === 'loan' ? 'Loan review' : 'Remote notary'}
                    </button>
                  ))}
                </div>

                <div className="request-card">
                  <div>
                    <span>{request.etaLabel}</span>
                    <strong>{request.eta}</strong>
                  </div>
                  <b>Step {request.stepNumber} of 4</b>
                </div>

                <div className="progress" aria-label={`${request.progress}% complete`}><i style={{ width: `${request.progress}%` }} /></div>

                <div className="action-panel">
                  <div className="panel-icon"><ActiveStatusIcon aria-hidden="true" size={18} /></div>
                  <div>
                    <span>{activeStatusPanel.title}</span>
                    <strong>{activeStatusPanel.body}</strong>
                    <p>{statusTab === 'status' ? request.helper : `Request owner: ${request.owner}`}</p>
                  </div>
                  <button className="primary-action" type="button" onClick={runStatusAction}>
                    {activeStatusPanel.action}
                  </button>
                </div>

                <div className="timeline" aria-label="Request progress">
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
              </div>

              <nav className="bottom-nav" aria-label="Status checker sections">
                {statusNav.map(({ tab, label, icon: Icon }) => (
                  <button key={tab} className={`nav-item${statusTab === tab ? ' is-active' : ''}`} type="button" onClick={() => setStatusTab(tab)}>
                    <Icon aria-hidden="true" size={18} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </article>

          <article className="prototype-block alternate">
            <div className="prototype-copy">
              <span className="label">HFCU app module</span>
              <h2>Remote notarization</h2>
              <p>The notary module now shows readiness, session timing, and completion status as one guided path instead of separate task cards.</p>
              <div className="metric-row">
                <div><strong>64%</strong><span>target digital completion</span></div>
                <div><strong>12 min</strong><span>member prep time</span></div>
                <div><strong>1 slot</strong><span>selected clearly</span></div>
              </div>
            </div>

            <div className="phone notary-phone" role="application" aria-label="HFCU remote notarization prototype">
              <div className="phone-top"><span>9:41</span><span>HFCU Notary</span></div>
              <div className="app-screen">
                <div className="hero notary-hero">
                  <span>Remote notarization</span>
                  <h3>{flow.title}</h3>
                  <p>{flow.eligibility}</p>
                </div>

                <div className="section-heading">
                  <span>Document type</span>
                </div>
                <div className="chip-grid">
                  {(['affidavit', 'loan', 'poa'] as const).map((type) => (
                    <button
                      key={type}
                      className={`notary-type${notaryType === type ? ' is-active' : ''}`}
                      type="button"
                      onClick={() => chooseNotary(type)}
                    >
                      <FileText aria-hidden="true" size={16} />
                      {type === 'affidavit' ? 'Affidavit' : type === 'loan' ? 'Loan doc' : 'Power of attorney'}
                    </button>
                  ))}
                </div>

                <div className="request-card notary-card">
                  <div>
                    <span>{flow.etaLabel}</span>
                    <strong>{flow.eta}</strong>
                  </div>
                  <b>{flow.progress}% ready</b>
                </div>

                <div className="progress"><i style={{ width: `${notaryProgress}%` }} /></div>

                <div className="action-panel notary-action">
                  <div className="panel-icon"><ActiveNotaryIcon aria-hidden="true" size={18} /></div>
                  <div>
                    <span>{activeNotaryPanel.title}</span>
                    <strong>{activeNotaryPanel.body}</strong>
                    <p>{flow.readiness}</p>
                  </div>
                  <button className="primary-action" type="button" onClick={runNotaryAction}>
                    {activeNotaryPanel.action}
                  </button>
                </div>

                <div className="checklist">
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
                </div>

                <div className="section-heading slot-heading">
                  <span>Available today</span>
                  <b>{slot}</b>
                </div>
                <div className="chip-grid">
                  {['10:30 AM', '1:15 PM', '4:45 PM'].map((time) => (
                    <button key={time} className={`notary-slot${slot === time ? ' is-active' : ''}`} type="button" onClick={() => reserveSlot(time)}>
                      <CalendarClock aria-hidden="true" size={16} />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <nav className="bottom-nav" aria-label="Notarization sections">
                {notaryNav.map(({ tab, label, icon: Icon }) => (
                  <button key={tab} className={`nav-item${notaryTab === tab ? ' is-active' : ''}`} type="button" onClick={() => setNotaryTab(tab)}>
                    <Icon aria-hidden="true" size={18} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </article>
        </section>
      </main>
    </>
  )
}

export default App
