# Async Data Explorer

A responsive product catalogue built with modern JavaScript, Vite, and Tailwind CSS v4. The app fetches product data from a public API and lets users search, filter, sort, and explore product details.

## Student Information

- **Student Name:** Umwali Keza Kenia
- **Assignment:** Week 5 — Modern JavaScript & Asynchronous Programming
- **API Used:** [DummyJSON Products API](https://dummyjson.com/docs/products)
- **Live App:** TODO — add your deployed link
- **Video Walkthrough:** TODO — add your 3–5 minute video link

## Features

- Fetches products from DummyJSON when the app loads.
- Uses a reusable `getJSON(url)` helper with `fetch`, `async/await`, and `response.ok` error checking.
- Displays animated loading skeletons.
- Shows an error message and Retry button when loading fails.
- Shows an empty state when no products match the search or category.
- Searches products by name, brand, and category.
- Filters products by category.
- Sorts products by price or name without mutating the original data.
- Opens a details dialog for an individual product.
- Displays statistics for total products, average price, and category count.
- Loads products and categories in parallel using `Promise.all`.
- Saves favourite products in `localStorage`.

## Technologies

- HTML
- Tailwind CSS v4
- Vite
- Vanilla JavaScript with ES modules
- DummyJSON public API

## Project Structure

```text
week5-async-data-explorer/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── api.js
    ├── main.js
    ├── render.js
    ├── style.css
    └── utils.js
```

## Application State

The app keeps its main state in one JavaScript object:

```javascript
const state = {
  items: [],
  categories: [],
  status: 'loading',
  error: null,
  query: '',
  filter: 'all',
  sort: 'default',
  selectedProduct: null,
  favourites: []
}
```

The state stores the products, categories, loading status, error message, search query, selected category, sorting option, selected product, and favourites.

### State-to-Render Flow

1. The app starts with a loading status.
2. `load()` fetches products and categories using `Promise.all`.
3. The returned data is stored in the state object.
4. The app calls `render(state)` to update the interface.
5. When the user searches, filters, or sorts, the event handler updates the state and calls `render(state)` again.
6. The `getVisibleItems(state)` helper filters and sorts the already-loaded data without making new API requests.

## Example API Data

The following is a shortened example of the product data returned by DummyJSON:

```json
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "category": "beauty",
      "price": 9.99,
      "rating": 4.94,
      "thumbnail": "https://cdn.dummyjson.com/..."
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 100
}
```

The actual response contains more products and additional fields.

### How the Data Is Transformed

- `map()` extracts or transforms values, such as product categories.
- `filter()` selects products matching the search query and chosen category.
- `find()` locates a particular product in the loaded data.
- `reduce()` calculates the average product price.
- `toSorted()` creates a sorted copy of the filtered products without modifying the original array.
- Destructuring extracts properties such as `id`, `title`, `category`, and `price`.

## Screenshots

Add your screenshots to a `screenshots/` folder and update these links when the images are available.

### Loading State

![Loading state](screenshots/loading.png)

### Successful Data Display

![Success state](screenshots/success.png)

### Empty State

![Empty state](screenshots/empty.png)

### Error State

![Error state](screenshots/error.png)

## What I Learned About Async JavaScript

I learned how to use `fetch()` and `async/await` to request data from a public API. I learned that checking `response.ok` helps detect HTTP errors and that `try/catch` can handle failed requests. I learned how to display loading, success, empty, and error states in the user interface. I practised using `map()`, `filter()`, `find()`, `reduce()`, and `toSorted()` to work with product data. I also learned how `Promise.all()` can run independent requests in parallel. Finally, I learned how to organise JavaScript into modules and keep application state separate from rendering logic.

## Run Locally

### Requirements

Install Node.js and npm before running the project.

### Steps

1. Clone this repository.
2. Open the project folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal.

## Author

Umwali Keza Kenia

Built for the Advanced Frontend Web Development Week 5 assignment.
