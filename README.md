# Job Application Tracker

A beautiful and intuitive React web application for tracking job applications with a modern UI/UX design.

## 🚀 Features

### Core Functionality
- **Dashboard**: View all job applications with beautiful cards and statistics
- **Add Job**: Easy-to-use form for adding new job applications
- **Job Details**: Detailed view with edit and delete capabilities
- **Status Management**: Track application status (Applied, Interviewing, Offer, Rejected)

### Advanced Features
- **Search & Filter**: Find jobs by company, position, or status
- **Sort Options**: Sort by date, company, position, or status
- **Export/Import**: Download data as JSON or import from existing files
- **Responsive Design**: Optimized for mobile and desktop
- **Local Storage**: Data persists between sessions
- **Beautiful UI**: Modern design with Tailwind CSS and Lucide icons

### Statistics & Analytics
- Total applications count
- Response rate calculation
- Success rate tracking
- Status distribution

## 🛠 Technologies Used

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing for navigation
- **Context API** - Global state management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Local Storage** - Client-side data persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗 Project Structure

```
src/
├── components/
│   └── Layout.js              # Main layout component with sidebar
├── context/
│   └── JobContext.js          # Global state management
├── hooks/
│   └── index.js               # Custom React hooks
├── pages/
│   ├── Dashboard.js           # Main dashboard with job list
│   ├── AddJob.js              # Add new job form
│   ├── JobDetails.js          # Job details and edit page
│   └── NotFound.js            # 404 error page
├── utils/
│   └── helpers.js             # Utility functions
├── App.js                     # Main app component with routing
├── index.js                   # App entry point
└── index.css                  # Tailwind CSS and custom styles
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#2563eb) for main actions and highlights
- **Success**: Green for offers and positive actions
- **Warning**: Yellow for in-progress states
- **Danger**: Red for rejections and delete actions

### Components
- **Cards**: Elevated design with soft shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Clean inputs with focus states
- **Status Badges**: Color-coded for easy recognition

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile
- Flexible grid layouts
- Touch-friendly interactions

## 📱 Usage Guide

### Adding a Job Application
1. Click "Add Job" in the sidebar or dashboard
2. Fill in company name, position, and status
3. Set the application date
4. Add optional notes
5. Click "Add Job Application"

### Managing Applications
- **View Details**: Click on any job card or use the eye icon
- **Edit**: Use the edit button in job details or table
- **Delete**: Use the delete button (with confirmation)
- **Search**: Use the search bar to find specific jobs
- **Filter**: Filter by status using the filters panel

### Data Management
- **Export**: Download all data as JSON file
- **Import**: Upload JSON file to restore data
- **Local Storage**: Data automatically saves to browser

## 🔧 Customization

### Adding New Status Types
Edit `src/context/JobContext.js` and update the `JOB_STATUSES` object:

```javascript
export const JOB_STATUSES = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  // Add new status here
  CUSTOM_STATUS: 'Custom Status'
};
```

### Styling Customization
Modify `tailwind.config.js` to change colors, fonts, or other design tokens.

## 🚀 Build and Deploy

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **Any Static Hosting**: Upload `build` folder contents

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📈 Future Enhancements

- [ ] Integration with job board APIs
- [ ] Email notifications and reminders
- [ ] Calendar integration
- [ ] Advanced analytics and charts
- [ ] Team collaboration features
- [ ] Dark mode support
- [ ] Offline functionality with PWA
- [ ] CSV export/import
- [ ] Interview scheduling
- [ ] Salary tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 🎯 Covered Topics

This project demonstrates proficiency in:

- ✅ **React** - Modern component architecture
- ✅ **React Router** - Client-side navigation
- ✅ **Form Handling** - Validation and state management
- ✅ **State Management** - Context API implementation
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **LocalStorage** - Data persistence
- ✅ **Modern UI/UX** - Beautiful and intuitive interface

---

Built with ❤️ using React and Tailwind CSS

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
