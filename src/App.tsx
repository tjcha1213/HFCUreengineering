import { useState } from 'react'

type RequestType = 'branch' | 'loan' | 'notary'
type NotaryType = 'affidavit' | 'loan' | 'poa'
type FlowTab = 'status' | 'docs' | 'notary' | 'support' | 'overview' | 'verify' | 'session' | 'receipt'

const requests = {
  branch: {
    id: 'HFCU-2048', label: 'In service queue', title: 'Branch visit check-in', eta: '18 min', progress: 58,
    stepTwo: 'Identity confirmed', stepThree: 'Waiting for next specialist', stepFour: 'Service completed',
    nextAction: 'Stay nearby. You will receive a text when the service desk is ready.',
  },
  loan: {
    id: 'HFCU-3316', label: 'Under review', title: 'Personal loan review', eta: '1 day', progress: 72,
    stepTwo: 'Documents matched', stepThree: 'Credit team reviewing', stepFour: 'Decision sent',
    nextAction: 'Upload the latest paystub to prevent a review delay.',
  },
  notary: {
    id: 'HFCU-4407', label: 'Ready to schedule', title: 'Remote notarization', eta: 'Today', progress: 84,
    stepTwo: 'ID verification passed', stepThree: 'Choose notary session', stepFour: 'Stamped document returned',
    nextAction: 'Select a live notary slot and upload the document before the session.',
  },
} satisfies Record<RequestType, {
  id: string; label: string; title: string; eta: string; progress: number;
  stepTwo: string; stepThree: string; stepFour: string; nextAction: string;
}>

const notaryFlows = {
  affidavit: {
    title: 'Affidavit notarization', eligibility: 'Eligible in your state', eta: 'Today', progress: 76,
    upload: 'Affidavit uploaded', session: 'Choose a live notary slot',
    panel: 'Your affidavit is eligible for remote notarization. Bring your government ID and join from a quiet, well-lit place.',
  },
  loan: {
    title: 'Loan document notarization', eligibility: 'HFCU review required', eta: '1 day', progress: 62,
    upload: 'Loan packet uploaded', session: 'Waiting on document review',
    panel: 'The loan packet can be notarized after HFCU confirms the signer, document version, and required witnesses.',
  },
  poa: {
    title: 'Power of attorney', eligibility: 'Witness check needed', eta: '2 days', progress: 48,
    upload: 'POA draft uploaded', session: 'Confirm witness requirements',
    panel: 'Power of attorney requests need extra readiness checks before a remote session can be scheduled.',
  },
} satisfies Record<NotaryType, {
  title: string; eligibility: string; eta: string; progress: number;
  upload: string; session: string; panel: string;
}>

const tabCopy: Record<FlowTab, { title: string; body: string }> = {
  status: { title: 'Next action', body: 'Stay nearby. You will receive a text when the service desk is ready.' },
  docs: { title: 'Documents', body: 'Government ID, member number, and the service form are ready. One optional income document is still missing.' },
  notary: { title: 'Remote notarization', body: 'Eligibility, ID verification, notary scheduling, secure upload, and completion receipt can live in this section.' },
  support: { title: 'Support', body: 'Escalate to live chat, request a callback, or send the member a branch handoff code.' },
  overview: { title: 'Member view', body: 'Your affidavit is eligible for remote notarization. Bring your government ID and join from a quiet, well-lit place.' },
  verify: { title: 'Verify', body: 'ID check, knowledge-based authentication, camera readiness, and signer consent are grouped before the live session.' },
  session: { title: 'Session', body: 'The app shows the selected time, notary join button, waiting room status, and escalation path if the member is late.' },
  receipt: { title: 'Receipt', body: 'After completion, the member can download the notarized file, view audit details, and send a copy to HFCU staff.' },
}

