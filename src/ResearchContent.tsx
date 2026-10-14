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
  ['Review-backed concern', 'Process continuity and exception resolution', 'Communication 8/39; resolution failure 5/39; repeat contact 4/39; handoffs 3/39, plus supplementary HFCU narratives.', 'Case ownership and follow-through are promising targets. Precise incidence and branch attribution remain unestablished.'],
  ['Possible mechanism', 'Document rework and unclear status', 'Documents or paperwork appear in 13 of the 39 low-rated reviews.', 'Audit the mentions to distinguish actual resubmissions from routine paperwork references.'],
  ['Measured arrival variation', 'Demand peaks and different service needs', '22.4 entrants/hour pooled; 17.3/hour in sampled afternoons; 42.6/hour during Friday lunch. Interviews suggest longer officer consultations.', 'Capacity shortfall is unproven. Four teller stations and six officer offices are physical positions, not confirmed active servers.'],
  ['Spatial hypothesis', 'ATM queues can interfere with the entrance', 'Branch observations and video show queues encroaching on the narrow two-door vestibule.', 'Measure blockage duration and frequency. This is stronger spatial evidence than the two layout mentions in low-rated reviews.'],
  ['Qualitative benchmark', 'CSB offers practices worth testing', 'Selected reviews describe follow-through; its official Harvard Square page documents an ITM/video-banker channel.', 'These are examples and evidence of channel feasibility, not proof that CSB has shorter waits, lower costs or superior resolution.'],
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
    <a className="section-inline-link" href={`${datasetBase}HFCU_Harvard_Square_Yelp_Reviews_87.csv`} download>Download HFCU reviews (CSV)</a>
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
    <div className="action-row"><a className="site-action secondary-site-action" href={`${datasetBase}CSB_Aggregated_Reviews_24.csv`} download>CSB reviews (CSV)</a><a className="site-action secondary-site-action" href={`${datasetBase}CSB_Review_Evidence_and_HFCU_Benchmark.xlsx`} download>Benchmark workbook (Excel)</a></div>
    <Benchmark />
    </div></details>
    <details><summary><span>Study limitations<small>What the evidence can and cannot establish</small></span></summary><div className="methodology-detail-body">
    <section className="research-section"><h3>Study limitations</h3><p>Review-selection bias, unequal source/geographic scope and overlapping first-pass codes limit inference. No real-world CSB advantage has been established. The short nonrandom observations omit mornings; service rates, active staffing, objective waits and obstruction frequency remain unmeasured. Geometry is conceptual. Video still publication requires appropriate authorization and de-identification.</p></section>
    </div></details>
    </div>
    <div className="methodology-links"><a className="site-action primary-site-action" href="#/key-findings">Key findings</a><a className="site-action secondary-site-action" href="#/video-appendix">Supporting videos</a></div>
  </section>

  if (page === 'findings') return <section className="research-findings research-content">
    <div className="section-heading"><span className="page-label">Key findings</span><h2>Candidate bottlenecks and strength of evidence</h2><p>The strongest current diagnosis is fragmented service continuity plus potentially inefficient routing of short versus complex transactions.</p></div>
    <figure className="failure-matrix-figure">
      <a href={`${datasetBase}HFCU_Failure_Matrix_Chart.png`} target="_blank" rel="noreferrer" aria-label="Open full-size HFCU failure matrix chart">
        <img src={`${datasetBase}HFCU_Failure_Matrix_Chart.png`} alt="HFCU failure matrix: digital-related mentions 21 of 39 low-rated reviews, documents 13, waiting 10, communication and staff behavior 8 each. Other coded themes and proposed operational responses are shown." />
      </a>
      <figcaption>Preliminary overlapping themes in 39 reviews rated 1-2 stars. Digital mentions are not necessarily failures; proposed responses are hypotheses, not observed effects.</figcaption>
      <a className="section-inline-link" href={`${datasetBase}HFCU_Harvard_Square_Yelp_Reviews_87.csv`} download>Download source reviews (CSV)</a>
    </figure>
    <div className="findings-grid">{findings.map(([confidence, title, evidence, interpretation]) => <article key={title}><span className="research-evidence-label">{confidence}</span><strong>{title}</strong><p>{evidence}</p><p>{interpretation}</p></article>)}</div>
    <p className="research-callout">ATM queueing in the entry vestibule is the most actionable architectural issue. The data do not establish broad understaffing or demonstrate that a wholesale renovation would improve outcomes.</p>
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
