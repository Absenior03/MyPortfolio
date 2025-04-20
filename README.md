# Anirban Banerjee - Interactive Portfolio

A visually stunning, scroll-interactive personal portfolio website showcasing my skills, experience, projects, and more.

## 🚀 Features

- **Interactive 3D Elements**: Using Three.js/React Three Fiber for immersive 3D visuals
- **Smooth Scroll Animations**: GSAP-powered scroll triggers and animations
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, modern design with interactive elements and animations
- **Dark Mode**: Dark-themed UI for a professional look
- **Interactive Sections**: Projects showcase, skills visualization, testimonials slider
- **Contact Form**: Interactive contact form with validation

## 🛠️ Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Three.js/React Three Fiber**: 3D graphics and animations
- **GSAP**: Advanced animations and scroll triggers
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **React Router**: Client-side routing

## 🏗️ Project Structure

- **src/components**: UI components (Navbar, Hero, etc.)
- **src/components/canvas**: Three.js canvas components
- **src/constants**: Data constants for the portfolio
- **src/utils**: Utility functions for animations and other helpers
- **src/styles**: Global styles and Tailwind configuration
- **src/types**: TypeScript type definitions
- **src/assets**: Images, icons, and other static assets

## 📋 Sections

1. **Hero**: Animated introduction with 3D computer visualization
2. **About Me**: Background, timeline, and personal information
3. **Experience**: Work and educational experience with interactive timeline
4. **Projects**: Showcase of projects with detailed cards
5. **Skills**: Interactive 3D visualization of technical skills
6. **Testimonials**: Animated slider with testimonials
7. **Contact**: Form and contact information with animations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. The site will be available at `http://localhost:3000`

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:

- Desktop: 1024px and above
- Tablet: 768px to 1024px
- Mobile: Below 768px

## 🌙 Future Enhancements

- Blog/Article section
- More advanced 3D interactions
- Project filtering options
- Light/Dark mode toggle
- Performance optimizations for mobile

## 👤 About the Developer

Anirban Banerjee is a full-stack developer and MCA student specializing in React, Node.js, and cloud technologies. With a passion for creating scalable web applications and optimizing performance, Anirban brings technical expertise and creative problem-solving to every project.

## 📝 License

This project is licensed under the MIT License.

## Deploying to Vercel

This portfolio website is optimized for deployment on Vercel.

### One-Click Deployment

The easiest way to deploy your portfolio is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository on Vercel
3. Vercel will detect that you're using Next.js and will set up the appropriate build settings

### Manual Deployment

You can also deploy manually using the Vercel CLI:

1. Install the Vercel CLI

```bash
npm install -g vercel
```

2. Deploy to Vercel

```bash
vercel
```

3. For production deployment:

```bash
vercel --prod
```

## Customization

1. Update the content in the `src/constants` directory to personalize the website
2. Modify the styling by editing the TailwindCSS configuration in `tailwind.config.js`
3. Change the 3D models in the `public/models` directory
4. Add your own images in the `public/images` directory
