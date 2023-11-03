<template>
  <div class="formContent">
    <div class="form">
      <ul class="header">
        <!--        <li>咨询问卷</li>-->
        <!--        <li>填问卷,赢好礼!</li>-->
        <!--        <li>收到信息后,我们会第一时间与您联系!</li>-->
      </ul>
      <van-form @submit="onSubmit" ref="form">
        <van-field label="姓名" v-model="name" :rules="[{ required: true, message: '请填写用户名' }]" required clearable
                   :border="false" left-icon="manager"/>
        <van-field label="手机" v-model="phone" type="number"
                   :rules="[{ required: true, message: '请填写手机号码' }, { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: '请输入正确的手机号码' }]"
                   required clearable maxlength="11" :border="false" left-icon="phone"/>
        <van-field label="单位" v-model="company" :rules="[{ required: true, message: '请填写单位' }]" required
                   clearable
                   :border="false" left-icon="column"/>
        <van-field label="邮箱" v-model="email"
                   :rules="[{ required: true, message: '请填写邮箱' }, { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请填写正确的邮箱' }]"
                   required clearable :border="false" left-icon="envelop-o"/>
        <radio name="感谢您花费宝贵时间填写此问卷，如实回答即可" :radioValueList="quesaireList"
               @radioChange="quesaireChange"/>
        <checkBox name="请选择您感兴趣的仪器（可多选）"
                  :checkBoxList="materialScienceList"
                  @checkBoxChange="lifeScienceChange" v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划'"
                  ref="checkBoxs1"/>
        <van-field v-model="interestedProOther"
                   :rules="[{ required: true, message: '请选择您感兴趣的其他仪器' }]"
                   required clearable :border="false" class="tutor"
                   v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划' && interestedPro.includes('其他')"/>
        <radio name="您单位是否有电镜采购计划？" @radioChange="personalProPlanChange" :radioValueList="personalProPlan"
               v-model="isPlan"
               ref="radios3"
               v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划'"/>
        <radio name="您计划采购的产品类型？" @radioChange="planProductChange" :radioValueList="planProductList"
               ref="radios4"
               v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划' && isPlan === '有' "/>
        <van-field v-model="planProductOther"
                   :rules="[{ required: true, message: '请选择您感兴趣的其他仪器' }]"
                   required clearable :border="false" class="tutor"
                   v-if="planProduct === '其他' && quesaire === '对赛默飞产品感兴趣,或有采购计划'"/>
        <checkBox name="请选择您需要的服务支持（多选）"
                  :checkBoxList="serviceSuppotList"
                  @checkBoxChange="serviceSuppotChange" v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划'"
                  ref="checkBoxs2"/>
        <van-field v-model="serviceSuppotOther"
                   :rules="[{ required: true, message: '请选择您感兴趣的其他仪器' }]"
                   required clearable :border="false" class="tutor"
                   v-if="quesaire === '对赛默飞产品感兴趣,或有采购计划' && serviceSuppot.includes('其他')"/>
        <radio name="您是否愿意接收赛默飞产品营销和活动推广的电子邮件?" :radioValueList="isOrNotAccetpList"
               @radioChange="isOrNotAcceptChange" ref="radios4"/>
        <div style="padding: 16px;">
          <van-button block type="info" :loading="isLoading" loading-text="提交中..." native-type="submit">提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data'
import radio from '../components/radios.vue'
import checkBox from '../components/checkBox.vue'
import { addForm } from '../api/forms'
import { Toast, Dialog } from 'vant'

