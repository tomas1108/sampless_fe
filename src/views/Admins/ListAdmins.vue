<template>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">List Admins</h4>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
    >
      <div class="col-span-3 flex items-center">
        <p class="font-medium">admin</p>
      </div>
      <div class="col-span-9 hidden items-center sm:flex">
        <p class="font-medium">token</p>
      </div>
    </div>

    <!-- Table Rows -->
    <div v-if="admins.length > 0">
      <div
        v-for="(admin, index) in admins"
        :key="index"
        class="grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
      >
        <div class="col-span-3 flex items-center">
          <div class="flex flex-col gap-4">
            <div class="h-12.5 w-15 rounded-md">
              <img :src="AdminImage" :alt="`Admin: ${admin?.username}`" />
            </div>
            <p class="text-sm font-medium text-black dark:text-white">{{ admin?.username }}</p>
          </div>
        </div>
        <div class="col-span-9 flex items-center">
          <p class="text-sm font-medium text-black dark:text-white w-full" style="word-wrap: break-word;">{{ admin?.token }}</p>
        </div>
      </div>
    </div>
    <div ref="loadMore" v-if="hasMore" class="py-4.5 px-4 text-center">Loading more...</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AdminImage from '@/assets/images/user/user-06.png'
import axiosInstance from '@/helper/interceptors'
import type { Admin } from '@/interfaces/admin.inteface';

const currentPage = ref(1)
const itemsPerPage = ref(10)
const hasMore = ref(true)
const loadMore = ref<HTMLElement | null>(null)
const admins = ref<Admin[]>([])

const fetchAdmins = async () => {
  try {
    const params = new URLSearchParams({
      sort: 'updated_at,DESC',
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString()
    })
    const response = await axiosInstance.get(`/admins?${params.toString()}`)

    if (response.data?.data?.length < itemsPerPage.value) {
      hasMore.value = false
    }

    if (currentPage.value === 1) {
      admins.value = response.data?.data
    } else {
      admins.value = [...admins.value, ...response.data?.data]
    }
  } catch (error) {
    console.error('Error fetching admins:', error)
  }
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting && hasMore.value) {
    currentPage.value += 1
    fetchAdmins()
  }
}

const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  threshold: 1.0
})

onMounted(() => {
  fetchAdmins()
  if (loadMore.value) {
    observer.observe(loadMore.value)
  }
})

onBeforeUnmount(() => {
  if (loadMore.value) {
    observer.unobserve(loadMore.value)
  }
})
</script>
