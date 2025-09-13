# Shriyash Sharma Portfolio

A modern, responsive personal portfolio website built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional design with dark/light theme toggle
- **Responsive**: Fully responsive design that works on all devices
- **Fast**: Built with Vite for optimal performance
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessible**: WCAG compliant with proper ARIA labels
- **Type Safe**: Built with TypeScript for better development experience
- **Animated**: Smooth animations with Framer Motion
- **Contact Form**: Functional contact form with validation

## 📋 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router
- **Animations**: Framer Motion
- **SEO**: React Helmet Async
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## 🛠️ Installation

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shriyashsharma/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your actual values:
   ```env
   VITE_CONTACT_EMAIL=shriyash@shriyashsharma.com
   VITE_GITHUB_URL=https://github.com/shriyashsharma
   VITE_LINKEDIN_URL=https://linkedin.com/in/shriyashsharma
   VITE_SITE_URL=https://shriyashsharma.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🎨 Customization

### Content Updates

1. **Personal Information**
   - Update personal details in `/src/pages/Home.tsx`
   - Modify about section in `/src/pages/About.tsx`
   - Add your experience in `/src/pages/Experience.tsx`

2. **Projects**
   - Replace placeholder projects in `/src/pages/Projects.tsx`
   - Add your actual project images to `/public/`
   - Update project URLs and descriptions

3. **Contact Information**
   - Update email in `/src/components/ContactForm.tsx`
   - Modify social links in `/src/components/Footer.tsx`
   - Configure contact form (see Contact Form Setup below)

4. **Images**
   - Replace placeholder images in `/public/`
   - Add your resume PDF to `/public/resume.pdf`
   - Update favicon and Open Graph image

### Styling

- Colors and themes are configured in `/tailwind.config.cjs`
- Custom styles are in `/src/styles/index.css`
- Component styles use Tailwind utility classes

### Contact Form Setup

Choose one of the following options:

#### Option 1: Formspree (Recommended)

1. Sign up at [formspree.io](https://formspree.io/)
2. Create a new form
3. Copy your form endpoint
4. Update `VITE_FORMSPREE_ENDPOINT` in `.env`

#### Option 2: Netlify Forms

1. Deploy to Netlify
2. Add `netlify` attribute to your form
3. No additional configuration needed

#### Option 3: Email Service

Replace the form submission logic in `/src/components/ContactForm.tsx` with your preferred email service.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Go to [vercel.com](https://vercel.com/)
   - Import your GitHub repository

2. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy" and your site will be live!

### Netlify

1. **Connect your repository**
   - Go to [netlify.com](https://netlify.com/)
   - Import your GitHub repository

2. **Configure build settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Deploy**
   - Click "Deploy site" and your site will be live!

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## 📧 Email Setup

The contact form is configured to send emails to `shriyash@shriyashsharma.com`. 

### Zoho Email Configuration

If you're using Zoho for email hosting:

1. **Domain Setup**
   - Add your domain to Zoho Mail
   - Configure DNS records as instructed by Zoho

2. **Email Configuration**
   - Create the email address `shriyash@shriyashsharma.com`
   - Configure email forwarding if needed

3. **Form Integration**
   - Use Formspree or Netlify Forms for form handling
   - Emails will be sent to your configured address

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── ProjectCard.tsx # Project display component
│   ├── ContactForm.tsx # Contact form
│   ├── TimelineItem.tsx # Experience timeline
│   └── SEOHead.tsx     # SEO meta tags
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Projects.tsx    # Projects showcase
│   ├── Experience.tsx  # Work experience
│   ├── Blog.tsx        # Blog posts
│   ├── Contact.tsx     # Contact page
│   └── NotFound.tsx    # 404 page
├── styles/             # Global styles
│   └── index.css       # Tailwind and custom styles
├── test/               # Test configuration
└── main.tsx           # App entry point
```

## 🔧 Configuration Files

- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `netlify.toml` - Netlify deployment configuration
- `vercel.json` - Vercel deployment configuration

## 📝 TODO Items

Before going live, make sure to:

- [ ] Replace all placeholder content with your actual information
- [ ] Update project images and descriptions
- [ ] Add your actual resume PDF
- [ ] Configure contact form with your preferred service
- [ ] Update social media links
- [ ] Set up custom domain (if desired)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Test all functionality on different devices
- [ ] Optimize images for web
- [ ] Set up sitemap.xml generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need help with setup, feel free to reach out:

- Email: shriyash@shriyashsharma.com
- LinkedIn: [linkedin.com/in/shriyashsharma](https://linkedin.com/in/shriyashsharma)
- GitHub: [github.com/shriyashsharma](https://github.com/shriyashsharma)

---

**Happy coding! 🚀**
