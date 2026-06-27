const TRIGRAMS = [
  ["坤", "地"],
  ["震", "雷"],
  ["坎", "水"],
  ["兑", "泽"],
  ["艮", "山"],
  ["离", "火"],
  ["巽", "风"],
  ["乾", "天"],
];

const KING_WEN_SEQUENCE = [
  2, 24, 7, 19, 15, 36, 46, 11,
  16, 51, 40, 54, 62, 55, 32, 34,
  8, 3, 29, 60, 39, 63, 48, 5,
  45, 17, 47, 58, 31, 49, 28, 43,
  23, 27, 4, 41, 52, 22, 18, 26,
  35, 21, 64, 38, 56, 30, 50, 14,
  20, 42, 59, 61, 53, 37, 57, 9,
  12, 25, 6, 10, 33, 13, 44, 1,
];

const PATTERN_TO_HEXAGRAM = new Array(65);
KING_WEN_SEQUENCE.forEach((hexagramIndex, pattern) => {
  PATTERN_TO_HEXAGRAM[hexagramIndex] = pattern;
});

export const HEXAGRAMS = {
  1: { name: "乾", judgment: "元亨利贞", meanings: ["刚健中正", "自强不息"] },
  2: { name: "坤", judgment: "元亨，利牝马之贞", meanings: ["厚德载物", "顺势而为"] },
  3: { name: "屯", judgment: "元亨利贞，勿用有攸往", meanings: ["万事开头难", "宜守不宜进"] },
  4: { name: "蒙", judgment: "亨，匪我求童蒙，童蒙求我", meanings: ["启蒙求知", "虚心受教"] },
  5: { name: "需", judgment: "有孚，光亨，贞吉", meanings: ["耐心等待", "时机将至"] },
  6: { name: "讼", judgment: "有孚窒惕，中吉，终凶", meanings: ["争讼不利", "宜和不宜争"] },
  7: { name: "师", judgment: "贞，丈人吉，无咎", meanings: ["统御有方", "行事正直"] },
  8: { name: "比", judgment: "吉，原筮元永贞，无咎", meanings: ["亲近辅助", "广结善缘"] },
  9: { name: "小畜", judgment: "亨，密云不雨，自我西郊", meanings: ["力量不足", "小有积蓄"] },
  10: { name: "履", judgment: "履虎尾，不咥人，亨", meanings: ["谨慎行事", "以礼待人"] },
  11: { name: "泰", judgment: "小往大来，吉，亨", meanings: ["通泰顺达", "否极泰来"] },
  12: { name: "否", judgment: "否之匪人，不利君子贞", meanings: ["闭塞不通", "暂且隐忍"] },
  13: { name: "同人", judgment: "同人于野，亨，利涉大川", meanings: ["志同道合", "团结协作"] },
  14: { name: "大有", judgment: "元亨", meanings: ["丰收盛大", "持盈保泰"] },
  15: { name: "谦", judgment: "亨，君子有终", meanings: ["谦虚受益", "低调行事"] },
  16: { name: "豫", judgment: "利建侯行师", meanings: ["安乐愉悦", "顺时而动"] },
  17: { name: "随", judgment: "元亨利贞，无咎", meanings: ["随机应变", "顺势而行"] },
  18: { name: "蛊", judgment: "元亨，利涉大川", meanings: ["整顿革新", "拨乱反正"] },
  19: { name: "临", judgment: "元亨利贞，至于八月有凶", meanings: ["居高临下", "把握时机"] },
  20: { name: "观", judgment: "盥而不荐，有孚颙若", meanings: ["审时度势", "观察入微"] },
  21: { name: "噬嗑", judgment: "亨，利用狱", meanings: ["明断是非", "排除阻碍"] },
  22: { name: "贲", judgment: "亨，小利有攸往", meanings: ["文饰外表", "质朴为本"] },
  23: { name: "剥", judgment: "不利有攸往", meanings: ["阴盛阳衰", "暂避锋芒"] },
  24: { name: "复", judgment: "亨，出入无疾，朋来无咎", meanings: ["一阳来复", "否极泰来"] },
  25: { name: "无妄", judgment: "元亨利贞", meanings: ["顺应天道", "勿存妄想"] },
  26: { name: "大畜", judgment: "利贞，不家食吉，利涉大川", meanings: ["积蓄力量", "厚积薄发"] },
  27: { name: "颐", judgment: "贞吉，观颐，自求口实", meanings: ["修身养性", "谨言慎行"] },
  28: { name: "大过", judgment: "栋桡，利有攸往，亨", meanings: ["非常之事", "大胆行动"] },
  29: { name: "坎", judgment: "习坎，有孚，维心亨", meanings: ["处险不惊", "以诚化难"] },
  30: { name: "离", judgment: "利贞，亨，畜牝牛吉", meanings: ["依附光明", "柔顺通达"] },
  31: { name: "咸", judgment: "亨，利贞，取女吉", meanings: ["感应相通", "以诚相待"] },
  32: { name: "恒", judgment: "亨，无咎，利贞", meanings: ["持之以恒", "守常不变"] },
  33: { name: "遯", judgment: "亨，小利贞", meanings: ["适时退避", "保全实力"] },
  34: { name: "大壮", judgment: "利贞", meanings: ["盛大刚强", "守正防过"] },
  35: { name: "晋", judgment: "康侯用锡马蕃庶，昼日三接", meanings: ["光明上进", "晋升顺利"] },
  36: { name: "明夷", judgment: "利艰贞", meanings: ["韬光养晦", "忍耐坚守"] },
  37: { name: "家人", judgment: "利女贞", meanings: ["治家有道", "各安其位"] },
  38: { name: "睽", judgment: "小事吉", meanings: ["意见相左", "求同存异"] },
  39: { name: "蹇", judgment: "利西南，不利东北，利见大人", meanings: ["前路艰难", "退守待时"] },
  40: { name: "解", judgment: "利西南，无所往，其来复吉", meanings: ["困难消散", "宜早行动"] },
  41: { name: "损", judgment: "有孚，元吉，无咎，可贞", meanings: ["减损得益", "以退为进"] },
  42: { name: "益", judgment: "利有攸往，利涉大川", meanings: ["增益发展", "大有可为"] },
  43: { name: "夬", judgment: "扬于王庭，孚号有厉", meanings: ["果断决裂", "刚决柔断"] },
  44: { name: "姤", judgment: "女壮，勿用取女", meanings: ["不期而遇", "慎防诱惑"] },
  45: { name: "萃", judgment: "亨，王假有庙，利见大人", meanings: ["荟萃聚集", "团聚有利"] },
  46: { name: "升", judgment: "元亨，用见大人，勿恤", meanings: ["积小成大", "稳步上升"] },
  47: { name: "困", judgment: "亨，贞，大人吉，无咎", meanings: ["困境求通", "坚守正道"] },
  48: { name: "井", judgment: "改邑不改井，无丧无得", meanings: ["养人济世", "守常不变"] },
  49: { name: "革", judgment: "己日乃孚，元亨利贞，悔亡", meanings: ["顺天革新", "除旧布新"] },
  50: { name: "鼎", judgment: "元吉，亨", meanings: ["稳重端正", "革故鼎新"] },
  51: { name: "震", judgment: "亨，震来虩虩，笑言哑哑", meanings: ["奋发振作", "居安思危"] },
  52: { name: "艮", judgment: "艮其背，不获其身，无咎", meanings: ["适可而止", "知止则安"] },
  53: { name: "渐", judgment: "女归吉，利贞", meanings: ["循序渐进", "不可急躁"] },
  54: { name: "归妹", judgment: "征凶，无攸利", meanings: ["有始无终", "安分守己"] },
  55: { name: "丰", judgment: "亨，王假之，勿忧，宜日中", meanings: ["丰盛光明", "盛极必衰"] },
  56: { name: "旅", judgment: "小亨，旅贞吉", meanings: ["漂泊在外", "谨慎寡言"] },
  57: { name: "巽", judgment: "小亨，利有攸往，利见大人", meanings: ["谦逊柔顺", "顺势而入"] },
  58: { name: "兑", judgment: "亨，利贞", meanings: ["喜悦和乐", "以诚待人"] },
  59: { name: "涣", judgment: "亨，王假有庙，利涉大川", meanings: ["涣散离析", "凝聚人心"] },
  60: { name: "节", judgment: "亨，苦节不可贞", meanings: ["适度节制", "过犹不及"] },
  61: { name: "中孚", judgment: "豚鱼吉，利涉大川，利贞", meanings: ["诚信感化", "信守承诺"] },
  62: { name: "小过", judgment: "亨，利贞，可小事，不可大事", meanings: ["小事可为", "不宜冒进"] },
  63: { name: "既济", judgment: "亨小利贞，初吉终乱", meanings: ["事情已成", "防止反复"] },
  64: { name: "未济", judgment: "亨，小狐汔济，濡其尾", meanings: ["尚未完成", "审慎前行"] },
};

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

