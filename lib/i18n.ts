export type Language = "en" | "zh";

export type LocalizedText = Record<Language, string>;

export const languageLabel: Record<Language, string> = {
    en: "EN",
    zh: "中文"
};

export const copy = {
    en: {
        appName: "AI Photo Challenge",
        truthKicker: "Seeing is no longer proof",
        truthHeadline: "The age of photo evidence is over.",
        truthBody:
            "Pick a scene, trust your eyes, then see how often a polished image can rewrite your confidence.",
        chooseCategory: "Choose a scene",
        total: "total",
        startChallenge: "Start challenge",
        changeScene: "Change scene",
        selectedScene: "Selected scene",
        sceneCount: (count: number) => `${count} ${count === 1 ? "question" : "questions"}`,
        todaysSet: "Today's set",
        freshPick: "Fresh pick",
        newDrop: "New drop",
        comingSoon: "Coming soon",
        proOnly: "Pro",
        lockedHint: "Unlocking this set requires Pro.",
        roundLabel: (n: number) => `Round ${n}`,
        pairPrompt: "Which image is AI-generated?",
        singlePrompt: "Is this image AI-generated?",
        score: "Score",
        correct: "Correct.",
        fooled: "Fooled.",
        battleCardTitle: "LLM opponent",
        battleCorrect: (name: string) => `${name} also got this one right.`,
        battleWrong: (name: string) => `${name} missed this one.`,
        battleReasonLead: "It thought:",
        yourScoreLabel: "You",
        noAnswer: "No answer selected.",
        pairMode: "A/B",
        singleMode: "Single image",
        chooseAI: "AI-generated",
        chooseReal: "Real photo",
        revealedAI: "AI image",
        revealedReal: "Real photo",
        missedPrefix: "",
        missedSuffix: "% of players missed this one.",
        seeScore: "See score",
        nextImage: "Next image",
        betterThan: "Better than",
        players: "of today's players.",
        opponentScoreLabel: (name: string) => name,
        challengeFriend: "Challenge a friend",
        replay: "Replay",
        linkReady: "Daily challenge link ready.",
        linkCopied: "Invite link copied to clipboard.",
        copyFailed: "Couldn't copy automatically. Link is shown above — copy it manually.",
        shareText: (score: number, total: number, opponentName: string, opponentScore: number) => {
            if (score > opponentScore) {
                return `I just outplayed ${opponentName} with a ${score}/${total}. Think you can clear this round too?`;
            }

            if (score < opponentScore) {
                return `${opponentName} kinda diffed me this round and I only got ${score}/${total}. Try this set and get revenge.`;
            }

            return `I tied ${opponentName} at ${score}/${total} on this round. Try it and break the deadlock.`;
        },
        nicknamePromptTitle: "Who should we name on the invite?",
        nicknamePromptHint: "Your friend will see this name above the challenge.",
        nicknamePlaceholder: "e.g. Alex",
        nicknameSkip: "Skip",
        nicknameContinue: "Create link",
        inviteBannerAnon: (score: number, total: number) =>
            `Someone just scored ${score}/${total}. Can you beat their streak?`,
        inviteBannerNamed: (name: string, score: number, total: number) =>
            `${name} just scored ${score}/${total}. Can you beat them on the same set?`,
        inviteBannerKicker: "You were invited",
        emailCaptureTitle: "Want harder image drops before everyone else?",
        emailCaptureBody:
            "Leave your email to get early access to new challenge packs, trickier scenes, and future product updates.",
        emailCaptureHint: "Low volume. Useful updates only.",
        emailPlaceholder: "you@example.com",
        emailSubmit: "Get early drops",
        emailDismiss: "Not now",
        emailSuccess: "You're in. We'll send the next drops to this inbox.",
        emailDuplicate: "This email is already on the list.",
        emailInvalid: "Enter a valid email address.",
        emailFailed: "Couldn't save your email just now. Please try again.",
        zoomIn: "Zoom in",
        closePreview: "Close preview",
        viewFullImage: "View full image"
    },
    zh: {
        appName: "AI 真假图挑战",
        truthKicker: "眼见不再为实",
        truthHeadline: "有图有真相的时代结束了。",
        truthBody:
            "选择一个场景，相信你的眼睛，然后看看一张足够精致的图片能多轻易地改写你的判断。",
        chooseCategory: "选择挑战场景",
        total: "总计",
        startChallenge: "开始挑战",
        changeScene: "更换场景",
        selectedScene: "当前场景",
        sceneCount: (count: number) => `${count} 道题`,
        todaysSet: "今日题组",
        freshPick: "精选上新",
        newDrop: "今日上新",
        comingSoon: "即将解锁",
        proOnly: "Pro 专享",
        lockedHint: "升级 Pro 即可抢先解锁。",
        roundLabel: (n: number) => `第 ${n} 轮`,
        pairPrompt: "哪一张是 AI 生成的？",
        singlePrompt: "这张图是 AI 生成的吗？",
        score: "得分",
        correct: "答对了。",
        fooled: "被骗了。",
        battleCardTitle: "LLM 对手",
        battleCorrect: (name: string) => `${name} 这题也答对了。`,
        battleWrong: (name: string) => `${name} 这题答错了。`,
        battleReasonLead: "它的判断是：",
        yourScoreLabel: "你",
        noAnswer: "还没有选择答案。",
        pairMode: "双图对比",
        singleMode: "单图判断",
        chooseAI: "AI 生成",
        chooseReal: "真实照片",
        revealedAI: "AI 图",
        revealedReal: "真实照片",
        missedPrefix: "这一题有 ",
        missedSuffix: "% 的玩家也选错了。",
        seeScore: "查看分数",
        nextImage: "下一题",
        betterThan: "超过了今日",
        players: "的玩家。",
        opponentScoreLabel: (name: string) => name,
        challengeFriend: "挑战朋友",
        replay: "再玩一次",
        linkReady: "今日挑战链接已准备好。",
        linkCopied: "邀请链接已复制到剪贴板。",
        copyFailed: "自动复制失败，请从上方手动复制链接。",
        shareText: (score: number, total: number, opponentName: string, opponentScore: number) => {
            if (score > opponentScore) {
                return `这轮我把 ${opponentName} 打下线了，拿了 ${score}/${total}。你来试试，别被 AI 薄纱。不会这都要被它拿捏吧？`;
            }

            if (score < opponentScore) {
                return `刚被 ${opponentName} 薄纱了，这轮我只有 ${score}/${total}。不服，来帮我复仇。不会你也要被它拿捏吧？`;
            }

            return `我和 ${opponentName} 这轮打成平手，都是 ${score}/${total}。这题库有点上头，你敢来破局吗？不会真要和它五五开吧？`;
        },
        nicknamePromptTitle: "用什么名字发邀请？",
        nicknamePromptHint: "朋友打开链接时会在挑战页顶部看到这个名字。",
        nicknamePlaceholder: "例如：小明",
        nicknameSkip: "跳过",
        nicknameContinue: "生成邀请链接",
        inviteBannerAnon: (score: number, total: number) =>
            `有人刚拿下 ${score}/${total} 分，你能比他更高吗？`,
        inviteBannerNamed: (name: string, score: number, total: number) =>
            `${name} 刚在同一套题里拿下 ${score}/${total} 分，来挑战试试？`,
        inviteBannerKicker: "你被邀请参加挑战",
        emailCaptureTitle: "想先拿到更难的新题包吗？",
        emailCaptureBody:
            "留下邮箱，后续新场景、进阶难度题组和产品更新会优先发给你。",
        emailCaptureHint: "不会高频打扰，只发有用更新。",
        emailPlaceholder: "you@example.com",
        emailSubmit: "抢先获取",
        emailDismiss: "暂时不用",
        emailSuccess: "已加入名单，后续新题会优先发到这个邮箱。",
        emailDuplicate: "这个邮箱已经登记过了。",
        emailInvalid: "请输入有效的邮箱地址。",
        emailFailed: "这次保存失败了，请稍后再试。",
        zoomIn: "放大查看",
        closePreview: "关闭预览",
        viewFullImage: "查看大图"
    }
} satisfies Record<Language, Record<string, string | ((...args: never[]) => string)>>;

export function t(text: LocalizedText, language: Language) {
    return text[language];
}
