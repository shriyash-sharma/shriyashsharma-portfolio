import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Github, Linkedin, Twitter } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import SEOHead from '../components/SEOHead'

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'shriyash@shriyashsharma.com',
      href: 'mailto:shriyash@shriyashsharma.com',
      description: 'Send me an email anytime',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91-9755512040', // TODO: Replace with actual phone number
      href: 'tel:+15551234567',
      description: 'Available for calls',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Remote / On-site',
      href: null,
      description: 'Open to remote and on-site work',
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24 hours',
      href: null,
      description: 'I typically respond quickly',
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      href: 'https://github.com/shriyashsharma', // TODO: Replace with actual GitHub URL
      description: 'Check out my code',
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/shriyashsharma', // TODO: Replace with actual LinkedIn URL
      description: 'Connect professionally',
    },
    {
      icon: Twitter,
      name: 'Twitter',
      href: 'https://twitter.com/shriyashsharma', // TODO: Replace with actual Twitter URL
      description: 'Follow for updates',
    },
  ]

  return (
    <>
      <SEOHead
        title="Contact - Shriyash Sharma"
        description="Get in touch with Shriyash Sharma for collaboration, job opportunities, or just to say hello."
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
              Let's <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-xl text-accent-600 dark:text-accent-400 leading-relaxed">
              I'm always excited to discuss new opportunities, innovative projects, 
              or just chat about technology. Don't hesitate to reach out!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-accent-900 dark:text-white mb-4">
                  Get In Touch
                </h2>
                <p className="text-lg text-accent-600 dark:text-accent-400 leading-relaxed">
                  Whether you have a project in mind, want to collaborate, or just want to say hello, 
                  I'd love to hear from you. Choose the method that works best for you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-accent-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-accent-700 dark:text-accent-300">
                            {item.value}
                          </p>
                        )}
                        <p className="text-sm text-accent-500 dark:text-accent-500">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-4">
                  Follow Me
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-accent-100 dark:bg-accent-800 rounded-lg flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors duration-200 group"
                        title={social.description}
                      >
                        <Icon className="h-6 w-6 text-accent-600 dark:text-accent-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-700"
              >
                <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-2">
                  Currently Available
                </h3>
                <p className="text-accent-600 dark:text-accent-400 text-sm">
                  I'm actively looking for new opportunities and exciting projects. 
                  Whether it's full-time positions, freelance work, or collaboration, 
                  I'm ready to contribute to meaningful work.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-accent-50 dark:bg-accent-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-accent-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400 max-w-2xl mx-auto">
              Quick answers to common questions about working together.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'What types of projects are you interested in?',
                answer: 'I\'m passionate about web applications, particularly full-stack solutions that solve real-world problems. I enjoy working with React, TypeScript, and Python, and I\'m always excited to learn new technologies.',
              },
              {
                question: 'What is your availability?',
                answer: 'I\'m currently available for full-time positions, freelance projects, and collaboration opportunities. I can work remotely or on-site, depending on the project requirements.',
              },
              {
                question: 'How quickly do you respond to messages?',
                answer: 'I typically respond to emails and messages within 24 hours. For urgent matters, feel free to mention it in your message, and I\'ll prioritize your request.',
              },
              {
                question: 'Do you work with teams or clients?',
                answer: 'Absolutely! I have experience working in team environments and enjoy collaboration. I\'m comfortable working with clients, project managers, designers, and other developers.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-accent-600 dark:text-accent-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
