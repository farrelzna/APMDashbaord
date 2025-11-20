<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="card p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ editableItem.id ? 'Edit Profile' : 'Create New User' }}
        </h2>
        <p class="text-gray-600">
          {{ editableItem.id
          ? 'Update user information and settings' : 'Fill in the details to create a new user account' }}
        </p>
      </div>

      <!-- Photo Upload Section -->
      <div class="flex flex-col items-center mb-8">
        <label for="photo-upload" class="relative group cursor-pointer">
          <div
            class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-medium group-hover:shadow-strong transition-all duration-300">
            <img v-if="photoPreview || editableItem.photo" :src="photoPreview || editableItem.photo"
              :alt="`${editableItem.first_name || ''} ${editableItem.last_name || ''}`.trim() || 'User Photo'"
              class="w-full h-full object-cover" />
            <div v-else
              class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </label>
        <input id="photo-upload" type="file" accept="image/*" @change="handlePhotoUpload" class="hidden" />
        <div class="mt-4 text-center">
          <label for="photo-upload" class="text-sm text-gray-500 mb-2 cursor-pointer hover:text-primary-600">
            Click to upload profile photo
          </label>
          <p class="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          <div v-if="editableItem.photoFile" class="text-sm text-primary-600 font-medium mt-2">
            {{ editableItem.photoFile.name }}
          </div>
        </div>
      </div>

      <!-- Form Fields -->
      <form class="space-y-6" @submit.prevent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div>
            <label for="form-first_name" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                First Name *
              </span>
            </label>
            <input id="form-first_name" v-model="editableItem.first_name" type="text" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.first_name }" placeholder="Enter first name"
              @blur="validateField('first_name')" />
            <p v-if="errors.first_name" class="error-text">{{ errors.first_name }}</p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="form-last_name" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Last Name *
              </span>
            </label>
            <input id="form-last_name" v-model="editableItem.last_name" type="text" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.last_name }" placeholder="Enter last name"
              @blur="validateField('last_name')" />
            <p v-if="errors.last_name" class="error-text">{{ errors.last_name }}</p>
          </div>

          <!-- Username -->
          <div>
            <label for="form-username" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Username *
              </span>
            </label>
            <input id="form-username" v-model="editableItem.username" type="text" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.username }" placeholder="Enter username"
              @blur="validateField('username')" />
            <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="form-email" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address *
              </span>
            </label>
            <input id="form-email" v-model="editableItem.email" type="email" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.email }" placeholder="Enter email address"
              @blur="validateField('email')" />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- Role -->
          <div>
            <label for="form-role" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
                Role *
              </span>
            </label>
            <select id="form-role" v-model="editableItem.role" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.role }" @change="validateField('role')"
              @blur="validateField('role')">
              <option value="">Select a role</option>
              <option v-for="roleItem in roleOptions" :key="roleItem" :value="roleItem">{{ roleItem }}</option>
            </select>
            <p v-if="errors.role" class="error-text">{{ errors.role }}</p>
          </div>

          <!-- Status -->
          <div>
            <label for="form-status" class="form-label">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm10 10h.01M17 13h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2v-5a2 2 0 012-2z"></path>
                </svg>
                Status *
              </span>
            </label>
            <select id="form-status" v-model="editableItem.status" class="input-field"
              :class="{ 'border-error-500 focus:ring-error-500': errors.status }"
              @change="validateField('status')" @blur="validateField('status')">
              <option value="">Select a status</option>
              <option v-for="statusItem in statusOptions" :key="statusItem" :value="statusItem">
                {{ statusItem.charAt(0).toUpperCase() + statusItem.slice(1) }}
              </option>
            </select>
            <p v-if="errors.status" class="error-text">{{ errors.status }}</p>
          </div>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineExpose } from 'vue'

interface UserItem {
  id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  status: string; // Added status
  photo?: string;
  photoFile?: File | null;
}

interface Props {
  modelValue: UserItem;
}