const LINE_LABELS = {
  6: "老阴（变）",
  7: "少阳",
  8: "少阴",
  9: "老阳（变）",
};

export function lineFromCoins(coins) {
  if (!Array.isArray(coins) || coins.length !== 3) {
    throw new Error("lineFromCoins expects exactly three coin values.");
  }

  const total = coins.reduce((sum, coin) => {
    if (coin !== 2 && coin !== 3) {
      throw new Error("Coin values must be 2 or 3.");
    }
    return sum + coin;
  }, 0);

  if (total < 6 || total > 9) {
    throw new Error("Invalid coin total.");
  }

  return total;
}

export function randomCoins(random = Math.random) {
  return Array.from({ length: 3 }, () => (random() < 0.5 ? 3 : 2));
}

export function randomLine(random = Math.random) {
  return lineFromCoins(randomCoins(random));
}

export function patternFromLines(lines) {
  assertLines(lines);
  return lines.reduce((pattern, line, index) => {
    return line & 1 ? pattern | (1 << index) : pattern;
  }, 0);
}

export function transformChangingLines(lines) {
  assertLines(lines);
  return lines.map((line) => {
    if (line === 6) return 7;
    if (line === 9) return 8;
    return line;
  });
}

export function hasChangingLines(lines) {
  assertLines(lines);
  return lines.some((line) => line === 6 || line === 9);
}

