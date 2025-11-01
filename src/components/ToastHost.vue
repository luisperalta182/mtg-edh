<script setup lang="ts">
import { useToast } from '@lib/toast';
const { state, dismiss } = useToast();
</script>

<template>
  <div class="toast-container">
    <div v-for="t in state.items" :key="t.id" class="toast" :data-kind="t.kind" @click="() => dismiss(t.id)">
      {{ t.message }}
    </div>
  </div>
</template>

<style>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}
.toast {
  background: #0b0e14cc;
  color: #e6e6e6;
  border: 1px solid #232832;
  border-left: 4px solid var(--accent);
  padding: 10px 12px;
  border-radius: 10px;
  min-width: 180px;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,0.3);
}
.toast[data-kind="success"] { border-left-color: #22c55e; }
.toast[data-kind="warning"] { border-left-color: #f59e0b; }
.toast[data-kind="error"] { border-left-color: #ef4444; }
</style>


