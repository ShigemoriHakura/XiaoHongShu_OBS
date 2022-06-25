<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent expand-on-hover app>
      <v-list nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link" link v-show="getIsShow(item.needIsLogin)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <v-snackbar v-model="$store.state.snackbar.show">
        {{ $store.state.snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" color="pink" text @click="$store.state.snackbar.show = false">
            关闭
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data() {
    return {
      items: [
        { title: '小红书助手', icon: 'mdi-view-dashboard', link: '/', needIsLogin: false },
        { title: '操作日志', icon: 'mdi-history', link: '/log', needIsLogin: false },
        { title: '更新日志', icon: 'mdi-cup', link: '/history', needIsLogin: false },
      ],
      right: null,

      //ws部分
      live: null,
    }
  },
  beforeDestroy() {
  },
  created() {
    //拉缓存信息
    this.$WebCommon.getSavedData(this)
  },
  methods: {
    getIsShow(status) {
      if (status && this.$store.state.config.isLogin) {
        return true
      } else if (!status) {
        return true
      }
      return false
    }
  }
}


</script>
