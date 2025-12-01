<template>
  <div class="max-w-3xl mx-auto p-2 space-y-6">
  <!-- Header Card -->
  <div class="card p-3">
    <div class="flex items-center gap-6">

      <!-- Profile Photo -->
      <div>
        <div class="relative w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
          <img :src="item.photo || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'" :alt="item.full_name || item.username" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Nama + Role -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          {{ item.full_name }}
        </h1>
        <p class="text-sm text-gray-500">{{ item.role }}</p>
      </div>
    </div>
  </div>
  <v-divider></v-divider>

  <!-- Personal + Account Information -->
  <div class="card p-3 space-y-8">

    <!-- Personal Info -->
    <div>
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
      </div>

      <div class="space-y-4">
        <div>
          <p class="detail-label">Full name*</p>
          <p class="detail-value">{{ item.full_name }}</p>
        </div>

        <div>
          <p class="detail-label">Email Address*</p>
          <p class="detail-value">{{ item.email }}</p>
        </div>

        <div>
          <p class="detail-label">Phone Number*</p>
          <p class="detail-value">{{ item.phone }}</p>
        </div>

        <div>
          <p class="detail-label">Department*</p>
          <p class="detail-value">{{ item.department }}</p>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Account Info -->
    <div>
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Account Information</h2>
      </div>

      <div class="space-y-4">
        <div>
          <p class="detail-label">Username*</p>
          <p class="detail-value">{{ item.username }}</p>
        </div>

        <div>
          <p class="detail-label">Account Status*</p>
          <p class="detail-value text-green-600 font-semibold flex items-center">
            <span class="w-2 h-2 rounded-full bg-green-600 mr-2"></span> Active
          </p>
        </div>

        <div>
          <p class="detail-label">Last Login*</p>
          <p class="detail-value">{{ formatDate(item.last_login) }}</p>
        </div>

        <div>
          <p class="detail-label">Account Created*</p>
          <p class="detail-value">{{ formatDate(item.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
interface UserItem {
  id?: string
  username: string
  email: string
  role: string
  full_name?: string
  phone?: string
  department?: string
  employee_id?: string
  join_date?: string
  manager?: string
  photo?: string
  last_login?: string
  created_at?: string
}

interface Props {
  item: UserItem
}

defineProps<Props>()

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not specified'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getAccessLevel = (role: string) => {
  const accessLevels: Record<string, string> = {
    'Board of Directors': 'Executive',
    'Admin Tender': 'Administrator',
    'PMO': 'Manager',
    'PM': 'Manager',
    'AM': 'Manager',
    'HRD': 'Manager',
    'Finance': 'Manager',
    'GA': 'Standard',
    'Engineer': 'Standard',
    'Technical': 'Standard',
    'Operational': 'Standard',
    'Sales': 'Standard',
    'PIC': 'Standard'
  }
  return accessLevels[role] || 'Standard'
}

const getPermissions = (role: string) => {
  const permissions: Record<string, string[]> = {
    'Board of Directors': ['Full Access', 'User Management', 'System Settings', 'Reports'],
    'Admin Tender': ['User Management', 'Tender Management', 'Reports'],
    'PMO': ['Project Management', 'Team Management', 'Reports'],
    'PM': ['Project Management', 'Team Management'],
    'AM': ['Account Management', 'Client Relations'],
    'HRD': ['HR Management', 'Employee Records'],
    'Finance': ['Financial Management', 'Budget Control'],
    'Engineer': ['Technical Access', 'Project Collaboration'],
    'Technical': ['Technical Access', 'System Maintenance'],
    'Operational': ['Operations Management'],
    'Sales': ['Sales Management', 'Client Relations'],
    'GA': ['General Administration'],
    'PIC': ['Project Coordination']
  }
  return permissions[role] || ['Basic Access']
}
</script>

<style scoped>
.detail-item {
  @apply border-b border-gray-100 pb-3 last:border-b-0 last:pb-0;
}

.detail-label {
  @apply block text-sm font-medium text-gray-500 mb-1;
}

.detail-value {
  @apply text-gray-900 font-medium;
}
</style>