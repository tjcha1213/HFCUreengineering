import { useEffect, useState, type CSSProperties } from 'react'
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
  Play,
  PlayCircle,
  Video,
} from 'lucide-react'

type RequestType = 'branch' | 'loan' | 'notary'
type NotaryType = 'affidavit' | 'loan' | 'poa'
type MainTab = 'home' | 'docs' | 'notary' | 'help'
type StatusTarget = 'home' | 'docs' | 'notary' | 'help'
type NotaryStep = 'overview' | 'verify' | 'session' | 'receipt'
type SitePage = 'strategy' | 'mvp' | 'architecture' | 'appendix' | 'methodology'
type ArchitectureRecommendationId = 'lounge' | 'surround' | 'atm' | 'queue'

type AppendixVideo = {
  title: string
  fileName: string
  videoPath: string
  thumbnail: string
  focus: string
}

type ArchitectureRecommendation = {
  id: ArchitectureRecommendationId
  title: string
  body: string
  overlays: {
    label: string
    className: string
    style: CSSProperties
  }[]
}

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

const assetBase = import.meta.env.BASE_URL

const appendixVideos: AppendixVideo[] = [
  {
    title: 'Appendix A.1',
    fileName: '1.mp4',
    videoPath: `${assetBase}appendix-videos/1.mp4`,
    thumbnail: `${assetBase}appendix-thumbnails/1.mp4.png`,
    focus: 'Branch lobby and queue flow observation',
  },
  {
    title: 'Appendix A.2',
    fileName: '2.mp4',
    videoPath: `${assetBase}appendix-videos/2.mp4`,
    thumbnail: `${assetBase}appendix-thumbnails/2.mp4.png`,
    focus: 'Member arrivals and visible wait behavior',
  },
  {
    title: 'Appendix A.3',
    fileName: '3.mp4',
    videoPath: `${assetBase}appendix-videos/3.mp4`,
    thumbnail: `${assetBase}appendix-thumbnails/3.mp4.png`,
    focus: 'Service desk demand and handoff patterns',
  },
  {
    title: 'Appendix A.4',
    fileName: '4.mp4',
    videoPath: `${assetBase}appendix-videos/4.mp4`,
    thumbnail: `${assetBase}appendix-thumbnails/4.mp4.png`,
    focus: 'Queue visibility and waiting-area movement',
  },
  {
    title: 'Appendix A.5',
    fileName: '5.mp4',
    videoPath: `${assetBase}appendix-videos/5.mp4`,
    thumbnail: `${assetBase}appendix-thumbnails/5.mp4.png`,
    focus: 'Customer experience evidence sample',
  },
]

const architectureRecommendations: ArchitectureRecommendation[] = [
  {
    id: 'lounge',
    title: 'Recenter the lounge',
    body: 'Move the waiting area closer to the service core so customers are visible to tellers and office staff, and staff are more visible to waiting customers.',
    overlays: [
      {
        label: 'Proposed visible lounge core',
        className: 'lounge-overlay',
        style: { left: '36%', top: '40%', width: '25%', height: '19%' },
      },
      {
        label: 'Current waiting area feels isolated',
        className: 'current-overlay',
        style: { left: '7%', top: '61%', width: '28%', height: '18%' },
      },
    ],
  },
  {
    id: 'surround',
    title: 'Surround waiting with service points',
    body: 'Arrange teller stands and offices around the lounge rather than leaving the lounge isolated by the street-facing windows.',
    overlays: [
      {
        label: 'Teller visibility edge',
        className: 'service-overlay',
        style: { left: '35%', top: '25%', width: '34%', height: '18%' },
      },
      {
        label: 'Office visibility edge',
        className: 'service-overlay',
        style: { left: '12%', top: '18%', width: '18%', height: '35%' },
      },
      {
        label: 'Office visibility edge',
        className: 'service-overlay',
        style: { left: '72%', top: '18%', width: '18%', height: '37%' },
      },
      {
        label: '',
        className: 'visibility-arrow arrow-from-left',
        style: { left: '33%', top: '51%', width: '11%', height: '5%' },
      },
      {
        label: '',
        className: 'visibility-arrow arrow-from-right',
        style: { left: '56%', top: '51%', width: '11%', height: '5%' },
      },
      {
        label: '',
        className: 'visibility-arrow arrow-from-top',
        style: { left: '48%', top: '36%', width: '6%', height: '11%' },
      },
    ],
  },
  {
    id: 'atm',
    title: 'Separate ATM flow from entry',
    body: 'The ATM can create a line that acts as a barrier to entry and exit. Separating the ATM from the entrance preserves a clearer arrival path.',
    overlays: [
      {
        label: 'ATM queue pressure',
        className: 'atm-overlay',
        style: { left: '51%', top: '61%', width: '12%', height: '18%' },
      },
      {
        label: 'Keep entry and exit clear',
        className: 'entry-overlay',
        style: { left: '44%', top: '78%', width: '16%', height: '12%' },
      },
    ],
  },
  {
    id: 'queue',
    title: 'Visible queue board',
    body: 'Pair the recentered lounge with an anonymized queue board so waiting members can see expected wait, status, and next service step.',
    overlays: [
      {
        label: 'Queue status board',
        className: 'queue-overlay',
        style: { left: '41%', top: '34%', width: '28%', height: '13%' },
      },
      {
        label: 'Sightline to waiting area',
        className: 'sightline-overlay',
        style: { left: '32%', top: '43%', width: '38%', height: '25%' },
      },
    ],
  },
]

