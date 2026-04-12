/**
 * BBTI (Badminton Brain Type Indicator) - Data Layer
 * 24 questions + 16 personality types + scoring maps + dimension metadata
 */
window.BBTI_DATA = (function () {
  'use strict';

  // ============================================================
  // 1. Dimension Metadata
  // ============================================================
  var dimensions = {
    attack_defense: {
      key: 'attack_defense',
      poleA: { key: 'attack', label: '进攻', emoji: '🗡️', code: 'A' },
      poleB: { key: 'defense', label: '防守', emoji: '🛡️', code: 'D' }
    },
    skill_power: {
      key: 'skill_power',
      poleA: { key: 'skill', label: '技巧', emoji: '🎯', code: 'S' },
      poleB: { key: 'power', label: '力量', emoji: '💪', code: 'P' }
    },
    plan_random: {
      key: 'plan_random',
      poleA: { key: 'plan', label: '计划', emoji: '📋', code: 'L' },
      poleB: { key: 'random', label: '随性', emoji: '🎲', code: 'R' }
    },
    zen_heated: {
      key: 'zen_heated',
      poleA: { key: 'zen', label: '佛系', emoji: '🧘', code: 'Z' },
      poleB: { key: 'heated', label: '上头', emoji: '🔥', code: 'H' }
    }
  };

  // Ordered dimension keys for iteration
  var dimensionOrder = ['attack_defense', 'skill_power', 'plan_random', 'zen_heated'];

  // ============================================================
  // 2. Stat Metadata
  // ============================================================
  var statMeta = [
    { key: 'smash', emoji: '💥', label: '杀球威力' },
    { key: 'accuracy', emoji: '🎯', label: '落点精度' },
    { key: 'speed', emoji: '🦵', label: '移动速度' },
    { key: 'tactics', emoji: '🧠', label: '战术智商' },
    { key: 'pressure', emoji: '😤', label: '抗压指数' },
    { key: 'heated', emoji: '🔥', label: '上头指数' }
  ];

  // ============================================================
  // 3. 16 Questions (v1.4 redesign)
  // ============================================================
  var questions = [
    // ── Dimension 1: Attack vs Defense (Q1-Q4) ──
    {
      id: 1,
      dimension: 'attack_defense',
      scene: '热身才打了两个球，全场已经听到你的声音了。',
      text: '打球时你最常喊的一句是——',
      options: [
        { label: 'A', text: '"杀！杀！杀！"', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '"稳住！别急！"', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '"我来"', scores: { attack: 1, defense: 0 } },
        { label: 'D', text: '"你来你来！"', scores: { attack: 0, defense: 1 } }
      ]
    },
    {
      id: 2,
      dimension: 'attack_defense',
      scene: '球友群弹出一条消息：',
      text: '请选择你的双打搭子',
      options: [
        { label: 'A', text: '暴力输出型：杀球巨猛，但偶尔杀出界', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '铁壁防守型：什么球都能接，就是不太进攻', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '鬼才控场型：假动作一堆，你永远不知道他下一拍', scores: { attack: 1, defense: 0 } },
        { label: 'D', text: '佛系陪练型：打得随缘，但全程乐呵', scores: { attack: 0, defense: 1 } }
      ]
    },
    {
      id: 3,
      dimension: 'attack_defense',
      scene: '搭子咳了一声——',
      text: '最常听见搭档怎么"关心"你：',
      options: [
        { label: 'A', text: '"你为什么跳起来平抽！"', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '"要不你帮隔壁A一下场地费呢~"', scores: { attack: 1, defense: 0 } },
        { label: 'C', text: '"这颗球你是不是不喜欢！"', scores: { attack: 0, defense: 2 } },
        { label: 'D', text: '"你的拍子应该不拉线也能打吧"', scores: { attack: 0, defense: 1 } }
      ]
    },
    {
      id: 4,
      dimension: 'attack_defense',
      scene: '夜深了，球拍支在墙角突然开口了。',
      text: '你的球拍最可能说的一句——',
      options: [
        { label: 'A', text: '"你轻点！我快断了！"', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '"你能不能用点力……"', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '"你到底要我干嘛"', scores: { attack: 0, defense: 1 } },
        { label: 'D', text: '"我想退休"', scores: { attack: 1, defense: 0 } }
      ]
    },

    // ── Dimension 2: Skill vs Power (Q5-Q8) ──
    {
      id: 5,
      dimension: 'skill_power',
      scene: '又一分被拿走了。你盯着对面。',
      text: '哪种丢分最让你破防——',
      options: [
        { label: 'A', text: '被一拍暴扣——球都没看清', scores: { skill: 2, power: 0 } },
        { label: 'B', text: '被搓了个网前——看到了就是够不着', scores: { skill: 0, power: 2 } },
        { label: 'C', text: '被假动作骗——感觉智商被摩擦', scores: { skill: 0, power: 1 } },
        { label: 'D', text: '被调动满场跑——腿快断了还是没接到', scores: { skill: 1, power: 0 } }
      ]
    },
    {
      id: 6,
      dimension: 'skill_power',
      scene: '羽毛球之神给了你一次机会。',
      text: '如果只能练一项技术到巅峰，你练啥——',
      options: [
        { label: 'A', text: '杀球——一拍下去地动山摇', scores: { skill: 0, power: 2 } },
        { label: 'B', text: '网前小球——搓搓勾勾贴网过', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '假动作——每一拍都是表演', scores: { skill: 1, power: 0 } },
        { label: 'D', text: '体能——打到对面站不起来', scores: { skill: 0, power: 1 } }
      ]
    },
    {
      id: 7,
      dimension: 'skill_power',
      scene: '全场安静了一秒，然后是掌声。',
      text: '你最帅的得分通常是——',
      options: [
        { label: 'A', text: '后场重杀，对面连拍都没举起来', scores: { skill: 0, power: 2 } },
        { label: 'B', text: '网前轻搓，球贴网带滚过去', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '一个假动作，对方往左你往右', scores: { skill: 1, power: 0 } },
        { label: 'D', text: '磨了二十拍，对面先崩了', scores: { skill: 0, power: 1 } }
      ]
    },
    {
      id: 8,
      dimension: 'skill_power',
      scene: '你盯着对面的站位。',
      text: '比赛中你脑子里最常冒出的——',
      options: [
        { label: 'A', text: '"这球我能杀死"', scores: { skill: 0, power: 2 } },
        { label: 'B', text: '"再搓一个看他怎么接"', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '"他肯定猜不到我下一拍"', scores: { skill: 1, power: 0 } },
        { label: 'D', text: '"先打到位再说"', scores: { skill: 0, power: 1 } }
      ]
    },

    // ── Dimension 3: Plan vs Random (Q9-Q12) ──
    {
      id: 9,
      dimension: 'plan_random',
      scene: '你脸上终于挂不住了。',
      text: '球场上你最无法忍受的——',
      options: [
        { label: 'A', text: '"你站前面就可以"', scores: { plan: 0, random: 2 } },
        { label: 'B', text: '偷后场', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '挂脸子', scores: { plan: 0, random: 1 } },
        { label: 'D', text: '拉球时扣杀', scores: { plan: 2, random: 0 } }
      ]
    },
    {
      id: 10,
      dimension: 'plan_random',
      scene: '你犹豫了一下。',
      text: '非要选一个的话，打球时最不爱接——',
      options: [
        { label: 'A', text: '太远的球——懒得跑', scores: { plan: 0, random: 2 } },
        { label: 'B', text: '太高的球——万一够不到会很尴尬', scores: { plan: 2, random: 0 } },
        { label: 'C', text: '杀球——因为我善', scores: { plan: 0, random: 1 } },
        { label: 'D', text: '太快的球——因为太快了肯定来不及呀！', scores: { plan: 1, random: 0 } }
      ]
    },
    {
      id: 11,
      dimension: 'plan_random',
      scene: '手机震了一下，约球消息。',
      text: '你平时怎么约球的——',
      options: [
        { label: 'A', text: '固定时间固定人，雷打不动', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '提前一两天群里吆喝一声', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '别人约就去，自己懒得组', scores: { plan: 0, random: 1 } },
        { label: 'D', text: '到球馆门口才发消息"有人吗"', scores: { plan: 0, random: 2 } }
      ]
    },
    {
      id: 12,
      dimension: 'plan_random',
      scene: '你拉开球包拉链，里面是——',
      text: '除了球拍，你包里通常——',
      options: [
        { label: 'A', text: '毛巾水壶手胶护膝，一应俱全', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '该有的都有，偶尔忘一两样', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '就球拍和球，其他随缘', scores: { plan: 0, random: 1 } },
        { label: 'D', text: '上次的湿毛巾还在里面……三天了', scores: { plan: 0, random: 2 } }
      ]
    },

    // ── Dimension 4: Zen vs Heated (Q13-Q16) ──
    {
      id: 13,
      dimension: 'zen_heated',
      scene: '双打时',
      text: '听到哪句话最让你感动——',
      options: [
        { label: 'A', text: '"这个球能碰到已经很厉害了👍🏻"', scores: { zen: 2, heated: 0 } },
        { label: 'B', text: '"想怎么打就怎么打"', scores: { zen: 1, heated: 0 } },
        { label: 'C', text: '"我的我的"', scores: { zen: 0, heated: 1 } },
        { label: 'D', text: '"nb"', scores: { zen: 0, heated: 2 } }
      ]
    },
    {
      id: 14,
      dimension: 'zen_heated',
      scene: '比赛中，',
      text: '你在球场上最常说的——',
      options: [
        { label: 'A', text: '"我的我的！"', scores: { zen: 0, heated: 1 } },
        { label: 'B', text: '"都怪你"', scores: { zen: 0, heated: 2 } },
        { label: 'C', text: '"等下吃什么"', scores: { zen: 2, heated: 0 } },
        { label: 'D', text: '"out了！"', scores: { zen: 1, heated: 0 } }
      ]
    },
    {
      id: 15,
      dimension: 'zen_heated',
      scene: '球又出界了。你张嘴，理由已经到嘴边了。',
      text: '打丢了球，你最常用的借口——',
      options: [
        { label: 'A', text: '灯晃眼', scores: { zen: 0, heated: 2 } },
        { label: 'B', text: '换个球', scores: { zen: 0, heated: 1 } },
        { label: 'C', text: '几天没打了', scores: { zen: 1, heated: 0 } },
        { label: 'D', text: '打杆了', scores: { zen: 2, heated: 0 } }
      ]
    },
    {
      id: 16,
      dimension: 'zen_heated',
      scene: '比分定格了。你深吸一口气。',
      text: '输球的你 be like——',
      options: [
        { label: 'A', text: '愤怒.png', img: 'img/愤怒.png', scores: { zen: 0, heated: 2 } },
        { label: 'B', text: '伤感.png', img: 'img/伤感.png', scores: { zen: 0, heated: 1 } },
        { label: 'C', text: '冷静分析.png', img: 'img/冷静分析.png', scores: { zen: 1, heated: 0 } },
        { label: 'D', text: '无所谓.png', img: 'img/无所谓.png', scores: { zen: 2, heated: 0 } }
      ]
    }
  ];

  // ============================================================
  // 4. Dimension Combination → Personality Type Lookup
  // ============================================================
  // Encoding: D1(A=Attack/D=Defense) + D2(S=Skill/P=Power)
  //         + D3(L=pLan/R=Random) + D4(Z=Zen/H=Heated)
  var typeMap = {
    'ASLZ': 'HEX',
    'ASLH': 'BOSS',
    'ASRZ': 'MIAO',
    'ASRH': 'WOK',
    'APLZ': 'ROCKET',
    'APLH': 'FLEX',
    'APRZ': 'SMASH',
    'APRH': 'BEAST',
    'DSLZ': 'ACE',
    'DSLH': 'SNOOK',
    'DSRZ': 'FEED',
    'DSRH': 'GACHA',
    'DPLZ': 'WALL',
    'DPLH': 'COUNTER',
    'DPRZ': 'CHAOS',
    'DPRH': 'TUMBLE'
  };

  // ============================================================
  // 5. 16 Personality Types - Complete Data
  // ============================================================
  var personalities = {
    HEX: {
      emoji: '🏅',
      code: 'HEX',
      nameCN: '六边形战士',
      tagline: '「没有弱点，也没有脾气。」',
      slogan: '全能六边形｜攻守兼备，心态如佛',
      dotLabel: '全面在线，毫无短板',
      dimensions: ['进攻', '技巧', '计划', '佛系'],
      description: '你是球场上的六边形战士——进攻有手感，防守有意识，战术有章法，心态还特别好。别人怒摔球拍的时候你在微笑，别人自乱阵脚的时候你在冷静提速。你不是最强的，但你是最没短板的。球馆里大家都想跟你搭档，因为跟你打球又舒服又能赢。唯一的缺点：太稳了，偶尔显得有点无聊。',
      playerArchetype: { name: '林丹', desc: '你就是球场上的林丹，巅峰全面打法，攻守兼备，心态如佛。' },
      quote: '「急什么，每一分都认真打就好了。」',
      coreBehavior: '没有明显短板的全能型选手',
      behaviorPattern: '热身认真 → 比赛冷静 → 落后不慌 → 领先不浪 → 赛后轻描淡写',
      stats: { smash: 78, accuracy: 85, speed: 75, tactics: 88, pressure: 90, heated: 15 },
      partner: { code: 'BEAST', reason: '你稳住局面，他暴力输出。你是方向盘，他是引擎。完美互补。', shortTag: '你稳他猛，完美互补' },
      rival: { code: 'GACHA', reason: '你算无遗策，但随机是你唯一的克星。盲盒打法让你的计划全部作废。', shortTag: '完美遇上随机，全废' }
    },
    BOSS: {
      emoji: '👴', code: 'BOSS', nameCN: '控场老登',
      tagline: '「听我的！打他反手！打他反手！」',
      slogan: '球场总指挥｜战术满分，音量更满分',
      dotLabel: '进攻有脑，指挥全场',
      dimensions: ['进攻', '技巧', '计划', '上头'],
      description: '你是球场上的总指挥。技术好、脑子活、有规划，但问题是——你太上头了。赢球你要喊，输球你更要喊，队友失误你还要喊。你不是在打球，你是在导演一出大戏，而你是唯一的导演。球场上回荡的都是你的声音：「压他反手！」「封网！」「跑啊！」大家又怕又服：怕你的音量，服你的指挥。',
      playerArchetype: { name: '蔡赟', desc: '你就是球场上的蔡赟，指挥核心，前封后攻的教科书。' },
      quote: '「我说的没错吧？早听我的早赢了！」',
      coreBehavior: '声音最大、意见最多的球场指挥官',
      behaviorPattern: '赛前布置战术 → 赛中大喊指挥 → 队友失误时碎碎念 → 赢了说「看我战术没问题吧」',
      stats: { smash: 70, accuracy: 82, speed: 60, tactics: 95, pressure: 55, heated: 88 },
      partner: { code: 'SMASH', reason: '你负责指哪，他负责打哪。你是GPS，他是导弹。只要他听你的。', shortTag: '你喊他杀，暴力执行' },
      rival: { code: 'FEED', reason: '你拼命指挥，他佛系喂球。你急他不急，你喊他不听，能气死你。', shortTag: '你指挥他不听，气死' }
    },
    MIAO: {
      emoji: '✨', code: 'MIAO', nameCN: '不知道很曼妙',
      tagline: '「刚才那球？我也不知道怎么打出来的。」',
      slogan: '天赋型灵感选手｜打球全靠手感，神球全靠随缘',
      dotLabel: '技巧拉满，进攻在线',
      dimensions: ['进攻', '技巧', '随性', '佛系'],
      description: '你是天赋型选手。不练球也能打出神球，不做计划照样赢。你的手感像开了挂，假动作是天生的，不是练出来的。关键是你心态贼好，打飞了笑笑，打进了也笑笑。别人研究你的战术？不好意思，你自己都不知道下一拍要干嘛。你不知道自己有多强，这种不知道，本身就很曼妙。',
      playerArchetype: { name: '戴资颖', desc: '你就是球场上的戴资颖，灵感打法，防不胜防。' },
      quote: '「想什么打什么吧，打球嘛，开心就好。」',
      coreBehavior: '靠灵感打球的天赋型选手',
      behaviorPattern: '不热身直接上 → 手感来了打谁都像菜 → 打出神球自己也惊讶 → 全程佛系微笑',
      stats: { smash: 60, accuracy: 75, speed: 78, tactics: 50, pressure: 88, heated: 12 },
      partner: { code: 'WALL', reason: '你随便浪，他在后面兜底。你是艺术家，他是保险公司。', shortTag: '你浪他兜底，稳赢' },
      rival: { code: 'SNOOK', reason: '他每球都在算计，你每球都在随缘。理性vs灵感的终极对决。', shortTag: '理性克死你的灵感' }
    },
    WOK: {
      emoji: '🍳', code: 'WOK', nameCN: '网前炒菜',
      tagline: '「网前我的！这个也是我的！那个也是我的！」',
      slogan: '网前炒菜大师｜手速拉满，抢球上瘾',
      dotLabel: '技巧进攻，网前称霸',
      dimensions: ['进攻', '技巧', '随性', '上头'],
      description: '你就是那个在网前疯狂抢球的人。球一过网你就扑上去，搓、推、勾、扑，操作得跟大厨炒菜一样——铲来翻去，噼里啪啦。你手感好、反应快，但你容易上头。越打越兴奋，越兴奋越往前压，压到最后连搭子的球都抢。你的搭子最大的感受是：「他在前面炒菜，我在后面看戏。」',
      playerArchetype: { name: '郑思维', desc: '你就是球场上的郑思维，网前魔术师，几拍之内结束战斗。' },
      quote: '「让一让！网前的都归我！」',
      coreBehavior: '网前疯狂抢球的炒菜大师',
      behaviorPattern: '站位越来越前 → 抢球越来越多 → 打出好球嗷嗷叫 → 失误了跺脚 → 继续抢',
      stats: { smash: 55, accuracy: 72, speed: 92, tactics: 45, pressure: 55, heated: 82 },
      partner: { code: 'ROCKET', reason: '你在前面炒菜，他在后面精确轰炸。前后分工明确，经典配合。', shortTag: '你搅局他轰炸，配合绝了' },
      rival: { code: 'COUNTER', reason: '你越扑他越接，越接越反击，让你的炒菜变成翻车现场。', shortTag: '你越扑他越反，翻车' }
    },
    ROCKET: {
      emoji: '🚀', code: 'ROCKET', nameCN: '钱学森弹道',
      tagline: '「杀球有轨迹，落点有坐标。」',
      slogan: '精确制导专家｜杀球有坐标，落点有计算',
      dotLabel: '力量进攻，精确制导',
      dimensions: ['进攻', '力量', '计划', '佛系'],
      description: '你的杀球不是蛮力，是精确制导导弹。你知道对手站在哪里，更知道他接不到哪里。你是球场上的弹道专家，每一拍重杀都经过了精密计算。关键是你心态平和——杀进去不兴奋，杀飞了不着急。你在双打里是后场的绝对核心，搭子只需要把球起高，剩下的交给你。钱学森弹道，说的就是你。',
      playerArchetype: { name: '安赛龙', desc: '你就是球场上的安赛龙，高点重杀精确到点位，冷静到可怕。' },
      quote: '「那个位置，杀直线，下压，他一定接不到。」',
      coreBehavior: '精确制导的后场杀球核心',
      behaviorPattern: '开局试探对手弱点 → 找到弱点后反复精确制导 → 表情始终冷静 → 杀球声是唯一BGM',
      stats: { smash: 95, accuracy: 90, speed: 55, tactics: 82, pressure: 85, heated: 18 },
      partner: { code: 'WOK', reason: '他在前面搅局，你在后面精确轰炸。完美的前后分工。', shortTag: '他搅局你轰炸，经典' },
      rival: { code: 'ACE', reason: '他攻守切换自如，你的精确导弹总被他化解。导弹打水，看谁先赢。', shortTag: '精准打灵活，谁先崩' }
    },
    FLEX: {
      emoji: '💪', code: 'FLEX', nameCN: '逼王再世',
      tagline: '「看到没？看到我那记杀球没？帅不帅？」',
      slogan: '球场表演艺术家｜打球要赢，更要帅',
      dotLabel: '力量进攻，帅字当头',
      dimensions: ['进攻', '力量', '计划', '上头'],
      description: '你打球的目的只有一个：帅。杀球要帅，接球要帅，赢球的表情更要帅。你有实力，但你更在意表演效果。每一次得分都像是在拍宣传片，恨不得现场有慢镜头回放。你会为了一记帅气的跳杀放弃更稳妥的处理方式。你赢球会叉腰，输球会甩头发（即使你是寸头）。球场上的逼王，实力配得上架子。',
      playerArchetype: { name: '李宗伟', desc: '你就是球场上的李宗伟，极致进攻美学，每一拍都像艺术品。' },
      quote: '「你们刚才有没有拍到？那个球必须发朋友圈。」',
      coreBehavior: '追求帅气得分的球场表演家',
      behaviorPattern: '得分时叉腰回头 → 帅球发群炫耀 → 失误比别人更生气（因为不帅）→ 赢了第一件事发朋友圈',
      stats: { smash: 88, accuracy: 72, speed: 68, tactics: 75, pressure: 50, heated: 85 },
      partner: { code: 'FEED', reason: '他把球喂到完美位置，你负责帅气收割。最佳辅助配最佳射手。', shortTag: '他喂球你帅杀，天造地设' },
      rival: { code: 'CHAOS', reason: '你精心设计的帅气表演被他的混乱完全打乱。审美差异的极致碰撞。', shortTag: '你帅他乱，审美崩溃' }
    },
    SMASH: {
      emoji: '💥', code: 'SMASH', nameCN: '暴力美学',
      tagline: '「后场起跳，一拍KO。」',
      slogan: '纯粹暴力美学｜一拍解决，不废话',
      dotLabel: '纯暴力，一拍解决',
      dimensions: ['进攻', '力量', '随性', '佛系'],
      description: '你信奉力量就是美。后场起跳重杀的那一瞬间，你觉得全世界都安静了。你不做计划，不搞战术，拿到球就一个动作——杀。赢了嗯一声，输了也嗯一声。你不是不在意，你只是觉得说那么多干嘛，用球拍说话就行。你的杀球声是球馆里最响亮的BGM，也是你唯一的社交方式。',
      playerArchetype: { name: '马林', desc: '你就是球场上的马林，连续起跳扣杀，每一拍都想打穿地板。' },
      quote: '「为什么要吊球？人生苦短，能杀就杀。」',
      coreBehavior: '只相信力量的佛系杀手',
      behaviorPattern: '接发球直接起跳 → 连续重杀 → 杀不进换个角度 → 全程面无表情 → 打完默默收拍',
      stats: { smash: 99, accuracy: 38, speed: 68, tactics: 20, pressure: 82, heated: 10 },
      partner: { code: 'BOSS', reason: '他负责喊你杀哪，你负责一拍打死。你是他手里最暴力的武器。', shortTag: '他指挥你杀，简单粗暴' },
      rival: { code: 'COUNTER', reason: '你越杀越猛，他越接越稳，突然一拍反杀。暴力vs反弹。', shortTag: '你杀他反弹，越杀越亏' }
    },
    BEAST: {
      emoji: '🔥', code: 'BEAST', nameCN: '强攻猛男',
      tagline: '「啊啊啊啊啊啊啊！杀！杀！杀！」',
      slogan: '肾上腺素永动机｜越打越猛，最后离场',
      dotLabel: '蛮力拉满，越打越猛',
      dimensions: ['进攻', '力量', '随性', '上头'],
      description: '你是球场上声音最大、力量最猛、情绪最激动的那个人。你不需要计划，因为你的计划就是——全力进攻。你打球靠的不是战术，是一腔热血和永远用不完的肾上腺素。越打越兴奋，越兴奋越猛，每一拍都像是要把球打穿。你赢了会怒吼，输了也会怒吼，总之一直在怒吼。球馆里的猛男，真正的原始力量。',
      playerArchetype: { name: '山口茜', desc: '你就是球场上的山口茜，156cm覆盖全场，永不疲倦的体能怪兽。' },
      quote: '「再来一局！什么？已经三小时了？再来一局！」',
      coreBehavior: '靠热血和肾上腺素打球的原始猛兽',
      behaviorPattern: '第一拍就全力杀 → 越打越兴奋越大声 → 汗洒全场 → 最后一个离开球馆 → 还在问谁要加赛',
      stats: { smash: 92, accuracy: 30, speed: 88, tactics: 15, pressure: 45, heated: 99 },
      partner: { code: 'HEX', reason: '你负责暴力输出，他负责稳住一切。你是引擎，他是方向盘。', shortTag: '你猛他稳，互相成就' },
      rival: { code: 'WALL', reason: '不可阻挡的力量vs不可移动的物体。世纪对决。', shortTag: '暴力打铁壁，世纪对决' }
    },
    ACE: {
      emoji: '🔄', code: 'ACE', nameCN: '可攻可受',
      tagline: '「攻防切换，随心所欲。」',
      slogan: '攻防自由切换｜像水一样，无形无相',
      dotLabel: '攻防自如，灵活如水',
      dimensions: ['防守', '技巧', '计划', '佛系'],
      description: '你是球场上最灵活的存在。需要防守你就守，需要进攻你就攻，需要搓球你就搓。你没有固定套路，但你有固定的冷静。你的强大不在于某一项技术特别突出，而在于你能根据局势自由切换。你是水，对手是什么形状的容器，你就变成什么形状。打球时波澜不惊，偶尔微笑——因为你已经读懂了比赛。',
      playerArchetype: { name: '桃田贤斗', desc: '你就是球场上的桃田贤斗，极致控球，攻守切换无缝衔接。' },
      quote: '「你打什么我接什么，你变我也变。」',
      coreBehavior: '攻防自如切换的百变球手',
      behaviorPattern: '开局观察 → 中场适应 → 后半段完全掌控节奏 → 面不改色赢球 → 鞠躬离场',
      stats: { smash: 55, accuracy: 88, speed: 72, tactics: 92, pressure: 90, heated: 8 },
      partner: { code: 'TUMBLE', reason: '你冷静善后，他热血鱼跃。你的智慧配他的拼劲，意外地好使。', shortTag: '你善后他拼命，意外好使' },
      rival: { code: 'ROCKET', reason: '精确vs灵活。导弹打水，看谁先分出胜负。', shortTag: '灵活打精准，各有千秋' }
    },
    SNOOK: {
      emoji: '🎱', code: 'SNOOK', nameCN: '斯诺克打法',
      tagline: '「这一拍是给你下套，三拍后你就知道了。」',
      slogan: '球场布局大师｜每一拍都是套路',
      dotLabel: '技巧防守，步步为营',
      dimensions: ['防守', '技巧', '计划', '上头'],
      description: '你打球像打斯诺克——每一拍不是为了得分，是为了让对手下一拍没球打。你的球路精密、刁钻、环环相扣。你享受的是对手被你调动得晕头转向的那种掌控感。但你有个毛病：太上头。当对手不按你的剧本走，你就开始急。「他怎么不上当？！」你布的局越精密，被破坏时你就越暴躁。',
      playerArchetype: { name: '谌龙', desc: '你就是球场上的谌龙，用「磨」赢下所有荣誉，主动防守，精密布局。' },
      quote: '「我让你以为你在进攻，其实你早就在我的圈套里了。」',
      coreBehavior: '每一拍都在设套的球场棋手',
      behaviorPattern: '精心设计球路陷阱 → 对手中套时暗爽 → 对手不上当就急 → 赢球后得意洋洋地复盘',
      stats: { smash: 35, accuracy: 92, speed: 58, tactics: 98, pressure: 65, heated: 78 },
      partner: { code: 'GACHA', reason: '你精心布局，他随机搅局。对手既要躲你的圈套又要猜他的盲盒，双重折磨。', shortTag: '你布局他搅局，双重折磨' },
      rival: { code: 'MIAO', reason: '你设套他不走，因为他根本不看路。灵感型打破计划型。', shortTag: '灵感不走你的套路' }
    },
    FEED: {
      emoji: '🍼', code: 'FEED', nameCN: '喂球童子',
      tagline: '「球给你，分归你，你开心就好。」',
      slogan: '无私喂球艺术家｜球给你，分归你，你开心就好',
      dotLabel: '技巧防守，默默喂球',
      dimensions: ['防守', '技巧', '随性', '佛系'],
      description: '你是双打中最无私的存在。你不在乎自己得多少分，只在乎搭子打得爽不爽。你的每一拍都在制造机会：搓一个网前让搭子扑，挑一个到位让搭子杀，挡一个回去让对面失位。你是球场上的辅助位，是喂球的艺术家。你心态极佳，从不上头——因为你打球的快乐来源不是赢球，是看到搭子打出好球时的笑容。',
      playerArchetype: { name: '黄雅琼', desc: '你就是球场上的黄雅琼，完美辅助，每一拍都在为搭子创造杀球机会。' },
      quote: '「没事，你打你打，我给你做球。」',
      coreBehavior: '专注为队友创造机会的无私辅助',
      behaviorPattern: '默默补位 → 精准做球 → 搭子得分他鼓掌 → 搭子失误他安慰 → 全场最低调也最重要的人',
      stats: { smash: 20, accuracy: 85, speed: 65, tactics: 70, pressure: 92, heated: 5 },
      partner: { code: 'FLEX', reason: '你负责喂球，他负责帅气杀球。最佳辅助配最佳射手。天造地设。', shortTag: '你喂球他帅杀，天作之合' },
      rival: { code: 'BOSS', reason: '他拼命指挥你，你佛系随缘。他的控制欲遇上你的无所谓，火星撞地球。', shortTag: '你佛系他暴躁，水火不容' }
    },
    GACHA: {
      emoji: '🎁', code: 'GACHA', nameCN: '盲盒打法',
      tagline: '「连我自己都不知道下一拍往哪打。惊不惊喜？」',
      slogan: '行走的盲盒｜连自己都不知道下一拍往哪',
      dotLabel: '随缘出招，自己也懵',
      dimensions: ['防守', '技巧', '随性', '上头'],
      description: '你的球路是量子力学级别的不可预测。你不做计划，全靠手感。手感好的时候你是戴资颖附体，手感差的时候你是刚学球的小朋友。每一拍都是一个盲盒——你自己不知道出什么，对手更不知道。而且你特别容易上头：打出好球嗷嗷叫，打飞了跺脚骂自己。你的情绪和球路一样随机，跟你打球永远不会无聊。',
      playerArchetype: { name: '无直接对应', desc: '你是每次混双里最不可控的变量，也是最大的笑点来源。' },
      quote: '「刚才那球？哦那是故意的。（才不是）」',
      coreBehavior: '球路和情绪都完全随机的盲盒选手',
      behaviorPattern: '打出好球嗷嗷叫 → 失误跺脚 → 下一拍更离谱 → 笑着说「不好意思」→ 继续随机',
      stats: { smash: 45, accuracy: 25, speed: 62, tactics: 15, pressure: 40, heated: 80 },
      partner: { code: 'SNOOK', reason: '你随机出招他在后面兜底布局。你的混乱加他的计划，居然意外地配。', shortTag: '你随机他兜底，居然配' },
      rival: { code: 'HEX', reason: '他太完美太稳了，让你的随机毫无用武之地。完美是混乱的克星。', shortTag: '完美克随机，毫无机会' }
    },
    WALL: {
      emoji: '🧱', code: 'WALL', nameCN: '防守铁壁',
      tagline: '「你杀吧。杀不死我的。」',
      slogan: '不可摧毁的墙｜你杀吧，杀不死的',
      dotLabel: '铜墙铁壁，杀不死的',
      dimensions: ['防守', '力量', '计划', '佛系'],
      description: '你是球场上的铜墙铁壁。不管对手杀多重、角度多刁钻，你总能接回来。你有力量但不急着进攻，你有计划但计划就是——先守住。你跑位扎实、接杀稳健、心态平和。别人在那边杀得面红耳赤，你在这边面不改色一拍一拍地接。你赢球不靠打死对手，靠的是对手在第30拍终于崩溃了。你就是那堵打不穿的墙。',
      playerArchetype: { name: '安洗莹', desc: '你就是球场上的安洗莹，防守转进攻的极致，女单未来统治者。' },
      quote: '「你继续杀，没关系，我接得住。我一直接得住。」',
      coreBehavior: '永远接得住的不死存在',
      behaviorPattern: '比赛不急不躁 → 让对手先进攻 → 默默接杀接杀接杀 → 对手崩溃 → 面无表情收球',
      stats: { smash: 40, accuracy: 78, speed: 72, tactics: 80, pressure: 98, heated: 8 },
      partner: { code: 'MIAO', reason: '你在后面兜底，他在前面创造奇迹。稳定+灵感的完美组合。', shortTag: '你兜底他创造奇迹' },
      rival: { code: 'BEAST', reason: '不可阻挡的力量vs不可移动的物体。史诗级对决。', shortTag: '铁壁打猛男，不死不休' }
    },
    COUNTER: {
      emoji: '⚔️', code: 'COUNTER', nameCN: '反击之王',
      tagline: '「你以为我在防守？不，我在等你犯错。」',
      slogan: '隐忍反击猎手｜等你犯错，一拍致命',
      dotLabel: '防守蓄力，一击反杀',
      dimensions: ['防守', '力量', '计划', '上头'],
      description: '你是球场上最耐心的猎人。你不主动进攻，但你的反击比任何进攻都致命。你享受的是对手疯狂进攻却打不死你，然后在他喘气的那一瞬间，一拍反抽直线。你的上头不是乱，是燃——越被压越兴奋，越接杀越带劲。上一拍你还在救球，下一拍已经在杀球了。像一把藏在防守后面的尖刀。',
      playerArchetype: { name: '石宇奇', desc: '你就是球场上的石宇奇，防守中突然变速突击，一拍制敌。' },
      quote: '「你杀吧。杀够了？到我了。」',
      coreBehavior: '防守中蓄力反击的耐心猎手',
      behaviorPattern: '开局防守试探 → 记住对手进攻规律 → 接杀越来越兴奋 → 找到空档一拍反杀 → 握拳怒吼',
      stats: { smash: 80, accuracy: 82, speed: 70, tactics: 85, pressure: 88, heated: 75 },
      partner: { code: 'BOSS', reason: '他指挥节奏，你负责在防守中找到致命反击点。一个喊一个杀。', shortTag: '他喊节奏你反杀' },
      rival: { code: 'WOK', reason: '他快你也快，但你更有耐心。看是炒菜先翻锅还是反击先亮刀。', shortTag: '你快他更快，拼速度' }
    },
    CHAOS: {
      emoji: '🌀', code: 'CHAOS', nameCN: '布朗运动',
      tagline: '「我自己都不知道下一拍往哪打。」',
      slogan: '量子级随机体｜跑位随缘，出手随心',
      dotLabel: '量子走位，完全随机',
      dimensions: ['防守', '力量', '随性', '佛系'],
      description: '你的球路是量子力学级别的不可预测。你的跑位让人看不懂，你的出手让人猜不到，包括你自己。但跟盲盒不一样，你完全不在意——你打球就图一乐。你有力量但不知道往哪使，有跑位但没有方向。你是球场上的布朗运动，微观上完全随机，宏观上……还是随机。但这就是你的魅力：跟你打球永远不无聊。',
      playerArchetype: { name: '无直接对应', desc: '你是每次混双里最不可控的变量，也是最有趣的佛系存在。' },
      quote: '「刚才那球？额……下一个下一个。」',
      coreBehavior: '量子级不可预测的佛系存在',
      behaviorPattern: '站位随缘 → 出手随心 → 偶尔打出神球 → 下一拍翻车 → 笑笑继续',
      stats: { smash: 65, accuracy: 18, speed: 60, tactics: 10, pressure: 70, heated: 12 },
      partner: { code: 'TUMBLE', reason: '两个不可预测的人凑一起，双重随机。对面不知道你们打哪，你们自己也不知道。', shortTag: '双随机，对面直接懵' },
      rival: { code: 'FLEX', reason: '你越乱他越没法帅。他精心设计的表演被你的随机完全打乱，审美灾难。', shortTag: '你乱他没法帅，崩溃' }
    },
    TUMBLE: {
      emoji: '😱', code: 'TUMBLE', nameCN: '连滚带爬',
      tagline: '「接到了！我接到了！虽然我摔了。」',
      slogan: '永不放弃拼命三郎｜摔了爬起来继续',
      dotLabel: '拼命救球，永不放弃',
      dimensions: ['防守', '力量', '随性', '上头'],
      description: '你打球的画面永远是连滚带爬的——往前扑、往后跳、侧身鱼跃、单膝跪接。你的球技可能不是最好的，但你的态度绝对是最认真的。你在乎每一个球，即使你的身体跟不上你的野心。你特别容易上头，一旦进入状态就完全不管不顾，哪怕膝盖已经发出了求救信号。你的运动轨迹就是一出喜剧大片。',
      playerArchetype: { name: '无直接对应', desc: '你是每个业余球馆里最拼命、膝盖最惨、表情最丰富的那个人。' },
      quote: '「我还能打！膝盖？膝盖没事！（膝盖在哭泣）」',
      coreBehavior: '匆匆忙忙连滚带爬但永不放弃',
      behaviorPattern: '飞身救球 → 倒地爬起 → 大喊「我没事」→ 下一球继续鱼跃 → 打完贴满膏药',
      stats: { smash: 70, accuracy: 28, speed: 75, tactics: 18, pressure: 35, heated: 92 },
      partner: { code: 'ACE', reason: '你拼命鱼跃救球，他冷静接管善后。你的热血配他的智慧，意外地好使。', shortTag: '你鱼跃他善后，热血配智慧' },
      rival: { code: 'FEED', reason: '他轻松写意地喂球，你满地打滚地接球。同一个球场，两种画风。', shortTag: '他写意你打滚，两种画风' }
    }
  };

  // ============================================================
  // 6. All personality codes for gallery iteration
  // ============================================================
  var allTypeCodes = [
    'HEX', 'BOSS', 'MIAO', 'WOK',
    'ROCKET', 'FLEX', 'SMASH', 'BEAST',
    'ACE', 'SNOOK', 'FEED', 'GACHA',
    'WALL', 'COUNTER', 'CHAOS', 'TUMBLE'
  ];

  // ============================================================
  // Public API
  // ============================================================
  return {
    dimensions: dimensions,
    dimensionOrder: dimensionOrder,
    statMeta: statMeta,
    questions: questions,
    typeMap: typeMap,
    personalities: personalities,
    allTypeCodes: allTypeCodes
  };
})();
