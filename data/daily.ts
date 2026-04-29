import type { LocalizedText } from "@/lib/i18n";

export type CategoryId =
    | "all"
    | "y2k-ccd"
    | "childhood"
    | "dorm-life"
    | "concert"
    | "ita-bag"
    | "photo-booth"
    | "local-food"
    | "minsu"
    | "kpop-fanmeet"
    | "wedding"
    | "esports"
    | "museum"
    | "street-fashion"
    | "temple-fair"
    | "graduation"
    | "pet-cafe"
    | "auto-show";

export type PairChoiceKey = "a" | "b";
export type SingleChoiceKey = "ai" | "real";
export type ChoiceKey = PairChoiceKey | SingleChoiceKey;

export type ImagePalette = "warm" | "cool" | "neutral" | "green" | "rose";

export type ImageChoice = {
    key: PairChoiceKey;
    src?: string;
    alt: LocalizedText;
    palette: ImagePalette;
};

export type BaseQuestion = {
    id: string;
    categoryId: Exclude<CategoryId, "all">;
    category: LocalizedText;
    title: LocalizedText;
    explanation: LocalizedText;
    llmExplanation: LocalizedText;
};

export type PairQuestion = BaseQuestion & {
    mode: "pair";
    a: ImageChoice;
    b: ImageChoice;
    aiAnswer: PairChoiceKey;
    llmAnswer: PairChoiceKey;
};

export type SingleQuestion = BaseQuestion & {
    mode: "single";
    image: Omit<ImageChoice, "key">;
    aiAnswer: boolean;
    llmAnswer: SingleChoiceKey;
};

export type Question = PairQuestion | SingleQuestion;

export type DailyChallenge = {
    day: string;
    title: LocalizedText;
    opponentPool: string[];
    questions: Question[];
};

export type CategoryDefinition = {
    id: CategoryId;
    label: LocalizedText;
    tagline: LocalizedText;
    accent: ImagePalette;
    locked?: "soon" | "pro";
    unlockHint?: LocalizedText;
};