export default {
  components: {
    radio,
    checkBox
  },
  data () {
    return {
      openId: this.$cookies.get('openId') || '',
      name: '', // 姓名
      phone: '', // 手机
      company: '', // 单位
      email: '', // 邮箱
      quesaire: '', // 填写原因
      acceptEmail: '', // 是否愿意接受邮件
      interestedPro: [], // 感兴趣的产品
      interestedProOther: '', // 其他感兴趣的产品
      planProduct: '', // 您计划采购的产品类型
      planProductOther: '', // 您计划采购的产品类型 其他
      serviceSuppot: [], // 需要的支持
      serviceSuppotOther: '', // 需要的其他支持
      isPlan: '', // 是否有采购计划
      quesaireList: ['填表只是想要礼品', '对赛默飞产品感兴趣,或有采购计划'], // 感谢您话费宝贵的时间填写问卷
      isOrNotAccetpList: ['愿意', '不愿意'], // 是否愿意接受
      materialScienceList: ['扫描电子显微镜-SEM',
        '透射电子显微镜-TEM',
        '双束电子显微镜-FIB',
        '冷冻电子显微镜-CryoEM',
        // 'X射线光电子能谱仪-XPS',
        '台式扫描电镜-Desktop SEM',
        'XPS/EDS',
        '三维可视化软件开发包',
        '电镜升级产品/软件/配件',
        'CleanMill氩离子研磨系统',
        '其他'
      ], // 感兴趣的仪器
      personalProPlan: ['有', '没有'],
      planProductList: [
        '扫描电子显微镜-SEM',
        '透射电子显微镜-TEM',
        '双束电子显微镜-FIB',
        '冷冻电子显微镜-CryoEM',
        // 'X射线光电子能谱仪-XPS',
        '台式扫描电镜-Desktop SEM',
        'XPS/EDS',
        '三维可视化软件开发包',
        '电镜升级产品/软件/配件',
        'CleanMill氩离子研磨系统',
        '其他'
      ],
      serviceSuppotList: ['需要做样', '需要报价', '需要产品介绍/样册', '没有服务需求', '其他'],
      // areaList: areaList, // 省市区地址
      isLoading: false
    }
  },
  methods: {
    // 填写问卷
    quesaireChange (val) {
      this.quesaire = val
    },
    // 感兴趣的仪器
    lifeScienceChange (val) {
      this.interestedPro = val
      console.log('this.interestedPro', this.interestedPro)
    },
    // 计划采购的产品类型
    planProductChange (val) {
      this.planProduct = val
    },
    // 是否有次采购计划
    personalProPlanChange (val) {
      this.isPlan = val
    },
    // 需要的支持
    serviceSuppotChange (val) {
      this.serviceSuppot = val
    },
    // 是否愿意接受邮件
    isOrNotAcceptChange (val) {
      this.acceptEmail = val
    },
    // 提交按钮
    async onSubmit () {
      this.isLoading = true
      this.interestedPro.map((item, index) => {
        if (item === '其他') {
          return this.interestedPro[index] = '其他-' + this.interestedProOther
        }
      })
      this.serviceSuppot.map((item, index) => {
        if (item === '其他') {
          return this.serviceSuppot[index] = '其他-' + this.serviceSuppotOther
        }
      })
      let data = {
        openId: this.openId,
        name: this.name,
        phone: this.phone,
        email: this.email,
        unit: this.company,
        optionOne: this.quesaire,
        optionTwo: this.acceptEmail,
        optionThree: this.planProduct === '其他' ? '其他-' + this.planProductOther : this.planProduct,
        optionHiddenOne: this.interestedPro.toString(),
        optionHiddenThree: this.isPlan,
        optionHiddenTwo: this.serviceSuppot.toString()
      }
      addForm(data).then((res) => {
        if (res.code === 200) {
          setTimeout(() => {
            this.isLoading = false
            this.$router.replace('/state')
          }, 1000)
        }
      })
      // submitForm(data).then(res => {
      //   if (res.code === 200) {
      //     this.isLoading = false
      //     this.$cookies.set('openId', this.openId)
      //     this.$router.replace(`/state?openId=${this.openId}`)
      //     this.$cookies.set('data', true)
      //   }
      // })
    },
    // 判断是否填过表单
    getForm () {
      if (this.$cookies.get('data') === true || this.$cookies.get('data') === 'true') {
        this.$router.push('/state')
      }
    }
  },
  created () {
    // if (this.$cookies.get('playStart') === 'notStart') {
    //   Toast.fail('活动暂未开启')
    // } else if (this.$cookies.get('playStart') === 'over') {
    //   Toast.fail('本次活动已结束，请留意后续活动')
    // } else {
    //   this.getForm()
    // }
  }
}
</script>
<style lang="scss" scoped>
.formContent {
  background-image: url('../assets/banner3.jpg');
  background-repeat: repeat;
  background-size: 100% 100%;
  height: 100vh;
  overflow-y: auto;

  .form {
    // min-height: 100vh;
    background: url('../assets/banner2.png') no-repeat;
    background-size: 100% auto;

    .header {
      height: 100%;
      text-align: center;
      position: relative;
      padding-top: 55%;
      letter-spacing: 2px;

      li:nth-child(1) {
        font-size: 27px;
        margin-bottom: 10px;
        color: #7F8C8D;
        font-weight: bold;
      }

      li:nth-child(2),
      li:nth-child(3) {
        font-size: 14px;
        color: #525252;
        line-height: 20px;
        opacity: .8;
      }
    }

    ::v-deep .van-form {
      margin-top: 20.4%;
      padding: 15px 0 0;
      background: #fff;
      opacity: .96;

      .van-cell {
        flex-direction: column;

        // 图标
        .van-field__left-icon {
          position: absolute;
          top: 48px;
          left: 25px;
        }

        .van-icon:before {
          font-size: 20px;
          color: #768bab;
        }

        .van-field__label {
          margin-bottom: 5px;
          margin-right: 0;

          span {
            font-size: 14px;
            letter-spacing: 2px;
          }
        }

        // 输入的内容
        .van-field__body {
          border: 1px #d3d3d3 solid;
          padding: 0 7px 0 35px;

          .van-field__control {
            font-size: 14px;
            line-height: 40px;
          }

          .van-icon:before {
            font-size: 16px !important;
          }
        }
      }

      .radio {

        .van-icon:before {
          font-size: 10px !important;
          color: #fff;
        }

        .van-cell__title.van-field__label {
          width: auto;
        }

        .van-field__body {
          border: none;
          padding: 0;

          .van-radio {
            margin: 10px 0 0;
          }
        }
      }

      .van-checkbox {
        margin: 15px 0 0;

        .van-checkbox__icon--checked .van-icon {
          background: #224477;
          border: 1px #224477 solid;
        }
      }

      .area,
      .detailArea,
      .tutor,
      .companyTypeOther {

        .van-field__body {
          padding: 0 7px;
        }

        .van-cell__title.van-field__label {
          width: auto;
        }
      }
    }
  }
}
</style>
