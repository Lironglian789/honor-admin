<template>
  <div class="app-container">
    <!-- 过滤条件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.accountname"
        placeholder="accountname"
        style="width: 200px"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      hightlight-current-row
      style="width:100%"
    >
      <el-table-column
        label="ID"
        align="center"
      >
        <template v-slot="{row}">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column
        label="账户名"
        align="center"
      >
        <template v-slot="{row}">
          {{ row.accountname }}
        </template>
      </el-table-column>
      <!-- 操作的列 -->
      <el-table-column
        label="操作"
        align="center"
      >
        <template v-slot="scope">
          <router-link :to="'/players/edit/'+scope.row.id">
            <el-button
              type="primary"
              icon="el-icon-edit"
            >
              更新
            </el-button>
          </router-link>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getPlayers, deletePlayer } from '@/api/players'
import { Player } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'list',
  components: {
    Pagination
  }
})
export default class extends Vue {
  list: Player[] = []; // 玩家列表数据
  private loading = true; // 数据加载状态
  total = 0 // 总条目数
  listQuery = { // 查询条件
    page: 1, // 默认第一页
    limit: 10, // 每页条数
    accountname: undefined // 按照账户名搜索结果
  }

  created() {
    this.getList()
  }

  async getList() {
    this.loading = true
    const { data } = await getPlayers(this.listQuery)
    this.list = data.items
    this.total = data.total
    this.loading = false
  }

  handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  // 新增玩家
  handleCreate() {
    this.$router.push('/players/create')
  }

  // 删除玩家
  handleDelete(scope: any) {
    const { $index, row } = scope
    this.$confirm('确定删除玩家信息吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonClass: '取消',
      type: 'warning'
    }).then(async() => {
      await deletePlayer(row.id)
      this.list.splice($index, 1)
      this.$message({
        type: 'success',
        message: '删除成功！'
      })
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
