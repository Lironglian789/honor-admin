import { Response, Request } from 'express'
import { Hero, Player } from '../src/api/types'
import { heros } from './heros'
import faker from 'faker'

faker.locale = 'zh_CN'

// 模拟玩家数据
const playCount = 100
const playerList: Player[] = []

for(let i = 0; i < playCount; i++) {
  playerList.push({
    id: i,
    accountname: faker.name.findName(),
    avatar: faker.image.avatar(),
    bravepoints: faker.random.number(1000),
    exp: faker.random.number(100000),
    level: faker.random.number(30),
    nickname: faker.name.findName(),
    rank: faker.random.number(200),
    wanttoplay: genWantoPlay(),
    winningstreak: faker.random.number(10)
  })
}

// 模拟想⽤英雄：只要三个不能重复
function genWantoPlay() {
  let wanttoplay: Set<Hero> = new Set() // 可以避免重复
  while(wanttoplay.size < 3) {
    wanttoplay.add(heros[faker.random.number(9)]) // 0 - 9 随机抽取
  }
  return Array.from(wanttoplay)
}

// 实现路由
export const getPlayers = (req: Request, res: Response) => {
  // 从查询的参数中获取分页、过滤关键词等参数
  const { accountname, page = 1, limit = 10 } = req.params
  // 根据账号名过滤
  let mockList = playerList.filter(item => {
    if (accountname && item.accountname.indexOf(accountname) < 0) {
      return false
    }
    return true
  })

  const pageList = mockList.filter((item, index)=> index < (limit as number) * (page as number) && index >= (limit as number) * ((page as number) - 1))
  return res.json({
    code: 20000,
    data: {
      total: mockList.length,
      items: pageList
    }
  })
}

// 根据id获取玩家信息
export const getPlayer = (req: Request, res: Response) => {
  const { id } = req.params
  for(const player of playerList) {
    if (player.id.toString() === id) {
      return res.json({
        code: 20000,
        data: {
          player
        }
      })
    }
  }

  res.json({
    code: 70001,
    message: '没有找到相应的玩家信息'
  })
}

// 创建玩家
export const createPlayer = (req: Request, res: Response) => {
  const {player} = req.body
  return res.json({
    code: 20000,
    data: {
      player
    }
  })
}

// 更新玩家信息
export const updatePlayer = (req: Request, res: Response) => {
  const {id} = req.params
  const {player} = req.body
  for(const v of playerList) {
    if (v.id.toString() === id) {
      return res.json({
        code: 20000,
        data: {
          player
        }
      })
    }
  }
  return res.json({
  code: 70001,
  message: 'player not found'
 })
}

// 根据id 删除指定玩家
export const deletePlayer = (req: Request, res: Response) => {
  res.json({
    code: 20000
  })
}