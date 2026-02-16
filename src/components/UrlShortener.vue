<template>
  <div class="shortener">
    <h1>🔗 URL Shortener</h1>

    <form @submit.prevent="handleSubmit">
      <input
        v-model="inputUrl"
        placeholder="Cole sua URL aqui..."
        :disabled="loading"
      />
      <button :disabled="loading || !inputUrl.trim()">
        {{ loading ? "Processando..." : "Encurtar" }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="result" class="result">
      <p><strong>Original:</strong> {{ result.originalUrl }}</p>
      <div class="short">
        <a :href="result.shortUrl" target="_blank">{{ result.shortUrl }}</a>
        <button @click="copy" type="button">{{ copied ? "✓" : "📋" }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { urlService } from "../services/api";
import type { ShortenUrlResponse } from "../types";

const inputUrl = ref("");
const result = ref<ShortenUrlResponse | null>(null);
const error = ref("");
const loading = ref(false);
const copied = ref(false);

const handleSubmit = async () => {
  error.value = "";
  result.value = null;
  loading.value = true;

  try {
    result.value = await urlService.shortenUrl(inputUrl.value);
    inputUrl.value = "";
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao encurtar URL";
  } finally {
    loading.value = false;
  }
};

const copy = async () => {
  if (result.value) {
    await navigator.clipboard.writeText(result.value.shortUrl);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
};
</script>

<style scoped>
.shortener {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

button:hover:not(:disabled) {
  background: #5568d3;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #e53e3e;
  padding: 0.75rem;
  background: #fff5f5;
  border-radius: 6px;
  border-left: 4px solid #e53e3e;
}

.result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.result p {
  margin-bottom: 1rem;
  word-break: break-all;
}

.short {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.short a {
  flex: 1;
  color: #667eea;
  font-weight: 600;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  text-decoration: none;
}

.short button {
  padding: 0.75rem 1rem;
  background: #48bb78;
}
</style>
