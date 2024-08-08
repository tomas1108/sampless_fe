<template>
    <button
        class="border-[1px] border-solid border-[#707070] min-h-[30px] rounded-2xl"
        :class="props.class"
        :disabled="props.disabled"
        :type="props.type"
        @click="emitClick"
    >
        {{ text }}
    </button>
</template>

<script setup lang="ts">

interface IProps {
    type?: "button" | "submit";
    text?: string;
    class?: any;
    disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    type: 'button',
    disabled: false,
});

const emit = defineEmits(['click']);

const emitClick = () => {
    emit('click')
}

</script>

<style scoped>

</style>