import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  responsibilities: string[]
  technologies: string[]
  companyUrl?: string
  current?: boolean
}

interface TimelineItemProps {
  experience: Experience
  index: number
}

const TimelineItem: React.FC<TimelineItemProps> = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500" />
      
      {/* Timeline Dot */}
      <div className="absolute left-3 top-6 w-2 h-2 bg-primary-500 rounded-full ring-4 ring-white dark:ring-accent-900" />
      
      {/* Content */}
      <div className="ml-12 pb-12">
        <div className="card">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
                {experience.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {experience.companyUrl ? (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    <span className="font-medium">{experience.company}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="font-medium text-accent-700 dark:text-accent-300">
                    {experience.company}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 md:mt-0 text-sm text-accent-600 dark:text-accent-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {experience.startDate} - {experience.endDate || 'Present'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{experience.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-accent-600 dark:text-accent-400 mb-4 leading-relaxed">
            {experience.description}
          </p>

          {/* Responsibilities */}
          <div className="mb-4">
            <h4 className="font-medium text-accent-900 dark:text-white mb-2">
              Key Responsibilities:
            </h4>
            <ul className="space-y-1">
              {experience.responsibilities.map((responsibility, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-2 text-sm text-accent-600 dark:text-accent-400"
                >
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="font-medium text-accent-900 dark:text-white mb-2">
              Technologies:
            </h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="tech-badge"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TimelineItem
