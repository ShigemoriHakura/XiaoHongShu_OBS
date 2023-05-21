<template>
  <div class="about">
    <v-container style="max-width: 100%!important;">
      <v-row>
        <v-col cols="12" md="12">
          更新日志
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    版本号
                  </th>
                  <th class="text-left">
                    内容
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0.1.0</td>
                  <td>初版，主要代码完善中。</td>
                </tr>
                <tr>
                  <td>0.1.1</td>
                  <td>修改封面比例为3:4，加入直播公告</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
