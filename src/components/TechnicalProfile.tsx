import { motion } from 'motion/react';
import { useRef } from 'react';
import { technicalIntro, technicalRows } from '../content/home';

export default function TechnicalProfile() {
  const ref = useRef(null);

  return (
    <section ref={ref} className="section-shell section-shell--framed">
      <div className="section-intro">
        <div className="section-rail">
          <h2 className="section-label">
            5.0 / Technical Profile
          </h2>
        </div>
        <div className="section-content section-copy section-copy-stage">
          <div aria-hidden="true" className="section-copy-rule" />
          {technicalIntro.map((paragraph, index) => (
            <p
              key={paragraph.text}
              className={
                paragraph.tone === 'lead'
                  ? 'section-copy-lead'
                  : index === technicalIntro.length - 1
                    ? 'section-copy-closing'
                    : 'section-copy-body'
              }
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </div>

      <div className="section-list">
        {technicalRows.map(([label, value], i) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.28, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
            className="profile-row data-row py-10 md:py-11"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
              <div className="md:col-span-4">
                <div className="flex items-start gap-4">
                  <span className="hero-stat-index mt-[0.32rem]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="profile-row-label">{label}</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <p className="profile-row-value">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
