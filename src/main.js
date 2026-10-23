
import './style.css'
import {
  getProducts,
  getCategories,
  getProduct,
} from './api.js'
import { render } from './render.js'


document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-[#f6f7ef] text-[#24352b]">
    <header class="bg-[#e4eddf] border-b border-[#c8d8c1]">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#477653]">WEEK 5 PROJECT</p>
        <h1 class="text-3xl font-bold mt-2">Async Data Explorer</h1>
        <p class="text-slate-500 mt-2">
          Discover products, explore categories, and find your favourites.
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-2xl border border-[#dce5d6] shadow-sm p-6 hover:shadow-md transition">
          <p class="text-sm text-slate-500">Products loaded</p>
          <p class="text-2xl font-bold mt-2">—</p>
        </div>
        <div class="bg-white rounded-2xl border border-[#dce5d6] shadow-sm p-6 hover:shadow-md transition">
          <p class="text-sm text-slate-500">Average price</p>
          <p class="text-2xl font-bold mt-2">—</p>
        </div>
        <div class="bg-white rounded-2xl border border-[#dce5d6] shadow-sm p-6 hover:shadow-md transition">
          <p class="text-sm text-slate-500">Categories</p>
          <p class="text-2xl font-bold mt-2">—</p>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-[#dce5d6] shadow-sm p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Find products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium mb-2">
              Search products
            </label>
            <input id="search" type="search"
              placeholder="Search by product name..."
              class="w-full rounded-lg border px-4 py-3" />
          </div>

          <div>
            <label for="category" class="block text-sm font-medium mb-2">
              Category
            </label>
            <select id="category" class="w-full rounded-lg border px-4 py-3">
              <option value="all">All categories</option>
            </select>
          </div>

          <div>
            <label for="sort" class="block text-sm font-medium mb-2">
              Sort products
            </label>
            <select id="sort" class="w-full rounded-lg border px-4 py-3">
              <option value="default">Default order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
          <h2 class="text-xl font-bold">Explore products</h2>
          <p id="status" aria-live="polite" class="text-slate-500">
            Loading products...
          </p>
        </div>
        <div id="products"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        </div>
      </section>
    </main>

    <footer class="text-center text-sm text-slate-500 py-8">
      Async Data Explorer · Built with JavaScript and Tailwind CSS
    </footer>
  </div>
`


const state = {
  items: [],
  categories: [],
  status: 'loading',
  error: null,
  query: '',
  filter: 'all',
  sort: 'default',
  selectedProduct: null,
  favourites: JSON.parse(localStorage.getItem('favourites') || '[]'),
}

async function load() {
  state.status = 'loading'
  state.error = null
  render(state)

  try {
    const [productData, categoryData] = await Promise.all([
      getProducts(),
      getCategories(),
    ])

    state.items = productData.products
    state.categories = categoryData.map(category =>
      typeof category === 'string' ? category : category.slug
    )
    state.status = 'success'

    populateCategories()
    render(state)
  } catch (error) {
    state.status = 'error'
    state.error = error.message
    render(state)
  }
}

function populateCategories() {
  const select = document.querySelector('#category')

  select.innerHTML = '<option value="all">All categories</option>'

  state.categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category
    option.textContent = category
    select.append(option)
  })
}

document.querySelector('#search').addEventListener('input', event => {
  state.query = event.target.value
  render(state)
})

document.querySelector('#category').addEventListener('change', event => {
  state.filter = event.target.value
  render(state)
})

document.querySelector('#sort').addEventListener('change', event => {
  state.sort = event.target.value
  render(state)
})

document.querySelector('#products').addEventListener('click', async event => {
  const button = event.target.closest('.product-details')
  if (!button) return

  const id = button.dataset.id
  const existingProduct = state.items.find(
  item => item.id === Number(id)
)

  try {
    const product = await getProduct(id)
    state.selectedProduct = product
    showProductDetails(product)
   
  } catch (error) {
    alert(`Could not load product details: ${error.message}`)
  }
})

document.querySelector('#products').addEventListener('click', event => {
  if (event.target.closest('#retry')) {
    load()
  }
})

function showProductDetails(product) {
  let dialog = document.querySelector('#product-dialog')

  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'product-dialog'
    dialog.className = 'w-11/12 max-w-xl rounded-2xl p-6 shadow-2xl backdrop:bg-slate-900/50'

    document.body.append(dialog)

    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close()
    })
  }

  const safeTitle = document.createElement('h2')
  safeTitle.className = 'text-2xl font-bold mb-3'
  safeTitle.textContent = product.title

  const image = document.createElement('img')
  image.src = product.thumbnail
  image.alt = product.title
  image.className = 'w-full h-48 object-contain mb-4'

  const description = document.createElement('p')
  description.className = 'text-slate-600 mb-4'
  description.textContent = product.description

  const price = document.createElement('p')
  price.className = 'font-bold text-xl mb-4'
  price.textContent = `$${product.price.toFixed(2)}`

  const favouriteButton = document.createElement('button')
  favouriteButton.className = 'bg-emerald-600 text-white px-4 py-2 rounded-lg mr-2'
  favouriteButton.textContent = state.favourites.includes(product.id)
    ? 'Remove favourite ♥'
    : 'Add favourite ♡'

  favouriteButton.addEventListener('click', () => {
    if (state.favourites.includes(product.id)) {
      state.favourites = state.favourites.filter(id => id !== product.id)
    } else {
      state.favourites = [...state.favourites, product.id]
    }

    localStorage.setItem('favourites', JSON.stringify(state.favourites))
    favouriteButton.textContent = state.favourites.includes(product.id)
      ? 'Remove favourite ♥'
      : 'Add favourite ♡'
  })

  const closeButton = document.createElement('button')
  closeButton.className = 'bg-slate-200 px-4 py-2 rounded-lg'
  closeButton.textContent = 'Close'
  closeButton.addEventListener('click', () => dialog.close())

  dialog.replaceChildren(
    safeTitle,
    image,
    description,
    price,
    favouriteButton,
    closeButton,
  )

  dialog.showModal()
}

load()
