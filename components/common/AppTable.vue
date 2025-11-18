<template>
  <div>
    <div>
      <slot name="header" />
    </div>
    <div class="overflow-x-auto">
      <table class="table static">
        <thead :class="[props.loading ? 'hidden' : '']" class="text-primary">
          <tr>
            <th v-show="checkable">
              <label class="label cursor-pointer">
                <input v-model="state.selectAll" class="checkbox-primary checkbox checkbox-sm" type="checkbox" @change="" />
              </label>
            </th>
            <th v-for="header in headings" :class="[header.width ? `${header.width}` : '']" class="capitalize">
              <span class="inline-flex items-center">
                <span class="mr-1 uppercase text-xs font-bold leading-none tracking-wide text-emphasis-medium"> {{ header.name }}</span>
                <span v-if="header.sortable" class="mt-[3spx]">
                  <Icon :size="12" :stroke-width="3" class="text-emphasis-medium" name="arrow-up" />
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="state.rows && state.rows.length > 0" :class="[props.loading ? 'hidden' : '']">
          <tr v-for="(tableData, index) in state.rows" class="cursor-pointer hover:bg-neustral-50" @click.exact="emits('itemClicked', tableData)">
            <td v-show="checkable">
              <label class="label cursor-pointer">
                <input v-model="tableData.checked" class="checkbox-primary checkbox checkbox-sm" type="checkbox" @change="updateSelectAll(index)" />
              </label>
            </td>
            <slot :row-data="{ ...tableData }" name="tableRows"></slot>
          </tr>
        </tbody>
        <tbody v-else :class="[tableData.length ? 'hidden' : '']" class="">
          <tr>
            <td :colspan="headings.length + (checkable ? 1 : 0)" class="py-6 text-center">No data available</td>
          </tr>
        </tbody>
      </table>
      <div class="flex">
        <div v-if="props.pagination" class="ml-auto">
          <div v-if="state.rows && state.rows.length > 0" class="space- mr-7 flex items-center">
            <button class="inline-flex text-gray-400 hover:text-black" @click="changePage(1)">
              <Icon :size="24" class="cursor-pointer text-primary" name="chevs-left" />
              <Icon :size="24" class="-ml-3.5 cursor-pointer text-primary" name="chevs-left" />
            </button>
            <button class="text-gray-400 hover:text-black" @click="changePage(state.currentPage - 1)">
              <Icon :size="24" class="cursor-pointer text-primary" name="chevs-left" />
            </button>
            <button
              v-for="page in pagesToDisplay"
              :key="page"
              :class="{ 'bg-[#F1F1F1]': state.currentPage === page }"
              class="rounded-sm px-2 py-1 text-sm text-black shadow-sm"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button class="text-gray-400 hover:text-black" @click="changePage(state.currentPage + 1)">
              <Icon :size="24" class="cursor-pointer text-primary" name="chevs-right" />
            </button>
            <button class="inline-flex text-gray-400 hover:text-black" @click="changePage(totalPageNumbers)">
              <Icon :size="24" class="-mr-3.5 cursor-pointer text-primary" name="chevs-right" />
              <Icon :size="24" class="cursor-pointer text-primary" name="chevs-right" />
            </button>
            <span class="ml-4 text-sm">{{ displayRange }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'

const route = useRoute()
const emits = defineEmits(['pageClicked', 'itemClicked'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  checkable: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  itemsMenu: {
    type: Boolean,
    default: false,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 1,
  },
  tableData: {
    type: Array,
    required: true,
    default: [],
    // validator: (value) => {
    //   return value.every(
    //     (item) =>
    //       typeof item === 'object' &&
    //       (Object.prototype.hasOwnProperty.call(item, '_id') || Object.prototype.hasOwnProperty.call(item, 'id')) &&
    //       Object.keys(item).length > 1,
    //   )
    // },
  },
  headings: {
    type: Array,
    required: false,
    validator: (value) => {
      return value.every((item) => typeof item === 'object')
    },
  },
})

const isWithinRange = (num, min, max) => num >= min && num <= max

const state = reactive({
  selectAll: false,
  rows: [],
  currentPage: ref(Number(route.query.page) || 1),
})

const totalPageNumbers = computed(() => {
  return Math.ceil(props.total / props.perPage) || 5
})

const pagesToDisplay = computed(() => {
  let pages = []
  const totalPagesToShow = 7
  const halfPagesToShow = Math.floor(totalPagesToShow / 2)
  if (totalPageNumbers.value <= totalPagesToShow) {
    for (let i = 1; i <= totalPageNumbers.value; i++) {
      pages.push(i)
    }
  } else if (state.currentPage <= halfPagesToShow) {
    for (let i = 1; i <= totalPagesToShow; i++) {
      pages.push(i)
    }
  } else if (state.currentPage > totalPageNumbers.value - halfPagesToShow) {
    for (let i = totalPageNumbers.value - totalPagesToShow + 1; i <= totalPageNumbers.value; i++) {
      pages.push(i)
    }
  } else {
    for (let i = state.currentPage - halfPagesToShow + 1; i <= state.currentPage + halfPagesToShow; i++) {
      pages.push(i)
    }
  }
  return pages
})

const displayRange = computed(() => {
  const itemsPerPage = props.perPage
  const startItem = (state.currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(state.currentPage * itemsPerPage, props.total)
  return `${startItem} - ${endItem} of  ${props.total} items`
})

watch(
  () => props.tableData,
  (newTableData) => {
    if (newTableData?.length) {
      state.rows = newTableData.map((item) => ({ ...item, checked: false }))
    } else {
      state.rows = []
    }
  },
  { immediate: true, deep: true },
)

// watch(
//     () => route.query.page, // Watch the page query parameter
//     (newPageValue) => {
//       state.currentPage = Number(newPageValue) || 1
//     },
// )

watch(
  () => state.selectAll,
  (newValue) => {
    state.rows.forEach((item) => (item.checked = newValue))
  },
  { deep: true },
)

watch(
  () => props.tableData,
  (newTableData) => {
    state.rows = newTableData?.length ? newTableData.map((item) => ({ ...item, checked: false })) : [] // Fallback to mock data
  },
  { immediate: true, deep: true },
)

function selectAllOrDeselectAll() {
  state.rows.forEach((item) => (item.checked = state.selectAll))
}

function changePage(page) {
  if (isWithinRange(page, 1, +totalPageNumbers.value)) {
    state.currentPage = page
    emits('pageClicked', page)
  }
}

function updateSelectAll(index) {
  if (!state.rows[index].checked) {
    state.selectAll = false
  } else {
    state.selectAll = state.rows.every((row) => row.checked)
  }
}
</script>

<style lang="scss">
table {
  thead {
    //@apply rounded bg-red-600 py-8;
    th {
      font-weight: 300;
      font-size: 14px;
    }

    tr > th:first-child {
      //@apply rounded-l;
    }

    tr > th:last-child {
      @apply rounded-r;
    }
  }
}

.checkbox {
  border-radius: 3px;
}
</style>
