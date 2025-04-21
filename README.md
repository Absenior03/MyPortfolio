# Anirban Banerjee's Portfolio

A modern, interactive portfolio website built with React, Next.js, and Three.js.

## 🚀 Deployment Requirements

This project uses Three.js and related libraries for 3D visualizations. When deploying, please ensure you have the following version requirements:

```json
"dependencies": {
  "three": "^0.159.0",
  "@react-three/drei": "^9.88.0",
  "@react-three/fiber": "^8.15.11"
}
```

## 🛠️ Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/Absenior03/MyPortfolio.git
cd MyPortfolio
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Start the production server:

```bash
npm start
```

## 🔍 Troubleshooting Deployment

If you encounter Three.js related errors during deployment, make sure:

1. You have the correct versions of Three.js, @react-three/drei, and @react-three/fiber as specified above
2. The package-lock.json is committed to your repository
3. Your deployment platform is using the correct Node.js version (14.x or higher)

### Common Errors

- **'BatchedMesh' is not exported from 'three'**: This indicates a version mismatch. Update to three.js ^0.159.0 to resolve.

## 🧰 Technologies Used

- React
- Next.js
- Three.js
- Framer Motion
- Tailwind CSS
- TypeScript

## 📝 Contact Information

- **Email**: anirbanbanerjee1087@gmail.com
- **GitHub**: [Absenior03](https://github.com/Absenior03)
- **LinkedIn**: [Anirban Banerjee](https://www.linkedin.com/in/anirban-banerjee-b8a75b1a9/)

## 🚀 Features

- **Interactive 3D Elements**: Using Three.js/React Three Fiber for immersive 3D visuals
- **Smooth Scroll Animations**: GSAP-powered scroll triggers and animations
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, modern design with interactive elements and animations
- **Dark Mode**: Dark-themed UI for a professional look
- **Interactive Sections**: Projects showcase, skills visualization, testimonials slider
- **Contact Form**: Interactive contact form with validation

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
