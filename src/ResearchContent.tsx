import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

const datasetBase = `${import.meta.env.BASE_URL}datasets/`

const themes = [
  ['Digital-related mentions', '21', '53.8%'],
  ['Documents / paperwork', '13', '33.3%'],
  ['Waiting / delays', '10', '25.6%'],
  ['Communication', '8', '20.5%'],
  ['Staff behavior', '8', '20.5%'],
  ['First-contact resolution failure', '5', '12.8%'],
  ['Repeated contact', '4', '10.3%'],
  ['Handoffs / escalation', '3', '7.7%'],
  ['Amenities', '3', '7.7%'],
  ['Physical layout', '2', '5.1%'],
  ['Staffing capacity', '1', '2.6%'],
  ['Third-party issues', '1', '2.6%'],
  ['Privacy', '1', '2.6%'],
]

const observations = [
  ['Monday / 1', '24:33', '12', '9', '29.3'],
  ['Tuesday / 2', '19:42', '7', '6', '21.3'],
  ['Wednesday / 3', '19:04', '4', '6', '12.6'],
  ['Thursday / 4', '19:54', '1', '5', '3.0'],
  ['Friday / 5', '21:07', '15', '14', '42.6'],
  ['Total', '104:20', '39', '40', '22.4 pooled'],
]

const findings = [
  ['Customer reviews', 'A request needs an owner.', 'Communication, repeat contact and handoffs recur in low-rated reviews. A shared case record could make the next step clearer.', '8/39 communication; 5/39 resolution failure; 4/39 repeat contact; 3/39 handoffs. Codes overlap. These counts do not establish population incidence or confirm every interaction occurred at this branch.'],
  ['Customer reviews', 'Paperwork is a recurring friction point.', 'Documents appear in one-third of the low-rated reviews. Clear acceptance status is a practical improvement to test.', '13 of 39 reviews mention documents or paperwork. Manual audit is needed to distinguish routine references from actual rework or resubmissions.'],
  ['Video observations', 'Demand changes. Routing should respond.', 'Friday lunch brought roughly 2.5 times the arrivals seen in the sampled afternoons. Short transactions and long consultations may need different routes.', '42.6 entrants/hour at Friday lunch versus 17.3/hour across Monday-Thursday afternoons; 22.4/hour pooled. Day and time of day are confounded. Four teller stations and six offices do not establish active staffing or a capacity shortfall.'],
  ['Branch observations', 'The ATM queue meets the front door.', 'Observed ATM queues can encroach on the entrance. Separating waiting space from the entry path is the clearest layout priority to test.', 'Video and branch observations support a circulation hypothesis. Blockage frequency and duration remain unmeasured; the floor plan is conceptual.'],
  ['Local benchmark', 'Video banking is already nearby.', 'CSB offers a local example of an ITM with live video bankers. It is a possible channel for eligible transactions outside the vestibule.', 'The official CSB Harvard Square listing confirms the channel. Its curated reviews offer practice examples, not proof of shorter waits, lower costs or superior service.'],
]

