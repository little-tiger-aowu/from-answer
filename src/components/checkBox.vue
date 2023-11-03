<template>
  <div class="checkBox">
    <van-field :label="name" required :rules="[{ required: true, message: '请选择' + name  }]" class="radio" :border="false">
      <template #input>
        <van-checkbox-group v-model="checkBox" direction @change="checkBoxChange"> 
          <van-checkbox v-for="(item, index) in checkBoxList" :name="item" :key="index" shape="square">{{item}}</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>
  </div>
</template>

<script>
    export default {
    props: {
      name: String,
      checkBoxList: Array
    },
    data() {
        return {
          checkBox: []
        }
    },
    methods: {
      checkBoxChange() {
        this.$emit('checkBoxChange', this.checkBox)
        // console.log(e);
      }
    }
    }
</script>
<style lang="scss" scoped>
</style>