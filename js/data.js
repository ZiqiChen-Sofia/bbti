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
  // 3. 24 Questions
  // ============================================================
  var questions = [
    // ── Dimension 1: Attack vs Defense (Q1-Q4) ──
    {
      id: 1,
      dimension: 'attack_defense',
      text: '约球群喊了半天终于凑齐人，19:19关键球，搭子瞟了你一眼——',
      options: [
        { label: 'A', text: '不管了！一把梭哈！起板就杀！', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '稳住别浪，拉个高远球先耗着', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '吊个网前骗他上来再说', scores: { attack: 1, defense: 1 } },
        { label: 'D', text: '有机会就偷袭，没机会接着磨', scores: { attack: 1, defense: 0 } }
      ]
    },
    {
      id: 2,
      dimension: 'attack_defense',
      text: '打完球撸串，聊起今天最得意的一分——',
      options: [
        { label: 'A', text: '"一记重杀直接锤地上，对面连反应都没有"', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '"跟他磨了30多拍，最后他自己先崩了"', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '"一个假动作骗翻全场，隔壁场都在看"', scores: { attack: 1, defense: 0 } },
        { label: 'D', text: '"反正赢了就行，来来来先干杯"', scores: { attack: 1, defense: 1 } }
      ]
    },
    {
      id: 3,
      dimension: 'attack_defense',
      text: '约球群有人说"今天来了个怎么打都打不死的，谁来挑战？"——',
      options: [
        { label: 'A', text: '我来！杀不死他我不信了', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '这种我喜欢，来比谁更能磨', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '有点头疼，最怕假动作多的那种', scores: { attack: 1, defense: 1 } },
        { label: 'D', text: '无所谓，来什么对手打什么球', scores: { attack: 1, defense: 1 } }
      ]
    },
    {
      id: 4,
      dimension: 'attack_defense',
      text: '双打搭子跟你说"稳一点，别着急进攻好不好"——',
      options: [
        { label: 'A', text: '"嗯嗯好的"（下一拍继续起跳暴杀）', scores: { attack: 2, defense: 0 } },
        { label: 'B', text: '"确实，先控制住别送分了"', scores: { attack: 0, defense: 2 } },
        { label: 'C', text: '"道理我都懂但是手它不听话啊！"', scores: { attack: 1, defense: 0 } },
        { label: 'D', text: '"行吧，但看到机会球我还是得杀啊"', scores: { attack: 1, defense: 0 } }
      ]
    },

    // ── Dimension 2: Skill vs Power (Q5-Q8) ──
    {
      id: 5,
      dimension: 'skill_power',
      text: '如果只能练一项技术到巅峰，你练啥？',
      options: [
        { label: 'A', text: '杀球力量——一拍子锤死，简单粗暴', scores: { power: 2, skill: 0 } },
        { label: 'B', text: '网前搓球——细腻如丝，对手干瞪眼', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '假动作——全场都猜不到我下一拍', scores: { skill: 1, power: 0 } },
        { label: 'D', text: '步伐——到位了什么球都好接', scores: { skill: 1, power: 1 } }
      ]
    },
    {
      id: 6,
      dimension: 'skill_power',
      text: '选新球拍，你最看重什么？',
      options: [
        { label: 'A', text: '头重进攻拍！杀球那个下压感，懂的都懂', scores: { power: 2, skill: 0 } },
        { label: 'B', text: '速度拍！手感好控球灵活才是王道', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '均衡拍吧，攻守都能兼顾', scores: { skill: 1, power: 1 } },
        { label: 'D', text: '这把颜值高……买了买了（认真的）', scores: { skill: 1, power: 1 } }
      ]
    },
    {
      id: 7,
      dimension: 'skill_power',
      text: '你觉得自己打球风格最像谁？',
      options: [
        { label: 'A', text: '安赛龙——后场起跳重杀，一拍封喉', scores: { power: 2, skill: 0 } },
        { label: 'B', text: '戴资颖——假动作变幻莫测，你永远猜不到', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '桃田贤斗——极致网前，搓得你怀疑人生', scores: { skill: 2, power: 0 } },
        { label: 'D', text: '林丹——慢慢打太极突然一剑封喉', scores: { skill: 1, power: 1 } }
      ]
    },
    {
      id: 8,
      dimension: 'skill_power',
      text: '双打时对手搓了个贴网球，搭子喊"你的你的！"——',
      options: [
        { label: 'A', text: '挑起来吧！后面搭子会补位的（大概）', scores: { power: 2, skill: 0 } },
        { label: 'B', text: '轻搓一个更贴的回去，比细腻谁怕谁', scores: { skill: 2, power: 0 } },
        { label: 'C', text: '勾个对角，出其不意搞他', scores: { skill: 1, power: 0 } },
        { label: 'D', text: '能放就放，放不了就挑呗', scores: { skill: 1, power: 1 } }
      ]
    },

    // ── Dimension 3: Plan vs Random (Q9-Q12) ──
    {
      id: 9,
      dimension: 'plan_random',
      text: '球友群通知周末有业余混双赛——到底去不去打啊？',
      options: [
        { label: 'A', text: '报！已经拉搭子加练了，还研究了对手打法', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '报了，到时候正常发挥就行', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '周六晚上才想起来，球拍线还是断的', scores: { plan: 0, random: 2 } },
        { label: 'D', text: '群里聊得热闹随手就报了，规则都没看', scores: { plan: 0, random: 1 } }
      ]
    },
    {
      id: 10,
      dimension: 'plan_random',
      text: '比赛还有10分钟开始，搭子已经在热身了，你在——',
      options: [
        { label: 'A', text: '跟搭子对暗号呢，三套战术已经安排好了', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '简单拉伸一下，感觉状态到了就行', scores: { plan: 1, random: 1 } },
        { label: 'C', text: '还在找球拍/换鞋/上厕所/买水', scores: { plan: 0, random: 2 } },
        { label: 'D', text: '在跟隔壁场的人聊天呢，"马上马上！"', scores: { plan: 0, random: 1 } }
      ]
    },
    {
      id: 11,
      dimension: 'plan_random',
      text: '球包里几把拍子？每次约球你——',
      options: [
        { label: 'A', text: '三把以上，不同拍对应不同对手和磅数', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '两把，一主一备，够用了', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '一把走天下，用顺手了干嘛换', scores: { plan: 0, random: 1 } },
        { label: 'D', text: '有时候忘带拍，到了蹭别人的（嘿嘿）', scores: { plan: 0, random: 2 } }
      ]
    },
    {
      id: 12,
      dimension: 'plan_random',
      text: '打完一局，干饭路上球友问"复盘一下？"——',
      options: [
        { label: 'A', text: '"来啊！第三分那球你处理不对，应该……"', scores: { plan: 2, random: 0 } },
        { label: 'B', text: '"大概想想关键分怎么处理的就行"', scores: { plan: 1, random: 0 } },
        { label: 'C', text: '"别复盘了！点菜点菜！我快饿死了！"', scores: { plan: 0, random: 2 } },
        { label: 'D', text: '"我只记得我那记帅球了，其他全忘了"', scores: { plan: 0, random: 1 } }
      ]
    },

    // ── Dimension 4: Zen vs Heated (Q13-Q16) ──
    {
      id: 13,
      dimension: 'zen_heated',
      text: '关键分打丢了，搭子默默看了你一眼——',
      options: [
        { label: 'A', text: '深呼吸，"没事，下一分拿回来"', scores: { zen: 2, heated: 0 } },
        { label: 'B', text: '小声骂了自己一句，然后继续', scores: { zen: 0, heated: 1 } },
        { label: 'C', text: '啪地拍了一下大腿，"这球怎么丢的！"', scores: { zen: 0, heated: 2 } },
        { label: 'D', text: '表面微笑，内心已经写了三千字检讨', scores: { zen: 1, heated: 0 } }
      ]
    },
    {
      id: 14,
      dimension: 'zen_heated',
      text: '连输两局了，搭子试探着说"……要不歇一局？"——',
      options: [
        { label: 'A', text: '"行啊，正好去买瓶水，开心就好嘛"', scores: { zen: 2, heated: 0 } },
        { label: 'B', text: '"不歇！今天必须赢回来再走！"', scores: { zen: 0, heated: 2 } },
        { label: 'C', text: '"先冷静想想，刚才到底哪出了问题"', scores: { zen: 1, heated: 0 } },
        { label: 'D', text: '不说话了，脸已经拉下来了', scores: { zen: 0, heated: 1 } }
      ]
    },
    {
      id: 15,
      dimension: 'zen_heated',
      text: '被一个你觉得水平不如你的人赢了，干饭时——',
      options: [
        { label: 'A', text: '"今天状态不好而已，吃饭吃饭"', scores: { zen: 2, heated: 0 } },
        { label: 'B', text: '一边吃一边想刚才哪里打得不对', scores: { zen: 0, heated: 1 } },
        { label: 'C', text: '"吃完回去再来一局！我不服！"', scores: { zen: 0, heated: 2 } },
        { label: 'D', text: '笑着说"你今天不错啊"，但筷子夹菜明显用力了', scores: { zen: 0, heated: 1 } }
      ]
    },
    {
      id: 16,
      dimension: 'zen_heated',
      text: '关于「赢球」这件事，你内心的真实想法是——',
      options: [
        { label: 'A', text: '赢了开心输了也开心，打球嘛，重在吃饭', scores: { zen: 2, heated: 0 } },
        { label: 'B', text: '过程开心就好，比分不重要', scores: { zen: 1, heated: 0 } },
        { label: 'C', text: '能赢干嘛不赢？下次约他我还要赢！', scores: { zen: 0, heated: 2 } },
        { label: 'D', text: '嘴上说不在意……但心里暗暗较劲', scores: { zen: 0, heated: 1 } }
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
      dimensions: ['进攻', '技巧', '计划', '佛系'],
      description: '你是球场上的六边形战士——进攻有手感，防守有意识，战术有章法，心态还特别好。别人怒摔球拍的时候你在微笑，别人自乱阵脚的时候你在冷静提速。你不是最强的，但你是最没短板的。球馆里大家都想跟你搭档，因为跟你打球又舒服又能赢。唯一的缺点：太稳了，偶尔显得有点无聊。',
      playerArchetype: { name: '林丹', desc: '巅峰期全面打法，攻守兼备，心态如佛。超级丹不是白叫的。' },
      quote: '「急什么，每一分都认真打就好了。」',
      coreBehavior: '没有明显短板的全能型选手',
      behaviorPattern: '热身认真 → 比赛冷静 → 落后不慌 → 领先不浪 → 赛后轻描淡写',
      stats: { smash: 78, accuracy: 85, speed: 75, tactics: 88, pressure: 90, heated: 15 },
      partner: { code: 'BEAST', reason: '你稳住局面，他暴力输出。你是方向盘，他是引擎。完美互补。' },
      rival: { code: 'GACHA', reason: '你算无遗策，但随机是你唯一的克星。盲盒打法让你的计划全部作废。' }
    },
    BOSS: {
      emoji: '👴',
      code: 'BOSS',
      nameCN: '控场老登',
      tagline: '「听我的！打他反手！打他反手！」',
      dimensions: ['进攻', '技巧', '计划', '上头'],
      description: '你是球场上的总指挥。技术好、脑子活、有规划，但问题是——你太上头了。赢球你要喊，输球你更要喊，队友失误你还要喊。你不是在打球，你是在导演一出大戏，而你是唯一的导演。球场上回荡的都是你的声音：「压他反手！」「封网！」「跑啊！」大家又怕又服：怕你的音量，服你的指挥。',
      playerArchetype: { name: '蔡赟', desc: '国羽男双指挥核心，场上的大脑和嘴巴。前封后攻的教科书。' },
      quote: '「我说的没错吧？早听我的早赢了！」',
      coreBehavior: '声音最大、意见最多的球场指挥官',
      behaviorPattern: '赛前布置战术 → 赛中大喊指挥 → 队友失误时碎碎念 → 赢了说「看我战术没问题吧」',
      stats: { smash: 70, accuracy: 82, speed: 60, tactics: 95, pressure: 55, heated: 88 },
      partner: { code: 'SMASH', reason: '你负责指哪，他负责打哪。你是GPS，他是导弹。只要他听你的。' },
      rival: { code: 'FEED', reason: '你拼命指挥，他佛系喂球。你急他不急，你喊他不听，能气死你。' }
    },
    MIAO: {
      emoji: '✨',
      code: 'MIAO',
      nameCN: '不知道很曼妙',
      tagline: '「刚才那球？我也不知道怎么打出来的。」',
      dimensions: ['进攻', '技巧', '随性', '佛系'],
      description: '你是天赋型选手。不练球也能打出神球，不做计划照样赢。你的手感像开了挂，假动作是天生的，不是练出来的。关键是你心态贼好，打飞了笑笑，打进了也笑笑。别人研究你的战术？不好意思，你自己都不知道下一拍要干嘛。你不知道自己有多强，这种不知道，本身就很曼妙。',
      playerArchetype: { name: '戴资颖', desc: '天赋最高的魔幻大师。灵感型打法，浑然天成。你以为她要放网，她突然推后场。' },
      quote: '「想什么打什么吧，打球嘛，开心就好。」',
      coreBehavior: '靠灵感打球的天赋型选手',
      behaviorPattern: '不热身直接上 → 手感来了打谁都像菜 → 打出神球自己也惊讶 → 全程佛系微笑',
      stats: { smash: 60, accuracy: 75, speed: 78, tactics: 50, pressure: 88, heated: 12 },
      partner: { code: 'WALL', reason: '你随便浪，他在后面兜底。你是艺术家，他是保险公司。' },
      rival: { code: 'SNOOK', reason: '他每球都在算计，你每球都在随缘。理性vs灵感的终极对决。' }
    },
    WOK: {
      emoji: '🍳',
      code: 'WOK',
      nameCN: '网前炒菜',
      tagline: '「网前我的！这个也是我的！那个也是我的！」',
      dimensions: ['进攻', '技巧', '随性', '上头'],
      description: '你就是那个在网前疯狂抢球的人。球一过网你就扑上去，搓、推、勾、扑，操作得跟大厨炒菜一样——铲来翻去，噼里啪啦。你手感好、反应快，但你容易上头。越打越兴奋，越兴奋越往前压，压到最后连搭子的球都抢。你的搭子最大的感受是：「他在前面炒菜，我在后面看戏。」',
      playerArchetype: { name: '郑思维', desc: '连贯快攻型前场手，网前魔术师。几拍之内结束战斗。' },
      quote: '「让一让！网前的都归我！」',
      coreBehavior: '网前疯狂抢球的炒菜大师',
      behaviorPattern: '站位越来越前 → 抢球越来越多 → 打出好球嗷嗷叫 → 失误了跺脚 → 继续抢',
      stats: { smash: 55, accuracy: 72, speed: 92, tactics: 45, pressure: 55, heated: 82 },
      partner: { code: 'ROCKET', reason: '你在前面炒菜，他在后面精确轰炸。前后分工明确，经典配合。' },
      rival: { code: 'COUNTER', reason: '你越扑他越接，越接越反击，让你的炒菜变成翻车现场。' }
    },
    ROCKET: {
      emoji: '🚀',
      code: 'ROCKET',
      nameCN: '钱学森弹道',
      tagline: '「杀球有轨迹，落点有坐标。」',
      dimensions: ['进攻', '力量', '计划', '佛系'],
      description: '你的杀球不是蛮力，是精确制导导弹。你知道对手站在哪里，更知道他接不到哪里。你是球场上的弹道专家，每一拍重杀都经过了精密计算。关键是你心态平和——杀进去不兴奋，杀飞了不着急。你在双打里是后场的绝对核心，搭子只需要把球起高，剩下的交给你。钱学森弹道，说的就是你。',
      playerArchetype: { name: '安赛龙', desc: '194cm杀球点，高点重杀精确到点位。两枚奥运金牌的欧洲霸主。' },
      quote: '「那个位置，杀直线，下压，他一定接不到。」',
      coreBehavior: '精确制导的后场杀球核心',
      behaviorPattern: '开局试探对手弱点 → 找到弱点后反复精确制导 → 表情始终冷静 → 杀球声是唯一BGM',
      stats: { smash: 95, accuracy: 90, speed: 55, tactics: 82, pressure: 85, heated: 18 },
      partner: { code: 'WOK', reason: '他在前面搅局，你在后面精确轰炸。完美的前后分工。' },
      rival: { code: 'ACE', reason: '他攻守切换自如，你的精确导弹总被他化解。导弹打水，看谁先赢。' }
    },
    FLEX: {
      emoji: '💪',
      code: 'FLEX',
      nameCN: '逼王再世',
      tagline: '「看到没？看到我那记杀球没？帅不帅？」',
      dimensions: ['进攻', '力量', '计划', '上头'],
      description: '你打球的目的只有一个：帅。杀球要帅，接球要帅，赢球的表情更要帅。你有实力，但你更在意表演效果。每一次得分都像是在拍宣传片，恨不得现场有慢镜头回放。你会为了一记帅气的跳杀放弃更稳妥的处理方式。你赢球会叉腰，输球会甩头发（即使你是寸头）。球场上的逼王，实力配得上架子。',
      playerArchetype: { name: '李宗伟', desc: '极致的进攻美学，每一拍都像艺术品。永不放弃的热血战士。' },
      quote: '「你们刚才有没有拍到？那个球必须发朋友圈。」',
      coreBehavior: '追求帅气得分的球场表演家',
      behaviorPattern: '得分时叉腰回头 → 帅球发群炫耀 → 失误比别人更生气（因为不帅）→ 赢了第一件事发朋友圈',
      stats: { smash: 88, accuracy: 72, speed: 68, tactics: 75, pressure: 50, heated: 85 },
      partner: { code: 'FEED', reason: '他把球喂到完美位置，你负责帅气收割。最佳辅助配最佳射手。' },
      rival: { code: 'CHAOS', reason: '你精心设计的帅气表演被他的混乱完全打乱。审美差异的极致碰撞。' }
    },
    SMASH: {
      emoji: '💥',
      code: 'SMASH',
      nameCN: '暴力美学',
      tagline: '「后场起跳，一拍KO。」',
      dimensions: ['进攻', '力量', '随性', '佛系'],
      description: '你信奉力量就是美。后场起跳重杀的那一瞬间，你觉得全世界都安静了。你不做计划，不搞战术，拿到球就一个动作——杀。赢了嗯一声，输了也嗯一声。你不是不在意，你只是觉得说那么多干嘛，用球拍说话就行。你的杀球声是球馆里最响亮的BGM，也是你唯一的社交方式。',
      playerArchetype: { name: '马林', desc: '连续起跳扣杀，每一拍都想打穿地板。欧洲暴力美学的代表。' },
      quote: '「为什么要吊球？人生苦短，能杀就杀。」',
      coreBehavior: '只相信力量的佛系杀手',
      behaviorPattern: '接发球直接起跳 → 连续重杀 → 杀不进换个角度 → 全程面无表情 → 打完默默收拍',
      stats: { smash: 99, accuracy: 38, speed: 68, tactics: 20, pressure: 82, heated: 10 },
      partner: { code: 'BOSS', reason: '他负责喊你杀哪，你负责一拍打死。你是他手里最暴力的武器。' },
      rival: { code: 'COUNTER', reason: '你越杀越猛，他越接越稳，突然一拍反杀。暴力vs反弹。' }
    },
    BEAST: {
      emoji: '🔥',
      code: 'BEAST',
      nameCN: '强攻猛男',
      tagline: '「啊啊啊啊啊啊啊！杀！杀！杀！」',
      dimensions: ['进攻', '力量', '随性', '上头'],
      description: '你是球场上声音最大、力量最猛、情绪最激动的那个人。你不需要计划，因为你的计划就是——全力进攻。你打球靠的不是战术，是一腔热血和永远用不完的肾上腺素。越打越兴奋，越兴奋越猛，每一拍都像是要把球打穿。你赢了会怒吼，输了也会怒吼，总之一直在怒吼。球馆里的猛男，真正的原始力量。',
      playerArchetype: { name: '山口茜', desc: '156cm覆盖全场，永不疲倦的体能怪兽。小身材大能量。' },
      quote: '「再来一局！什么？已经三小时了？再来一局！」',
      coreBehavior: '靠热血和肾上腺素打球的原始猛兽',
      behaviorPattern: '第一拍就全力杀 → 越打越兴奋越大声 → 汗洒全场 → 最后一个离开球馆 → 还在问谁要加赛',
      stats: { smash: 92, accuracy: 30, speed: 88, tactics: 15, pressure: 45, heated: 99 },
      partner: { code: 'HEX', reason: '你负责暴力输出，他负责稳住一切。你是引擎，他是方向盘。' },
      rival: { code: 'WALL', reason: '不可阻挡的力量vs不可移动的物体。世纪对决。' }
    },
    ACE: {
      emoji: '🔄',
      code: 'ACE',
      nameCN: '可攻可受',
      tagline: '「攻防切换，随心所欲。」',
      dimensions: ['防守', '技巧', '计划', '佛系'],
      description: '你是球场上最灵活的存在。需要防守你就守，需要进攻你就攻，需要搓球你就搓。你没有固定套路，但你有固定的冷静。你的强大不在于某一项技术特别突出，而在于你能根据局势自由切换。你是水，对手是什么形状的容器，你就变成什么形状。打球时波澜不惊，偶尔微笑——因为你已经读懂了比赛。',
      playerArchetype: { name: '桃田贤斗', desc: '极致控球，攻守切换无缝衔接。精密控制的日本机器。' },
      quote: '「你打什么我接什么，你变我也变。」',
      coreBehavior: '攻防自如切换的百变球手',
      behaviorPattern: '开局观察 → 中场适应 → 后半段完全掌控节奏 → 面不改色赢球 → 鞠躬离场',
      stats: { smash: 55, accuracy: 88, speed: 72, tactics: 92, pressure: 90, heated: 8 },
      partner: { code: 'TUMBLE', reason: '你冷静善后，他热血鱼跃。你的智慧配他的拼劲，意外地好使。' },
      rival: { code: 'ROCKET', reason: '精确vs灵活。导弹打水，看谁先分出胜负。' }
    },
    SNOOK: {
      emoji: '🎱',
      code: 'SNOOK',
      nameCN: '斯诺克打法',
      tagline: '「这一拍是给你下套，三拍后你就知道了。」',
      dimensions: ['防守', '技巧', '计划', '上头'],
      description: '你打球像打斯诺克——每一拍不是为了得分，是为了让对手下一拍没球打。你的球路精密、刁钻、环环相扣。你享受的是对手被你调动得晕头转向的那种掌控感。但你有个毛病：太上头。当对手不按你的剧本走，你就开始急。「他怎么不上当？！」你布的局越精密，被破坏时你就越暴躁。',
      playerArchetype: { name: '谌龙', desc: '防守反击的极致，用「磨」赢下所有荣誉。主动防守，精密布局。' },
      quote: '「我让你以为你在进攻，其实你早就在我的圈套里了。」',
      coreBehavior: '每一拍都在设套的球场棋手',
      behaviorPattern: '精心设计球路陷阱 → 对手中套时暗爽 → 对手不上当就急 → 赢球后得意洋洋地复盘',
      stats: { smash: 35, accuracy: 92, speed: 58, tactics: 98, pressure: 65, heated: 78 },
      partner: { code: 'GACHA', reason: '你精心布局，他随机搅局。对手既要躲你的圈套又要猜他的盲盒，双重折磨。' },
      rival: { code: 'MIAO', reason: '你设套他不走，因为他根本不看路。灵感型打破计划型。' }
    },
    FEED: {
      emoji: '🍼',
      code: 'FEED',
      nameCN: '喂球童子',
      tagline: '「球给你，分归你，你开心就好。」',
      dimensions: ['防守', '技巧', '随性', '佛系'],
      description: '你是双打中最无私的存在。你不在乎自己得多少分，只在乎搭子打得爽不爽。你的每一拍都在制造机会：搓一个网前让搭子扑，挑一个到位让搭子杀，挡一个回去让对面失位。你是球场上的辅助位，是喂球的艺术家。你心态极佳，从不上头——因为你打球的快乐来源不是赢球，是看到搭子打出好球时的笑容。',
      playerArchetype: { name: '黄雅琼', desc: '混双中的完美辅助，每一拍都在为搭子创造杀球机会。最佳助攻。' },
      quote: '「没事，你打你打，我给你做球。」',
      coreBehavior: '专注为队友创造机会的无私辅助',
      behaviorPattern: '默默补位 → 精准做球 → 搭子得分他鼓掌 → 搭子失误他安慰 → 全场最低调也最重要的人',
      stats: { smash: 20, accuracy: 85, speed: 65, tactics: 70, pressure: 92, heated: 5 },
      partner: { code: 'FLEX', reason: '你负责喂球，他负责帅气杀球。最佳辅助配最佳射手。天造地设。' },
      rival: { code: 'BOSS', reason: '他拼命指挥你，你佛系随缘。他的控制欲遇上你的无所谓，火星撞地球。' }
    },
    GACHA: {
      emoji: '🎁',
      code: 'GACHA',
      nameCN: '盲盒打法',
      tagline: '「连我自己都不知道下一拍往哪打。惊不惊喜？」',
      dimensions: ['防守', '技巧', '随性', '上头'],
      description: '你的球路是量子力学级别的不可预测。你不做计划，全靠手感。手感好的时候你是戴资颖附体，手感差的时候你是刚学球的小朋友。每一拍都是一个盲盒——你自己不知道出什么，对手更不知道。而且你特别容易上头：打出好球嗷嗷叫，打飞了跺脚骂自己。你的情绪和球路一样随机，跟你打球永远不会无聊。',
      playerArchetype: { name: '无直接对应', desc: '但你是每次混双里最不可控的变量，也是最大的笑点来源。' },
      quote: '「刚才那球？哦那是故意的。（才不是）」',
      coreBehavior: '球路和情绪都完全随机的盲盒选手',
      behaviorPattern: '打出好球嗷嗷叫 → 失误跺脚 → 下一拍更离谱 → 笑着说「不好意思」→ 继续随机',
      stats: { smash: 45, accuracy: 25, speed: 62, tactics: 15, pressure: 40, heated: 80 },
      partner: { code: 'SNOOK', reason: '你随机出招他在后面兜底布局。你的混乱加他的计划，居然意外地配。' },
      rival: { code: 'HEX', reason: '他太完美太稳了，让你的随机毫无用武之地。完美是混乱的克星。' }
    },
    WALL: {
      emoji: '🧱',
      code: 'WALL',
      nameCN: '防守铁壁',
      tagline: '「你杀吧。杀不死我的。」',
      dimensions: ['防守', '力量', '计划', '佛系'],
      description: '你是球场上的铜墙铁壁。不管对手杀多重、角度多刁钻，你总能接回来。你有力量但不急着进攻，你有计划但计划就是——先守住。你跑位扎实、接杀稳健、心态平和。别人在那边杀得面红耳赤，你在这边面不改色一拍一拍地接。你赢球不靠打死对手，靠的是对手在第30拍终于崩溃了。你就是那堵打不穿的墙。',
      playerArchetype: { name: '安洗莹', desc: '防守转进攻的极致，上一拍还在救球，下一拍已经在杀球。女单未来统治者。' },
      quote: '「你继续杀，没关系，我接得住。我一直接得住。」',
      coreBehavior: '永远接得住的不死存在',
      behaviorPattern: '比赛不急不躁 → 让对手先进攻 → 默默接杀接杀接杀 → 对手崩溃 → 面无表情收球',
      stats: { smash: 40, accuracy: 78, speed: 72, tactics: 80, pressure: 98, heated: 8 },
      partner: { code: 'MIAO', reason: '你在后面兜底，他在前面创造奇迹。稳定+灵感的完美组合。' },
      rival: { code: 'BEAST', reason: '不可阻挡的力量vs不可移动的物体。史诗级对决。' }
    },
    COUNTER: {
      emoji: '⚔️',
      code: 'COUNTER',
      nameCN: '反击之王',
      tagline: '「你以为我在防守？不，我在等你犯错。」',
      dimensions: ['防守', '力量', '计划', '上头'],
      description: '你是球场上最耐心的猎人。你不主动进攻，但你的反击比任何进攻都致命。你享受的是对手疯狂进攻却打不死你，然后在他喘气的那一瞬间，一拍反抽直线。你的上头不是乱，是燃——越被压越兴奋，越接杀越带劲。上一拍你还在救球，下一拍已经在杀球了。像一把藏在防守后面的尖刀。',
      playerArchetype: { name: '石宇奇', desc: '防守中突然变速突击，一拍制敌的屠龙刀。' },
      quote: '「你杀吧。杀够了？到我了。」',
      coreBehavior: '防守中蓄力反击的耐心猎手',
      behaviorPattern: '开局防守试探 → 记住对手进攻规律 → 接杀越来越兴奋 → 找到空档一拍反杀 → 握拳怒吼',
      stats: { smash: 80, accuracy: 82, speed: 70, tactics: 85, pressure: 88, heated: 75 },
      partner: { code: 'BOSS', reason: '他指挥节奏，你负责在防守中找到致命反击点。一个喊一个杀。' },
      rival: { code: 'WOK', reason: '他快你也快，但你更有耐心。看是炒菜先翻锅还是反击先亮刀。' }
    },
    CHAOS: {
      emoji: '🌀',
      code: 'CHAOS',
      nameCN: '布朗运动',
      tagline: '「我自己都不知道下一拍往哪打。」',
      dimensions: ['防守', '力量', '随性', '佛系'],
      description: '你的球路是量子力学级别的不可预测。你的跑位让人看不懂，你的出手让人猜不到，包括你自己。但跟盲盒不一样，你完全不在意——你打球就图一乐。你有力量但不知道往哪使，有跑位但没有方向。你是球场上的布朗运动，微观上完全随机，宏观上……还是随机。但这就是你的魅力：跟你打球永远不无聊。',
      playerArchetype: { name: '无直接对应', desc: '但你是每次混双里最不可控的变量，也是最有趣的佛系存在。' },
      quote: '「刚才那球？额……下一个下一个。」',
      coreBehavior: '量子级不可预测的佛系存在',
      behaviorPattern: '站位随缘 → 出手随心 → 偶尔打出神球 → 下一拍翻车 → 笑笑继续',
      stats: { smash: 65, accuracy: 18, speed: 60, tactics: 10, pressure: 70, heated: 12 },
      partner: { code: 'TUMBLE', reason: '两个不可预测的人凑一起，双重随机。对面不知道你们打哪，你们自己也不知道。' },
      rival: { code: 'FLEX', reason: '你越乱他越没法帅。他精心设计的表演被你的随机完全打乱，审美灾难。' }
    },
    TUMBLE: {
      emoji: '😱',
      code: 'TUMBLE',
      nameCN: '连滚带爬',
      tagline: '「接到了！我接到了！虽然我摔了。」',
      dimensions: ['防守', '力量', '随性', '上头'],
      description: '你打球的画面永远是连滚带爬的——往前扑、往后跳、侧身鱼跃、单膝跪接。你的球技可能不是最好的，但你的态度绝对是最认真的。你在乎每一个球，即使你的身体跟不上你的野心。你特别容易上头，一旦进入状态就完全不管不顾，哪怕膝盖已经发出了求救信号。你的运动轨迹就是一出喜剧大片。',
      playerArchetype: { name: '无直接对应', desc: '但你是每个业余球馆里最拼命、膝盖最惨、表情最丰富的那个人。' },
      quote: '「我还能打！膝盖？膝盖没事！（膝盖在哭泣）」',
      coreBehavior: '匆匆忙忙连滚带爬但永不放弃',
      behaviorPattern: '飞身救球 → 倒地爬起 → 大喊「我没事」→ 下一球继续鱼跃 → 打完贴满膏药',
      stats: { smash: 70, accuracy: 28, speed: 75, tactics: 18, pressure: 35, heated: 92 },
      partner: { code: 'ACE', reason: '你拼命鱼跃救球，他冷静接管善后。你的热血配他的智慧，意外地好使。' },
      rival: { code: 'FEED', reason: '他轻松写意地喂球，你满地打滚地接球。同一个球场，两种画风。' }
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