interface Emits {
  (e: 'update:modelValue', value: UserItem): void;
  (e: 'update:potentialValidity', value: boolean): void;
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editableItem = ref<UserItem>({ ...props.modelValue });
const photoPreview = ref<string | null>(null)
const errors = ref<Partial<Record<keyof UserItem, string>>>({})

const roleOptions = [
  'Engineer', 'PM', 'AM', 'PIC', 'Sales', 'Admin Tender',
  'HRD', 'Finance', 'GA', 'PMO', 'Technical', 'Operational',
  'Board of Directors', 'Undefined'
]

const statusOptions = ['internal', 'external'] as const;


const validateField = (field: keyof UserItem) => {
  switch (field) {
    case 'first_name':
      errors.value.first_name = !editableItem.value.first_name ? 'First name is required' : '';
      break;
    case 'last_name':
      errors.value.last_name = !editableItem.value.last_name ? 'Last name is required' : '';
      break;
    case 'username':
      errors.value.username = !editableItem.value.username ? 'Username is required' : '';
      break;
    case 'email':
      if (!editableItem.value.email) {
        errors.value.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableItem.value.email)) {
        errors.value.email = 'Please enter a valid email address';
      } else {
        errors.value.email = '';
      }
      break;
    case 'role':
      errors.value.role = !editableItem.value.role ? 'Role is required' : '';
      break;
    case 'status': // Added validation for status
      errors.value.status = !editableItem.value.status ? 'Status is required' : '';
      break;
  }
};

const isFormValid = computed(() => {
  const requiredFields: (keyof UserItem)[] = ['first_name', 'last_name', 'username', 'email', 'role', 'status']; // Added status
  return requiredFields.every(field => {
    const value = editableItem.value[field as keyof UserItem]; // Type assertion for safety
    return !!value && !errors.value[field];
  });
});

const isPotentiallyValid = computed(() => {
  const tempErrors: Partial<Record<keyof UserItem, string>> = {};
  const fieldsToTest: (keyof UserItem)[] = ['first_name', 'last_name', 'username', 'email', 'role', 'status']; // Added status

  fieldsToTest.forEach(field => {
    const value = editableItem.value[field as keyof UserItem]; // Type assertion
    switch (field) {
      case 'first_name': if (!value) tempErrors.first_name = 'e'; break;
      case 'last_name': if (!value) tempErrors.last_name = 'e'; break;
      case 'username': if (!value) tempErrors.username = 'e'; break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) tempErrors.email = 'e';
        break;
      case 'role': if (!value) tempErrors.role = 'e'; break;
      case 'status': if (!value) tempErrors.status = 'e'; break; // Added status check
    }
  });
  return Object.keys(tempErrors).length === 0;
});


const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      target.value = ''; // Reset file input
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File is too large. Maximum size is 5MB.');
      target.value = ''; // Reset file input
      return;
    }
    editableItem.value.photoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    editableItem.value.photoFile = null;
    photoPreview.value = null;
  }
};


const validateAndCheck = () => {
  const fieldsToValidate: (keyof UserItem)[] = ['first_name', 'last_name', 'username', 'email', 'role', 'status']; // Added status
  fieldsToValidate.forEach(field => validateField(field));
  return isFormValid.value;
};

defineExpose({ validateAndCheck });

watch(() => props.modelValue, (newVal) => {
  const baseUser: UserItem = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role: '',
    status: '', // Added status initialization
    photo: undefined,
    photoFile: null,
  };
  editableItem.value = { ...baseUser, ...newVal, photoFile: null }; // Ensure photoFile is reset
  photoPreview.value = null; // Reset photo preview when modelValue changes
  errors.value = {}; // Reset errors
}, { deep: true, immediate: true });


watch(editableItem, (newVal) => {
  emit('update:modelValue', newVal);
  emit('update:potentialValidity', isPotentiallyValid.value);
}, { deep: true, immediate: true });

</script>

<style scoped>
/* Assuming these utility classes are defined globally (e.g., via Tailwind CSS) */
/* .card { ... } */
/* .form-label { ... } */
/* .input-field { ... } */
/* .border-error-500 { ... } */
/* .focus\:ring-error-500 { ... } */
/* .error-text { ... } */
/* .shadow-medium { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); } */
/* .shadow-strong { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); } */
/* .text-primary-600 { color: #4f46e5; } adjust as per your primary color */
</style>