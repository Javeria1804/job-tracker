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

## 🚀 Build and Deploy

### Build for Production
```bash
npm run build
```