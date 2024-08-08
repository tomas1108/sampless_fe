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
          <h4 class="text-xl font-bold text-black dark:text-white">List Users</h4>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-12 md:px-6 2xl:px-7.5"
        >
          <div class="col-span-2 flex items-center">
            <p class="font-medium">user</p>
          </div>
          <div class="col-span-3 hidden items-center sm:flex">
            <p class="font-medium">email</p>
          </div>
          <div class="col-span-2 hidden items-center sm:flex">
            <p class="font-medium">name</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="font-medium">role</p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="font-medium">chips amount</p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="font-medium">actions</p>
          </div>
        </div>

        <!-- Table Rows -->
        <div v-if="users.length > 0">
          <div
            v-for="(user, index) in users"
            :key="index"
            class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-12 md:px-6 2xl:px-7.5"
          >
            <div class="col-span-2 flex items-center">
              <div class="flex flex-col gap-4">
                <div class="h-12.5 w-15 rounded-md">
                  <img :src="UserImage" :alt="`User: ${user?.username}`" />
                </div>
                <p class="text-sm font-medium text-black dark:text-white">{{ user?.username }}</p>
              </div>
            </div>
            <div class="col-span-3 hidden items-center sm:flex">
              <p class="text-sm font-medium text-black dark:text-white">{{ user?.email }}</p>
            </div>
            <div class="col-span-2 hidden items-center sm:flex">
              <p class="text-sm font-medium text-black dark:text-white">{{ user?.name }}</p>
            </div>
            <div class="col-span-1 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">{{ user?.role }}</p>
            </div>
            <div class="col-span-2 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">
                ${{ user?.chips_amount }}
              </p>
            </div>
            <div class="col-span-2 flex items-center">
              <div class="flex flex-col gap-2">
                <label
                  @click="$router.push(`/win-or-lose-history?uid=${user?.id}`)"
                  class="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                >
                  <span>win/lose history</span>
                </label>
                <label
                  @click="$router.push(`/bank-history?uid=${user?.id}`)"
                  class="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                >
                  <span>bank history</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div ref="loadMore" v-if="hasMore" class="py-4.5 px-4 text-center">Loading more...</div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import UserImage from '@/assets/images/user/user-06.png'
import axiosInstance from '@/helper/interceptors'
import webSocketService, { users } from '@/websocket'
import { sortArrayByDate } from '@/helper/sort'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Users')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const hasMore = ref(true)
const loadMore = ref<HTMLElement | null>(null)

const fetchUsers = async () => {
  try {
    const params = new URLSearchParams({
      sort: 'updated_at,DESC',
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString()
    })
    const response = await axiosInstance.get(`/users?${params.toString()}`)

    if (response.data?.data?.length < itemsPerPage.value) {
      hasMore.value = false
    }

    if (currentPage.value === 1) {
      users.value = response.data?.data
    } else {
      users.value = [...users.value, ...response.data?.data]
    }
    sortArrayByDate(users.value, 'updated_at')
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting && hasMore.value) {
    currentPage.value += 1
    fetchUsers()
  }
}

const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  threshold: 1.0
})

onMounted(() => {
  fetchUsers()
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
  users.value = []
})
</script>