export const categoryDeck: CategoryDefinition[] = [
    {
        id: "all",
        label: { en: "All scenes", zh: "全部场景" },
        tagline: {
            en: "A mixed run across the images young people now trust, share, and repost.",
            zh: "混合挑战年轻人最容易相信、转发和截图保存的图片。"
        },
        accent: "neutral"
    },
    {
        id: "y2k-ccd",
        label: { en: "Y2K CCD", zh: "千禧年CCD" },
        tagline: {
            en: "Flash, grain, timestamps, and the kind of blur that makes a fake feel found.",
            zh: "闪光灯、颗粒、时间戳和CCD糊感，最容易让假图看起来像翻出来的旧照片。"
        },
        accent: "cool"
    },
    {
        id: "childhood",
        label: { en: "Childhood", zh: "童年旧照" },
        tagline: {
            en: "Playgrounds, school gates, and birthday photos where memory fills in the gaps.",
            zh: "操场、校门和生日照，人会自动用记忆补全破绽。"
        },
        accent: "warm"
    },
    {
        id: "dorm-life",
        label: { en: "Dorm life", zh: "宿舍生活" },
        tagline: {
            en: "Beds, desks, takeout bags, and the messy details students know too well.",
            zh: "床帘、书桌、外卖袋和小物件，学生党一眼就有代入感。"
        },
        accent: "neutral"
    },
    {
        id: "concert",
        label: { en: "Concerts", zh: "演唱会现场" },
        tagline: {
            en: "Stage lights, phone screens, and blurry crowds that make verification hard.",
            zh: "舞台灯光、手机屏幕和远距离糊图，最适合挑战眼睛。"
        },
        accent: "rose"
    },
    {
        id: "ita-bag",
        label: { en: "Ita bags", zh: "谷子痛包" },
        tagline: {
            en: "Badges, stickers, standees, and tiny printed details that AI loves to distort.",
            zh: "吧唧、立牌、贴纸和小字细节，AI 很容易在复杂重复物上露馅。"
        },
        accent: "rose"
    },
    {
        id: "photo-booth",
        label: { en: "City streets", zh: "城市街景" },
        tagline: {
            en: "Crosswalks, storefronts, traffic, and reflections layered into scenes that AI can fake too smoothly.",
            zh: "路口、店招、车流和玻璃反光叠在一起时，AI 很容易把街景做得过于顺滑。"
        },
        accent: "warm"
    },
    {
        id: "local-food",
        label: { en: "Food reviews", zh: "探店美食" },
        tagline: {
            en: "Restaurant dishes, queues, and table shots made for social recommendations.",
            zh: "餐厅菜品、排队场面和桌面图，最适合制造“这家很火”的感觉。"
        },
        accent: "warm"
    },
    {
        id: "minsu",
        label: { en: "Minsu stays", zh: "民宿酒店" },
        tagline: {
            en: "Rooms and windows that sell a weekend before anyone arrives.",
            zh: "一个房间、一扇窗，就能让人相信这个周末值得出发。"
        },
        accent: "green"
    },
    {
        id: "kpop-fanmeet",
        label: { en: "K-pop fanmeet", zh: "K-pop 粉丝见面会" },
        tagline: {
            en: "Signing lines, flash photos, and fan-cam moments under idol-booth lighting.",
            zh: "签售、闪光合影与饭拍瞬间，全在偶像打光下发生。"
        },
        accent: "rose",
        locked: "soon",
        unlockHint: { en: "Unlocks this week.", zh: "本周解锁。" }
    },
    {
        id: "wedding",
        label: { en: "Wedding album", zh: "婚礼现场" },
        tagline: {
            en: "Bridal portraits, banquet tables, and soft bokeh that already looks retouched.",
            zh: "新娘写真、婚宴桌花、柔焦氛围，本身就像精修过。"
        },
        accent: "warm",
        locked: "soon",
        unlockHint: { en: "Unlocks this week.", zh: "本周解锁。" }
    },
    {
        id: "esports",
        label: { en: "E-sports arena", zh: "电竞赛场" },
        tagline: {
            en: "LED walls, team jerseys, and arena crowds shot from the press pit.",
            zh: "LED 屏、战队队服、媒体席角度的现场观众。"
        },
        accent: "cool",
        locked: "soon",
        unlockHint: { en: "Unlocks next week.", zh: "下周解锁。" }
    },
    {
        id: "museum",
        label: { en: "Museum exhibits", zh: "博物馆展厅" },
        tagline: {
            en: "Glass cases, spotlit artifacts, and wall labels with tricky tiny text.",
            zh: "展柜、射灯下的展品和墙上的小字说明。"
        },
        accent: "neutral",
        locked: "pro"
    },
    {
        id: "street-fashion",
        label: { en: "Street fashion", zh: "街头时装" },
        tagline: {
            en: "Outfit-of-the-day snaps that always feel one filter away from a campaign.",
            zh: "OOTD 街拍，离广告大片永远只差一层滤镜。"
        },
        accent: "rose",
        locked: "pro"
    },
    {
        id: "temple-fair",
        label: { en: "Temple fair", zh: "庙会赶集" },
        tagline: {
            en: "Red lanterns, sugar-painting vendors, and crowded narrow alleys.",
            zh: "红灯笼、糖画摊和拥挤窄巷的人间烟火气。"
        },
        accent: "warm",
        locked: "pro"
    },
    {
        id: "graduation",
        label: { en: "Graduation day", zh: "毕业典礼" },
        tagline: {
            en: "Gowns, diplomas, and sunlit lawns shot on a borrowed camera.",
            zh: "学士袍、毕业证和阳光草坪，临时借来的相机拍摄。"
        },
        accent: "green",
        locked: "pro"
    },
    {
        id: "pet-cafe",
        label: { en: "Pet cafe", zh: "撸猫咖啡馆" },
        tagline: {
            en: "Blurry cats, latte art, and Instagram-ready window seats.",
            zh: "动态糊掉的猫、拉花和最上相的窗边座位。"
        },
        accent: "warm",
        locked: "pro"
    },
    {
        id: "auto-show",
        label: { en: "Auto show", zh: "车展现场" },
        tagline: {
            en: "Glossy paint, turntables, and model poses under cold showroom light.",
            zh: "亮漆车身、旋转展台，以及冷色展厅下的模特 pose。"
        },
        accent: "cool",
        locked: "pro"
    }
];

