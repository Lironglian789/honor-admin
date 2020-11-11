<template>
  <div>
    <el-form
      ref="form"
      :model="playerForm"
    >
      <el-form-item
        props="accountname"
        label="账户名称"
      >
        <el-input v-model="playerForm.accountname" />
      </el-form-item>
      <el-form-item
        props="nickname"
        label="用户昵称"
      >
        <el-input v-model="playerForm.nickname" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { defaultPlayerData, getPlayer, createPlayer, updatePlayer } from '@/api/players'

  @Component({
    name: 'createPlayer',
    components: {
    }
  })
export default class extends Vue {
    @Prop({ default: false })
    isEdit!: boolean;

    // 数据模型，复制一份空数据模型
    playerForm = Object.assign({}, defaultPlayerData)
    // 加载状态
    loading = true

    // 根基isEdit状态判断是否需要获取玩家信息
    created() {
      // 编辑的路由状态：players/edit/:id
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(parseInt(id))
      }
    }

    async fetchData(id: number) {
      try {
        const { data } = await getPlayer(id)
        this.playerForm = data.player
      } catch (error) {
        console.log(error)
      }
    }

    // 提交表单
    async submitForm() {
      this.loading = true
      try {
        if (this.isEdit) {
          await updatePlayer(this.playerForm.id, this.playerForm)
        } else {
          await createPlayer(this.playerForm)
        }
        // 操作成功的提示
        this.$notify({
          title: '操作成功',
          message: '新增玩家成功',
          type: 'success',
          duration: 20000
        })
      } catch (error) {
        console.log(error)
      }
    }
}
</script>

<style scoped>

</style>
