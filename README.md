<<<<<<< HEAD
# Car Buying Dashboard
=======
# 程晞大家庭 - 買車
>>>>>>> ef70d50ffd1a2d22f549ca2228760d5dbc8dc3ad

A dynamic, responsive dashboard for visualizing and filtering car listings. This project fetches live data from `car_data.json` and presents it in a premium, user-friendly interface.

## Features

- **Dynamic Data Loading**: Fetches real-time JSON data without page reloads.
- **Interactive Filtering**: Filter by Model, Engine, Price range, and Mileage.
- **Sorting**: Sort listings by price, mileage, or model name.
- **Theme Selection**: Choose from multiple themes including Original, XO, Pochacco, Kuromi, and Hello Kitty.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.
- **Premium UI**: Modern card layout with vibrant colors and smooth transitions.
- **Detailed Analytics**: Real-time stats bar showing total listings and average price.

## Tech Stack

- **HTML5**: Semantic markup for structure.
- **CSS3**: Custom styling with Flexbox/Grid, CSS Variables, and animations.
- **JavaScript (ES6+)**: Vanilla JS for logic, DOM manipulation, and data fetching.
- **Data**: JSON format (`car_data.json`).

## Local Development

To run this project locally, you need a simple HTTP server because `fetch()` requests to local files are blocked by CORS policies in some browsers.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/kenny-wong/carbuy.git
    cd carbuy
    ```

2.  **Start a local server**:
    - If you have Python installed:
      ```bash
      python -m http.server 8000
      ```
    - If you have Node.js/npm:
      ```bash
      npx serve
      ```

3.  **Open in Browser**:
    Navigate to `http://localhost:8000` to view the dashboard.

## Deployment

This project is designed to be hosted on **GitHub Pages**.

1.  Go to your repository settings on GitHub.
2.  Navigate to the "Pages" section.
3.  Select the `main` branch as the source.
4.  Your site will be live at `https://kenny-wong.github.io/carbuy/`.

## Data Structure

The dashboard expects `car_data.json` to follow this structure:

```json
[
  {
    "url": "https://...",
    "title": "2015 Nissan Juke",
    "price": "£6,495",
    "mileage": "42,000 miles",
    "transmission": "Automatic",
    "engine_fuel": "1.6L Petrol",
    "image_url": "https://..."
  }
]
```