function App() {
  const [requestType, setRequestType] = useState<RequestType>('branch')
  const [requestId, setRequestId] = useState(requests.branch.id)
  const [statusTab, setStatusTab] = useState<FlowTab>('status')
  const [notaryType, setNotaryType] = useState<NotaryType>('affidavit')
  const [notaryTab, setNotaryTab] = useState<FlowTab>('overview')
  const [slot, setSlot] = useState('10:30 AM')
  const [sessionText, setSessionText] = useState(notaryFlows.affidavit.session)
  const [notaryProgress, setNotaryProgress] = useState(notaryFlows.affidavit.progress)
  const [completedChecks, setCompletedChecks] = useState<number[]>([0, 1])
  const request = requests[requestType]
  const flow = notaryFlows[notaryType]

  function chooseRequest(type: RequestType) {
    setRequestType(type)
    setRequestId(requests[type].id)
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
  }

  return (
    <>
      <header className="topbar">
        <div><p className="eyebrow">HFCU Reengineering</p><h1>Member Service App MVP</h1></div>
        <a href="https://github.com/tjcha1213/HFCUreengineering" target="_blank" rel="noreferrer">GitHub repo</a>
      </header>

      <main>
        <section className="intro">
          <div><h2>Prototype Objective</h2><p>Reduce service uncertainty by giving members a clear app-based path for request status, document readiness, remote notarization, and support escalation.</p></div>
          <div className="metric-card"><span>Target outcome</span><strong>Fewer status calls, clearer digital completion</strong></div>
        </section>

        <section className="prototype-grid" aria-label="HFCU MVP prototypes">
          <article className="prototype-block">
            <div className="prototype-copy">
              <span className="label">MVP app</span><h2>Waiting status checker</h2>
              <p>Roomie-inspired mobile pattern for checking request status, expected wait, required action, and service routing.</p>
              <div className="metric-row"><div><strong>31%</strong><span>target call deflection</span></div><div><strong>2.4 min</strong><span>status check cycle</span></div><div><strong>88</strong><span>clarity score</span></div></div>
            </div>
            <div className="phone" role="application" aria-label="HFCU waiting status checker prototype">
              <div className="phone-top"><span>9:41</span><span>HFCU</span></div>
              <div className="app-screen">
                <div className="hero"><span>Member services</span><h3>Waiting status checker</h3><p>Track branch, loan, card, and notarization requests in one place.</p></div>
                <div className="status-search"><label htmlFor="requestId">Request ID</label><div><input id="requestId" type="text" value={requestId} onChange={(event) => setRequestId(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') lookupRequest() }} /><button id="lookup" type="button" onClick={lookupRequest}>Check</button></div></div>
                <div className="chip-grid">
                  {(['branch', 'loan', 'notary'] as const).map((type) => <button key={type} className={`sample-request${requestType === type ? ' is-active' : ''}`} type="button" onClick={() => chooseRequest(type)}>{type === 'branch' ? 'Branch visit' : type === 'loan' ? 'Loan review' : 'Remote notary'}</button>)}
                </div>
                <div className="request-card"><div><span>{request.label}</span><strong>{request.title}</strong></div><b>{request.eta}</b></div>
                <div className="progress"><i style={{ width: `${request.progress}%` }} /></div>
                <div className="timeline"><div className="is-complete"><span /><p>Request received</p></div><div className="is-complete"><span /><p>{request.stepTwo}</p></div><div className="is-current"><span /><p>{request.stepThree}</p></div><div><span /><p>{request.stepFour}</p></div></div>
                <div className="tab-panel is-active"><strong>{tabCopy[statusTab].title}</strong><p>{statusTab === 'status' ? request.nextAction : tabCopy[statusTab].body}</p></div>
              </div>
              <nav className="bottom-nav" aria-label="Status checker sections">
                {(['status', 'docs', 'notary', 'support'] as const).map((tab) => <button key={tab} className={`nav-item${statusTab === tab ? ' is-active' : ''}`} type="button" onClick={() => setStatusTab(tab)}><span>{tab === 'support' ? '?' : tab[0].toUpperCase()}</span>{tab === 'status' ? 'Status' : tab === 'docs' ? 'Docs' : tab === 'notary' ? 'Notary' : 'Support'}</button>)}
              </nav>
            </div>
          </article>

          <article className="prototype-block alternate">
            <div className="prototype-copy"><span className="label">HFCU app module</span><h2>Remote notarization</h2><p>Member-facing notarization path inside the HFCU app: eligibility, verification, scheduling, live session, and receipt.</p><div className="metric-row"><div><strong>64%</strong><span>target digital completion</span></div><div><strong>12 min</strong><span>member prep time</span></div><div><strong>92%</strong><span>ready before session</span></div></div></div>
            <div className="phone notary-phone" role="application" aria-label="HFCU remote notarization prototype">
              <div className="phone-top"><span>9:41</span><span>HFCU Notary</span></div>
              <div className="app-screen">
                <div className="hero notary-hero"><span>Remote notarization</span><h3>Prepare, verify, meet</h3><p>Confirm eligibility, upload the document, and join a secure notary session.</p></div>
                <div className="chip-grid">
                  {(['affidavit', 'loan', 'poa'] as const).map((type) => <button key={type} className={`notary-type${notaryType === type ? ' is-active' : ''}`} type="button" onClick={() => chooseNotary(type)}>{type === 'affidavit' ? 'Affidavit' : type === 'loan' ? 'Loan doc' : 'Power of attorney'}</button>)}
                </div>
                <div className="request-card notary-card"><div><span>{flow.eligibility}</span><strong>{flow.title}</strong></div><b>{flow.eta}</b></div>
                <div className="progress"><i style={{ width: `${notaryProgress}%` }} /></div>
                <div className="checklist">
                  {[
                    { tag: 'ID', text: 'Government ID verified' },
                    { tag: 'UP', text: flow.upload },
                    { tag: 'LIVE', text: sessionText },
                    { tag: 'DONE', text: 'Receive notarized copy' },
                  ].map((check, index) => <button key={check.tag} className={`notary-check${completedChecks.includes(index) ? ' is-complete' : ''}${index === 2 && !completedChecks.includes(index) ? ' is-current' : ''}`} type="button" onClick={() => setCompletedChecks((current) => current.includes(index) ? current : [...current, index])}><span>{check.tag}</span><p>{check.text}</p></button>)}
                </div>
                <div className="chip-grid">{['10:30 AM', '1:15 PM', '4:45 PM'].map((time) => <button key={time} className={`notary-slot${slot === time ? ' is-active' : ''}`} type="button" onClick={() => { setSlot(time); setSessionText(`Session held for ${time}`); setNotaryProgress(88) }}>{time}</button>)}</div>
                <div className="tab-panel is-active"><strong>{tabCopy[notaryTab].title}</strong><p>{notaryTab === 'overview' ? flow.panel : tabCopy[notaryTab].body}</p></div>
              </div>
              <nav className="bottom-nav" aria-label="Notarization sections">
                {(['overview', 'verify', 'session', 'receipt'] as const).map((tab) => <button key={tab} className={`nav-item${notaryTab === tab ? ' is-active' : ''}`} type="button" onClick={() => setNotaryTab(tab)}><span>{tab[0].toUpperCase()}</span>{tab[0].toUpperCase() + tab.slice(1)}</button>)}
              </nav>
            </div>
          </article>
        </section>
      </main>
    </>
  )
}

export default App
