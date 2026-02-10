# Car Buying Dashboard (程晞大家庭 - 買車)

A dynamic, responsive dashboard for visualizing and filtering car listings. This project fetches live data from `car_data.json` and presents it in a premium, user-friendly interface.

## 🌟 Features

-   **Dynamic Data Loading**: Fetches real-time JSON data without page reloads.
-   **Interactive Filtering**:
    -   **Model**: Filter by car model.
    -   **Engine**: Filter by engine size/type.
    -   **Price**: Set a maximum price budget.
    -   **Mileage**: Set a maximum mileage limit.
-   **Smart Sorting**: Sort listings by Price (Low/High), Mileage (Low/High), or Model Name.
-   **🎨 Themes**: Switch between various themes, including:
    -   **Original**: Clean and modern.
    -   **XO (Bad Badtz-Maru)**: Dark theme with yellow accents.
    -   **Pochacco**: Mint green and soft cyan theme.
    -   **Kuromi**: Purple and black gothic theme.
    -   **Hello Kitty**: Classic pink and red theme.
-   **Responsive Design**: optimized for desktop, tablet, and mobile devices.
-   **Detailed Analytics**: Real-time stats bar showing total listings and average price.

## 🛠️ Tech Stack

-   **HTML5**: Semantic markup.
-   **CSS3**: Custom styling with Flexbox/Grid, CSS Variables, and animations.
-   **JavaScript (ES6+)**: Vanilla JS for logic, DOM manipulation, and data fetching.
-   **Data**: JSON format (`car_data.json`).

## 🚀 Local Development

To run this project locally, you need a simple HTTP server because `fetch()` requests to local files are blocked by CORS policies in directly opened HTML files.

### Option 1: Python (Recommended)
If you have Python installed:
```bash
git clone https://github.com/kenny-wong/carbuy.git
cd carbuy
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Node.js
If you have Node.js installed:
```bash
npx serve
```

## 🌐 Deployment

This project is deployed on **GitHub Pages**.

1.  Push your changes to the `main` branch.
2.  Go to **Settings > Pages** in your GitHub repository.
3.  Select `main` branch as the source.
4.  Your site will be visible at `https://kenny-wong.github.io/carbuy/`.

## 📂 Data Structure

The dashboard expects `car_data.json` to follow this structure:

```json
[
  {
    "url": "https://example.com/car-listing",
    "title": "2015 Nissan Juke",
    "price": "£6,495",
    "mileage": "42,000 miles",
    "transmission": "Automatic",
    "engine_fuel": "1.6L Petrol",
    "image_url": "https://example.com/image.jpg"
  }
]
```
