import React from 'react'
import { motion } from 'framer-motion'
import { Download, Award, Users, Coffee } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const About: React.FC = () => {
  const skills = [
    { category: 'Frontend', technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', technologies: ['Python', 'Node.js', 'Express', 'FastAPI', 'PostgreSQL'] },
    { category: 'Tools & Others', technologies: ['Git', 'Docker', 'AWS', 'Figma', 'Jest', 'Vite'] },
  ]

  const achievements = [
    {
      icon: Award,
      title: 'Udemy Certificate',
      description: 'Complete Web Development Bootcamp',
      year: '2023',
    },
    {
      icon: Users,
      title: 'Globant Experience',
      description: 'Software Developer Intern',
      year: '2023-2024',
    },
    {
      icon: Coffee,
      title: 'Continuous Learning',
      description: 'Always exploring new technologies',
      year: 'Ongoing',
    },
  ]

  return (
    <>
      <SEOHead
        title="About - Shriyash Sharma"
        description="Learn more about Shriyash Sharma's journey as a software developer, skills, and passion for technology."
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
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-xl text-accent-600 dark:text-accent-400 leading-relaxed">
              Passionate software developer with a love for creating innovative solutions 
              and learning new technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white">
                My Journey
              </h2>
              <div className="space-y-4 text-accent-600 dark:text-accent-400 leading-relaxed">
                <p>
                  My journey into software development began with curiosity about how websites work. 
                  What started as a simple HTML page has evolved into a passion for creating 
                  full-stack applications that solve real-world problems.
                </p>
                <p>
                  I specialize in React and TypeScript for frontend development, with a strong 
                  foundation in Python for backend services. My experience at Globant has given 
                  me valuable insights into enterprise-level development practices and team collaboration.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to 
                  open-source projects, or sharing knowledge with the developer community. I believe 
                  in continuous learning and staying up-to-date with the latest industry trends.
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/resume.pdf" // TODO: Add actual resume file
                  download
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl font-bold">SS</span>
                    </div>
                    <h3 className="text-2xl font-semibold">Shriyash Sharma</h3>
                    <p className="text-white/80">Software Developer</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/80">Location:</span>
                      <span>Remote / On-site</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Experience:</span>
                      <span>1+ Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Availability:</span>
                      <span>Open to Work</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              Skills & Technologies
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              A comprehensive overview of the technologies and tools I work with.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="space-y-3">
                  {skillGroup.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="text-accent-700 dark:text-accent-300">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
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
              Key Achievements
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              Milestones that have shaped my development journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-accent-600 dark:text-accent-400 mb-2">
                    {achievement.description}
                  </p>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {achievement.year}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-accent-50 dark:bg-accent-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-8">
              My Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                  Continuous Learning
                </h3>
                <p className="text-accent-600 dark:text-accent-400">
                  Technology evolves rapidly, and so do I. I'm committed to staying current 
                  with the latest trends and continuously improving my skills.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                  Quality First
                </h3>
                <p className="text-accent-600 dark:text-accent-400">
                  I believe in writing clean, maintainable code and delivering solutions 
                  that not only work but are also scalable and user-friendly.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                  Collaboration
                </h3>
                <p className="text-accent-600 dark:text-accent-400">
                  Great software is built by great teams. I value open communication, 
                  knowledge sharing, and working together toward common goals.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                  Impact-Driven
                </h3>
                <p className="text-accent-600 dark:text-accent-400">
                  I'm motivated by projects that make a real difference, whether it's 
                  improving user experience or solving complex business challenges.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