const interventions = [
  ['P1', 'One case owner and shared document tracking', 'Service blueprinting + Lean service', 'Reduce repeated explanations, duplicate submissions and unclear handoffs across branch, phone, app, loans and cards.', 'Pilot one case ID, named owner, next action, document acceptance status and callbacks for complex cases.', 'First-contact resolution; repeat contacts per case; resubmissions; unresolved case age.'],
  ['P1', 'Reception triage and service segmentation', 'Flow management', 'Route short routine transactions to tellers and complex needs to officers or specialists without repeated queuing.', 'Test light-touch service-reason check-in before investing in an app or kiosk.', 'Teller/officer arrival split; time to first contact; handoffs; service time by class.'],
  ['P1', 'Keep ATM queues out of the entrance path', 'Facility layout + bottleneck management', 'Separate queue storage from pedestrian circulation.', 'Measure obstruction, then trial floor markings or alternate queue placement; verify ownership, accessibility and security permissions.', 'Blocked doorway minutes; ATM queue length; interference events.'],
  ['P2', 'Pilot off-vestibule ITM / video banking', 'Service-channel substitution + capacity pooling', 'Move eligible assisted transactions to remote employees, without assuming every task is suitable.', 'Evaluate demand, live banker coverage, privacy, accessibility and costs. Keep longer ITM interactions outside the congested vestibule.', 'Eligible volume; service times; teller diversion; cost per transaction.'],
  ['P2', 'Match active staffing to service mix', 'Queueing + variability buffering', 'Add flexibility where measured demand is high and consultations are long.', 'Observe active teller/officer staffing and service times; compare matched lunch and afternoon periods before changing staffing.', 'Class-specific arrival and service rates; utilization; queue lengths and waits.'],
  ['P2', 'Live specialist escalation with a shared case record', 'Handoff reduction + first-contact resolution', 'Connect officers to remote loan or card specialists without losing customer context.', 'Pilot video specialist access from an existing office.', 'Completed escalations; repeated explanations; follow-up contacts; resolution time.'],
  ['P3', 'Selective furniture and circulation changes', 'Facility design + service-route mapping', 'Reduce observed unnecessary movement rather than redesigning aesthetics without measured benefit.', 'Validate the conceptual plan, trace anonymous routes and trial low-cost furniture changes before removing partitions.', 'Movement paths; waiting footprint; visibility; customer effort.'],
]

