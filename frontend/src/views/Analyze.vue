<template>
    <ul class="analysis-list">
        <li v-for="(item, index) in analysisChoices" :key="index" class="analysis-item">
            <router-link :to="item.to" class="analysis-link">
                <span class="analysis-text">{{ item.text }}</span>
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
  name: 'AnalyzePage',
  data() {
    return {
      analysisChoices: [
        { to: '/analyze/GEA', text: 'gene expression analyze (GEA)' },
        { to: '/analyze/CCA', text: 'cell component analyze (CCA)' },
        { to: '/analyze/DGA', text: 'dynamic gene analyze (DGA)' },
        { to: '/analyze/MNA', text: 'multi-network analyze (MNA)' }
      ]
    };
  }
};
</script>

<style scoped>

</style>
