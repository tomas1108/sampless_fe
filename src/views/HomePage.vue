<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <ListAdmins />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref } from 'vue'
import ListAdmins from '@/views/Admins/ListAdmins.vue'

const pageTitle = ref('Admins')
</script>

<style scoped></style>
