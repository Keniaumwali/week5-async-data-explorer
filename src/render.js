
import { getVisibleItems } from './utils.js'

const app = document.querySelector('#app')

function renderLoading() {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${Array.from({ length: 8 }, () => `
        <div class="animate-pulse bg-white rounded-xl border border-slate-200 p-4">
          <div class="h-44 bg-slate-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      `).join('')}
    </div>
  `
}

function renderProducts(items) {
  if (items.length === 0) {
    return `
      <div class="col-span-full text-center bg-white border rounded-xl p-10">
        <h3 class="text-lg font-semibold">No products found</h3>
        <p class="text-slate-500 mt-2">Try another search or category.</p>
      </div>
    `
  }

  return items.map(({ id, title, category, price, thumbnail, rating }) => `
    <article class="group bg-white rounded-2xl border border-[#dce5d6] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <button
        type="button"
        class="product-details w-full text-left"
        data-id="${id}"
        aria-label="View details for ${escapeHTML(title)}"
      >
        <img
          src="${escapeHTML(thumbnail)}"
          alt="${escapeHTML(title)}"
          class="w-full h-48 object-contain bg-[#f3f6ee] p-5 group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <div class="p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-[#58805c]">${escapeHTML(category)}</p>
          <h3 class="font-semibold mt-2 min-h-12">${escapeHTML(title)}</h3>
          <div class="flex justify-between items-center gap-2 mt-4">
            <span class="text-lg font-bold">$${Number(price).toFixed(2)}</span>
            <span class="text-sm text-amber-600">★ ${Number(rating).toFixed(1)}</span>
          </div>
          <p class="text-sm font-semibold text-[#58805c] mt-4 group-hover:text-[#294b35]">View details →</p>
        </div>
      </button>
    </article>
  `).join('')
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export function render(state) {
  const status = document.querySelector('#status')
  const productsContainer = document.querySelector('#products')

  if (state.status === 'loading') {
    status.textContent = 'Loading products...'
    productsContainer.innerHTML = renderLoading()
    return
  }

  if (state.status === 'error') {
    status.textContent = 'Could not load products.'

    productsContainer.innerHTML = `
      <div class="col-span-full bg-red-50 border border-red-200 rounded-xl p-6">
        <p class="text-red-700 mb-4">${escapeHTML(state.error)}</p>
        <button id="retry" class="bg-red-600 text-white px-5 py-2 rounded-lg">
          Retry
        </button>
      </div>
    `
    return
  }

  const visibleItems = getVisibleItems(state)

  status.textContent = `Showing ${visibleItems.length} of ${state.items.length} products`
  productsContainer.innerHTML = renderProducts(visibleItems)

  const total = state.items.length
  const average = total
    ? state.items.reduce((sum, product) => sum + product.price, 0) / total
    : 0

  const categoryCount = state.items.reduce((categories, { category }) => {
  categories.add(category)
  return categories
}, new Set()).size

  const statValues = document.querySelectorAll('main > section:first-child .text-2xl')
  statValues[0].textContent = total
  statValues[1].textContent = `$${average.toFixed(2)}`
  statValues[2].textContent = categoryCount
}
