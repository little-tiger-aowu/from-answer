<template>
  <div><img src="@/assets/loading.gif" width="100%"></div>
</template>
<script>
import { Toast } from 'vant'
import { userLogin, isAddForm } from '@/api/forms'

export default {
  data () {
    return {
      openId: this.$route.query.openId || '',
      nickName: this.$route.query.nickname || '',
      portrait: this.$route.query.avatar || '',
      batchTag: this.$cookies.get('batchTag') || '' // 批次
    }
  },
  created () {
    this.getOpenid()
  },
  methods: {
    getOpenid () {
      if (this.openId) {
        this.$cookies.set('openId', this.openId)
        this.$cookies.set('nickName', this.nickName)
        this.$cookies.set('portrait', this.portrait)
        this.login()
      } else {
        let url =
            'http://wx.oauth.synconize.com/wechat/oauth/?appId=wxfb99f0fc1ca20ac0&mode=hash&redirectUrl=http://thermofisher-material.draw.al-ecs.synconize.cn/'
        // let url =
        // 'http://wx.oauth.synconize.com/wechat/oauth/?appId=wxfb99f0fc1ca20ac0&mode=hash&redirectUrl=http://192.168.0.40:8080/'
        window.location.href = url
      }
    },
    login () {
      let data = {
        nickName: this.nickName,
        openId: this.openId,
        portrait: this.portrait
      }
      userLogin(data).then((res) => {
        if (res.code === 200) {
          isAddForm(data.openId).then((res) => {
            console.log('res', res.data)
            if (res.data) {
              this.$router.push('/state')
            } else {
              this.$router.push('/form')
            }
          })
        } else {
          Toast({
            type: 'fail',
            message: res.msg
          })
        }
      })
    },
  }
}
</script>
