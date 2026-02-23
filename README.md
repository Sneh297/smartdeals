# SmartDeals Store Hub

A full-stack web application built with Node.js, Express.js, and EJS for curated product listings.

## Features

- **Dynamic Product Listing**: Displays a grid of products with images, descriptions, and prices.
- **Admin Dashboard**: Password-protected area to add, delete, and track clicks on products.
- **Store Disclosure**: Policy-compliant disclaimer visible on all pages.
- **Category Filtering**: Easily navigate products by category.
- **Click Tracking**: Simple analytics to see how many times each product link is clicked.
- **Responsive Design**: Modern, mobile-friendly UI using Vanilla CSS.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Application**:
   ```bash
   node app.js
   ```

3. **Access the Website**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Login: [http://localhost:3000/admin](http://localhost:3000/admin) (Password: `admin`)

## Project Structure

- `app.js`: Main Express server and API routes.
- `data/products.json`: JSON file acting as the database.
- `public/`: Static assets (CSS, images).
- `views/`: EJS templates for frontend and admin pages.
- `views/partials/`: Reusable components like header, footer, and disclaimer.

## Compliance

- **Disclosure**: Included in `views/partials/disclaimer.ejs`.
- **Branding**: Uses standard "View on Store" call-to-action.
- **Links**: Uses `rel="nofollow noopener"` for SEO and security.
