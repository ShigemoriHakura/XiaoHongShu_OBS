<template>
  <div class="about">
    <v-container style="max-width: 100%!important;">
      <v-row>
        <v-col cols="12" md="12">
          系统日志
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    日志时间
                  </th>
                  <th class="text-left">
                    日志内容
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in $store.state.logList" :key="item.name">
                  <td>{{ item.logTime | formatDate }}</td>
                  <td>{{ item.logContent }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { formatDate } from '@/utils/timeFormat'

export default {
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
}
</script>