<template>
    <header class='sticky top-0 z-[15] flex w-full bg-white shadow-1'>
        <div class='relative flex flex-grow items-center justify-center xl:justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11'>
            <button class="absolute top-[50%] -translate-y-1/2 left-4 rounded-[4px] bg-white xl:hidden flex justify-center items-center w-10 h-10 hover:rounded-[100%] hover:bg-yellow-300">
                <img class="w-8" src="@/assets/images/menu-icon.svg" alt="">
            </button>
            <div>
                <img class="h-10" src="@/assets/images/logo.png" alt="">
            </div>
            <div class="hidden xl:flex xl:items-center xl:gap-1">
                <div class="w-8 h-8 cursor-pointer flex justify-center items-center">
                    <img class="w-6" src="@/assets/images/user-icon.svg" alt="">
                </div>
                <div>Username</div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
</style>