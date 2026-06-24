# Contact Us Information Portal

The Contact Us capability provides visitors and members with immediate, public access to the studio's official contact information directly from the landing page.

## 🧭 Public Access

The Contact Us links are placed in the navigation header, the page footer, and at the bottom of the fullscreen login card. Clicking any of these links will open a glassmorphic modal overlay (`#contact-us-modal`) displaying the studio's information.

This modal operates independently of the authorization status, meaning users who are not logged in can view these details directly without hitting the authentication gates, and can access it directly while on the login page.

## 📇 Contact Information Displayed

The modal provides the following details:
1. **Physical Address**: The location of the studio (default: `108 Prana Boulevard, Sector 4, Indiranagar, Bengaluru, KA 560038`).
2. **Phone Number**: An interactive link targeting the telephone protocol (`tel:`) so users on mobile or desktop softphone clients can initiate calls with a single click.
3. **Email ID**: An interactive link targeting the email client protocol (`mailto:`) to immediately draft general query emails.

## ⚙️ Administration & Configuration

Rather than being hardcoded in HTML, the studio contact details are fully database-driven:

1. **Access Settings**: Log in as an administrator (e.g. `admin@quantumyoga.xyz`) and navigate to **Admin Panel -> System Settings**.
2. **Configure Details**: Locate the **Studio Contact Settings** card and enter the new Physical Address, Phone Number, and Email ID.
3. **Instant Propagation**: Click **Save Studio Details** to persist updates on the server database. The new details propagate dynamically to all Contact Us triggers across the site.
