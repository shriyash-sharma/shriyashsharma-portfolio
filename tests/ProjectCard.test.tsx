import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProjectCard from '../src/components/ProjectCard'

// Mock the framer-motion module
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    title: 'Test Project',
    description: 'A test project description',
    longDescription: 'A longer description of the test project',
    image: '/test-image.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/test/test-project',
    demoUrl: 'https://demo.test-project.com',
    featured: true,
  }

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} index={0} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
    expect(screen.getByAltText('Test Project')).toBeInTheDocument()
  })

  it('renders technology badges', () => {
    render(<ProjectCard project={mockProject} index={0} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
  })

  it('renders GitHub and Demo links', () => {
    render(<ProjectCard project={mockProject} index={0} />)
    
    const githubLink = screen.getByRole('link', { name: /code/i })
    const demoLink = screen.getByRole('link', { name: /live demo/i })
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/test-project')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    expect(demoLink).toHaveAttribute('href', 'https://demo.test-project.com')
    expect(demoLink).toHaveAttribute('target', '_blank')
    expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles missing URLs gracefully', () => {
    const projectWithoutUrls = {
      ...mockProject,
      githubUrl: undefined,
      demoUrl: undefined,
    }
    
    render(<ProjectCard project={projectWithoutUrls} index={0} />)
    
    expect(screen.queryByRole('link', { name: /code/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument()
  })

  it('applies correct image attributes', () => {
    render(<ProjectCard project={mockProject} index={0} />)
    
    const image = screen.getByAltText('Test Project')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
  })
})
