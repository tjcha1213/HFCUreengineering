import { useEffect, useState, type CSSProperties } from 'react'
import ResearchContent from './ResearchContent'
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
  MessageCircle,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Stamp,
  UploadCloud,
  Play,
  PlayCircle,
  Video,
  X,
} from 'lucide-react'

type RequestType = 'branch' | 'loan' | 'notary'
type NotaryType = 'affidavit' | 'loan' | 'poa'
type MainTab = 'home' | 'docs' | 'notary' | 'help'
type StatusTarget = 'home' | 'docs' | 'notary' | 'help'
type NotaryStep = 'overview' | 'verify' | 'session' | 'receipt'
type SitePage = 'about' | 'strategy' | 'mvp' | 'architecture' | 'appendix' | 'videoAppendix' | 'methodology' | 'findings' | 'datasets'
type ArchitectureRecommendationId = 'lounge' | 'surround' | 'atm' | 'queue'
type ChatMessage = {
  id: number
  author: 'member' | 'worker'
  name: string
  text: string
  time: string
}

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
    body: 'P3 hypothesis: trial a lounge closer to the service core, then measure sightlines, walking routes and waiting footprint before committing to permanent changes.',
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
    body: 'P3 hypothesis: test staff-to-lounge sightlines and seated interactions for longer consultations. Validate service routes and furniture changes before considering partition removal.',
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

const suggestedChatQuestions = [
  'What should I bring?',
  'How long is the wait?',
  'Can I upload documents?',
  'Can someone call me?',
]

const availableAppointmentDays = new Set([14, 15, 16, 17, 20, 21, 22, 23, 27, 28, 29, 30])
const calendarWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const appointmentCalendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index - 3
  return day > 0 && day <= 31
    ? { day, date: `Oct ${day}`, available: availableAppointmentDays.has(day) }
    : null
})
const appointmentTimes = ['10:30 AM', '1:15 PM', '4:45 PM']