function getSitePage(): SitePage {
  const hash = window.location.hash.replace(/^#\/?/, '')

  if (hash === 'mvp') return 'mvp'
  if (hash === 'branch-architecture') return 'architecture'
  if (hash === 'video-appendix') return 'appendix'
  if (hash === 'traffic-methodology') return 'methodology'
  return 'strategy'
}

function App() {
  const [sitePage, setSitePage] = useState<SitePage>(getSitePage)
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
  const [activeArchitecture, setActiveArchitecture] = useState<ArchitectureRecommendationId | null>(null)
  const [showLoungeModal, setShowLoungeModal] = useState(false)

  useEffect(() => {
    const syncPage = () => setSitePage(getSitePage())

    syncPage()
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  const request = requests[requestType]
  const flow = notaryFlows[notaryType]
  const activeArchitectureRecommendation = architectureRecommendations.find((item) => item.id === activeArchitecture)
  const atmQueueVideoPath = `${assetBase}architecture/atm-queue-pressure.mp4`
  const atmQueueThumbPath = `${assetBase}architecture/atm-queue-thumb.jpg`
  const competitorWaitingAreaPath = `${assetBase}architecture/csb-waiting-area.png`
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
        <nav className="site-nav" aria-label="Project pages">
          <a className={sitePage === 'strategy' ? 'is-active' : ''} href="#/">Recommendations</a>
          <a className={sitePage === 'mvp' ? 'is-active' : ''} href="#/mvp">MVP</a>
          <a className={sitePage === 'architecture' ? 'is-active' : ''} href="#/branch-architecture">Branch architecture</a>
          <a className={sitePage === 'appendix' ? 'is-active' : ''} href="#/video-appendix">Video appendix</a>
          <a className={sitePage === 'methodology' ? 'is-active' : ''} href="#/traffic-methodology">Methodology</a>
          <a href="https://github.com/tjcha1213/HFCUreengineering" target="_blank" rel="noreferrer">GitHub repo</a>
        </nav>
      </header>

      <main className="site-main">
        {sitePage === 'strategy' && (
          <>
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
              <a className="site-action primary-site-action" href="#/mvp">View MVP</a>
              <a className="site-action secondary-site-action" href="#/branch-architecture">See branch architecture</a>
              <a className="site-action secondary-site-action" href="#/video-appendix">Open video appendix</a>
              <a className="site-action secondary-site-action" href="#/traffic-methodology">View methodology</a>
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
        <section className="recommendations" aria-label="Analytical reasoning and recommendations">
          <div className="section-heading">
            <span className="page-label">Analytical reasoning</span>
            <h2>Pain point resolutions</h2>
            <p>The reengineering proposal separates avoidable uncertainty from work that genuinely needs staff attention.</p>
          </div>
          <div className="recommendation-grid">
            <article>
              <strong>1. Make queue status self-service</strong>
              <p>Members should be able to see wait stage, ETA, and next action without asking branch staff. This reduces front-desk interruption and lowers perceived wait time.</p>
            </article>
            <article>
              <strong>2. Move document readiness before arrival</strong>
              <p>Missing documents should surface before the member reaches a specialist. The app should show exactly what is missing and whether a visit can proceed.</p>
            </article>
            <article>
              <strong>3. Split simple service from specialist work</strong>
              <p>Fast teller transactions, loan review, notarization, and escalations should have separate routing so members do not wait in one ambiguous queue.</p>
            </article>
            <article>
              <strong>4. Add remote notarization as a guided workflow</strong>
              <p>Identity verification, document upload, appointment selection, and receipt delivery can be handled as a structured digital sequence.</p>
            </article>
            <article>
              <strong>5. Use the branch as a visibility system</strong>
              <p>Interior cues, queue displays, and desk zoning should help members understand where to go and why they are waiting.</p>
            </article>
            <article>
              <strong>6. Preserve human support for exceptions</strong>
              <p>The app should not replace staff. It should reduce repetitive clarification so staff can focus on complex cases and relationship-building.</p>
            </article>
          </div>
        </section>
          </>
        )}

        {sitePage === 'appendix' && (
        <section className="video-appendix" aria-label="Research video appendix">
          <div className="section-heading">
            <span className="page-label">Research appendix</span>
            <h2>Video recordings for branch observation evidence</h2>
            <p>Appendix A stores web-playable observation recordings as evidence for the queueing, visibility, and customer experience recommendations.</p>
            <a className="section-inline-link" href="#/traffic-methodology">View customer arrival methodology</a>
          </div>

          <section className="appendix-video-grid" aria-label="Appendix video files">
            {appendixVideos.map((video) => (
              <article className="appendix-video-card" key={video.fileName}>
                <a className="video-thumbnail" href={video.videoPath} target="_blank" rel="noreferrer" aria-label={`Play ${video.title}`}>
                  <img src={video.thumbnail} alt="" loading="lazy" />
                  <span><PlayCircle aria-hidden="true" size={28} /></span>
                </a>
                <div>
                  <span>{video.title}</span>
                  <h3>{video.fileName}</h3>
                  <p>{video.focus}</p>
                </div>
                <a className="video-play-action" href={video.videoPath} target="_blank" rel="noreferrer">
                  <PlayCircle aria-hidden="true" size={18} />
                  Play recording
                </a>
              </article>
            ))}
          </section>
        </section>
        )}

        {sitePage === 'methodology' && (
        <section className="traffic-methodology" aria-label="Customer arrival rate and daily traffic estimation methodology">
          <div className="section-heading">
            <span className="page-label">Research methodology</span>
            <h2>Customer Arrival Rate and Daily Traffic Estimation</h2>
            <p>Customer traffic at Harvard Federal Credit Union's Harvard Square branch was estimated using five weekday video observations. The recordings support a preliminary arrival-rate estimate for branch reengineering decisions.</p>
          </div>

          <div className="methodology-summary">
            <article>
              <strong>Observation window</strong>
              <p>Five recordings were reviewed from Monday through Friday. Each lasted approximately 20-25 minutes.</p>
            </article>
            <article>
              <strong>Counting rule</strong>
              <p>Customer entrances and exits were manually counted from the recordings. Pedestrians passing by the branch were excluded.</p>
            </article>
            <article>
              <strong>Arrival-rate calculation</strong>
              <p>The arrival rate (&lambda;) was calculated by dividing the number of entrances by the recording duration in hours.</p>
            </article>
          </div>

          <div className="methodology-table-wrap">
            <table className="methodology-table">
              <caption>Observational results</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Approx. time</th>
                  <th scope="col">Duration</th>
                  <th scope="col">IN</th>
                  <th scope="col">OUT</th>
                  <th scope="col">&lambda; arrivals/hr</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Monday</th>
                  <td>2:00-2:25 PM</td>
                  <td>24:33</td>
                  <td>12</td>
                  <td>9</td>
                  <td>29.3</td>
                </tr>
                <tr>
                  <th scope="row">Tuesday</th>
                  <td>2:30-2:50 PM</td>
                  <td>19:42</td>
                  <td>7</td>
                  <td>6</td>
                  <td>21.3</td>
                </tr>
                <tr>
                  <th scope="row">Wednesday</th>
                  <td>3:00-3:20 PM</td>
                  <td>19:04</td>
                  <td>4</td>
                  <td>6</td>
                  <td>12.6</td>
                </tr>
                <tr>
                  <th scope="row">Thursday</th>
                  <td>3:30-3:50 PM</td>
                  <td>19:54</td>
                  <td>1</td>
                  <td>5</td>
                  <td>3.0</td>
                </tr>
                <tr>
                  <th scope="row">Friday</th>
                  <td>12:10-12:30 PM</td>
                  <td>21:07</td>
                  <td>15</td>
                  <td>14</td>
                  <td>42.6</td>
                </tr>
                <tr className="table-total">
                  <th scope="row">Total</th>
                  <td>Five weekdays</td>
                  <td>104:20</td>
                  <td>39</td>
                  <td>40</td>
                  <td>22.4</td>
                </tr>
              </tbody>
            </table>
            <p className="table-note">Note: Monday-Thursday observation times are approximate assigned windows, not verified recording timestamps. Friday's observation time was reported directly. Arrival rates use the actual recording durations.</p>
          </div>

          <div className="calculation-grid">
            <article>
              <span>Pooled arrival rate</span>
              <strong>&lambda;-hat = 39 / (104.33 / 60) = 22.4 arrivals/hour</strong>
            </article>
            <article>
              <span>Estimated weekday traffic</span>
              <strong>N-day = 22.4 x 8 = approximately 180 arrivals/day</strong>
            </article>
          </div>

          <div className="methodology-columns">
            <section aria-label="Key findings">
              <h3>Key findings</h3>
              <ul>
                <li>Pooled arrival rate: 22.4 customers/hour, or approximately one arrival every 2.7 minutes.</li>
                <li>Monday-Thursday afternoon arrival rate: approximately 17.3 customers/hour.</li>
                <li>Friday lunchtime arrival rate: 42.6 customers/hour, approximately 2.5 times the observed afternoon rate.</li>
                <li>Estimated average weekday traffic: approximately 180 branch entrances per day.</li>
              </ul>
            </section>

            <section aria-label="Limitations">
              <h3>Limitations</h3>
              <p>The daily traffic figure is a preliminary extrapolation from five short, nonrandom observation periods rather than a directly measured daily average. Morning hours were not sampled, and Friday's lunchtime observation is not directly comparable with the Monday-Thursday afternoon observations. Consequently, differences in arrival rates may reflect time-of-day effects rather than weekday effects. The counts represent branch entrances, not unique customers or arrivals to individual service queues.</p>
            </section>
          </div>

          <div className="methodology-links">
            <a className="site-action primary-site-action" href="#/video-appendix">Open supporting videos</a>
            <a className="site-action secondary-site-action" href="#/">Back to recommendations</a>
          </div>
        </section>
        )}

        {sitePage === 'architecture' && (
        <section id="branch-system" className="branch-system" aria-label="Hypothetical Cambridge branch system map">
          <div className="section-heading">
            <span className="page-label">Branch architecture recommendation</span>
            <h2>Interior changes for queue visibility and customer experience</h2>
            <p>This page separates the physical branch recommendations from the MVP. The goal is to make queues, service zones, and staff handoffs more visible to members as soon as they enter.</p>
          </div>

          <div className="map-layout">
            <figure className="branch-floor-plan">
              <div className="floor-plan-stage">
                <img
                  src={`${assetBase}architecture/hfcu-floor-plan.png`}
                  alt="Conceptual customer-facing first-floor plan for the Harvard Federal Credit Union Harvard Square branch"
                />
                <div className="floor-plan-overlays" aria-live="polite">
                  {activeArchitectureRecommendation?.overlays.map((overlay, index) => (
                    <span
                      key={`${activeArchitectureRecommendation.id}-${overlay.label}-${overlay.className}-${index}`}
                      className={`floor-plan-overlay ${overlay.className}`}
                      style={overlay.style}
                    >
                      {overlay.className.includes('visibility-arrow') ? (
                        <svg className="visibility-arrow-svg" viewBox="0 0 120 44" aria-hidden="true">
                          <path d="M4 16H76V6L116 22L76 38V28H4Z" />
                        </svg>
                      ) : overlay.label}
                    </span>
                  ))}
                </div>
              </div>
              <figcaption>Conceptual customer-facing first floor plan for 104 Mount Auburn Street.</figcaption>
            </figure>

            <div className="system-notes">
              <div>
                <strong>System goal</strong>
                <p>Route status checks and readiness questions into the app before the member reaches staff.</p>
              </div>
              <div>
                <strong>Branch bottleneck</strong>
                <p>The current lounge is pushed toward the street-facing edge, which weakens mutual visibility between waiting members, tellers, and office staff.</p>
              </div>
              <div>
                <strong>Reengineering move</strong>
                <p>Recenter waiting activity so tellers and offices surround the lounge area, while ATM traffic is separated from the main entrance path.</p>
              </div>
            </div>
          </div>
          <div className="architecture-recommendations">
            {architectureRecommendations.map((item) => (
              <button
                key={item.id}
                className={`architecture-card${activeArchitecture === item.id ? ' is-active' : ''}`}
                type="button"
                onClick={() => setActiveArchitecture((current) => current === item.id ? null : item.id)}
                aria-pressed={activeArchitecture === item.id}
              >
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </button>
            ))}
          </div>
          {activeArchitecture === 'atm' && (
            <aside className="architecture-video-evidence" aria-label="ATM queue pressure video evidence">
              <a className="atm-video-thumbnail" href={atmQueueVideoPath} target="_blank" rel="noreferrer" aria-label="Play ATM queue pressure footage">
                <img src={atmQueueThumbPath} alt="" loading="lazy" />
                <span><Play aria-hidden="true" size={24} fill="currentColor" /></span>
              </a>
              <div>
                <span>Supporting observation</span>
                <strong>ATM queue pressure footage</strong>
                <p>This recording is included as visual evidence for how ATM use can form a line near the entrance and interfere with entry or exit movement.</p>
              </div>
            </aside>
          )}
          {activeArchitecture === 'lounge' && (
            <aside className="architecture-photo-evidence" aria-label="Competitor waiting-area comparison">
              <button className="evidence-thumbnail" type="button" onClick={() => setShowLoungeModal(true)} aria-label="Open competitor waiting-area reference">
                <img src={competitorWaitingAreaPath} alt="" loading="lazy" />
                <span>View reference</span>
              </button>
              <div>
                <span>Community banking reference</span>
                <strong>Visible waiting area and seated service posture</strong>
                <p>The Cambridge Savings Bank waiting area shows a lounge placed in clear view of staff and customers. HFCU can use this as a reference for a more visible lounge core and for shifting teller interactions away from standing-only windows toward more comfortable seated service points.</p>
              </div>
            </aside>
          )}
        </section>
        )}

        {showLoungeModal && (
          <div className="evidence-modal-backdrop" role="presentation" onClick={() => setShowLoungeModal(false)}>
            <section className="evidence-modal" role="dialog" aria-modal="true" aria-label="Competitor waiting-area reference" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close-button" type="button" onClick={() => setShowLoungeModal(false)} aria-label="Close reference image">x</button>
              <img src={competitorWaitingAreaPath} alt="Cambridge Savings Bank waiting area with lounge seating and visible teller area" />
              <div>
                <span>Competitor reference</span>
                <h3>Waiting visibility and seated interaction model</h3>
                <p>This image supports the lounge redesign recommendation: the waiting area should be visually connected to staff, and teller interactions should be more approachable through seated or semi-seated service moments rather than standing-only transaction windows.</p>
              </div>
            </section>
          </div>
        )}

        {sitePage === 'mvp' && (
        <section id="mvp" className="mvp-stage" aria-label="HFCU MVP">
          <div className="section-heading">
            <span className="page-label">MVP</span>
            <h2>Member-facing app prototype</h2>
            <p>This standalone MVP is separated from the reasoning page so stakeholders can test the mobile flow directly.</p>
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
        )}
      </main>
      </div>
  )
}

export default App
