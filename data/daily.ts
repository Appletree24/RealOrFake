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
};

export type PairQuestion = BaseQuestion & {
    mode: "pair";
    a: ImageChoice;
    b: ImageChoice;
    aiAnswer: PairChoiceKey;
};

export type SingleQuestion = BaseQuestion & {
    mode: "single";
    image: Omit<ImageChoice, "key">;
    aiAnswer: boolean;
};

export type Question = PairQuestion | SingleQuestion;

export type DailyChallenge = {
    day: string;
    title: LocalizedText;
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
    day: "2026-04-27",
    title: {
        en: "China Launch Set",
        zh: "国内传播题库"
    },
    questions: [
        {
            id: "y2k-karaoke-001",
            mode: "pair",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "KTV snapshot with timestamp", zh: "带时间戳的KTV旧照" },
            a: {
                key: "a",
                src: "/quiz/y2k-ccd/y2k-karaoke-001-a.jpg",
                alt: { en: "KTV option A", zh: "KTV选项 A" },
                palette: "cool"
            },
            b: {
                key: "b",
                src: "/quiz/y2k-ccd/y2k-karaoke-001-b.jpg",
                alt: { en: "KTV option B", zh: "KTV选项 B" },
                palette: "rose"
            },
            aiAnswer: "a",
            explanation: {
                en: "The timestamp glow is too sharp while the faces and table edge are heavily blurred.",
                zh: "时间戳边缘过于锐利，但人脸和桌沿却糊得很重。"
            }
        },
        {
            id: "y2k-mirror-001",
            mode: "single",
            categoryId: "y2k-ccd",
            category: { en: "Y2K CCD", zh: "千禧年CCD" },
            title: { en: "CCD mirror selfie in a mall restroom", zh: "商场洗手间CCD镜自拍" },
            image: {
                src: "/quiz/y2k-ccd/y2k-mirror-001.jpg",
                alt: { en: "Y2K mirror selfie", zh: "千禧年镜自拍" },
                palette: "cool"
            },
            aiAnswer: true,
            explanation: {
                en: "The flash reflection is clean, but the phone edge and mirror stains do not line up.",
                zh: "闪光灯反射很干净，但手机边缘和镜面污渍对不上。"
            }
        },
        {
            id: "childhood-playground-001",
            mode: "pair",
            categoryId: "childhood",
            category: { en: "Childhood", zh: "童年旧照" },
            title: { en: "Primary school playground photo", zh: "小学操场旧照片" },
            a: {
                key: "a",
                src: "/quiz/childhood/childhood-playground-001-a.jpg",
                alt: { en: "Playground option A", zh: "操场选项 A" },
                palette: "green"
            },
            b: {
                key: "b",
                src: "/quiz/childhood/childhood-playground-001-b.jpg",
                alt: { en: "Playground option B", zh: "操场选项 B" },
                palette: "warm"
            },
            aiAnswer: "b",
            explanation: {
                en: "The school fence repeats and one child's sleeve blends into the slide.",
                zh: "学校围栏出现重复，一个孩子的袖口也和滑梯粘在一起。"
            }
        },
        {
            id: "childhood-birthday-001",
            mode: "single",
            categoryId: "childhood",
            category: { en: "Childhood", zh: "童年旧照" },
            title: { en: "Birthday cake at home, early 2000s", zh: "千禧年前后的家里生日照" },
            image: {
                src: "/quiz/childhood/childhood-birthday-001.jpg",
                alt: { en: "Childhood birthday photo", zh: "童年生日照片" },
                palette: "warm"
            },
            aiAnswer: false,
            explanation: {
                en: "The uneven flash, awkward crop, and messy table feel like a real family snapshot.",
                zh: "闪光不均、裁切别扭、桌面杂乱，更像真实家庭快照。"
            }
        },
        {
            id: "dorm-desk-001",
            mode: "pair",
            categoryId: "dorm-life",
            category: { en: "Dorm life", zh: "宿舍生活" },
            title: { en: "Late-night dorm desk", zh: "深夜宿舍书桌" },
            a: {
                key: "a",
                src: "/quiz/dorm-life/dorm-desk-001-a.jpg",
                alt: { en: "Dorm desk option A", zh: "宿舍书桌选项 A" },
                palette: "neutral"
            },
            b: {
                key: "b",
                src: "/quiz/dorm-life/dorm-desk-001-b.jpg",
                alt: { en: "Dorm desk option B", zh: "宿舍书桌选项 B" },
                palette: "cool"
            },
            aiAnswer: "b",
            explanation: {
                en: "The keyboard rows bend near the cup, and one charging cable has no visible end.",
                zh: "杯子旁边的键盘行发生弯曲，一根充电线也没有明确的末端。"
            }
        },
        {
            id: "dorm-bunk-001",
            mode: "single",
            categoryId: "dorm-life",
            category: { en: "Dorm life", zh: "宿舍生活" },
            title: { en: "Bunk bed with curtains and takeout bags", zh: "床帘和外卖袋旁的宿舍床位" },
            image: {
                src: "/quiz/dorm-life/dorm-bunk-001.jpg",
                alt: { en: "Dorm bunk bed", zh: "宿舍床位照片" },
                palette: "neutral"
            },
            aiAnswer: false,
            explanation: {
                en: "The clutter, wrinkles, and uneven light feel naturally lived-in.",
                zh: "杂物、褶皱和不均匀光线都更像真实住过的空间。"
            }
        },
        {
            id: "concert-crowd-001",
            mode: "pair",
            categoryId: "concert",
            category: { en: "Concerts", zh: "演唱会现场" },
            title: { en: "Phone-shot concert crowd", zh: "手机拍的演唱会人群" },
            a: {
                key: "a",
                src: "/quiz/concert/concert-crowd-001-a.png",
                alt: { en: "Concert option A", zh: "演唱会选项 A" },
                palette: "rose"
            },
            b: {
                key: "b",
                src: "/quiz/concert/concert-crowd-001-b.jpg",
                alt: { en: "Concert option B", zh: "演唱会选项 B" },
                palette: "cool"
            },
            aiAnswer: "a",
            explanation: {
                en: "Several phone screens show the same stage shape with different viewing angles.",
                zh: "几块手机屏幕里舞台形状相同，但拍摄角度却不一致。"
            }
        },
        {
            id: "concert-stage-001",
            mode: "single",
            categoryId: "concert",
            category: { en: "Concerts", zh: "演唱会现场" },
            title: { en: "Distant stage with heavy zoom", zh: "远距离放大的舞台照" },
            image: {
                src: "/quiz/concert/concert-stage-001.jpg",
                alt: { en: "Distant concert stage", zh: "远距离演唱会舞台照" },
                palette: "rose"
            },
            aiAnswer: true,
            explanation: {
                en: "The light beams cross cleanly, but the crowd silhouettes repeat in clusters.",
                zh: "灯束交叉得很干净，但观众剪影成组重复。"
            }
        },
        {
            id: "ita-bag-badges-001",
            mode: "pair",
            categoryId: "ita-bag",
            category: { en: "Ita bags", zh: "谷子痛包" },
            title: { en: "Badge-covered ita bag on a cafe chair", zh: "咖啡馆椅子上的谷子痛包" },
            a: {
                key: "a",
                src: "/quiz/ita-bag/ita-bag-badges-001-a.jpg",
                alt: { en: "Ita bag option A", zh: "痛包选项 A" },
                palette: "rose"
            },
            b: {
                key: "b",
                src: "/quiz/ita-bag/ita-bag-badges-001-b.jpg",
                alt: { en: "Ita bag option B", zh: "痛包选项 B" },
                palette: "neutral"
            },
            aiAnswer: "b",
            explanation: {
                en: "Badge faces repeat with tiny expression changes, and some pin edges melt into fabric.",
                zh: "吧唧人物脸重复但表情细节微变，几个别针边缘也融进布料里。"
            }
        },
        {
            id: "ita-bag-standees-001",
            mode: "single",
            categoryId: "ita-bag",
            category: { en: "Ita bags", zh: "谷子痛包" },
            title: { en: "Acrylic standees and stickers on a desk", zh: "书桌上的亚克力立牌和贴纸" },
            image: {
                src: "/quiz/ita-bag/ita-bag-standees-001.jpg",
                alt: { en: "Acrylic standees and stickers", zh: "亚克力立牌和贴纸" },
                palette: "cool"
            },
            aiAnswer: true,
            explanation: {
                en: "The tiny character eyes and printed text become inconsistent across repeated items.",
                zh: "重复小物里的角色眼睛和印刷小字不稳定。"
            }
        },
        {
            id: "city-street-crosswalk-001",
            mode: "pair",
            categoryId: "photo-booth",
            category: { en: "City streets", zh: "城市街景" },
            title: { en: "Crosswalk at dusk with dense traffic", zh: "傍晚车流很密的城市路口" },
            a: {
                key: "a",
                src: "/quiz/city-street/city-street-crosswalk-001-a.jpg",
                alt: { en: "City street option A", zh: "城市街景选项 A" },
                palette: "warm"
            },
            b: {
                key: "b",
                src: "/quiz/city-street/city-street-crosswalk-001-b.jpg",
                alt: { en: "City street option B", zh: "城市街景选项 B" },
                palette: "rose"
            },
            aiAnswer: "a",
            explanation: {
                en: "The lane markings and car contours drift slightly, even though the camera position barely moves.",
                zh: "镜头机位几乎没变，但车身轮廓和地面线条有轻微漂移。"
            }
        },
        {
            id: "city-street-window-001",
            mode: "single",
            categoryId: "photo-booth",
            category: { en: "City streets", zh: "城市街景" },
            title: { en: "Storefront street shot after rain", zh: "雨后带橱窗反光的街景" },
            image: {
                src: "/quiz/city-street/city-street-window-001.jpg",
                alt: { en: "Storefront city street", zh: "带橱窗的城市街景" },
                palette: "warm"
            },
            aiAnswer: false,
            explanation: {
                en: "The wet pavement glow, mixed signage, and uneven reflections are all plausible in a real street photo.",
                zh: "地面积水反光、杂乱店招和不均匀倒影都很像真实街拍里会出现的状态。"
            }
        },
        {
            id: "hotpot-table-001",
            mode: "pair",
            categoryId: "local-food",
            category: { en: "Food reviews", zh: "探店美食" },
            title: { en: "Hotpot table under warm light", zh: "暖光下的火锅探店图" },
            a: {
                key: "a",
                src: "/quiz/local-food/hotpot-table-001-a.jpg",
                alt: { en: "Hotpot option A", zh: "火锅选项 A" },
                palette: "warm"
            },
            b: {
                key: "b",
                src: "/quiz/local-food/hotpot-table-001-b.jpg",
                alt: { en: "Hotpot option B", zh: "火锅选项 B" },
                palette: "rose"
            },
            aiAnswer: "b",
            explanation: {
                en: "The steam shape repeats and the chopstick shadows do not match the overhead light.",
                zh: "雾气形状重复，筷子的阴影也和顶灯方向对不上。"
            }
        },
        {
            id: "street-snack-001",
            mode: "single",
            categoryId: "local-food",
            category: { en: "Food reviews", zh: "探店美食" },
            title: { en: "Night market snack stall", zh: "夜市小吃摊随手拍" },
            image: {
                src: "/quiz/local-food/street-snack-001.jpg",
                alt: { en: "Night market snack stall", zh: "夜市小吃摊照片" },
                palette: "warm"
            },
            aiAnswer: false,
            explanation: {
                en: "The messy labels, oil stains, and mixed light feel naturally inconsistent.",
                zh: "标签、油渍和混杂灯光都不够整齐，反而更像真实现场。"
            }
        },
        {
            id: "minsu-window-001",
            mode: "pair",
            categoryId: "minsu",
            category: { en: "Minsu stays", zh: "民宿酒店" },
            title: { en: "Mountain-view minsu room", zh: "山景民宿房间" },
            a: {
                key: "a",
                src: "/quiz/minsu/minsu-window-001-a.jpg",
                alt: { en: "Minsu option A", zh: "民宿选项 A" },
                palette: "green"
            },
            b: {
                key: "b",
                src: "/quiz/minsu/minsu-window-001-b.jpg",
                alt: { en: "Minsu option B", zh: "民宿选项 B" },
                palette: "warm"
            },
            aiAnswer: "a",
            explanation: {
                en: "The window reflection does not match the mountain angle outside.",
                zh: "窗户反射和窗外山体角度不一致。"
            }
        },
        {
            id: "hotel-breakfast-001",
            mode: "single",
            categoryId: "minsu",
            category: { en: "Minsu stays", zh: "民宿酒店" },
            title: { en: "Hotel breakfast tray", zh: "酒店早餐托盘" },
            image: {
                src: "/quiz/minsu/hotel-breakfast-001.jpg",
                alt: { en: "Hotel breakfast tray", zh: "酒店早餐图" },
                palette: "warm"
            },
            aiAnswer: true,
            explanation: {
                en: "The fork tines merge near the handle, and the fruit shadows point in different directions.",
                zh: "叉齿在把手附近粘连，水果阴影方向也不一致。"
            }
        }
    ]
};