function ResearchTable({ caption, headings, rows }: { caption: string; headings: string[]; rows: string[][] }) {
  return <div className="methodology-table-wrap" tabIndex={0} role="region" aria-label={caption}>
    <table className="methodology-table"><caption>{caption}</caption>
      <thead><tr>{headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
}

function Benchmark() {
  return <section className="research-section">
    <h3>Cambridge Savings Bank: a qualitative benchmark</h3>
    <p>CSB narratives offer examples of personal attention, resolution, managerial escalation and follow-through. Include its negative reviews alongside positive examples; HFCU also receives praise for personal service. Label each review by Harvard Square, other-branch or institution-wide scope.</p>
    <p>CSB officially lists an ITM with live video bankers at Harvard Square, Monday-Friday 8 AM-6 PM and Saturday 8 AM-3 PM. This establishes channel feasibility, not better outcomes. <a href="https://www.cambridgesavings.com/locations/cambridge-harvard-square-0" target="_blank" rel="noreferrer">CSB Harvard Square branch services</a>.</p>
  </section>
}

export default function ResearchContent({ page }: { page: 'methodology' | 'findings' | 'strategy' }) {
  const [selectedFinding, setSelectedFinding] = useState<number | null>(null)
  const findingDialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = findingDialog.current
    if (selectedFinding === null || !dialog) return
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [selectedFinding])
  if (page === 'methodology') return <section className="traffic-methodology research-content methodology-simple">
    <div className="section-heading"><span className="page-label">Methodology</span><h2>How the branch was studied</h2><p>Customer reviews, video observations and branch visits informed the proposed service improvements.</p></div>
    <div className="methodology-overview">
      <div><strong>87 reviews</strong><span>HFCU customer experiences</span></div>
      <div><strong>24 narratives</strong><span>Compiled CSB review dataset</span></div>
      <div><strong>5 recordings</strong><span>104 minutes of entrance activity</span></div>
      <div><strong>Branch visits</strong><span>Interviews and layout observations</span></div>
    </div>
    <p className="methodology-caveat">An exploratory study: observations identify possible improvements, not proven causes or guaranteed results.</p>
    <div className="methodology-details">
    <details><summary><span>Customer reviews<small>Sources, sample sizes and review themes</small></span></summary><div className="methodology-detail-body">
    <ResearchTable caption="Evidence and sampling" headings={['Evidence', 'Scope and sample', 'Analytical use']} rows={[
      ['HFCU Harvard Square Yelp', '87 written records; 66 recoverable star scores; 39 rated 1-2 stars', 'Primary voice of customer and preliminary failure matrix'],
      ['Supplementary HFCU narratives', '14 accessible negative/mixed digital or institution-wide accounts', 'Separate qualitative triangulation'],
      ['Compiled CSB review dataset', '24 curated narratives: 17 positive, 4 negative, 2 mixed, 1 neutral. Four on Harvard Square listings; one additionally mentions Harvard and Porter.', 'Qualitative service-practice examples across sources and locations'],
      ['HFCU video observations', 'Five weekdays; 104 minutes, 20 seconds', 'Manually counted entrances/exits and entrance/ATM circulation'],
      ['Interviews and conceptual layout', 'Staff/service observations, qualitative interviews and reconstructed first floor', 'Service-class differences and candidate bottlenecks'],
    ]} />
    <p>HFCU Yelp listing association does not establish an actual branch visit. CSB narratives span platforms, locations and digital banking and may not be original branch-specific postings. Their percentages cannot establish population failure rates or relative bank performance. Supplementary HFCU narratives remain separate.</p>
    <ResearchTable caption="Preliminary themes in 39 reviews rated 1-2 stars" headings={['Theme', 'Reviews', 'Share of 39']} rows={themes} />
    <div className="action-row"><a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/1CEh8fO8i7jwSSzkZDVDSIsjSEaqUv90jyzBfEtoo20Y/edit?gid=1599124210#gid=1599124210" target="_blank" rel="noreferrer">Open HFCU review spreadsheet</a></div>
    <p className="research-callout">Codes overlap and require manual audit. Digital mentions include ordinary technology references: 53.8% is not a digital failure rate. Waiting includes callbacks and other non-branch delays. Example wording from a matrix graphic is not a verbatim source quotation.</p>
    </div></details>
    <details><summary><span>Customer traffic<small>Five weekday recordings and arrival-rate calculations</small></span></summary><div className="methodology-detail-body">
    <section className="research-section"><h3>Arrival-rate observation</h3><p>Count people crossing the branch entrance and exclude passersby. Monday-Thursday recordings sample different afternoon periods within approximately 2-4 PM; these are assigned windows, not verified timestamps. Friday was reported as approximately 12:10-12:30 PM. All samples are short and nonrandom.</p></section>
    <ResearchTable caption="Observed entrances and exits" headings={['Day / video', 'Duration', 'Entrances', 'Exits', 'Entrants/hour']} rows={observations} />
    <div className="calculation-grid"><article><span>Duration-weighted pooled rate</span><strong>39 / (104.33 / 60) = 22.4 entrants/hour</strong></article><article><span>Eight-hour scenario, not a measured daily average</span><strong>22.4 x 8 = approximately 180 entrances/day</strong></article></div>
    <p>Monday-Thursday afternoons pool to approximately 17.3 entrants/hour; Friday lunch is approximately 42.6/hour. The roughly 2.5-fold difference confounds day and time of day. Entrances are neither unique customers nor arrivals to a specific service queue; the extrapolation has no statistically justified confidence interval.</p>
    </div></details>
    <details><summary><span>Branch layout and service flow<small>Interviews, customer routes and the conceptual floor plan</small></span></summary><div className="methodology-detail-body">
    <section className="research-section"><h3>Interviews, process map and floor plan</h3><p>The conceptual first floor has four teller stations and six officer offices, not verified concurrent staffing. Interviews suggest longer officer consultations, but service-time distributions, active-server counts, teller/officer arrival splits and average waits have not been reliably measured.</p><ol className="research-process">{['Arrival', 'Vestibule / ATM or reception', 'Teller or officer', 'Possible handoff / remote specialist', 'Resolution or follow-up', 'Exit'].map(step => <li key={step}>{step}</li>)}</ol><p>Overlay anonymous service routes on the conceptual plan. Test the narrow vestibule and ATM queue as a specific circulation constraint; the drawing is not a measured as-built plan.</p></section>
    </div></details>
    <details><summary><span>CSB dataset and local comparison<small>24 compiled narratives across sources and locations</small></span></summary><div className="methodology-detail-body">
    <p>The compiled Cambridge Savings Bank (CSB) dataset contains 24 curated review narratives: 17 positive, 4 negative, 2 mixed and 1 neutral. It supports qualitative comparison of service practices, not a ranking of bank performance or a representative customer survey.</p>
    <div className="action-row"><a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/1EAtGJ8z-8EqnswEkvXZIJ1YP5ekj0BeYMGZWYottSww/edit?gid=172617412#gid=172617412" target="_blank" rel="noreferrer">Open CSB review spreadsheet</a><a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/199p_fUqUFBk9rx9svq5clJ4W1fF1aDhaon7udtYTKX4/edit?gid=532963172#gid=532963172" target="_blank" rel="noreferrer">CSB sources and supporting details</a></div>
    <Benchmark />
    </div></details>
    <details><summary><span>Study limitations<small>What the evidence can and cannot establish</small></span></summary><div className="methodology-detail-body">
    <section className="research-section"><h3>Study limitations</h3><p>Review-selection bias, unequal source/geographic scope and overlapping first-pass codes limit inference. No real-world CSB advantage has been established. The short nonrandom observations omit mornings; service rates, active staffing, objective waits and obstruction frequency remain unmeasured. Geometry is conceptual. Video still publication requires appropriate authorization and de-identification.</p></section>
    </div></details>
    </div>
    <div className="methodology-links"><a className="site-action primary-site-action" href="#/key-findings">Key findings</a><a className="site-action secondary-site-action" href="#/video-appendix">Supporting videos</a></div>
  </section>

  if (page === 'findings') return <section className="research-findings research-content findings-focused">
    <div className="section-heading"><span className="page-label">Key findings</span><h2>Clearer next steps. Better service flow.</h2><p>The evidence points to three priorities: own the request, route the customer, and keep the entrance clear.</p></div>
    <div className="findings-numbers" aria-label="Evidence at a glance">
      <div><strong>13 / 39</strong><span>low-rated reviews mention paperwork</span><small>Mentions, not confirmed rework</small></div>
      <div><strong>2.5x</strong><span>observed Friday lunch arrival rate</span><small>Compared with sampled Mon-Thu afternoons</small></div>
      <div><strong>One entrance</strong><span>shared with the ATM queue</span><small>Observed circulation conflict; impact unmeasured</small></div>
    </div>
    <div className="finding-takeaways">{findings.map(([source, title, takeaway], index) => <button className="finding-card" type="button" key={title} onClick={() => setSelectedFinding(index)} aria-haspopup="dialog">
      <span className="finding-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <span className="finding-card-copy"><span className="research-evidence-label">{source}</span><strong className="finding-card-title">{title}</strong><span>{takeaway}</span></span>
      <ArrowUpRight size={20} aria-hidden="true" />
    </button>)}</div>
    {selectedFinding !== null && <dialog className="finding-dialog" ref={findingDialog} aria-labelledby="finding-dialog-title" onCancel={() => setSelectedFinding(null)} onClose={() => setSelectedFinding(null)} onClick={event => { if (event.target === event.currentTarget) setSelectedFinding(null) }}>
      <div className="finding-dialog-content">
        <button className="finding-dialog-close" type="button" aria-label="Close finding" title="Close finding" onClick={() => setSelectedFinding(null)}><X size={22} /></button>
        <span className="research-evidence-label">{findings[selectedFinding][0]}</span>
        <h3 id="finding-dialog-title">{findings[selectedFinding][1]}</h3>
        <p>{findings[selectedFinding][2]}</p>
        {selectedFinding === 3 && <video controls playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}architecture/atm-queue-thumb.jpg`} src={`${import.meta.env.BASE_URL}architecture/atm-queue-pressure.mp4`} aria-label="Observed ATM queue pressure" />}
        <h4>Evidence and limits</h4><p>{findings[selectedFinding][3]}</p>
        {selectedFinding === 4 && <a className="site-action secondary-site-action" href="https://www.cambridgesavings.com/locations/cambridge-harvard-square-0" target="_blank" rel="noreferrer">CSB Harvard Square services</a>}
      </div>
    </dialog>}
    <div className="findings-conclusion"><h3>Fix the process first.</h3><p>Test case ownership, service triage and a clear entrance before committing to major renovation. The evidence does not establish broad understaffing.</p><a className="site-action primary-site-action" href="#/">Explore recommendations</a></div>
    <section className="research-section"><h3>The review evidence</h3><p>Frequency of coded themes in 39 reviews rated 1-2 stars.</p>
    <figure className="failure-matrix-figure">
      <a href={`${datasetBase}HFCU_Failure_Matrix_Chart.png`} target="_blank" rel="noreferrer" aria-label="Open full-size HFCU failure matrix chart">
        <img src={`${datasetBase}HFCU_Failure_Matrix_Chart.png`} alt="HFCU failure matrix: digital-related mentions 21 of 39 low-rated reviews, documents 13, waiting 10, communication and staff behavior 8 each. Other coded themes and proposed operational responses are shown." />
      </a>
      <figcaption>Preliminary overlapping themes in 39 reviews rated 1-2 stars. Digital mentions are not necessarily failures; proposed responses are hypotheses, not observed effects.</figcaption>
      <div className="action-row"><a className="site-action secondary-site-action" href="https://docs.google.com/spreadsheets/d/1CEh8fO8i7jwSSzkZDVDSIsjSEaqUv90jyzBfEtoo20Y/edit?gid=1599124210#gid=1599124210" target="_blank" rel="noreferrer">Open source review spreadsheet</a></div>
    </figure>
    </section>
    <div className="findings-actions"><a className="site-action primary-site-action" href="#/traffic-methodology">View methodology</a><a className="site-action secondary-site-action" href="#/">Open recommendations</a><a className="site-action secondary-site-action" href="#/datasets">Open datasets</a></div>
  </section>

  return <section className="recommendations research-content">
    <div className="section-heading"><span className="page-label">Recommendations</span><h2>Redesign the service process first</h2><p>Prioritize reliable case ownership, demand-sensitive routing and an unobstructed entrance. Reconfigure the physical environment selectively, using measured pilot outcomes to guide investment.</p><div className="action-row"><a className="site-action primary-site-action" href="#/mvp">View MVP</a><a className="site-action secondary-site-action" href="#/branch-architecture">Branch architecture</a></div></div>
    <p className="research-callout">The MVP illustrates a proposed status, document and support workflow. Service improvements and wait reductions remain outcomes to test, not demonstrated results.</p>
    <div className="recommendation-grid">{interventions.map(([priority, title, framework, mechanism, pilot, measures]) => <article key={title}><span className="research-evidence-label">{priority} · {framework}</span><strong>{title}</strong><p>{mechanism}</p><p><b>Pilot: </b>{pilot}</p><p><b>Measure: </b>{measures}</p></article>)}</div>
    <section className="research-section"><h3>Evaluate queues by service class</h3><p>The pooled 22.4 entrants/hour is a branch-level rate, not the arrival rate of one four-server teller queue. Measure each class's arrival share and active servers first.</p><div className="research-equations"><p>Utilization: rho(j) = lambda(j) / [s(j) x mu(j)]</p><p>Service rate: mu(j) = 60 / mean service minutes for class j</p><p>Little's Law, for an approximately stable system: Lq(j) = lambda(j) x Wq(j)</p></div><p>Here lambda is arrivals per hour, s is active servers, mu is services per server-hour, Lq is average queue length and Wq is average waiting time in hours. Assess variability and queue discipline before choosing an M/M/s model or projecting exact wait reductions.</p></section>
    <section className="research-section"><h3>Phased implementation</h3><ol className="research-phases"><li><strong>Baseline.</strong> Audit frequent review codes; timestamp a small nonidentifying sample of arrivals, queues, service times and ATM obstruction at matched time slots.</li><li><strong>Process pilots.</strong> Test service-reason check-in, named ownership and shared document/status records. Compare resolution, repeat contacts and waits with baseline.</li><li><strong>Space and technology pilots.</strong> Move ATM waiting out of circulation. Test remote assistance or an ITM only when volumes, costs, permissions and accessibility support it.</li><li><strong>Evaluate and scale.</strong> Compare service levels, workload, customer effort and cost. Revisit floor-plan changes when causal evidence supports them.</li></ol></section>
    <Benchmark />
  </section>
}
