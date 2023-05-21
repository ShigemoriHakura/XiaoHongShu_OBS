<template>
  <v-container style="max-width: 100%!important;">
    <!--<v-container v-if="!$store.state.config.isLogin" style="max-width: 100%!important;">
      请先登录账号再使用本功能！
    </v-container>
    <v-container v-if="$store.state.config.isLogin" style="max-width: 100%!important;">-->
    <v-container style="max-width: 100%!important;">
      <v-tabs>
        <v-tab>
          首页
        </v-tab>
        <v-tab>
          封面
        </v-tab>
        <v-tab-item>
          <v-container>
            <p>存储的SID： {{$store.state.WebCommonCache.sid}}</p>
            <v-btn class="ma-2" elevation="2" color="warning" @click="LogOut">登出</v-btn>
          </v-container>
          <v-container v-if="$store.state.WebCommonCache.sid =='' || $store.state.WebCommonCache.sid == null">
            <p>未登录</p>
            <v-text-field v-model="phoneNumber" type="text" label="手机号">
            </v-text-field>
            <v-text-field v-model="smsNumber" type="text" label="验证码">
            </v-text-field>
            <v-btn class="ma-2" elevation="2" color="warning" @click="GetSMS">获取验证码</v-btn>
            <v-btn class="ma-2" elevation="2" color="success" @click="LoginIn">登录</v-btn>
          </v-container>
          <v-container v-if="$store.state.WebCommonCache.sid !='' && $store.state.WebCommonCache.sid != null">
            <v-text-field v-model="obsName" type="text" label="直播间名">
            </v-text-field>
            <v-text-field v-model="notice" type="text" label="直播公告">
            </v-text-field>
            <v-text-field v-model="obsUrl" type="text" label="推流地址">
            </v-text-field>
            <v-text-field v-model="roomId" type="text" label="房间ID" disabled>
            </v-text-field>
            <v-text-field v-model="cover" type="text" label="封面" disabled>
            </v-text-field>
            <v-btn class="ma-2" elevation="2" color="warning" @click="LivePre">准备推流</v-btn>
            <v-btn class="ma-2" elevation="2" color="success" @click="LiveStart">开始直播</v-btn>
            <v-btn class="ma-2" elevation="2" color="error" @click="LiveStop">结束直播</v-btn>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="12">
              上传封面：
              <v-btn class="ma-2" elevation="2" color="success" @click="ChangeCover">上传封面</v-btn>
              <v-image-input v-model="liveCover" :image-quality="0.25" clearable image-format="jpeg" :imageHeight="470"
                :imageWidth="352.5" :fullWidth="true" :fullHeight="true" :hideActions="false" />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-container>
</template>

<script>
import eConfig from "electron-config"
import cookie from "cookie"
import got from "got"
import { Debugger, remote, shell } from 'electron'
import { formatDate } from '@/utils/timeFormat'
const FormData = require('form-data');