export const dailyChallenge: DailyChallenge = {
    day: "2026-04-28",
    title: {
        en: "China Launch Set",
        zh: "国内传播题库"
    },
    opponentPool: [
        "Claude Sonnet 4.6",
        "Gemini 3.1 Pro",
        "Grok 4",
        "豆包"
    ],
    questions: [
        {
            id: "concert-crowd-001",
            mode: "pair",
            categoryId: "concert",
            category: { en: "Concerts", zh: "演唱会现场" },
            title: { en: "Phone-shot concert crowd", zh: "手机拍的演唱会现场" },
            a: {
                key: "a",
                src: "/quiz/concert/concert-crowd-001-a.webp",
                alt: { en: "Concert option A", zh: "演唱会选项 A" },
                palette: "rose"
            },
            b: {
                key: "b",
                src: "/quiz/concert/concert-crowd-001-b.webp",
                alt: { en: "Concert option B", zh: "演唱会选项 B" },
                palette: "cool"
            },
            aiAnswer: "a",
            llmAnswer: "b",
            explanation: {
                en: "It noticed that the stage brand, crowd distribution, lighting, and background city details are all too uniform.",
                zh: "它在舞台品牌露出、人群分布、灯光烟雾、手机拍摄行为以及背景城市细节上都呈现出一种过于均匀和克制的“理想化结构”，缺少真实音乐节那种不可控的混乱、噪声与偶然性，从而在细节层面暴露出“被生成过”的痕迹"
            },
            llmExplanation: {
                en: "It also noticed that several phone screens repeat nearly the same stage outline despite clearly different viewing angles, so it correctly chose A.",
                zh: "它认为这是2023 年草莓音乐节的现场图片，同时背景的城市天际线和黄昏天色，也符合户外音乐节傍晚演出的真实场景，所以错误判断 B 是 AI。"
            }
        },
        {
            id: "city-street-window-001",
            mode: "single",
            categoryId: "photo-booth",
            category: { en: "City streets", zh: "城市街景" },
            title: { en: "City street after rain", zh: "雨后的街景" },
            image: {
                src: "/quiz/city-street/city-street-window-001.webp",
                alt: { en: "City street after rain", zh: "雨后的街景" },
                palette: "warm"
            },
            aiAnswer: false,
            llmAnswer: "ai",
            explanation: {
                en: "The wet pavement glow and uneven reflections are all plausible in a real street photo.",
                zh: "地面积水反光和不均匀倒影都很像真实街拍里会出现的状态。"
            },
            llmExplanation: {
                en: "It felt the rain reflections and overall lighting looked a bit too polished, so it called the image AI-generated, but that instinct was off this time.",
                zh: "它觉得雨后反光和整体光线有点过于规整，所以判断成了 AI 图，但这次这个直觉偏了。"
            }
        },
        {
            id: "street-snack-001",
            mode: "single",
            categoryId: "local-food",
            category: { en: "Food reviews", zh: "探店美食" },
            title: { en: "Night market snack stall", zh: "夜市小吃摊随手拍" },
            image: {
                src: "/quiz/local-food/street-snack-001.webp",
                alt: { en: "Night market snack stall", zh: "夜市小吃摊照片" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: {
                en: "The billboard is too neat, unlike the real scene.",
                zh: "摊子上的字过于整齐，反而不像真实现场。"
            },
            llmExplanation: {
                en: "It read the night-market clutter and mixed lighting as natural street-life detail, so it called the image real, but that realism was faked.",
                zh: "它把夜市摊位的杂乱感和混合光线当成了真实生活痕迹，所以判断成真实照片，但这份真实感其实是伪装出来的。"
            }
        }
    ]
};
