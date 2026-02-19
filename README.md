# 🏥 Lifeline Hospital — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A modern, fully responsive hospital management frontend built with React.js and Tailwind CSS. Patients can book appointments, chat with doctors, download prescriptions and manage their health — all in one platform.

**🔗 Live Demo:** [hospital-frontend.vercel.app](https://hospital-frontend.vercel.app)
**🔗 Backend Repo:** [github.com/AmirSohelSardar/hospitalbackend](https://github.com/AmirSohelSardar/hospitalbackend)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Components](#-pages--components)
- [Authentication Flow](#-authentication-flow)
- [Role-Based Access](#-role-based-access)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 Patient Features
- ✅ Register and login with email verification
- ✅ Browse and search doctors by specialization
- ✅ View detailed doctor profiles (qualifications, experience, time slots, reviews)
- ✅ Book appointments by selecting date and available time slot
- ✅ Stripe payment integration for appointment fees
- ✅ View all bookings with payment status (Paid / Unpaid)
- ✅ Download professional PDF prescriptions after paid appointments
- ✅ Submit star ratings and written reviews for doctors
- ✅ Upgrade to Premium User for exclusive features
- ✅ Profile management (photo, blood type, gender)
- ✅ Delete account option

### 👑 Premium Patient Features
- ✅ Real-time chat with booked doctors (polling every 3 seconds)
- ✅ View analytics and health insights dashboard
- ✅ Premium badge on profile

### 👨‍⚕️ Doctor Features
- ✅ Register as a doctor with full profile setup
- ✅ Upload qualifications and experience certificates to Cloudinary
- ✅ Set available time slots for each day of the week
- ✅ Set ticket price for appointments
- ✅ View all patient appointments in dashboard
- ✅ Provide prescriptions to patients
- ✅ View and reply to patient chat messages
- ✅ Overview dashboard with ratings and reviews

### 🛡️ Admin Features
- ✅ View and manage all registered doctors
- ✅ Edit any doctor profile (specialization, ticket price, time slots, qualifications, experience)
- ✅ Approve or reject doctor registrations
- ✅ View all registered patients
- ✅ Analytics dashboard with charts (Chart.js)
- ✅ Platform insights and booking statistics

### 🌐 General Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Beautiful landing page with services, testimonials, FAQ
- ✅ Doctor search and filter by specialization
- ✅ Top Rated badge for highest rated doctors
- ✅ Email verification on registration
- ✅ Password reset via email link
- ✅ Toast notifications for all actions

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | UI framework |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Styling & responsive design |
| React Router DOM | 6.x | Client-side routing |
| Context API | built-in | Global state management |
| React Toastify | latest | Toast notifications |
| React Spinners | latest | Loading indicators |
| React Icons | latest | Icon library |
| Chart.js | latest | Analytics charts |
| React Hook Form | latest | Form handling |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/          # Static images, icons
│   ├── components/
│   │   ├── Doctors/         # DoctorCard, DoctorList
│   │   ├── Error/           # Error component
│   │   ├── Footer/          # Footer
│   │   ├── Header/          # Navbar, mobile menu
│   │   ├── Loader/          # Loading spinner
│   │   ├── Routers/         # Protected routes
│   │   └── Testimonial/     # Patient testimonials
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── Dashboard/
│   │   ├── admin-account/   # Admin dashboard components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditDoctorModal.jsx
│   │   │   ├── ViewAllDoctors.jsx
│   │   │   └── ViewUsers.jsx
│   │   ├── doctor-account/  # Doctor dashboard components
│   │   │   ├── Appointments.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DoctorChats.jsx
│   │   │   ├── ChatWithPatient.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Tabs.jsx
│   │   └── user-account/    # Patient dashboard components
│   │       ├── MyAccount.jsx
│   │       ├── MyBookings.jsx
│   │       ├── Modal.jsx
│   │       └── Profile.jsx
│   ├── hooks/
│   │   └── useFetchData.js  # Custom data fetching hook
│   ├── pages/
│   │   ├── Doctors/         # Doctor detail, feedback, chat
│   │   │   ├── Chat.jsx
│   │   │   ├── DoctorsAbout.jsx
│   │   │   ├── DoctorsDetails.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── FeedbackForm.jsx
│   │   │   └── SidePanel.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Contact.jsx
│   │   ├── Services.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── CheckoutSuccess.jsx
│   ├── utils/
│   │   ├── formateDate.js
│   │   ├── covertTime.js
│   │   └── uploadCloudinary.js
│   ├── config.js            # API base URL config
│   ├── App.jsx              # Root component & routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Backend server running (see backend repo)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/AmirSohelSardar/hospitalfrontend.git
cd hospitalfrontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env` file in the root:**
```env
VITE_BASE_URL=http://localhost:5000/api/v1
```

**4. Start the development server:**
```bash
npm run dev
```

**5. Open in browser:**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

For production deployment on Vercel, add:
```
VITE_BASE_URL=https://your-backend.vercel.app/api/v1
```

---

## 📄 Pages & Components

### Public Pages
| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, services, doctors, testimonials |
| `/doctors` | Doctors | Browse all approved doctors with search |
| `/doctors/:id` | Doctor Detail | Full doctor profile, reviews, booking panel |
| `/login` | Login | Patient, Doctor login |
| `/register` | Register | Patient, Doctor registration with photo upload |
| `/forgot-password` | Forgot Password | Send reset email |
| `/reset-password/:token` | Reset Password | Set new password |
| `/services` | Services | Hospital services overview |
| `/contact` | Contact | Contact form |

### Protected Pages
| Route | Role | Description |
|---|---|---|
| `/users/profile/me` | Patient | Bookings, chat, profile settings |
| `/doctors/profile/me` | Doctor | Overview, appointments, chat, profile |
| `/admin/profile/me` | Admin | Manage doctors, patients, analytics |
| `/checkout-success` | Patient | Payment success page |

---

## 🔑 Authentication Flow

```
Register → Email Verification → Login → JWT Token stored in localStorage
                                           ↓
                              Role check (patient/doctor/admin)
                                           ↓
                              Redirect to respective dashboard
```

- JWT token stored in `localStorage`
- Token sent with every API request in `Authorization: Bearer <token>` header
- `AuthContext` manages global auth state across the app
- Protected routes check role before rendering

---

## 👥 Role-Based Access

| Feature | Patient | Premium Patient | Doctor | Admin |
|---|---|---|---|---|
| Browse doctors | ✅ | ✅ | ✅ | ✅ |
| Book appointment | ✅ | ✅ | ❌ | ❌ |
| Download prescription | ✅ | ✅ | ❌ | ❌ |
| Chat with doctor | ❌ | ✅ | ✅ | ❌ |
| Submit review | ✅ | ✅ | ❌ | ❌ |
| Manage profile | ✅ | ✅ | ✅ | ❌ |
| Edit any doctor | ❌ | ❌ | ❌ | ✅ |
| Approve doctors | ❌ | ❌ | ❌ | ✅ |
| View analytics | ❌ | ✅ | ✅ | ✅ |

---

## 🚀 Deployment on Vercel

**1. Push to GitHub**
**2. Go to [vercel.com](https://vercel.com) → New Project → Import repo**
**3. Configure:**
```
Framework Preset : Vite
Build Command    : npm run build
Output Directory : dist
```
**4. Add environment variable:**
```
VITE_BASE_URL = https://your-backend.vercel.app/api/v1
```
**5. Click Deploy**

---

## 👨‍💻 Developer

**Amir Sohel Sardar**
- GitHub: [@AmirSohelSardar](https://github.com/AmirSohelSardar)
- Email: sohelamirsohel786@gmail.com

---

<div align="center">
Made with ❤️ using React.js & Tailwind CSS
</div>
