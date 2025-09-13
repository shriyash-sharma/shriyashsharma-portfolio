import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/shriyashsharma', // TODO: Replace with actual GitHub URL
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/shriyashsharma', // TODO: Replace with actual LinkedIn URL
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:shriyash@shriyashsharma.com',
      icon: Mail,
    },
  ]

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/experience' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-accent-50 dark:bg-accent-800 border-t border-accent-200 dark:border-accent-700">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
            >
              Shriyash Sharma
            </Link>
            <p className="text-accent-600 dark:text-accent-400 text-sm leading-relaxed">
              Software Developer specializing in React, TypeScript, and Python. 
              Passionate about creating innovative solutions and learning new technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white dark:bg-accent-700 hover:bg-accent-100 dark:hover:bg-accent-600 text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white">
              Get In Touch
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:shriyash@shriyashsharma.com"
                className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>shriyash@shriyashsharma.com</span>
              </a>
              <div className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 text-sm">
                <span>📱 +91-9755512040</span>
              </div>
              <div className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 text-sm">
                <span>📍 Available for remote work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-accent-200 dark:border-accent-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-accent-600 dark:text-accent-400 text-sm">
              © {currentYear} Shriyash Sharma. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
