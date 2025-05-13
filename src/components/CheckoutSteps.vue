<script setup>
import { defineProps } from 'vue'

defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <nav aria-label="Progress" class="mb-8">
    <ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
      <li v-for="(step, index) in steps" :key="index" class="md:flex-1">
        <div
          :class="[
            currentStep === index + 1 ? 'border-indigo-600' : 'border-gray-200',
            'group pl-4 py-2 flex border-l-4 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4'
          ]"
        >
          <span
            :class="[
              currentStep === index + 1 ? 'border-indigo-600' : 'border-gray-200',
              'flex items-center text-sm leading-5 font-medium'
            ]"
          >
            <span
              :class="[
                currentStep === index + 1 ? 'border-indigo-600 text-indigo-600' : 'border-gray-200 text-gray-500',
                'h-8 w-8 rounded-full border-2 flex items-center justify-center'
              ]"
            >
              {{ index + 1 }}
            </span>
            <span
              :class="[
                currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-500',
                'ml-4 text-sm font-medium'
              ]"
            >
              {{ step.name }}
            </span>
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template> 