function currentChatTime() {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function getHfcuWorkerReply(question: string, request: (typeof requests)[RequestType]) {
  const normalized = question.toLowerCase()

  if (normalized.includes('bring') || normalized.includes('document') || normalized.includes('upload')) {
    return request.documentNote
  }

  if (normalized.includes('wait') || normalized.includes('long') || normalized.includes('eta') || normalized.includes('time')) {
    return `${request.etaLabel}: ${request.eta}. ${request.nextAction}`
  }

  if (normalized.includes('call') || normalized.includes('phone') || normalized.includes('callback')) {
    return `I can flag ${request.owner} to call you back using request ${request.id}. You can also keep this chat open for updates.`
  }

  if (normalized.includes('notary') || normalized.includes('appointment') || normalized.includes('schedule')) {
    return 'For notary support, please confirm your ID, upload the document, and choose an available session in the Notary tab.'
  }

  return `I can help with request ${request.id}, document readiness, wait status, uploads, notary scheduling, or a callback from ${request.owner}.`
}

function getSitePage(): SitePage {
  const hash = window.location.hash.replace(/^#\/?/, '')

  if (hash === 'about') return 'about'
  if (hash === 'mvp') return 'mvp'
  if (hash === 'branch-architecture') return 'architecture'
  if (hash === 'appendix') return 'appendix'
  if (hash === 'video-appendix') return 'videoAppendix'
  if (hash === 'traffic-methodology') return 'methodology'
  if (hash === 'key-findings') return 'findings'
  if (hash === 'datasets') return 'datasets'
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
  const [appointmentDate, setAppointmentDate] = useState('Oct 14')
  const [draftSlot, setDraftSlot] = useState('10:30 AM')
  const [draftDate, setDraftDate] = useState('Oct 14')
  const [appointmentPickerOpen, setAppointmentPickerOpen] = useState(false)
  const [sessionText, setSessionText] = useState(notaryFlows.affidavit.session)
  const [notaryProgress, setNotaryProgress] = useState(notaryFlows.affidavit.progress)
  const [completedChecks, setCompletedChecks] = useState<number[]>([0, 1])
  const [branchReminder, setBranchReminder] = useState(false)
  const [activeArchitecture, setActiveArchitecture] = useState<ArchitectureRecommendationId | null>(null)
  const [showLoungeModal, setShowLoungeModal] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [workerTyping, setWorkerTyping] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      author: 'worker',
      name: 'HFCU member services',
      text: 'Hi, I can help with your branch visit, documents, notary appointment, or request status.',
      time: currentChatTime(),
    },
  ])

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
    setAppointmentDate('Oct 14')
    setDraftSlot('10:30 AM')
    setDraftDate('Oct 14')
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

  function openAppointmentPicker(nextSlot = slot) {
    setDraftSlot(nextSlot)
    setDraftDate(appointmentDate)
    setAppointmentPickerOpen(true)
  }

  function reserveSlot(nextSlot = draftSlot, nextDate = draftDate) {
    setSlot(nextSlot)
    setAppointmentDate(nextDate)
    setSessionText(`Session confirmed for ${nextDate} at ${nextSlot}`)
    setNotaryProgress(92)
    setNotaryStep('session')
    setCompletedChecks((current) => current.includes(2) ? current : [...current, 2])
    setAppointmentPickerOpen(false)
  }

  function runNotaryAction() {
    if (notaryStep === 'overview') {
      openAppointmentPicker()
      return
    }
    if (notaryStep === 'verify') {
      setNotaryStep('session')
      return
    }
    if (notaryStep === 'session') {
      setSessionText(`Session confirmed for ${appointmentDate} at ${slot}`)
      setNotaryProgress(100)
      setNotaryStep('receipt')
      setCompletedChecks([0, 1, 2, 3])
      return
    }
    setNotaryStep('overview')
  }

  function openChat() {
    setChatOpen(true)
  }

  function sendChatMessage(presetQuestion?: string) {
    const text = (presetQuestion ?? chatInput).trim()
    if (!text) return

    setChatMessages((messages) => [
      ...messages,
      {
        id: Date.now(),
        author: 'member',
        name: 'Maya',
        text,
        time: currentChatTime(),
      },
    ])
    setChatInput('')
    setWorkerTyping(true)

    window.setTimeout(() => {
      setChatMessages((messages) => [
        ...messages,
        {
          id: Date.now() + 1,
          author: 'worker',
          name: 'HFCU member services',
          text: getHfcuWorkerReply(text, request),
          time: currentChatTime(),
        },
      ])
      setWorkerTyping(false)
    }, 650)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <h1><span>Harvard Federal Credit Union:</span><span>Cambridge Branch Service Redesign</span></h1>
        </div>
        <nav className="site-nav" aria-label="Project pages">
          <a className={sitePage === 'about' ? 'is-active' : ''} href="#/about">About the Project</a>
          <a className={sitePage === 'methodology' ? 'is-active' : ''} href="#/traffic-methodology">Methodology</a>
          <a className={sitePage === 'findings' ? 'is-active' : ''} href="#/key-findings">Key findings</a>
          <a className={['strategy', 'mvp', 'architecture'].includes(sitePage) ? 'is-active' : ''} href="#/">Recommendations</a>
          <a className={['appendix', 'videoAppendix', 'datasets'].includes(sitePage) ? 'is-active' : ''} href="#/appendix">Appendix</a>
          <a href="https://github.com/tjcha1213/HFCUreengineering" target="_blank" rel="noreferrer">GitHub repo</a>
        </nav>
      </header>

      <main className="site-main">
        {sitePage === 'about' && (
          <section className="research-content research-findings" aria-label="About the project">
            <div className="section-heading">
              <span className="page-label">About the Project</span>
              <h2>An individual reengineering course project</h2>
              <p>This project examines customer-facing operations at Harvard Federal Credit Union's Harvard Square branch, connecting service processes, digital support and the physical branch environment.</p>
            </div>
            <section className="research-section">
              <h3>Why this project</h3>
              <p>I chose this individual reengineering project because I experienced several of these service challenges myself, first as an international student preparing to arrive in the United States and later as a customer at the Harvard Square branch.</p>
            </section>
            <section className="research-section">
              <h3>Banking before arriving in the United States</h3>
              <p>Before arriving, I needed to open a bank account and settle the banking arrangements for my grants and loans. Having to sign documents in front of a notary made this difficult from overseas and added anxiety about my financial readiness before I had even reached the university.</p>
              <p>That experience motivated the remote-notary component of this project. Given Harvard's international student community, notarization should be easier to navigate from abroad, with clear document requirements, appointment options and guidance on which steps can be completed remotely.</p>
            </section>
            <section className="research-section">
              <h3>Waiting without reaching a service desk</h3>
              <p>During busy visits to the Harvard Square branch, I observed queues that appeared poorly organized and saw people leave in frustration before receiving service. They did not even reach a staff member to raise their concerns.</p>
              <p>These observations prompted questions about routing, waiting visibility and customers leaving before service. They are personal observations, not a measured abandonment rate.</p>
            </section>
            <section className="research-section">
              <h3>Digital friction that brings customers back to the branch</h3>
              <p>I found the banking app difficult to navigate, slow and dated, particularly around login and customer support. The analysis of low-rated HFCU Yelp reviews identified related themes involving digital channels, communication and resolution. Those themes support further investigation, although a digital mention alone does not establish a failure.</p>
              <p>A personal interview at the branch added another perspective. Kathleen McDermott, who had recently retired, described an unsatisfactory HFCU banking experience, with proximity to her workplace at Harvard University Press (HUP) as a convenience. She raised concerns about both branch queues and the digital experience, explaining that difficulty banking online or on mobile led her to visit the branch instead.</p>
              <p>Her account illustrates a possible connection between digital friction and in-person demand. It is one customer's experience, not a representative finding about all members.</p>
            </section>
            <section className="research-section">
              <h3>A nearby comparison: Cambridge Savings Bank</h3>
              <p>Cambridge Savings Bank provided a local community-banking comparison. Its favorable review narratives, renovated branch environment and ITM offering drew my attention to possible alternatives for HFCU. Its floor plan also suggested ways to organize waiting and service more clearly.</p>
              <p>The compiled CSB dataset and branch reference materials inform those possibilities. Because the review sources and locations differ, they do not establish that CSB has better overall reviews, shorter waits or superior queue management. The ITM and layout are benchmarks for potential pilots, rather than proof of an operational advantage.</p>
            </section>
            <section className="research-section">
              <h3>The reengineering question</h3>
              <p>How can the branch resolve customer requests more reliably, reduce avoidable handoffs and improve the connection between in-person and digital service?</p>
            </section>
            <section className="research-section">
              <h3>Course application</h3>
              <p>The analysis applies service blueprinting, Lean service, queueing and facility-layout concepts to reviews, observations and a conceptual floor plan. Recommendations are framed as pilots with measurable outcomes.</p>
            </section>
            <div className="methodology-links">
              <a className="site-action primary-site-action" href="#/traffic-methodology">View methodology</a>
            </div>
          </section>
        )}
        {sitePage === 'strategy' && <ResearchContent page="strategy" />}

        {sitePage === 'appendix' && (
        <section className="research-datasets" aria-label="Research appendix">
          <div className="section-heading">
            <span className="page-label">Appendix</span>
            <h2>Research appendix</h2>
            <p>The appendix brings together observation videos, HFCU and CSB review datasets, and supporting research materials.</p>
          </div>

          <div className="dataset-grid">
            <article>
              <strong>Video appendix</strong>
              <p>Observation recordings used as evidence for queueing, customer visibility, ATM pressure, and customer experience analysis.</p>
              <a className="site-action secondary-site-action" href="#/video-appendix">Open videos</a>
            </article>
            <article>
              <strong>Datasets</strong>
              <p>HFCU and Cambridge Savings Bank review datasets, CSB source details, and the failure-matrix chart.</p>
              <a className="site-action secondary-site-action" href="#/datasets">Open datasets</a>
            </article>
          </div>
        </section>
        )}

        {sitePage === 'videoAppendix' && (
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

        {sitePage === 'methodology' && <ResearchContent page="methodology" />}

        {sitePage === 'findings' && <ResearchContent page="findings" />}

        {sitePage === 'datasets' && (
        <section className="research-datasets" aria-label="Research datasets and rationale evidence">
          <div className="section-heading">
            <span className="page-label">Appendix datasets</span>
            <h2>Datasets created for the rationales</h2>
            <p>This appendix groups the structured research files and evidence assets that support the methodology, key findings, MVP rationale, and branch architecture recommendations.</p>
          </div>

          <div className="dataset-grid">
            <article>
              <strong>Compiled CSB review dataset</strong>
              <p>24 curated Cambridge Savings Bank narratives across sources and locations: 17 positive, 4 negative, 2 mixed and 1 neutral. Used as a qualitative service-practice benchmark, not a representative comparison of bank performance.</p>
              <a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/1EAtGJ8z-8EqnswEkvXZIJ1YP5ekj0BeYMGZWYottSww/edit?gid=172617412#gid=172617412" target="_blank" rel="noreferrer">Open spreadsheet</a>
            </article>
            <article>
              <strong>HFCU Harvard Square review dataset</strong>
              <p>87 written Yelp records with review text and preliminary theme codes. The failure matrix uses the 39 reviews rated 1-2 stars.</p>
              <a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/1CEh8fO8i7jwSSzkZDVDSIsjSEaqUv90jyzBfEtoo20Y/edit?gid=1599124210#gid=1599124210" target="_blank" rel="noreferrer">Open spreadsheet</a>
            </article>
            <article>
              <strong>CSB sources and supporting details</strong>
              <p>Source information and supplementary details for the compiled CSB review dataset and qualitative service-practice comparison.</p>
              <a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/199p_fUqUFBk9rx9svq5clJ4W1fF1aDhaon7udtYTKX4/edit?gid=532963172#gid=532963172" target="_blank" rel="noreferrer">Open spreadsheet</a>
            </article>
            <article>
              <strong>HFCU failure matrix</strong>
              <p>Coded review themes, operational areas and potential responses. Categories overlap and proposed effects remain untested.</p>
              <a className="site-action secondary-site-action" href={`${assetBase}datasets/HFCU_Failure_Matrix_Chart.png`} target="_blank" rel="noreferrer">Open chart</a>
            </article>
            <article>
              <strong>Video appendix</strong>
              <p>Observation recordings used as appendix evidence for queueing, visibility, and customer experience analysis.</p>
              <a className="site-action secondary-site-action" href="#/video-appendix">Open videos</a>
            </article>
            <article>
              <strong>Branch architecture assets</strong>
              <p>Floor plan, ATM queue clip, ATM thumbnail, and competitor waiting-area reference used in the architecture rationale.</p>
              <a className="site-action secondary-site-action" href="#/branch-architecture">Open architecture</a>
            </article>
          </div>
        </section>
        )}

        {sitePage === 'architecture' && (
        <section id="branch-system" className="branch-system" aria-label="Hypothetical Cambridge branch system map">
          <div className="section-heading">
            <span className="page-label">Branch architecture recommendation</span>
            <h2>Interior changes for queue visibility and customer experience</h2>
            <p>Prioritize keeping ATM queues out of the entrance path. Lounge, seating and service-point changes are selective hypotheses to test after process pilots, not evidence that wholesale renovation is needed. This conceptual plan is not a measured as-built drawing.</p>
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
        <div className="iphone-status-bar" aria-label="Phone status">
          <span>9:41</span>
          <div aria-hidden="true">
            <i className="signal-bars"><b /><b /><b /></i>
            <svg className="wifi-icon" viewBox="0 0 18 14">
              <path d="M2.1 4.8C5.9 1.6 12.1 1.6 15.9 4.8" />
              <path d="M5 8C7.2 6.2 10.8 6.2 13 8" />
              <path d="M8.9 11.2H9.1" />
            </svg>
            <i className="battery-icon"><b /></i>
          </div>
        </div>
        <main className="screen">
          {activeTab === 'home' && (
            <section className="scroll-area home-screen">
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
                    <article
                      key={check.title}
                      className={`notary-check${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      <span>{isComplete ? <CheckCircle2 aria-hidden="true" size={18} /> : <CheckIcon aria-hidden="true" size={18} />}</span>
                      <p><strong>{check.title}</strong><small>{check.body}</small></p>
                    </article>
                  )
                })}
              </section>

              <div className="section-label with-value"><span>Available appointments</span><b>{appointmentDate} · {slot}</b></div>
              <section className="chip-grid">
                {appointmentTimes.map((time) => (
                  <button key={time} className={`chip${slot === time ? ' is-active' : ''}`} type="button" onClick={() => openAppointmentPicker(time)}>
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
              <button className="support-card" type="button" onClick={openChat}>
                <Headphones aria-hidden="true" size={22} />
                <div>
                  <strong>Chat with {request.owner}</strong>
                  <p>Share your request ID and continue from the current step.</p>
                </div>
              </button>
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

          {chatOpen && (
            <section className="mvp-chat-shell" aria-label="HFCU member services chat">
              <div className="mvp-chat-panel">
                <header className="mvp-chat-header">
                  <div>
                    <span>Connected now</span>
                    <h3><MessageCircle aria-hidden="true" size={17} /> HFCU chat</h3>
                    <p>{request.owner} can see {request.id}.</p>
                  </div>
                  <button type="button" aria-label="Close chat" onClick={() => setChatOpen(false)}>
                    <X aria-hidden="true" size={17} />
                  </button>
                </header>

                <div className="mvp-chat-messages" aria-live="polite">
                  {chatMessages.map((message) => (
                    <article key={message.id} className={`mvp-chat-message ${message.author}`}>
                      <span>{message.name} · {message.time}</span>
                      <p>{message.text}</p>
                    </article>
                  ))}
                  {workerTyping && (
                    <article className="mvp-chat-message worker typing">
                      <span>HFCU member services</span>
                      <p>Typing...</p>
                    </article>
                  )}
                </div>

                <div className="mvp-quick-questions" aria-label="Suggested chat questions">
                  {suggestedChatQuestions.map((question) => (
                    <button key={question} type="button" onClick={() => sendChatMessage(question)}>
                      {question}
                    </button>
                  ))}
                </div>

                <form
                  className="mvp-chat-compose"
                  onSubmit={(event) => {
                    event.preventDefault()
                    sendChatMessage()
                  }}
                >
                  <input
                    aria-label="Message HFCU member services"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask HFCU"
                  />
                  <button type="submit" aria-label="Send message">
                    <Send aria-hidden="true" size={17} />
                  </button>
                </form>
              </div>
            </section>
          )}

          {appointmentPickerOpen && (
            <section className="appointment-picker-shell" aria-label="Choose appointment date and time">
              <div className="appointment-picker-panel">
                <header className="appointment-picker-header">
                  <div>
                    <span>Appointment</span>
                    <h3><CalendarClock aria-hidden="true" size={17} /> Choose date and time</h3>
                  </div>
                  <button type="button" aria-label="Close calendar" onClick={() => setAppointmentPickerOpen(false)}>
                    <X aria-hidden="true" size={17} />
                  </button>
                </header>

                <div className="calendar-card" aria-label="Available dates">
                  <div className="calendar-month">
                    <strong>October 2026</strong>
                    <span>Available days highlighted</span>
                  </div>
                  <div className="calendar-weekdays" aria-hidden="true">
                    {calendarWeekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                  </div>
                  <div className="calendar-month-grid">
                    {appointmentCalendarDays.map((date, index) => date ? (
                      <button
                        key={date.date}
                        className={`${draftDate === date.date ? 'is-active' : ''}${date.available ? ' is-available' : ''}`}
                        type="button"
                        disabled={!date.available}
                        aria-label={date.available ? `${date.date} available` : `${date.date} unavailable`}
                        onClick={() => setDraftDate(date.date)}
                      >
                        <span>{date.day}</span>
                      </button>
                    ) : <i key={`empty-${index}`} aria-hidden="true" />)}
                  </div>
                </div>

                <div className="appointment-times" aria-label="Available times">
                  {appointmentTimes.map((time) => (
                    <button
                      key={time}
                      className={draftSlot === time ? 'is-active' : ''}
                      type="button"
                      onClick={() => setDraftSlot(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <button className="primary-action blue-action" type="button" onClick={() => reserveSlot()}>
                  Confirm {draftDate} at {draftSlot}
                </button>
              </div>
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
