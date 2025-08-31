# URL Shortener

A **modern URL shortener** built with **Node.js, Express, MongoDB, and EJS**.  
This project allows users to shorten URLs, customize short codes, set expiration dates, track click counts, and view a session-based history of URLs.

---

## **Features**

- Shorten any valid URL.
- Optional **custom short code**.
- Optional **expiration date** for short URLs.
- **Click tracking** to see how many times a URL has been used.
- **Session-based URL history** for easy access to previously shortened URLs.
- **Auto-copy short URL** with a toast notification.
- Responsive and polished **frontend using Bootstrap**.
- **Validation** for proper URLs to prevent errors.

---

## **Tech Stack**

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Frontend:** EJS templates, Bootstrap  
- **Other:** `nanoid` for generating short codes, `express-session` for session management

---

## **Getting Started**

### **Prerequisites**
- Node.js installed  
- MongoDB installed and running locally  

---

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/khushi-2902/url-shortener.git
2.Install Dependencies
cd url-shortener
npm install
3.Create a .env file in the root directory:

BASE_URL=http://localhost:5000
4.Start the server:

nodemon index.js


5.Open your browser and go to:

http://localhost:5000