export default {
  name: 'OBSPanel',
  data: () => ({
    //弹窗
    dialogShow: false,
    dialogText: "",
    dialogUserName: "",
    dialogUserId: "",
    dialogAction: "",
    categoryId: 9,
    categoryConcrete: [],

    checkTimer: null,

    phoneNumber: "",
    smsNumber: "",

    obsName: "",
    obsUrl: "",
    roomId: "",
    cover: "",
    liveCover: "",
    notice: "",
  }),
  beforeDestroy() {
    window.clearInterval(this.checkTimer)
  },
  components: {
  },
  watch: {
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  async created() {
    this.checkTimer = window.setInterval(this.CheckLiveStatus, 3 * 1000)
  },
  methods: {
    async GetSMS() {
      var url = "https://robs.xiaohongshu.com/api/sns/send_sms"
      var res = await this.$WebCommon.postHTTPResult(
        url,
        {
          phone_number: this.phoneNumber,
          phone_country: "86"
        }
      )
      var resJson = JSON.parse(res.body)
      if (resJson.result == 0) {
        this.showSnackbar("发送成功")
      } else {
        this.showSnackbar(resJson.msg)
      }
    },
    async LoginIn() {
      var url = "https://robs.xiaohongshu.com/api/sns/login_by_sms"
      var res = await this.$WebCommon.postHTTPResult(
        url,
        {
          phone_number: this.phoneNumber,
          phone_country: "86",
          sms_code: this.smsNumber
        }
      )
      var resJson = JSON.parse(res.body)
      console.log(resJson)
      if (resJson.result == 0) {
        this.showSnackbar("登录成功，" + resJson.data.nickname)
        this.$store.state.WebCommonCache.sid = resJson.data.access_token
        this.$store.state.WebCommonCache.cookies = res.headers["set-cookie"]
        this.$WebCommon.saveNewData(this)
      } else {
        this.showSnackbar(resJson.msg)
      }
    },
    LogOut() {
      this.$store.state.WebCommonCache.sid = ""
      this.$store.state.WebCommonCache.cookies = ""
      this.$WebCommon.saveNewData(this)
    },
    async LivePre() {
      var url = "https://robs.xiaohongshu.com/api/sns/live/pre?build=2200002&platform=pc&system_version=10.0.22000&cpu_model=12th+Gen+Intel(R)+Core(TM)+i5-12400&gpu=ANGLE+(NVIDIA+GeForce+RTX+3070+Direct3D11+vs_5_0+ps_5_0)&is_win_7=false"
      var res = await this.$WebCommon.getHTTPResult(
        url,
        this.$store.state.WebCommonCache.sid
      )
      var resJson = JSON.parse(res.body)
      console.log(resJson)
      this.obsName = resJson.data.name
      this.obsUrl = resJson.data.url.push_url
      this.roomId = resJson.data.room_id
      this.cover = resJson.data.cover
    },
    async LiveStart() {
      if (this.roomId != "") {
        var url = "https://robs.xiaohongshu.com/api/sns/live/" + this.roomId + "/start?build=2200002&platform=pc&system_version=10.0.22000&cpu_model=12th+Gen+Intel(R)+Core(TM)+i5-12400&gpu=ANGLE+(NVIDIA+GeForce+RTX+3070+Direct3D11+vs_5_0+ps_5_0)&is_win_7=false"
        //var url = "https://httpbin.org/anything"
        var res = await this.$WebCommon.postJsonHTTPResult(
          url,
          this.$store.state.WebCommonCache.sid,
          {
            name: this.obsName,
            notice: this.notice,
            is_distribute: true,
            cover: this.cover,
            lesson_id: 0
          }
        )
        var resJson = JSON.parse(res.body)
        if (resJson.result == 0) {
          this.showSnackbar("开始成功")
        } else {
          this.showSnackbar("开始失败：" + resJson.msg)
        }
      } else {
        this.showSnackbar("请先准备直播")
      }
    },
    async LiveStop() {
      if (this.roomId != "") {
        var url = "https://robs.xiaohongshu.com/api/sns/live/" + this.roomId + "/stop"
        var res = await this.$WebCommon.postJsonHTTPResult(
          url,
          this.$store.state.WebCommonCache.sid,
          {
          }
        )
        var resJson = JSON.parse(res.body)
        console.log(resJson)
        if (resJson.result == 0) {
          this.showSnackbar("结束成功")
          this.obsName = ""
          this.obsUrl = ""
          this.roomId = ""
          this.cover = ""
        } else {
          this.showSnackbar("结束失败：" + resJson.msg)
        }
      } else {
        this.showSnackbar("请先准备直播")
      }
    },
    async ChangeCover() {
      if (this.liveCover != null && this.liveCover != "") {
        var seed = Math.round(Math.random() * 9999999999999999)
        console.log(seed)
        var url = "https://www.xiaohongshu.com/fe_common_api/burdock/upload/v4/qcloud/token?_=0.0" + seed + "&bucket=picasso&bizKey=livehelper&useAccelerate=false"
        var res = await this.$WebCommon.getX3HTTPResult(
          url
        )
        var resJson = JSON.parse(res.body)
        console.log(resJson)
        if (resJson.code == 0) {
          //console.log("https://picasso-static.xiaohongshu.com/" + resJson.data.key)
          var aurl = "https:" + resJson.data.url
          var mFormData = new FormData()

          var decodedFile = new Buffer(this.liveCover.split(',')[1], 'base64')
          mFormData.append('Content-Type', 'image/png')
          mFormData.append('key', resJson.data.key)
          mFormData.append('Signature', resJson.data.token)
          mFormData.append('x-cos-security-token', String(resJson.data.xCosSecurityToken))
          mFormData.append('file', decodedFile, { filename: 'cover.jpg' })

          var res1 = await this.$WebCommon.postHTTPFormData(
            aurl,
            mFormData
          )
          if (res1.statusCode == 204) {
            this.showSnackbar("上传成功")
            this.cover = "https://picasso-static.xiaohongshu.com/" + resJson.data.key
          } else {
            this.showSnackbar("上传失败：" + res1.statusCode)
          }
        } else {
          this.showSnackbar(res.body)
        }
      }
    },
    async CheckLiveStatus() {
      if (this.$store.state.WebCommonCache.sid != "" && this.$store.state.WebCommonCache.sid != null) {
        var url = "https://robs.xiaohongshu.com/api/sns/check_login"
        var res = await this.$WebCommon.getHTTPResult(
          url,
          this.$store.state.WebCommonCache.sid
        )
        var resJson = JSON.parse(res.body)
        if (resJson.result != 0) {
          this.showSnackbar(resJson.msg)
          this.LogOut()
        }
        //console.log(resJson)
        var url = "https://robs.xiaohongshu.com/api/sns/live/check_live"
        var res = await this.$WebCommon.getHTTPResult(
          url,
          this.$store.state.WebCommonCache.sid
        )
        var resJson = JSON.parse(res.body)
        //console.log(resJson)
      }
    },
    getStatus(status) {
      if (status) {
        return "已启动"
      }
      return "未启动"
    },
    showSnackbar(content) {
      this.$store.state.snackbar.text = content
      this.$store.state.snackbar.show = true
    },
  }
}
</script>
