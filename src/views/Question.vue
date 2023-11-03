<template>
  <div class="question">
    <img src="@/assets/banner1.png" width="100%"/>
    <div class="form-box">
      <van-form @submit="onSubmitG">
        <van-field class="title-stand" required v-model="fullNameG" name="姓名" label="姓名"
                   :rules="[{ required: true, message: '请填您的姓名' }]"/>
        <van-field class="title-stand" required v-model="phoneG" name="手机" label="手机"
                   :rules="[{ pattern: regPhone, message: '请填您的手机号码' }]"/>
        <van-field class="title-stand" required v-model="emailG" name="单位" label="单位"
                   :rules="[{ pattern: regEmail, message: '请填您的邮箱' }]"/>
        <van-field class="title-stand" required v-model="companyG" name="您的单位/Organization"
                   label="您的单位/Organization"
                   :rules="[{ required: true, message: '请填您的单位名称' }]"/>

        <!-- 单选框 -->
        <van-field required class="title-stand" name="radio" label="您的职业/Job Function"
                   :rules="[{ required: true, message: '请选择您的职位！' }]">
          <template #input>
            <van-radio-group v-model="radioGroup2G" @change="changeShowRadioForm">
              <van-radio name="项目负责人/Principle Investigator">项目负责人/Principle Investigator</van-radio>
              <van-radio name="实验室技术员/Lab Technician">实验室技术员/Lab Technician</van-radio>
              <van-radio name="学生/Student">学生/Student</van-radio>
              <van-radio name="研发科学家/R&D Scientist">研发科学家/R&D Scientist</van-radio>
              <van-radio name="实验室管理员/Lab Manager">实验室管理员/Lab Manager</van-radio>
              <van-radio name="公司管理人员/Corporate Management">公司管理人员/Corporate Management</van-radio>
              <div class="radio-input">
                <van-radio name="其他">其他，请说明/Other, please specify</van-radio>
                <input type="text" v-if="otherRadio" v-model="newJob"/>
              </div>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 复选框 1-->
        <van-field class="title-stand" required name="checkboxGroup4G"
                   label="电镜应用方向（可多选）/Do you use EM for (multiple choice)"
                   :rules="[{ required: true, message: '请选择电镜应用方向？' }]">
          <template #input>
            <van-checkbox-group v-model="checkboxGroup4G">
              <van-checkbox :name="item.checkname" shape="square" v-for="item in checkboxList4G"
                            :key="item.id">{{ item.checkname }}
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
        <!-- 复选框 1-->
        <van-field class="title-stand" required name="checkboxGroup3G"
                   label="请选择您感兴趣的工作流程（可多选）/You are interested in workflow (multiple choice)"
                   :rules="[{ required: true, message: '请选择您感兴趣的工作流程？' }]">
          <template #input>
            <van-checkbox-group v-model="checkboxGroup3G">
              <van-checkbox :name="item.checkname" shape="square" v-for="item in checkboxList3G"
                            :key="item.id">{{ item.checkname }}
              </van-checkbox>
              <div class="other-input">
                <van-checkbox name="其他" @click="othercheckG3(checkboxGroup3G)" shape="square">其他，请说明/Other,
                  please
                  specify
                </van-checkbox>
                <input type="text" v-model="checkboxOther3G" v-show="isShowOther3G"/>
              </div>
            </van-checkbox-group>
          </template>
        </van-field>

        <!-- 下拉选项 -->
        <van-field required readonly clickable name="picker" :value="q1G"
                   label="您单位的采购计划是/Do you have purchase plan"
                   class="title-stand" placeholder="请选择" :rules="[{ required: true, message: '您单位的采购计划是' }]"
                   @click="showPickerG = true"/>
        <van-popup v-model="showPickerG" position="bottom">
          <van-picker show-toolbar :columns="columnsG" @confirm="onConfirmG" @cancel="showPickerG = false"/>
        </van-popup>

        <div v-if="isShowOther">
          <!-- 复选框 1-->
          <van-field class="title-stand" required name="checkboxGroup1G"
                     label="请选择您感兴趣的电子显微镜类仪器（可多选）/You are interested in ( multiple choice)"
                     :rules="[{ required: true, message: '您近期有意向购买的产品类型是？' }]">
            <template #input>
              <van-checkbox-group v-model="checkboxGroup1G">
                <van-checkbox :name="item.checkname" shape="square" v-for="item in checkboxList1G"
                              :key="item.id">{{ item.checkname }}
                </van-checkbox>
                <div class="other-input">
                  <van-checkbox name="其他" @click="othercheckG1(checkboxGroup1G)" shape="square">其他/Other,please
                    specify
                  </van-checkbox>
                  <input type="text" v-model="checkboxOther1G" v-show="isShowOther1G"/>
                </div>
              </van-checkbox-group>
            </template>
          </van-field>

          <!-- 复选框 2-->
          <van-field class="title-stand" required name="checkboxGroup2G"
                     label="您希望我们提供的服务支持（可多选）/You would like to (multiple choice)"
                     :rules="[{ required: true, message: '请选择您需要的支持' }]">
            <template #input>
              <van-checkbox-group v-model="checkboxGroup2G">
                <van-checkbox :name="item.checkname" shape="square" v-for="item in checkboxList2G"
                              :key="item.id">{{ item.checkname }}
                </van-checkbox>
                <div class="other-input">
                  <van-checkbox name="其他" @click="othercheckG2(checkboxGroup2G)" shape="square">其他，请说明/Other,
                    please
                    specify
                  </van-checkbox>
                  <input type="text" v-model="checkboxOther2G" v-show="isShowOther2G"/>
                </div>
              </van-checkbox-group>
            </template>
          </van-field>
        </div>
        <!-- 单选框 -->
        <van-field required class="title-stand" name="radio"
                   label="您后续是否愿意收到有关我们新产品和服务的邮件/Are you willing to receive the new product and solution promotion email from us?"
                   :rules="[{ required: true, message: '请选择' }]">
          <template #input>
            <van-radio-group v-model="radioGroup1G" direction="horizontal">
              <van-radio name="愿意，希望可以了解更多信息/Yes">愿意，希望可以了解更多信息/Yes</van-radio>
              <van-radio name="不愿意/No">不愿意/No</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <div style="padding: 60px 0; text-align:center">
          <van-button native-type="onSubmitG" v-if="buttonShow">提 交</van-button>
          <van-button loading loading-text="提交中..." v-else/>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { prizeLifeSciences, check } from '@/api/forms'

