import React from 'react'
import { motion } from 'framer-motion'
import TimelineItem, { Experience } from '../components/TimelineItem'
import SEOHead from '../components/SEOHead'

const ExperiencePage: React.FC = () => {
  // TODO: Replace with actual experience data
  const experiences: Experience[] = [
    {
      id: '1',
      title: 'Software Developer Intern',
      company: 'Globant',
      location: 'Remote',
      startDate: 'June 2023',
      endDate: 'December 2023',
      description: 'Worked as a Software Developer Intern at Globant, contributing to enterprise-level projects and gaining valuable experience in modern development practices.',
      responsibilities: [
        'Developed and maintained web applications using React and TypeScript',
        'Collaborated with cross-functional teams in an Agile environment',
        'Participated in code reviews and implemented best practices',
        'Worked with RESTful APIs and database integration',
        'Contributed to UI/UX improvements and responsive design implementation',
        'Assisted in testing and debugging applications',
      ],
      technologies: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git', 'Agile', 'REST APIs'],
      companyUrl: 'https://www.globant.com',
      current: false,
    },
    // TODO: Add more experience entries as they become available
  ]

  const skills = [
    { category: 'Programming Languages', items: ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS'] },
    { category: 'Frameworks & Libraries', items: ['React', 'Node.js', 'Express', 'FastAPI', 'Next.js'] },
    { category: 'Tools & Technologies', items: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'Jest'] },
    { category: 'Methodologies', items: ['Agile', 'Scrum', 'Test-Driven Development', 'RESTful APIs'] },
  ]

  return (
    <>
      <SEOHead
        title="Experience - Shriyash Sharma"
        description="Explore my professional experience, skills, and career journey as a software developer."
      />

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-accent-900 dark:text-white mb-6">
              My <span className="gradient-text">Experience</span>
            </h1>
            <p className="text-xl text-accent-600 dark:text-accent-400 leading-relaxed">
              A journey through my professional experience, skills development, 
              and the projects that have shaped my career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-4">
              Professional Experience
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              My career journey and the valuable experiences that have contributed to my growth as a developer.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {experiences.map((experience, index) => (
              <TimelineItem
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </div>

          {/* No Experience Message */}
          {experiences.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="card max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-accent-900 dark:text-white mb-4">
                  Building My Experience
                </h3>
                <p className="text-accent-600 dark:text-accent-400 leading-relaxed">
                  I'm currently building my professional experience through personal projects, 
                  open-source contributions, and continuous learning. Check out my projects 
                  to see what I've been working on!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-accent-50 dark:bg-accent-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              The technologies and methodologies I've learned and applied throughout my journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-4">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="tech-badge"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-4">
              Education & Certifications
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              My educational background and professional certifications.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                    Complete Web Development Bootcamp
                  </h3>
                  <p className="text-accent-600 dark:text-accent-400">
                    Udemy - Online Course
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    2023
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-accent-600 dark:text-accent-400">
                  Comprehensive course covering HTML, CSS, JavaScript, React, Node.js, 
                  and various web development tools and technologies.
                </p>
              </div>
            </motion.div>

            {/* TODO: Add more education entries as they become available */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-accent-50 dark:bg-accent-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white">
              Ready to Add More Experience?
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400">
              I'm actively seeking new opportunities to grow and contribute to innovative projects. 
              Let's connect and explore how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Get In Touch</span>
              </a>
              <a
                href="/resume.pdf" // TODO: Add actual resume file
                download
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <span>Download Resume</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default ExperiencePage
