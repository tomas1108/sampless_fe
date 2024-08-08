<template>
    <div class="relative">
        <label :class="classLabel" class="flex text-xs xl:text-lg mb-2" v-if="label">
            <span>{{ label }}</span>
            <span v-if="required" class="text-red">*</span>
        </label>
        <input 
            class="border border-[#707070] min-h-[30px] lg:min-h-[40px] xl:min-h-[44px] text-sm xl:text-base w-full px-3"
            :class="classInput"
            :type="type"
            :placeholder="placeholder"
            :name="name"
            v-model="newModelValue"
            @input="updateInput"
        >
        <div v-if="errorMessage" class="mt-1 xl:mt-2 text-xs xl:text-sm text-red-500">※ {{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';


interface IProps {
    required?: boolean;
    type?: string;
    label?: string;
    name?: string;
    modelValue?: string | number;
    placeholder?: string;
    hideDetails?: boolean;
    rules?: any;
    errorMessage?: string;
    disabled?: boolean;
    classLabel?: string;
    classInput?: string;
    replaceNonNumeric?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    required: false,
    type: 'text',
    hideDetails: false,
    replaceNonNumeric: false,
});

const newModelValue = ref(props.modelValue);

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>();

watch(() => props.modelValue, (newValue) => {
    newModelValue.value = newValue;
});

const updateInput = () => {
    if(props.replaceNonNumeric) { 
        newModelValue.value = (newModelValue.value as string).replace(/[^\d+]/g, '');
    }
    emit('update:modelValue', newModelValue.value);
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>