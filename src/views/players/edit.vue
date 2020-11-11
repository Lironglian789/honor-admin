<template>
  <div>
    <player-detail :is-edit="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import playerDetail from './components/PlayerDetail.vue'

  @Component({
    name: 'createPlayer',
    components: {
      playerDetail
    }
  })
export default class extends Vue {
}
</script>

<style scoped>

</style>
