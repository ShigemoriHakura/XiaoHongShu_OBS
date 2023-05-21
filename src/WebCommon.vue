<script>
import eConfig from "electron-config"
import cookie from "cookie"
import got from "got"
import axios from 'axios'

const econfig = new eConfig()
const UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) live-helper/2.6.6 Chrome/89.0.4389.128 Electron/12.0.11 Safari/537.36 env/production platform/win32 appname/xhs-live"
const DeviceId = "70:12:c2:fb:17:22"
let Base64 = require('js-base64').Base64

//主业务逻辑，处理全局登录等属性。
export default {
  //存储区逻辑
  //同步存储数据，经典的this和that！
  getSavedData(that) {
    that.$store.state.WebCommonCache.cookies = econfig.get("WebCommonCache.cookies")
    that.$store.state.WebCommonCache.sid = econfig.get("WebCommonCache.sid")
    that.$store.commit('addLog', "读取设置内容完成")
  },

  //全部数据保存
  saveNewData(that) {
    econfig.set("WebCommonCache.cookies", that.$store.state.WebCommonCache.cookies)
    econfig.set("WebCommonCache.sid", that.$store.state.WebCommonCache.sid)
    that.$store.commit('addLog', "保存设置内容完成")
  },

  //不同请求有不同的referer和ua需求，这里统一封装方法。因为formdata有点问题所以多一个RawBody（Buffer）的方法
  async postHTTPResult(url, form) {
    try {
      const res = await got(url, {
        method: "POST",
        headers: {
          "device-id": DeviceId,
          "user-agent": UserAgent,
        },
        form: form,
      })
      return res
    } catch (error) {
      return error.response
    }
  },
  async postJsonHTTPResult(url, sid, form) {
    try {
      const res = await got(url, {
        method: "POST",
        headers: {
          "sid": sid,
          "device-id": DeviceId,
          "user-agent": UserAgent,
        },
        json: form,
      })
      return res
    } catch (error) {
      return error.response
    }
  },
  async postHTTPRawBody(url, referer, cookies, contentType, body) {
    try {
      const res = await got(url, {
        method: "POST",
        headers: {
          Referer: referer,
          cookie: cookies,
          "content-type": contentType,
          "user-agent": UserAgent,
        },
        body: body,
      })
      return res
    } catch (error) {
      return error.response
    }
  },
  async postHTTPFormData(url, body) {
    try {
      const res = await got(url, {
        method: "POST",
        headers: {
          "user-agent": UserAgent,
        },
        body: body,
      })
      return res
    } catch (error) {
      console.log(error)
      return error.response
    }
  },
  async getX3HTTPResult(url) {
    try {
      const res = await got(url, {
        method: "GET",
        headers: {
          "user-agent": UserAgent,
        }
      })
      return res
    } catch (error) {
      return error.response
    }
  },
  async getHTTPResult(url, sid) {
    try {
      const res = await got(url, {
        method: "GET",
        headers: {
          "sid": sid,
          "device-id": DeviceId,
          "user-agent": UserAgent,
        },
      })
      return res
    } catch (error) {
      return error.response
    }
  },
}
</script>
