
# Digital Evidence Management System
## Frontend Development Roadmap

This document describes the architecture and component structure of the frontend system.

The frontend will be built using React.js and designed as a component-based architecture where each UI element has a clearly defined responsibility.

The system must support role-based access control, evidence management, chain of custody tracking, and audit logs.

---

# 1. Overall Frontend Architecture

The frontend application consists of the following layers:

UI Layer  
Handles visual components and user interactions.

State Management Layer  
Stores user session, authentication state, and system data.

API Communication Layer  
Handles communication with backend APIs.

Routing Layer  
Controls navigation between pages.

---

# 2. Application Layout Components

## App Component
Main entry point of the React application.

Responsibilities:
- Initialize routing
- Load authentication state
- Wrap application with global providers
- Redirect unauthenticated users to login

---

## Navbar Component

Purpose:
Top navigation bar visible on all authenticated pages.

Features:
- System logo
- Notification icon
- User profile dropdown
- Logout button

Behavior:
Displays logged-in user name and role and allows logout.

---

## Sidebar Component

Purpose:
Primary navigation menu for the system.

Menu Items:
- Dashboard
- Evidence
- Upload Evidence
- Chain of Custody
- Audit Logs
- User Management (Admin Only)

Menu items change based on user role.

---

## PageLayout Component

Purpose:
Provides a consistent layout for all pages.

Structure:
Navbar  
Sidebar  
Main Content Area

Responsibilities:
Maintains layout and renders dynamic page content.

---

## ProtectedRoute Component

Purpose:
Prevent unauthorized access to protected pages.

Behavior:
- Redirects unauthenticated users to login
- Displays access denied if role permissions are insufficient

---

# 3. Authentication Components

## LoginPage

Purpose:
Authenticate users.

UI Elements:
- Email field
- Password field
- Login button

Behavior:
- Sends credentials to backend
- Stores authentication token
- Redirects to dashboard

---

## ResetPasswordPage

Purpose:
Allows users to reset forgotten passwords.

Behavior:
- User submits email
- Receives reset link
- Sets new password

---

# 4. Dashboard Components

## DashboardPage

Purpose:
Main landing page after login.

Displays:
- Evidence statistics
- Recent activities
- System alerts

---

## StatsCard Component

Reusable component displaying numerical metrics.

Examples:
- Total Evidence Files
- Active Cases
- Recent Uploads
- Pending Verifications

---

## RecentActivity Component

Displays latest system events.

Examples:
- Evidence uploaded
- Evidence accessed
- Chain of custody updated

---

# 5. Evidence Management Components

## EvidenceListPage

Displays all evidence records.

Features:
- Table layout
- Sorting
- Filtering
- Pagination

Columns:
Evidence ID  
File Name  
Case ID  
Upload Date  
Status  

---

## EvidenceCard Component

Displays summary of evidence file.

Information:
- Evidence ID
- File name
- Upload date
- Case ID
- Integrity status

---

## EvidenceUploadPage

Allows investigators to upload evidence.

Fields:
- Evidence Title
- Case ID
- Description
- File Upload

Behavior:
Uploads file and metadata to backend.

---

## EvidenceViewer Component

Displays evidence preview.

Supported Types:
- Images
- Videos
- Documents

---

## EvidenceSearch Component

Allows searching evidence using:
- Evidence ID
- Case ID
- File name
- Date range

---

## EvidenceFilter Component

Filters evidence list.

Options:
- Date range
- Case ID
- Upload user
- Evidence type

---

# 6. Chain of Custody Components

## CustodyPage

Displays custody history for evidence.

---

## CustodyTimeline Component

Visual timeline showing evidence actions.

Example Flow:
Upload → Review → Lab Analysis → Court Submission

---

## CustodyLogTable Component

Detailed custody record table.

Columns:
- Action
- User
- Timestamp
- Remarks

---

## AddCustodyEntry Component

Allows adding new custody record.

Fields:
- Action type
- User
- Notes

---

# 7. User Management Components

Accessible only by administrators.

## UserListPage

Displays system users.

Columns:
User ID  
Name  
Role  
Status  

---

## AddUserPage

Create new users.

Fields:
Name  
Email  
Role  
Password  

---

## RoleEditor Component

Modify user role.

Roles:
Admin  
Investigator  
Forensic Analyst  
Auditor  

---

# 8. Audit and Logging Components

## AccessLogPage

Displays access history.

Columns:
User  
Evidence ID  
Action  
Timestamp  

---

## SystemActivityPage

Displays system-wide logs.

Examples:
- User login
- Evidence upload
- Permission changes

---

# 9. Utility Components

## LoadingSpinner
Displayed during API calls.

## NotificationToast
Displays success or error messages.

## ModalDialog
Confirmation popups for critical actions.

## FilePreview Component
Preview uploaded files such as images, PDFs, and videos.

---

# 10. Suggested Frontend Folder Structure

src/

components/
layout/
Navbar.jsx
Sidebar.jsx
PageLayout.jsx

auth/
LoginPage.jsx
ResetPasswordPage.jsx

dashboard/
DashboardPage.jsx
StatsCard.jsx
RecentActivity.jsx

evidence/
EvidenceListPage.jsx
EvidenceCard.jsx
EvidenceUploadPage.jsx
EvidenceViewer.jsx
EvidenceSearch.jsx
EvidenceFilter.jsx

custody/
CustodyPage.jsx
CustodyTimeline.jsx
CustodyLogTable.jsx
AddCustodyEntry.jsx

users/
UserListPage.jsx
AddUserPage.jsx
RoleEditor.jsx

logs/
AccessLogPage.jsx
SystemActivityPage.jsx

utils/
LoadingSpinner.jsx
NotificationToast.jsx
ModalDialog.jsx
FilePreview.jsx

---

# 11. Routing Structure

/login  
/dashboard  
/evidence  
/evidence/upload  
/custody  
/logs  
/users  

---

# 12. API Integration Examples

POST /api/login  
GET /api/evidence  
POST /api/evidence/upload  
GET /api/custody/{evidence_id}  
GET /api/logs  

---

# 13. Role Based Access

Supported Roles:

Admin  
Investigator  
Forensic Analyst  
Auditor  

Each role sees different navigation and permissions.

---

# 14. Typical User Flow

Login → Dashboard → Upload Evidence → Evidence Stored → Custody Updated → Evidence Reviewed → Audit Logs Recorded

---
