<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 class="text-xl font-bold text-black dark:text-white">Generate Link</h4>
          <div class="mt-4">
            <button
              type="button"
              @click="handleDefaultGenerate"
              class="bg-secondary text-white py-2 px-4 rounded hover:bg-opacity-80"
            >
              Random Generate
            </button>
          </div>
        </div>
      </div>

      <div v-if="generatedLinks.length > 0" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
        <div class="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 class="text-xl font-bold text-black dark:text-white">Link List</h4>
          <div class="mt-4">
            <ul class="space-y-4">
              <li v-for="(item, index) in generatedLinks" :key="index" class="border p-4 rounded">
                <p><strong>Link:</strong> <a :href="item.link" target="_blank" class="text-primary hover:underline break-words">{{ item.link }}</a></p>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import axiosInstance from '@/helper/interceptors'

const pageTitle = ref('Generate Link')

const generatedLinks = ref<Array<{ link: string }>>([])

const handleGenerate = async () => {
  try {

    
    const response = await axiosInstance.get(`https://dev.pokerzone.bar/api/admins/account-link-generation`)
   
    if (response.data && response.data.link) {
      generatedLinks.value.push({ link: response.data })
    } else {
      console.error('Invalid response format:', response.data)
    }
  } catch (error) {
    console.error('Error generating link:', error)
  }
}

const handleDefaultGenerate = () => {
  handleGenerate()
}
</script>

<style scoped>
.bg-secondary {
  background-color: #6c757d;
}
</style>
