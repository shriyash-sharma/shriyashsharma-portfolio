import React from 'react'
import { motion } from 'framer-motion'
import ProjectCard, { Project } from '../components/ProjectCard'
import SEOHead from '../components/SEOHead'

const Projects: React.FC = () => {
  // TODO: Replace with actual project data
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with React.js frontend and Python FastAPI backend, featuring modern architecture, user authentication, payment integration, and admin dashboard.',
      longDescription: 'Built a complete e-commerce platform showcasing modern full-stack development with React.js, Next.js, and Python FastAPI. Implemented user authentication, product management, shopping cart functionality, REST APIs, and integrated Stripe for payments. Features modern frontend architecture with Tailwind CSS and responsive design.',
      image: '/placeholder-project-1.jpg', // TODO: Replace with actual project images
      technologies: ['React.js', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'REST APIs', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      githubUrl: 'https://github.com/shriyashsharma/ecommerce-platform', // TODO: Replace with actual URLs
      demoUrl: 'https://ecommerce-demo.shriyashsharma.com', // TODO: Replace with actual URLs
      featured: true,
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application built with React.js and modern architecture, featuring real-time updates, team collaboration, and drag-and-drop functionality.',
      longDescription: 'Developed a comprehensive task management application using React.js, Next.js, and modern frontend architecture with real-time collaboration. Features include drag-and-drop task boards, team member assignment, deadline tracking, REST APIs, and progress visualization with responsive design.',
      image: '/placeholder-project-2.jpg', // TODO: Replace with actual project images
      technologies: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'REST APIs', 'Framer Motion'],
      githubUrl: 'https://github.com/shriyashsharma/task-manager', // TODO: Replace with actual URLs
      demoUrl: 'https://taskmanager-demo.shriyashsharma.com', // TODO: Replace with actual URLs
      featured: true,
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard built with React.js and TypeScript, featuring location-based forecasts, interactive maps, and modern data visualization.',
      longDescription: 'Created a weather dashboard using React.js, Next.js, and TypeScript with modern frontend architecture. Integrated with multiple REST APIs to provide accurate forecasts, historical data, and severe weather alerts with responsive design and interactive maps.',
      image: '/placeholder-project-3.jpg', // TODO: Replace with actual project images
      technologies: ['React.js', 'Next.js', 'TypeScript', 'Chart.js', 'Leaflet', 'REST APIs', 'Tailwind CSS', 'HTML5 & CSS3'],
      githubUrl: 'https://github.com/shriyashsharma/weather-dashboard', // TODO: Replace with actual URLs
      demoUrl: 'https://weather-demo.shriyashsharma.com', // TODO: Replace with actual URLs
      featured: false,
    },
  ]

  return (
    <>
      <SEOHead
        title="Projects by Shiryash Sharma - Senior Software Developer | React.js, Next.js, Python Portfolio"
        description="Explore the portfolio of Shiryash Sharma, featuring React.js, Next.js, Python full-stack projects and innovative web applications. Contact Shiryash Sharma for custom development."
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
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-accent-600 dark:text-accent-400 leading-relaxed">
              A collection of projects by Shiryash Sharma, a Senior Software Developer 
              showcasing expertise in React.js, Next.js, Python full-stack development, and modern web architecture. 
              Discover innovative solutions created by Shiryash Sharma.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
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
              Featured Projects
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              Here are some of the most recent and impactful projects by Shiryash Sharma that demonstrate 
              capabilities as a Senior Software Developer specializing in React.js, Next.js, and Python.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects
              .filter(project => project.featured)
              .map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
          </div>
        </div>
      </section>

      {/* All Projects */}
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
              All Projects
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              Explore my complete portfolio of projects, from simple tools to complex applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white">
              Interested in Working Together?
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400">
              I'm always excited to take on new challenges and create innovative solutions. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Start a Project</span>
              </a>
              <a
                href="https://github.com/shriyashsharma" // TODO: Replace with actual GitHub URL
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <span>View on GitHub</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Projects
