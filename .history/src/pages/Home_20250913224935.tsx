import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, ArrowRight, Code, Database, Globe } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const Home: React.FC = () => {
  const skills = [
    { name: 'Frontend Development', icon: Globe, description: 'React, TypeScript, Next.js' },
    { name: 'Backend Development', icon: Database, description: 'Python, Node.js, Express' },
    { name: 'Full-Stack Solutions', icon: Code, description: 'End-to-end web applications' },
  ]

  return (
    <>
      <SEOHead
        title="Shriyash Sharma - Software Developer"
        description="Software Developer specializing in React, TypeScript, and Python. Looking for full-time roles."
      />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold text-accent-900 dark:text-white leading-tight"
                >
                  Hi — I'm{' '}
                  <span className="gradient-text">Shriyash Sharma</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl md:text-2xl text-accent-700 dark:text-accent-300"
                >
                  Software Developer | React & Python
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-lg text-accent-600 dark:text-accent-400 leading-relaxed"
                >
                  Passionate about creating innovative solutions and learning new technologies. 
                  Currently looking for full-time opportunities to make an impact.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/contact"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Get In Touch</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <a
                  href="/resume.pdf" // TODO: Add actual resume file
                  download
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-2xl" />
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20" />
                
                {/* Floating Code Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-8 left-8 text-white/80 font-mono text-sm"
                >
                  <div className="bg-black/20 p-2 rounded backdrop-blur-sm">
                    {'<div className="hero">'}
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-8 right-8 text-white/80 font-mono text-sm"
                >
                  <div className="bg-black/20 p-2 rounded backdrop-blur-sm">
                    {'def create_impact():'}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
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
              What I Do
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              I specialize in creating modern, scalable web applications with a focus on user experience and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
                    {skill.name}
                  </h3>
                  <p className="text-accent-600 dark:text-accent-400">
                    {skill.description}
                  </p>
                </motion.div>
              )
            })}
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
              Ready to Work Together?
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400">
              I'm always excited to discuss new opportunities, innovative projects, 
              or just chat about technology. Let's connect!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Start a Conversation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/projects"
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <span>View My Work</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home
