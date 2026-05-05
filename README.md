# Frontend - React + Vite Application

Modern React frontend cho ứng dụng quản lý việc làm, được xây dựng với Vite và Ant Design.

## 🎯 Tính Năng

- ⚡️ Fast development with Vite
- 🎨 Beautiful UI with Ant Design
- 🔐 Protected routes with authentication
- 📱 Responsive design
- 📊 Charts and data visualization
- 🌐 React Router for navigation
- 📝 Rich text editor
- 🎯 Context API for state management

## 🛠️ Technology Stack

| Technology       | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| React            | 19.2.4  | UI Framework         |
| Vite             | Latest  | Build tool           |
| Ant Design       | 6.3.3   | UI Component Library |
| React Router     | 7.13.1  | Client-side routing  |
| Ant Design Plots | 2.6.8   | Data visualization   |
| React Quill      | 3.8.3   | Rich text editor     |
| Axios            | Latest  | HTTP client          |
| ESLint           | 9.39.4  | Code quality         |

## 📋 Requirements

- Node.js 16+
- npm 7+ or yarn 1.22+
- Git

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure API Endpoint

Edit `src/config/utils.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
export default API_BASE_URL;
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Application will open at: `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

Output will be in `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/                   # Admin dashboard components
│   │   ├── layout.admin.jsx     # Admin layout
│   │   ├── company/             # Company management components
│   │   ├── job/                 # Job management components
│   │   ├── user/                # User management components
│   │   ├── role/                # Role management components
│   │   ├── skill/               # Skill management components
│   │   ├── permission/          # Permission management components
│   │   ├── resume/              # Resume management components
│   │   └── dashboard/           # Dashboard components
│   └── client/                  # Client-facing components
│       ├── layout/              # Client layout
│       ├── company/             # Company listing
│       ├── job/                 # Job search
│       └── homes/               # Home pages
├── pages/
│   ├── admin/                   # Admin pages
│   ├── auth/                    # Login/Register pages
│   └── client/                  # Client-facing pages
├── services/
│   ├── api.service.js           # API calls
│   ├── axios.customize.js       # Axios configuration
│   └── helper/                  # Helper functions
├── context/
│   ├── auth.context.jsx         # Auth context
│   └── ProtectedRoute.jsx       # Protected route wrapper
├── config/
│   └── utils.js                 # Configuration
├── assets/                      # Images, icons, fonts
├── styles/
│   └── global.css               # Global styles
├── App.jsx                      # Main App component
└── main.jsx                     # Entry point
```

## 📄 Available Scripts

### Development

```bash
npm run dev              # Start development server
```

### Production

```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint -- --fix    # Fix ESLint issues
```

## 🧩 Key Components

### Admin Components

- **AdminLayout** - Layout wrapper for admin pages
- **UserManagement** - Manage users (create, read, update, delete)
- **CompanyManagement** - Manage companies
- **JobManagement** - Manage job postings
- **RoleManagement** - Manage user roles
- **SkillManagement** - Manage skills
- **PermissionManagement** - Manage permissions
- **ResumeManagement** - View and manage resumes
- **Dashboard** - Statistics and overview

### Client Components

- **HomePage** - Landing page
- **ProfilePage** - User profile
- **CompanyPage** - Browse companies
- **JobPage** - Browse and apply to jobs
- **CompanyDetail** - Detailed company view

## 🔐 Authentication

### Protected Routes

Routes requiring authentication use the `ProtectedRoute` component:

```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

### Auth Context

Access authentication state:

```jsx
import { useAuth } from "./context/auth.context";

function Component() {
  const { user, isAuthenticated, login, logout } = useAuth();
}
```

## 🎨 UI Components (Ant Design)

Available Ant Design components:

- Button, Form, Input, Select
- Modal, Drawer, Popover, Tooltip
- Table, List, Card
- Layout, Menu, Navigation
- Message, Notification, Confirm
- Icon (from @ant-design/icons)
- And more...

See [Ant Design documentation](https://ant-design.com/) for details.

## 🔄 API Integration

### Axios Configuration

`src/services/axios.customize.js` handles:

- Base URL configuration
- Authentication token injection
- Response interceptors
- Error handling

### API Service

`src/services/api.service.js` contains methods for:

- Authentication (login, register)
- CRUD operations for all resources
- File uploads
- Search and filtering

### Usage Example

```javascript
import { userService } from "@/services/api.service";

const users = await userService.getAll();
const user = await userService.getById(1);
await userService.create(userData);
await userService.update(1, userData);
await userService.delete(1);
```

## 📊 Charts (Ant Design Plots)

Use `@ant-design/plots` for data visualization:

```jsx
import { LineChart, BarChart, PieChart } from "@ant-design/plots";

<LineChart data={data} xField="date" yField="value" />;
```

## 📝 Rich Text Editor (React Quill)

```jsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

<ReactQuill value={value} onChange={setValue} />;
```

## 🌐 Client-Side Routing

Routes are defined in components using React Router:

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

<Router>
  <Routes>
    <Route path="/jobs" element={<JobPage />} />
    <Route path="/companies" element={<CompanyPage />} />
  </Routes>
</Router>;
```

## 🎯 State Management

### Context API

Global state managed with React Context:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Access state in components:

```jsx
const { user, token } = useContext(AuthContext);
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Job Management System
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📱 Responsive Design

Ant Design provides built-in responsive utilities:

- Grid system with breakpoints
- Layout components with responsive behavior
- Mobile-first approach

## 🧪 Code Quality

### ESLint

Configure in `eslint.config.js`:

```bash
npm run lint          # Check issues
npm run lint -- --fix # Fix issues
```

## 🚀 Build & Deployment

### Build Process

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Deployment Options

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Traditional Server

```bash
# Build
npm run build

# Copy dist folder to server
scp -r dist/ user@server:/var/www/app/

# Configure web server (nginx/apache) to serve dist/
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t job-frontend:latest .
docker run -p 80:80 job-frontend:latest
```

## 🐛 Troubleshooting

### Issue: Module not found

**Solution**:

- Run `npm install` to ensure all dependencies are installed
- Check import paths are correct

### Issue: CORS errors

**Solution**:

- Verify backend is running
- Check API_BASE_URL in utils.js is correct
- Ensure backend has CORS enabled

### Issue: Port 5173 already in use

**Solution**:

```bash
npm run dev -- --port 3000
```

### Issue: Build size too large

**Solution**:

- Check `vite.config.js` for optimization settings
- Remove unused dependencies
- Use code splitting configuration

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Ant Design Documentation](https://ant-design.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint`
4. Submit a pull request

## 📄 License

MIT License

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Created**: April 7, 2026  
**Node Version**: 16+  
**React Version**: 19.2.4  
**Vite Version**: Latest
