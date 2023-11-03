<template>
  <div class="radio">
    <van-field :label="name" required :rules="[{ required: true, message: '请选择' + name  }]" class="radio" :border="false">
      <template #input>
        <van-radio-group v-model="radioValue" direction @change="radioChange"> 
          <van-radio v-for="(item, index) in radioValueList" :name="item" :key="index" >{{item}}
            <template #icon="props">
              <svg v-show="props.checked" t="1658390839578" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2262" width="20" height="20">
                <path d="M512 62C263.5 62 62 263.5 62 512s201.5 450 450 450 450-201.5 450-450S760.5 62 512 62z m0 810c-198.8 0-360-161.2-360-360s161.2-360 360-360 360 161.2 360 360-161.2 360-360 360z"
                  fill="#224477" p-id="2263"></path>
                <path d="M512 512m-210 0a210 210 0 1 0 420 0 210 210 0 1 0-420 0Z" fill="#224477" p-id="2264"></path>
              </svg>
              <svg v-show="!props.checked" t="1658391225901" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3493" width="20" height="20">
                <path d="M511.829108 113.706715c219.430618 0 397.952524 178.520883 397.952524 397.952524S731.259726 909.61074 511.829108 909.61074 113.876584 731.09088 113.876584 511.658216 292.39849 113.706715 511.829108 113.706715M511.829108 63.961754c-247.25636 0-447.696462 200.441125-447.696462 447.696462 0 247.25636 200.440102 447.696462 447.696462 447.696462s447.696462-200.440102 447.696462-447.696462C959.52557 264.402879 759.085468 63.961754 511.829108 63.961754L511.829108 63.961754z" p-id="3494" fill="#d3d3d3"></path>
              </svg>
            </template>
          </van-radio>
        </van-radio-group>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  name: 'radio',
  props: {
    name: String,
    radioValueList: Array
  },
  data() {
    return {
      radioValue: ''
    }
  },
  methods: {
    radioChange() {
      this.$emit('radioChange', this.radioValue);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
