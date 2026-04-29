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
    categoryId: CategoryId;
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
                src: "/quiz/library/concert-crowd-001-a.webp",
                alt: { en: "Concert option A", zh: "演唱会选项 A" },
                palette: "rose"
            },
            b: {
                key: "b",
                src: "/quiz/library/concert-crowd-001-b.webp",
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
                src: "/quiz/library/city-street-window-001.webp",
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
                src: "/quiz/library/street-snack-001.webp",
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
        },
        {
            id: "y2k-ccd-me-and-doraemon-001",
            mode: "single",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "Me and doraemon", zh: "我和蓝胖子" },
            image: {
                src: "/quiz/library/002.webp",
                alt: { en: "Me and doraemon", zh: "我和蓝胖子" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: { en: "The overall look is very similar to a CCD flash snapshot, but the lighting and details are too “clean and uniform,” lacking the random noise and color shifts commonly found in authentic vintage cameras.", zh: "整体观感很像CCD直闪快照，但光影与细节过于“干净统一”，缺少真实老相机常见的随机噪点和色偏波动。\n" },
            llmExplanation: { en: "The photos feature natural film grain and color shifts; the lighting and perspective of the people and models are perfectly aligned, and the background elements show none of the text distortions or logical inconsistencies commonly found in AI-generated images.", zh: "照片具备自然的胶片颗粒与色彩偏差，人物与模型的光影、透视关系完全匹配，背景元素也无 AI 生成常见的文字错乱、逻辑矛盾等问题。" }
        },
        {
            id: "y2k-ccd-me-and-cinnamoroll-001",
            mode: "single",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "Me and Cinnamoroll", zh: "我和大耳狗" },
            image: {
                src: "/quiz/library/y2k-ccd-me-and-cinnamoroll-001.webp",
                alt: { en: "Me and Cinnamoroll", zh: "我和大耳狗" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "The image looks too “smooth and polished”; everything from skin texture to lighting and noise appears to have been meticulously adjusted, lacking the rough, unpredictable quality of a real CCD sensor.", zh: "画面太“均匀讨好”，从肤质到灯光噪点都像被精心调过，缺少真实CCD那种随机翻车的粗糙感。" },
            llmExplanation: { en: "The character's hands exhibit obvious morphological distortions and fused fingers—typical defects found in AI-generated images. The details of the background objects are blurry and chaotic, and the overall lighting and textures have an unnatural, artificial look.", zh: "人物手部存在明显的形态扭曲、手指融合等典型 AI 生成缺陷，背景设备细节模糊混乱，且整体光影与质感存在不自然的模拟感." }
        },
        {
            id: "y2k-ccd-chinese-street-001",
            mode: "single",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "Chinese Street", zh: "中国街景" },
            image: {
                src: "/quiz/library/y2k-ccd-chinese-street-001.webp",
                alt: { en: "Chinese Street", zh: "中国街景" },
                palette: "warm"
            },
            aiAnswer: false,
            llmAnswer: "real",
            explanation: { en: "", zh: "" },
            llmExplanation: { en: "Authentic vintage photographs capturing street scenes in Wuhan from the 2000s.", zh: "真实拍摄的 2000 年代武汉街景纪实老照片。" }
        },
        {
            id: "y2k-ccd-chinese-street-002",
            mode: "single",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "Chinese Street", zh: "中国街景" },
            image: {
                src: "/quiz/library/y2k-ccd-chinese-street-002.webp",
                alt: { en: "Chinese Street", zh: "中国街景" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: { en: "", zh: "" },
            llmExplanation: { en: "The shooting date “7 24 '00” in the bottom right corner, along with iconic landmarks such as the Cathay Cinema and the Shanghai Customs Building, as well as the 2000s-era cars, street signs, and pedestrians’ attire, all align with the urban landscape of Shanghai at that time. The lighting, perspective, and attention to detail are natural, with none of the typical flaws associated with AI-generated imagery.", zh: "右下角带有 “7 24 '00” 的拍摄日期，画面里的国泰电影院、上海海关大楼等标志性场景，以及 2000 年代的车型、街景招牌和行人穿搭，均与当时的上海城市风貌吻合，光影、透视与细节逻辑自然，无 AI 生成的典型瑕疵" }
        },
        {
            id: "y2k-ccd-chinese-street-003",
            mode: "pair",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "Chinese Street", zh: "中国街景" },
            a: {
                key: "a",
                src: "/quiz/library/y2k-ccd-chinese-street-003-a.webp",
                alt: { en: "Chinese Street A", zh: "中国街景 A" },
                palette: "warm"
            },
            b: {
                key: "b",
                src: "/quiz/library/y2k-ccd-chinese-street-003-b.webp",
                alt: { en: "Chinese Street B", zh: "中国街景 B" },
                palette: "cool"
            },
            aiAnswer: "b",
            llmAnswer: "a",
            explanation: { en: "The details of the era are “too uniform and pristine,” resembling retro memories curated by an algorithm rather than the slightly chaotic and serendipitous street scenes of the real world.", zh: "时代细节“过于统一且干净”，像是被算法整理过的复古记忆，而不是真实世界里那种略带混乱与偶然性的街景。" },
            llmExplanation: { en: "Taken by photographer Demuri Riyu in 1983, these photographs serve as authentic documentary images of the streetscape of Shanghai’s Nanjing East Road at that time, as the photographer, date, location, and details such as the architecture, traffic, and signage are all supported by reliable historical evidence.", zh: "由摄影师出目里利吕井 1983 年拍摄的照片，因拍摄者、时间、地点及建筑、交通、招牌等细节均有可靠历史佐证，是记录当时上海南京东路街景的真实纪实影像。" }
        },
        {
            id: "moon-landing-photos-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Moon landing photos", zh: "登月照片" },
            image: {
                src: "/quiz/library/moon-landing-photos-001.webp",
                alt: { en: "Moon landing photos", zh: "登月照片" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "There’s no need to say more, right?", zh: "不用多说了吧。" },
            llmExplanation: { en: "It is a conceptual rendering released by China's lunar exploration program for future manned moon missions before 2030 (though the judgment is actually incorrect).", zh: "是中国探月工程发布的、对未来 2030 年前载人登月任务的概念渲染效果图（其实判断的也不对）" }
        },
        {
            id: "the-kitten-eats-hot-pot-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "The kitten eats hot pot", zh: "小猫吃火锅" },
            image: {
                src: "/quiz/library/the-kitten-eats-hot-pot-001.webp",
                alt: { en: "The kitten eats hot pot", zh: "小猫吃火锅" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "There’s no need to say more, right?", zh: "不用多说了吧。" },
            llmExplanation: { en: "An AI-generated creative composite image, not a real photograph.", zh: "一张 AI 生成的创意合成图，并非真实拍摄的照片。" }
        },
        {
            id: "meituan-food-delivery-rider-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Meituan food delivery rider", zh: "美团外卖员" },
            image: {
                src: "/quiz/library/meituan-food-delivery-rider-001.webp",
                alt: { en: "Meituan food delivery rider", zh: "美团外卖员" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "Horses moving through the slippery city traffic lack the expected splashes, hoofprints, and real interactive reactions with the surrounding people and vehicles, giving the entire scene a sense of 'physically present but socially absent' dissonance.", zh: "马匹在湿滑城市车流中行进却缺乏应有的溅水、蹄印与周围人车的真实互动反应，使整个场景呈现出一种“物理存在但社会不存在”的违和感。" },
            llmExplanation: { en: "Horses are prohibited on urban roads in reality: In our country, animal-drawn vehicles and horses are strictly forbidden on city motor vehicle roads. This kind of scene itself does not comply with traffic regulations and common sense.  \nObvious signs of composition: The lighting and perspective of the rider and horse in relation to the background show unnatural splicing; the rider's posture and the horse's movements have low integration with the rainy traffic.  \nContradictory background information: The 'Zhejiang Tailong Commercial Bank' appearing in the image is a bank in Taizhou, while the license plate 'Zhe B' belongs to Ningbo. This mismatch further supports that the picture was composited.", zh: "现实中城市道路禁止骑马通行：我国城市机动车道路严禁畜力、马匹通行，这种场景本身就不符合交通法规和常识。\n明显的合成痕迹：骑手、马匹与背景的光影、透视存在不自然的拼接感，骑手的姿态和马匹的动作与雨天车流的融合度较低。\n背景信息矛盾：图中出现的 “浙江泰隆商业银行” 是台州的银行，而车牌 “浙 B” 属于宁波，这种混搭也侧面印证了图片是拼接制作的。" }
        },
        {
            id: "cosplayer-pictures-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Cosplayer pictures", zh: "Coser图片" },
            image: {
                src: "/quiz/library/cosplayer-pictures-001.webp",
                alt: { en: "Cosplayer pictures", zh: "Coser图片" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: { en: "The character is too 'camera-centered' and the skin details are unusually clean, making it look like a subject rendered separately and pasted onto the scene in the complex lighting and crowd environment of a convention.", zh: "人物过于“镜头中心化”和皮肤细节异常干净，在复杂漫展光源与人流环境中显得像被单独渲染贴上去的主体。" },
            llmExplanation: { en: "It is a real-life cosplay photo of Rem at a comic convention.", zh: "是一张漫展上的真人雷姆 cosplay 实拍图。" }
        },
        {
            id: "coser-six-grid-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Coser Six-Grid", zh: "Coser六宫格" },
            image: {
                src: "/quiz/library/coser-six-grid-001.webp",
                alt: { en: "Coser Six-Grid", zh: "Coser六宫格" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "The character is too 'camera-centered' and the skin details are unusually clean, making it look like a subject rendered separately and pasted onto the scene in the complex lighting and crowd environment of a convention.", zh: "人物过于“镜头中心化”和皮肤细节异常干净，在复杂漫展光源与人流环境中显得像被单独渲染贴上去的主体。" },
            llmExplanation: { en: "AI-generated creative cosplay composite image, not a real photographed photo.", zh: "AI 生成的创意 cosplay 合成图，并非真实拍摄的照片。" }
        },
        {
            id: "coser-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Coser", zh: "Coser" },
            image: {
                src: "/quiz/library/coser-001.webp",
                alt: { en: "Coser", zh: "Coser" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "The main character is too 'perfectly focused and flawless,' presenting studio-level lighting and skin texture even in the noisy convention environment, which is very difficult for a real camera to achieve with such clean separation.", zh: "人物主体过于“完美对焦且无瑕疵”，在嘈杂漫展环境中仍呈现棚拍级光影与皮肤质感，真实相机很难同时做到这种干净分离感。" },
            llmExplanation: { en: "AI-generated fake images, not real photos of cosplay at conventions", zh: "AI 生成的假图，并非真实拍摄的漫展 cosplay 照片。" }
        },
        {
            id: "baji-sharing-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "BaJi Sharing", zh: "吧唧分享" },
            image: {
                src: "/quiz/library/baji-sharing-001.webp",
                alt: { en: "Coser", zh: "Coser" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "ai",
            explanation: { en: "Multiple people are photographed up close, yet everyone is clear with no motion blur, and the lighting is even as if shot in a soft light studio; this is almost impossible to achieve simultaneously at a crowded, dynamic convention scene.", zh: "多人近距离围拍却人人清晰无运动模糊、光线均匀到像柔光棚拍，这在拥挤动态的漫展现场几乎不可能同时成立。" },
            llmExplanation: { en: "The hands of the characters in the image have obvious deformities, abnormal numbers of fingers, distorted structures, and other typical AI-generated defects, and the overall lighting and details also have an unnatural sense of incongruity.", zh: "画面中人物的手部存在明显畸形、手指数量异常、结构扭曲等 AI 生成的典型缺陷，且整体光影和细节也存在不自然的违和感。" }
        },
        {
            id: "assassin-s-creed-odyssey-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Assassin's Creed Odyssey", zh: "刺客信条奥德赛" },
            image: {
                src: "/quiz/library/assassin-s-creed-odyssey-001.webp",
                alt: { en: "Assassin's Creed Odyssey", zh: "刺客信条奥德赛" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: { en: "The perspective and layering of the UI elements are inconsistent with the ambient lighting and shadows, as if they were overlaid in post-production onto an 'overly realistic' scene, lacking a unified rendering logic.", zh: "UI元素与环境光影的透视和分层不一致，像是后期叠加在“过于真实”的场景上，缺乏统一渲染逻辑。" },
            llmExplanation: { en: "This is a real in-game screenshot of 'Assassin's Creed: Odyssey,' not AI-generated. The UI, Corfu Island scene, Poseidon statue, and main character model all perfectly match the original game content.", zh: "是《刺客信条：奥德赛》的真实游戏截图，并非 AI 生成，界面 UI、科孚岛场景、波塞冬雕像与主角模型均与游戏原作内容完全吻合。" }
        },
        {
            id: "genshin-impact-001",
            mode: "single",
            categoryId: "all",
            category: { en: "Mixed pool", zh: "混合题池" },
            title: { en: "Genshin Impact", zh: "原神" },
            image: {
                src: "/quiz/library/genshin-impact-001.webp",
                alt: { en: "Genshin Impact", zh: "原神" },
                palette: "warm"
            },
            aiAnswer: true,
            llmAnswer: "real",
            explanation: { en: "Although the image simulates a game screenshot, the HUD text and icons are too sharp and disconnected from the scene's depth of field and lighting, as if an interface layer was added in post-production.", zh: "画面虽模拟游戏截图，但HUD文字与图标过于锐利且与场景景深、光照脱节，像是后期平贴上去的界面层。" },
            llmExplanation: { en: "This is a real screenshot from Genshin Impact; the interface UI, scenes, and characters completely match the original game content, with no AI-generated flaws.", zh: "是《原神》的真实游戏截图，界面 UI、场景、角色与游戏原作内容完全吻合，无 AI 生成的缺陷。" }
        }
    ]
};
