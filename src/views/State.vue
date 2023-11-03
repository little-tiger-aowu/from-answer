<template>
  <div class="draw">
    <LuckyWheel ref="myLucky" width="85vw" height="85vw" :prizes="prizes" :blocks="blocks" :buttons="buttons"
                :default-style="defaultStyle" :default-config="defaultConfig" @start="startCallback" @end="endCallback"
                class="luckyWheel"/>
    <div class="myPrizeText">
      <div>已有{{ people }}人参与</div>
      <br>
      <div>您今天还有{{ remaining }}次抽奖机会</div>
      <img v-if="!isPlay" style="margin: 20px 0;" src="../assets/button.png" @click="startCallback" alt=""
           width="230px">
      <img v-else style="margin: 20px 0;" src="../assets/showMyPrize.png" @click="showPrize" alt="" width="230px">
      <div class="illustrate">
        <img src="../assets/prize.png" width="100px" height="20px" alt="" style="margin:10px 20px;">
        <div style="margin-left: 20px;">活动奖品</div>
        <div style="overflow: auto;height: 200px;">
          <div style="margin: 10px 20px;display: flex;" v-for="item in prizesItem" :key="item.index"
               v-if="item.id != 0">
            <div style="flex:2">
              <img style="width:50px;height:50px;background-color: #ffffff;" :src="item.prizePic" alt="">
            </div>
            <div
                style="flex:8;border-bottom: 1px dashed #ccc; border-color: #966818;margin-left: 10px;font-size: 13px;">
              <!-- <div style="font-size: 14px;font-weight: 800;">
                一等奖
              </div> -->
              <div style="margin-top: 20px;font-size: 14px;font-weight: 800;">
                {{ item.hierarchy }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-dialog v-model="show" :showConfirmButton=false style="border-radius: 5px;width: 280px;">
      <div style=" border-bottom: 1px dashed #ccc;width: 100%;height: 20px;line-height: 20px;">
        <div @click="show = false" style="position: absolute;right: 0;top: 0;">
          <van-icon name="cross"/>
        </div>
      </div>
      <img :src=prizePic width="120px" style="margin: 20px 0;">
      <div style="margin-bottom: 20px;">{{ prizeName }}</div>
      <div style="margin-bottom: 20px;">请到赛默飞展位现场领取</div>
    </van-dialog>
  </div>
</template>
<script>

import drawBg from '../assets/draw_back3.png'
import drawBtn from '../assets/start.png'
import { getPrize, getPrizeInfo, getPlayUserSum, startPlay, isPlay, records } from '../api/forms'
import { Toast, Dialog } from 'vant'

export default {
  data () {
    return {
      show: false, // 弹框显示隐藏
      prizeName: '', // 弹框标题
      prizePic: '', // 弹框图片
      people: 0, // 参与人数
      remaining: 0, // 剩余抽奖次数
      prizes: [], // 转盘上面的数据
      prizesItem: [], // 下面奖品列表的数据
      blocks: [{ padding: '6.5vw', imgs: [{ src: drawBg, width: '100%', rotate: true }] }],
      drawDisable: false,
      isPlay: false,
      params: {
        openId: this.$cookies.get('openId') || '',
        batchTag: this.$cookies.get('batchTag')
      },
      prizeInfo: {}, // 中奖信息
      defaultStyle: {
        fontColor: '#000',
        fontSize: '13px'
      },
      buttons: [{
        radius: '50px',
        imgs: [{ src: drawBtn, width: '18vw', top: '-13vw' }]
      }],
      defaultConfig: { gutter: '3px' }
    }
  },

  mounted () {
    this.myPrizeBtn()
    // this.getForm()
    // this.myPrizeBtn()
    this.awards()
    this.postparticipation()
    this.userIsPlay()
    // if (this.$cookies.get('playStart') === 'notStart') {
    //   Toast.fail('活动暂未开启')
    // } else if (this.$cookies.get('playStart') === 'over') {
    //   Toast.fail('活动已结束')
    // }
  },

  methods: {
    myPrizeBtn () {
      getPrize().then((res) => {
        if (res.code === 200) {
          res.data.forEach((item, index) => { // 转盘里面的数据
            this.prizes.push({
              fonts: [{ text: item.prizeName, fontSize: '10px', fontColor: '#000', top: '70px', lineHeight: '13px' }],
              background: '#fff',
              imgs: [{
                src: item.prizePic,
                // width: '40px',
                // height: '40px',
                width: '50px',
                top: '20px'
              }]
            })
          })
        }
      })
    },
    endCallback () {
      this.show = true // 显示弹框
    },
    // 开始抽奖
    startCallback () {
      // this.$refs.myLucky.play()
      // // 模拟调用接口异步抽奖
      // setTimeout(() => {
      //   // 假设后端返回的中奖索引是0
      //   const index = 2
      //   // 调用stop停止旋转并传递中奖索引
      //   this.$refs.myLucky.stop(index)
      // }, 3000)
      startPlay(this.params.openId).then(res => {
        if (res.code === 200) {
          this.prizeInfo = res.data
          this.prizeName = res.data.prizeName // 中奖礼品名字
          this.prizePic = res.data.prizePic // 图片
          // 调用抽奖组件的play方法开始游戏
          this.$refs.myLucky.play()
          // 模拟调用接口异步抽奖
          setTimeout(() => {
            // 假设后端返回的中奖索引是0
            const index = res.data.id - 1
            // 调用stop停止旋转并传递中奖索引
            this.$refs.myLucky.stop(index)
          }, 3000)
          this.postparticipation()
          this.isPlay = true
        } else {
          Toast.fail(res.msg)
        }
      })
    },
    // 参与人数和抽奖机会
    postparticipation () {
      console.log('123', 123)
      getPlayUserSum({ openId: this.params.openId }).then((res) => {
        this.people = res.data.people
        this.remaining = res.data.remaining
      })
    },
    // 是否抽奖
    userIsPlay () {
      isPlay(this.params.openId).then((res) => {
        this.isPlay = res.data
      })
    },
    // 查看我的奖品
    showPrize () {
      records(this.params.openId).then((res) => {
        this.prizeInfo = res.data
        this.prizeName = res.data.prizeName // 中奖礼品名字
        this.prizePic = res.data.prizePic // 图片
        this.show = true
      })
    },
    // 判断是否填过表单
    getForm () {
      if (this.$cookies.get('data') == false || this.$cookies.get('data') == 'false') {
        this.$router.push('/form')
      }
    },
    // 获取奖品奖项备注
    awards () {
      getPrizeInfo().then((res) => {
        if (res.code === 200) {
          this.prizesItem = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.draw {
  min-height: 150vh;
  background: url('../assets/BG.png') no-repeat;
  text-align: center;
  background-size: cover; // 或者使用 background-size: 100%;
  background-repeat: no-repeat;
  background-position: top center;
  position: relative;

  .luckyWheel {
    margin: auto;
    padding-top: 150px;
  }

  .myPrizeText {
    margin: 15px 0;
    text-align: center;
    color: #fff;
    letter-spacing: 3px;

    span {
      letter-spacing: 5px;
      padding-bottom: 5px;
      border-bottom: 1px #000 solid;
      color: #000;
      font-family: 'SourceHanSansCN-Medium';
    }
  }

  .people {
    width: 400px;
    padding-top: 50px;
  }

  .illustrate {

    left: 0;
    right: 0;
    // display: flex;
    // justify-content: center;
    color: #5d5437;
    width: 80%;
    margin: 0 auto;
    background-color: #d4d4d2;
    height: 40vh;
    border-radius: 20px;
    opacity: 0.9;
    text-align: left;
  }
}

.var-popup__overlay {
  background-color: rgba(0, 0, 0, .7);
}

.var-popup__content.var-elevation--3.var-popup--center {
  background-color: rgba(0, 0, 0, 0);
  box-shadow: none;

  .winPrize {
    position: relative;

    .prizeImg {
      // width: 200px;
      position: absolute;
      z-index: 99;
      left: 50%;
      top: 32%;
      transform: translate(-50%, -50%);
    }

    .prizeText {
      // width: 200px;
      position: absolute;
      z-index: 99;
      left: 50%;
      top: 57%;
      transform: translate(-50%, -50%);
      color: #000000;
      font-size: 30px;

    }

    .winPrizeBg {
      position: relative;
      width: 80vw;
      border-radius: 20px;
    }
  }

  .info {
    text-align: center;

    .prizeImg {
      width: 150px;
    }

    p {
      font-size: 28px;
      letter-spacing: 5px;
      position: relative;
      top: 70px;
      color: #fff;
      width: 500px;
    }

    .prizeName {
      font-size: 35px;
      font-weight: bold;
    }

    .var-image__image {
      margin: auto;
    }

    .receiveAddress {
      display: inline-block;
      color: rgb(255, 255, 255);
      padding: 0 30px;
      line-height: 70px;
      background-color: #ef6378;
      border-radius: 10px;
      letter-spacing: 4px;
      margin-top: 15px;
      font-family: 'SourceHanSansCN-Bold';
    }
  }

  .tips {
    font-size: 25px;
    letter-spacing: 2px;
    color: #fff;
    padding-top: 50px;
    font-family: 'SourceHanSansCN-Medium';
  }

  .close {
    text-align: center;
    padding-top: 45px;
  }

  .noPrize {
    width: 80vw;
    border-radius: 20px;
  }

}
</style>
