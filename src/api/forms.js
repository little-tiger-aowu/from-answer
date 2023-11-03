import requestJson from '@/utils/requestJson'

// 用户授权登录
export function userLogin (data) {
  return requestJson({
    url: 'user/login',
    method: 'POST',
    data
  })
}

// 提交表单
export function addForm (data) {
  return requestJson({
    url: '/user',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data
  })
}

// 用户是否提交表单
export function isAddForm (openId) {
  return requestJson({
    url: `/user/isFrom?openId=${openId}`,
    method: 'POST'
  })
}

// 获取转盘奖品
export function getPrize () {
  return requestJson({
    url: '/prize',
    method: 'GET'
  })
}

// 获取奖品信息
export function getPrizeInfo () {
  return requestJson({
    url: '/prize/awards',
    method: 'GET'
  })
}

// 获取参与人数和用户抽奖次数
export function getPlayUserSum (params) {
  return requestJson({
    url: '/prize/participation',
    method: 'GET',
    params
  })
}

// 抽奖
export function startPlay (data) {
  return requestJson({
    url: `/prize?openId=${data}`,
    method: 'POST'
  })
}

// 用户是否以抽奖
export function isPlay (data) {
  return requestJson({
    url: `/prize/isDraw?openId=${data}`,
    method: 'POST'
  })
}

// 查看中奖记录
export function records (data) {
  return requestJson({
    url: `/prize/records?openId=${data}`,
    method: 'GET'
  })
}
