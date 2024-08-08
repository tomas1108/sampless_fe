<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 class="text-xl font-bold text-black dark:text-white">Bank History List</h4>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
        >
          <div class="col-span-2 flex items-center">
            <p class="font-medium">created at</p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="font-medium">status</p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="font-medium">amount</p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="font-medium">type</p>
          </div>
        </div>

        <!-- Table Rows -->
        <div v-if="bankHistories.length > 0">
          <div
            v-for="(history, index) in bankHistories"
            :key="index"
            class="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
          >
            <div class="col-span-2 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">
                {{ history?.created_at ? formatDate(history?.created_at) : '' }}
              </p>
            </div>
            <div class="col-span-2 flex items-center">
              <p
                class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                :class="
                  history?.status === 'SUCCESS'
                    ? 'bg-success text-success'
                    : history?.status === 'PENDING'
                      ? 'bg-warning text-warning'
                      : 'bg-danger text-danger'
                "
              >
                {{ history?.status }}
              </p>
            </div>
            <div class="col-span-2 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">
                {{
                  history?.type
                    ? (history?.type === 'recharge' ? '+' : '-') + '$' + history?.amount
                    : ''
                }}
              </p>
            </div>
            <div class="col-span-2 flex items-center">
              <p
                class="text-sm font-medium"
                :class="history?.type === 'recharge' ? 'text-success' : 'text-danger'"
              >
                {{ history?.type }}
              </p>
            </div>
          </div>
        </div>
        <div ref="loadMore" v-if="hasMore" class="py-4.5 px-4 text-center">Loading more...</div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import axiosInstance from '@/helper/interceptors'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import webSocketService, { bankHistories } from '@/websocket'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDate } from '@/helper/format'
import { sortArrayByDate } from '@/helper/sort'

const pageTitle = ref('Bank History')
const route = useRoute()
const page = ref<number>(1)
const limit = ref<number>(10)
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const loadMore = ref<HTMLDivElement | null>(null)

const fetchHistories = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true

  try {
    const queries = new URLSearchParams({
      page: page.value.toString(),
      limit: limit.value.toString()
    })
    const response = await axiosInstance.get(
      `/banks/histories/${route.query?.uid}?${queries.toString()}`
    )

    if (response.data.length < limit.value) {
      hasMore.value = false
    }
    bankHistories.value.push(...response.data)
    sortArrayByDate(bankHistories.value, 'created_at')
    page.value++
  } catch (error) {
    console.error('Error fetching bank histories:', error)
  } finally {
    loading.value = false
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      fetchHistories()
    }
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }
)

onMounted(() => {
  fetchHistories()
  webSocketService.connect()

  if (loadMore.value) {
    observer.observe(loadMore.value)
  }
})

onBeforeUnmount(() => {
  webSocketService.disconnect()
  if (loadMore.value) {
    observer.unobserve(loadMore.value)
  }
  bankHistories.value = []
})
</script>

<style scoped></style>