export default {
  name: 'home',
  data () {
    return {
      isShowOther: false,
      // 正则
      regPhone: /^(0|86|17951)?(13[0-9]|15[0-9]|166|17[3678]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/,
      regEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      openId: this.$route.query.openId || '',
      buttonShow: true,

      newJob: '',
      otherRadio: false,

      checkboxOther1G: '', //q3 其他选项
      checkboxOther2G: '', //q4 其他选项
      checkboxOther3G: '', //q4 其他选项

      checkboxGroup3G: [],
      checkboxGroup4G: [],
      fullNameG: '', // 姓名
      companyG: '', // 单位
      emailG: '', // 邮箱
      jobG: '', //职位
      phoneG: '', // 手机
      radioGroup2G: '', // 采购计划
      q1G: '', // 问题一：您所在的研究领域是
      checkboxGroup1G: [], //问题二：您感兴趣的产品类型是？
      radioGroup1G: '', //问题三：您单位是否将有设备采购计划？
      checkboxGroup2G: [], //问题四：您需要的支持是？
      showPickerG: false, // 下拉选择 popup
      columnsG: [
        '近期无采购计划/none',
        '未来半年内/Within half year',
        '未来一年内/Within 1 year',
        '未来1-2年内/Arround 1~2 year',
      ],
      isShowOther1G: false, // 是否选择其他
      checkboxList1G: [
        {
          id: 1,
          checkname: '冷冻透射电子显微镜/Cryo TEM',
        },
        {
          id: 2,
          checkname: '冷冻双束电子显微镜/Cryo FIB',
        },
        {
          id: 3,
          checkname: '连续切面扫描电子显微镜/SBF SEM',
        },
        {
          id: 4,
          checkname: '三维可视化软件/Amira',
        },
        {
          id: 5,
          checkname: '常温透射电子显微镜/RT TEM',
        },
        {
          id: 6,
          checkname: '常温双束电子显微镜/RT FIB',
        },
        {
          id: 7,
          checkname: '阵列式断层扫描电子显微镜/AT SEM',
        },
      ],
      isShowOther2G: false, // 是否选择其他
      checkboxList2G: [
        {
          id: 1,
          checkname: '需要销售人员联系/Speak to acount manager',
        },
        {
          id: 2,
          checkname: '需要做样/Schedule a demo',
        },
        {
          id: 3,
          checkname: '需要产品样册/Get brochure',
        },
        {
          id: 4,
          checkname: '已有赛默飞产品，需要售后支持/Get service support',
        },
        {
          id: 5,
          checkname: '已有赛默飞产品，需要培训/Get training',
        },
      ],
      isShowOther3G: false, // 是否选择其他
      checkboxList3G: [
        {
          id: 1,
          checkname: '冷冻电子断层扫描/Cryo Tomography',
        },
        {
          id: 2,
          checkname: '单颗粒分析/Single Particle Analysis',
        },
        {
          id: 3,
          checkname: '大体积分析/Large Volume Analysis',
        },
        {
          id: 4,
          checkname: '微电子衍射/MicroED',
        },
      ],
      checkboxList4G: [
        {
          id: 1,
          checkname: '生命科学/life science',
        },
        {
          id: 2,
          checkname: '材料科学/materials science',
        },
      ],
    }
  },
  mounted () {
    this.getOpenid()
  },
  methods: {
    getOpenid () {
      if (!this.openId) {
        this.$router.push('/')
      } else {
        this.judgeState()
      }
    },
    judgeState () {
      check(this.openId).then((res) => {
        if (res.code == 4003) {
          this.$router.push('/state?code=' + res.code)
        } else if (res.code == 4002) {
          this.$router.push('/state?code=' + res.code)
        }
      })
    },

    // 表单提交开始
    onSubmitG (values) {
      this.buttonShow = false

      let i1 = this.checkboxGroup1G.indexOf('其他')
      this.checkboxGroup1G[i1] = this.checkboxOther1G

      let i2 = this.checkboxGroup2G.indexOf('其他')
      this.checkboxGroup2G[i2] = this.checkboxOther2G

      let i3 = this.checkboxGroup3G.indexOf('其他')
      this.checkboxGroup3G[i3] = this.checkboxOther3G

      let i4 = this.radioGroup2G.indexOf('其他')
      console.log(i4)
      if (i4 > -1) {
        this.radioGroup2G = this.newJob
      }

      let data = {
        batchTag: '2022920', // 批次标签
        fullName: this.fullNameG, // 姓名
        company: this.companyG, // 单位
        phone: this.phoneG, // 手机号
        email: this.emailG, // 邮箱
        openId: this.openId, // 微信openId
        q1: this.radioGroup2G, // 职业
        q2: this.checkboxGroup4G.join(','),
        q3: this.checkboxGroup3G.join(','),
        q4: this.checkboxGroup1G.join(','),
        q5: this.checkboxGroup2G.join(','),
        q6: this.q1G,
        q7: this.radioGroup1G,
      }
      prizeLifeSciences(data).then(res => {
        if (res.code == 200) {
          this.buttonShow = true
          if (res.data == 4002) {
            this.$router.push('/state?code=' + res.data)
          } else if (res.data == 4003) {
            this.$router.push('/state?code=' + res.data)
          }
        }
      })
    },
    onConfirmG (value) {
      if (value == '近期无采购计划/none') {
        this.isShowOther = false
      } else {
        this.isShowOther = true
      }
      this.q1G = value
      this.showPickerG = false
    },
    // 复选框 其他
    othercheckG1 (value) {
      let i = value.indexOf('其他')
      if (value.indexOf('其他') >= 0) {
        this.isShowOther1G = true
      } else {
        this.isShowOther1G = false
      }
    },
    othercheckG2 (value) {
      if (value.indexOf('其他') >= 0) {
        this.isShowOther2G = true
      } else {
        this.isShowOther2G = false
      }
    },
    othercheckG3 (value) {
      if (value.indexOf('其他') >= 0) {
        this.isShowOther3G = true
      } else {
        this.isShowOther3G = false
      }
    },
    changeShowRadioForm (val) {
      if (val == '其他') {
        this.otherRadio = true
      } else {
        this.otherRadio = false
      }
    },
    // 表单提交结束
  },
}
</script>
<style lang="scss" scoped>
.question {
  background-color: #f8f3f9;
}

.form-box {
  margin-top: 20px;
  padding: 0 20px;
}

.title-stand {
  flex-direction: column;

  .van-field__label {
    width: 100%;
  }

  .van-checkbox,
  .van-radio {
    margin-bottom: 5px;
  }

  .other-input {
    position: relative;

    input {
      box-sizing: border-box;
      background: none;
      outline: none;
      border: 1px solid #ccc;
      margin-left: 30px;
      height: 30px;
      padding: 5px 10px;
    }
  }

  .radio-input {
    input {
      display: block !important;
      box-sizing: border-box;
      background: none;
      outline: none;
      border: 1px solid #ccc;
      height: 30px;
      padding: 5px 10px;
    }
  }
}

.van-cell {
  background-color: #f8f3f9 !important;
}

.van-cell::after {
  border-bottom: #e5e3e9 1px solid !important;
}

.van-button {
  width: 159px !important;
  height: 35px !important;

  background-image: linear-gradient(#97b6e8, #688ab9);
  background-blend-mode: normal, normal;
  border-radius: 19px !important;
  border-width: 0;

  span {
    line-height: 35px !important;
    font-size: 16px;
    color: #fff;
    // font-weight: 300 !important;
  }
}
</style>
