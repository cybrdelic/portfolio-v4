import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  catalogDomains,
  catalogProjects,
  catalogStatuses,
  getCatalogDomainLabel,
  getCatalogPath,
  getCatalogStatusClassName,
  isCatalogDomain,
  type CatalogDomainKey,
} from '../content/projectCatalog';
import {
  EASE_STANDARD,
  FLIP_LAYOUT_PROPS,
  FLIP_LAYOUT_SCROLL_PROPS,
  FLIP_LAYOUT_TRANSITION,
  SPRING_FLIP,
} from '../lib/motion';

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) {
    return 'Portfolio only';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${updatedAt}T00:00:00Z`));
}

export default function ProjectsCatalog() {
  const [searchParams] = useSearchParams();
  const requestedDomain = searchParams.get('domain');
  const activeDomain: CatalogDomainKey = isCatalogDomain(requestedDomain) ? requestedDomain : 'all';
  const activeDomainMeta = catalogDomains.find((domain) => domain.key === activeDomain) ?? catalogDomains[0];
  const filteredProjects =
    activeDomain === 'all'
      ? catalogProjects
      : catalogProjects.filter((project) => project.domain === activeDomain);
  const featuredCount = filteredProjects.filter((project) => project.featured).length;
  const labCount = filteredProjects.filter((project) => project.status === 'Lab').length;
  const statusCounts = Object.fromEntries(
    catalogStatuses.map((status) => [
      status.key,
      filteredProjects.filter((project) => project.status === status.key).length,
    ])
  ) as Record<(typeof catalogStatuses)[number]['key'], number>;

  return (
    <LayoutGroup id="projects-catalog-layout">
      <motion.main className="relative" {...FLIP_LAYOUT_SCROLL_PROPS}>
        <motion.section
          className="section-shell section-shell--catalog section-shell--framed border-b-0"
          {...FLIP_LAYOUT_SCROLL_PROPS}
        >
          <motion.div className="section-inner" {...FLIP_LAYOUT_PROPS}>
            <Link to="/" className="catalog-back-link catalog-back-link--section">
              <ArrowLeft size={16} />
              <span>Back Home</span>
            </Link>
          </motion.div>

          <motion.div className="section-intro" {...FLIP_LAYOUT_PROPS}>
            <div className="section-rail">
              <p className="section-label">2.0 / Project Index</p>
            </div>

            <div className="section-content relative catalog-hero-copy">
              <p className="eyebrow">All public work</p>
              <h1 className="catalog-page-title">Project Index</h1>
              <p className="catalog-page-deck">{activeDomainMeta.summary}</p>
              <motion.div className="catalog-stats-grid" {...FLIP_LAYOUT_PROPS}>
                <motion.div className="catalog-stat" {...FLIP_LAYOUT_PROPS}>
                  <p className="catalog-stat-label">Visible</p>
                  <p className="catalog-stat-value">{String(filteredProjects.length).padStart(2, '0')}</p>
                </motion.div>
                <motion.div className="catalog-stat" {...FLIP_LAYOUT_PROPS}>
                  <p className="catalog-stat-label">Featured</p>
                  <p className="catalog-stat-value">{String(featuredCount).padStart(2, '0')}</p>
                </motion.div>
                <motion.div className="catalog-stat" {...FLIP_LAYOUT_PROPS}>
                  <p className="catalog-stat-label">Labs</p>
                  <p className="catalog-stat-value">{String(labCount).padStart(2, '0')}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="section-list border-t-0" {...FLIP_LAYOUT_PROPS}>
            <motion.div className="catalog-filter-row" {...FLIP_LAYOUT_PROPS}>
              {catalogDomains.map((domain) => {
                const isActive = domain.key === activeDomain;
                const chipCount =
                  domain.key === 'all'
                    ? catalogProjects.length
                    : catalogProjects.filter((project) => project.domain === domain.key).length;

                return (
                  <motion.div key={domain.key} {...FLIP_LAYOUT_PROPS}>
                    <Link
                      to={domain.key === 'all' ? '/projects' : getCatalogPath(domain.key)}
                      className={`catalog-filter-chip ${isActive ? 'is-active' : ''}`}
                    >
                      <span>{domain.label}</span>
                      <span>{String(chipCount).padStart(2, '0')}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div className="catalog-status-row" {...FLIP_LAYOUT_PROPS}>
              {catalogStatuses.map((status) => (
                <motion.div
                  key={status.key}
                  className={`catalog-status-card ${getCatalogStatusClassName(status.key)}`}
                  {...FLIP_LAYOUT_PROPS}
                >
                  <p className="catalog-status-card-label">{status.key}</p>
                  <p className="catalog-status-card-count">{String(statusCounts[status.key]).padStart(2, '0')}</p>
                  <p className="catalog-status-card-copy">{status.summary}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="catalog-stack-list xl:hidden" {...FLIP_LAYOUT_PROPS}>
              <AnimatePresence initial={false}>
                {filteredProjects.map((project) => (
                  <motion.article
                    key={`stack-${project.title}-${project.repoName ?? 'portfolio'}`}
                    layout
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.36, ease: EASE_STANDARD, layout: SPRING_FLIP }}
                    className={`catalog-stack-card ${getCatalogStatusClassName(project.status)}`}
                  >
                    <motion.div className="catalog-stack-header" {...FLIP_LAYOUT_PROPS}>
                      <div className="min-w-0">
                        <motion.div className="catalog-project-title-row" {...FLIP_LAYOUT_PROPS}>
                          <p className="catalog-project-title">{project.title}</p>
                          {project.featured ? <span className="catalog-badge">Featured</span> : null}
                        </motion.div>
                        <p className="catalog-project-description">{project.description}</p>
                      </div>
                      <span className={`catalog-status-pill ${getCatalogStatusClassName(project.status)}`}>
                        {project.status}
                      </span>
                    </motion.div>

                    <motion.div className="catalog-stack-meta" {...FLIP_LAYOUT_PROPS}>
                      <div className="catalog-stack-meta-block">
                        <p className="catalog-stat-label">Domain</p>
                        <span className="catalog-domain-pill">{getCatalogDomainLabel(project.domain)}</span>
                      </div>
                      <div className="catalog-stack-meta-block">
                        <p className="catalog-stat-label">Updated</p>
                        <p className="catalog-date-copy">{formatUpdatedAt(project.updatedAt)}</p>
                      </div>
                      <div className="catalog-stack-meta-block">
                        <p className="catalog-stat-label">Source</p>
                        <span className="catalog-source-copy">{project.source}</span>
                      </div>
                    </motion.div>

                    <p className="catalog-tech-copy">{project.techSummary}</p>

                    <motion.div className="catalog-project-meta" {...FLIP_LAYOUT_PROPS}>
                      <span>{project.repoName ? `Repo: ${project.repoName}` : 'Portfolio dossier only'}</span>
                      <span>{project.language}</span>
                    </motion.div>

                    <motion.div className="catalog-link-cluster" {...FLIP_LAYOUT_PROPS}>
                      {project.detailPath ? (
                        <Link to={project.detailPath} className="catalog-inline-link">
                          <span>Dossier</span>
                          <ArrowUpRight size={15} />
                        </Link>
                      ) : null}
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="catalog-inline-link"
                        >
                          <span>GitHub</span>
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                    </motion.div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div className="catalog-table-shell hidden xl:block" {...FLIP_LAYOUT_PROPS}>
              <motion.div className="catalog-table-scroll" {...FLIP_LAYOUT_PROPS}>
                <motion.table className="catalog-table" layout transition={FLIP_LAYOUT_TRANSITION}>
                  <colgroup>
                    <col className="catalog-col-project" />
                    <col className="catalog-col-domain" />
                    <col className="catalog-col-status" />
                    <col className="catalog-col-stack" />
                    <col className="catalog-col-updated" />
                    <col className="catalog-col-source" />
                    <col className="catalog-col-links" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Domain</th>
                      <th>Status</th>
                      <th>Stack</th>
                      <th>Updated</th>
                      <th>Source</th>
                      <th className="text-right">Links</th>
                    </tr>
                  </thead>
                  <motion.tbody layout transition={FLIP_LAYOUT_TRANSITION}>
                    <AnimatePresence initial={false}>
                      {filteredProjects.map((project) => (
                        <motion.tr
                          key={`${project.title}-${project.repoName ?? 'portfolio'}`}
                          layout
                          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                          transition={{ duration: 0.36, ease: EASE_STANDARD, layout: SPRING_FLIP }}
                          className={`catalog-row ${getCatalogStatusClassName(project.status)}`}
                        >
                          <td>
                            <motion.div className="catalog-project-cell" {...FLIP_LAYOUT_PROPS}>
                              <motion.div className="catalog-project-title-row" {...FLIP_LAYOUT_PROPS}>
                                <p className="catalog-project-title">{project.title}</p>
                                {project.featured ? <span className="catalog-badge">Featured</span> : null}
                              </motion.div>
                              <p className="catalog-project-description">{project.description}</p>
                              <motion.div className="catalog-project-meta" {...FLIP_LAYOUT_PROPS}>
                                <span>{project.repoName ? `Repo: ${project.repoName}` : 'Portfolio dossier only'}</span>
                                <span>{project.language}</span>
                              </motion.div>
                            </motion.div>
                          </td>
                          <td>
                            <span className="catalog-domain-pill">{getCatalogDomainLabel(project.domain)}</span>
                          </td>
                          <td>
                            <span className={`catalog-status-pill ${getCatalogStatusClassName(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>
                            <p className="catalog-tech-copy">{project.techSummary}</p>
                          </td>
                          <td>
                            <p className="catalog-date-copy">{formatUpdatedAt(project.updatedAt)}</p>
                          </td>
                          <td>
                            <span className="catalog-source-copy">{project.source}</span>
                          </td>
                          <td>
                            <motion.div className="catalog-link-cluster" {...FLIP_LAYOUT_PROPS}>
                              {project.detailPath ? (
                                <Link to={project.detailPath} className="catalog-inline-link">
                                  <span>Dossier</span>
                                  <ArrowUpRight size={15} />
                                </Link>
                              ) : null}
                              {project.githubUrl ? (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="catalog-inline-link"
                                >
                                  <span>GitHub</span>
                                  <ExternalLink size={15} />
                                </a>
                              ) : null}
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </motion.table>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.main>
      <Footer />
    </LayoutGroup>
  );
}
