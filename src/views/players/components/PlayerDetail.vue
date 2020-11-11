<template>
  <div>
    <el-form
      ref="playerForm"
      :model="playerForm"
      :rules="rules"
    >
      <el-form-item
        prop="accountname"
        label="账户名称"
      >
        <el-input v-model="playerForm.accountname" />
      </el-form-item>
      <el-form-item
        prop="nickname"
        label="用户昵称"
      >
        <el-input v-model="playerForm.nickname" />
      </el-form-item>

      <!-- 头像上传 -->
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
      >
        <!-- 预览 -->
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
        >
        <!-- 添加按钮 -->
        <i
          v-else
          class="el-icon-plus avatar-uploader-icon"
        />
      </el-upload>

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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { defaultPlayerData, getPlayer, createPlayer, updatePlayer } from '@/api/players'
import { ElUploadInternalFileDetail } from 'element-ui/types/upload'
import { Form } from 'element-ui'

  @Component({
    name: 'createPlayer',
    components: {
    }
  })
export default class extends Vue {
  @Prop({ default: false }) private isEdit!: boolean

  private validateRequire = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      if (rule.field === 'imageURL') {
        this.$message({
          message: 'Upload cover image is required',
          type: 'error'
        })
      } else {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
      }
      callback(new Error(rule.field + ' is required'))
    } else {
      callback()
    }
  }

  // 数据模型，复制一份空数据模型
  playerForm = Object.assign({}, defaultPlayerData)
  private rules = {
    accountname: [{ validator: this.validateRequire }],
    nickname: [{ validator: this.validateRequire }]
  }

  // 加载状态
  loading = true

  // 头像的预览地址
  imageUrl = ''

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

  // 上传之前校验
  beforeAvatarUpload(file: ElUploadInternalFileDetail) {
    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
      this.$message.error('上传头像图片大小不能超过1MB！')
    }
    return isLt1M
  }

  // 上传成功预览
  handleAvatarSuccess(resp: any, file: ElUploadInternalFileDetail) {
  // 预览图片 可能版本问题file.raw 已经不存在了
    this.imageUrl = URL.createObjectURL(file.raw)
    // 赋值,todo: avatar值应该是在resp中返回的
    this.playerForm.avatar = file.name
  }

  private submitForm() {
    (this.$refs.playerForm as Form).validate(async(valid: boolean) => {
      if (valid) {
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
      } else {
        console.error('校验失败，请修改后重试！')
        return false
      }
    })
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