export function deriveHexagram(lines) {
  const pattern = patternFromLines(lines);
  const index = KING_WEN_SEQUENCE[pattern];
  const hexagram = HEXAGRAMS[index];

  return {
    index,
    name: hexagram.name,
    fullName: fullHexagramName(index, pattern),
    judgment: hexagram.judgment,
    meanings: hexagram.meanings,
    pattern,
  };
}

export function changingLineNames(lines) {
  assertLines(lines);
  return lines
    .map((line, index) => (line === 6 || line === 9 ? LINE_NAMES[index] : null))
    .filter(Boolean);
}

export function lineLabel(line) {
  return LINE_LABELS[line];
}

export function buildAiPrompt(lines) {
  assertLines(lines, 6);

  const original = deriveHexagram(lines);
  const transformedLines = transformChangingLines(lines);
  const transformed = deriveHexagram(transformedLines);
  const movingLines = changingLineNames(lines);

  let prompt = "我用三枚铜钱起了一卦（六爻），请帮我解卦：\n\n";
  prompt += `本卦：第${original.index}卦 ${original.name}（${original.fullName}）\n`;
  prompt += `卦辞：${original.judgment}\n\n`;
  prompt += "六爻（从下往上）：\n";

  lines.forEach((line, index) => {
    const moving = line === 6 || line === 9 ? " → 动爻" : "";
    prompt += `${LINE_NAMES[index]}：${LINE_LABELS[line]}${moving}\n`;
  });

  if (movingLines.length > 0) {
    prompt += `\n之卦：第${transformed.index}卦 ${transformed.name}（${transformed.fullName}）\n`;
    prompt += `动爻位置：${movingLines.join("、")}\n`;
  }

  prompt += `\n请结合本卦卦辞、爻位、动爻含义${movingLines.length > 0 ? "及之卦" : ""}来综合解读。`;

  return prompt;
}

function fullHexagramName(index, pattern) {
  const lower = TRIGRAMS[pattern & 7];
  const upper = TRIGRAMS[(pattern >> 3) & 7];
  const hexagram = HEXAGRAMS[index];

  return lower === upper
    ? `${lower[0]}为${lower[1]}`
    : `${upper[1]}${lower[1]}${hexagram.name}`;
}

function assertLines(lines, exactLength) {
  if (!Array.isArray(lines)) {
    throw new Error("Lines must be an array.");
  }

  if (exactLength && lines.length !== exactLength) {
    throw new Error(`Expected ${exactLength} lines.`);
  }

  lines.forEach((line) => {
    if (![6, 7, 8, 9].includes(line)) {
      throw new Error("Line values must be 6, 7, 8, or 9.");
    }
  });
}
