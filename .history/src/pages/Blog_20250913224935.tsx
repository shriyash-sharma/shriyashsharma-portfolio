import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react'
import SEOHead from '../components/SEOHead'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedDate: string
  readTime: string
  category: string
  tags: string[]
  featured?: boolean
  externalUrl?: string
}

const Blog: React.FC = () => {
  // TODO: Replace with actual blog posts or connect to CMS
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with React and TypeScript',
      excerpt: 'A comprehensive guide to building modern React applications with TypeScript, covering best practices and common patterns.',
      content: 'Full blog post content would go here...',
      author: 'Shriyash Sharma',
      publishedDate: '2024-01-15',
      readTime: '5 min read',
      category: 'Tutorial',
      tags: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
      featured: true,
    },
    // TODO: Add more blog posts as they become available
  ]

  const categories = ['All', 'Tutorial', 'Technology', 'Career', 'Personal']
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <>
      <SEOHead
        title="Blog - Shriyash Sharma"
        description="Read my thoughts on web development, technology trends, and career insights in software development."
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
              My <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-accent-600 dark:text-accent-400 leading-relaxed">
              Thoughts on web development, technology trends, and insights from my journey 
              as a software developer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-accent-200 dark:border-accent-700">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-accent-100 dark:bg-accent-800 text-accent-700 dark:text-accent-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Category */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-accent-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-accent-600 dark:text-accent-400 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-accent-100 dark:bg-accent-700 text-accent-700 dark:text-accent-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-accent-500 dark:text-accent-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="pt-4">
                      {post.externalUrl ? (
                        <a
                          href={post.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
                        >
                          <span>Read on Medium</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <button className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="card max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-accent-900 dark:text-white mb-4">
                  Coming Soon
                </h3>
                <p className="text-accent-600 dark:text-accent-400 leading-relaxed mb-6">
                  I'm currently working on creating valuable content about web development, 
                  technology trends, and my journey as a software developer. Check back soon for new posts!
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-accent-500 dark:text-accent-500">
                    In the meantime, you can:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/projects"
                      className="btn-primary text-sm"
                    >
                      View My Projects
                    </a>
                    <a
                      href="/contact"
                      className="btn-outline text-sm"
                    >
                      Get In Touch
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup (Optional) */}
      <section className="section-padding bg-accent-50 dark:bg-accent-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-accent-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-accent-600 dark:text-accent-400 mb-6">
              Get notified when I publish new articles about web development and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-accent-500 dark:text-accent-500 mt-2">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Blog
