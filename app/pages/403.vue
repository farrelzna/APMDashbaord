<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center px-4">
      <!-- 403 Icon -->
      <div class="mb-6">
        <v-icon
          icon="mdi-lock-alert-outline"
          size="120"
          color="error"
          class="opacity-50"
        ></v-icon>
      </div>

      <!-- Error Message -->
      <h1 class="text-6xl md:text-9xl font-bold text-gray-300 mb-4">403</h1>
      <h2 class="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
        Access Forbidden
      </h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        You don't have permission to access this page. Please contact your
        administrator if you believe this is an error.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
          size="large"
        >
          Go Back
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-home"
          @click="goHome"
          size="large"
        >
          Go to Dashboard
        </v-btn>
      </div>

      <!-- Additional Info -->
      <div class="mt-12 text-xs text-gray-400">
        <p>Error Code: 403 - Forbidden</p>
        <p v-if="attemptedRoute" class="mt-1">
          Attempted route:
          <code class="bg-gray-100 px-2 py-1 rounded">{{
            attemptedRoute
          }}</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const attemptedRoute = computed(
  () => (route.query.from as string) || route.fullPath
);

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};

// Set page meta
definePageMeta({
  layout: false, // Use no layout for error page
});

// Set page title
useHead({
  title: "403 - Access Forbidden",
});
</script>

<style scoped>
code {
  font-family: "Courier New", monospace;
}
</style>
