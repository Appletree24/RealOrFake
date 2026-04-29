"use client";

import { Button } from "@/components/ui/button";
import type { CategoryId, ImagePalette, PairChoiceKey, SingleChoiceKey } from "@/data/daily";
import { useEffect, useMemo, useState } from "react";

type BuilderCategory = {
    id: Exclude<CategoryId, "all">;
    label: {
        en: string;
        zh: string;
    };
};

type QuestionBuilderProps = {
    categories: BuilderCategory[];
    imagePaths: string[];
    existingIds: string[];
};

type BuilderMode = "pair" | "single";

type LocalizedDraft = {
    zh: string;
    en: string;
};

type PairImageDraft = {
    src: string;
    alt: LocalizedDraft;
    palette: ImagePalette;
};

type SingleImageDraft = {
    src: string;
    alt: LocalizedDraft;
    palette: ImagePalette;
};

type UploadSlot = "a" | "b" | "image";

type UploadStatus = {
    state: "idle" | "uploading" | "uploaded" | "failed";
    message: string;
};

const imagePalettes: ImagePalette[] = ["warm", "cool", "neutral", "green", "rose"];

const defaultCategory = "concert" satisfies Exclude<CategoryId, "all">;

function createLocalizedDraft(zh: string, en: string): LocalizedDraft {
    return { zh, en };
}

function formatString(value: string) {
    return JSON.stringify(value);
}

function formatLocalizedText(value: LocalizedDraft) {
    return `{ en: ${formatString(value.en)}, zh: ${formatString(value.zh)} }`;
}

function formatImageChoice(key: PairChoiceKey, image: PairImageDraft) {
    return [
        `${key}: {`,
        `    key: ${formatString(key)},`,
        `    src: ${formatString(image.src)},`,
        `    alt: ${formatLocalizedText(image.alt)},`,
        `    palette: ${formatString(image.palette)}`,
        "},"
    ].join("\n");
}

function formatSingleImage(image: SingleImageDraft) {
    return [
        "image: {",
        `    src: ${formatString(image.src)},`,
        `    alt: ${formatLocalizedText(image.alt)},`,
        `    palette: ${formatString(image.palette)}`,
        "},"
    ].join("\n");
}

function indent(block: string, spaces = 4) {
    const prefix = " ".repeat(spaces);
    return block
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n");
}

function inputClassName() {
    return "h-11 min-w-0 w-full rounded-md border border-line bg-white/80 px-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-ink";
}

function textAreaClassName() {
    return "min-h-[120px] w-full resize-y rounded-md border border-line bg-white/80 px-3 py-2 text-sm leading-6 text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-ink";
}

function slugify(value: string) {
    const normalized = value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return normalized || "question";
}

function nextSequenceForPrefix(prefix: string, existingIds: string[]) {
    const pattern = new RegExp(`^${prefix}-(\\d{3})$`);
    const max = existingIds.reduce((currentMax, value) => {
        const match = value.match(pattern);
        if (!match) return currentMax;
        return Math.max(currentMax, Number.parseInt(match[1], 10));
    }, 0);

    return String(max + 1).padStart(3, "0");
}

export function QuestionBuilder({ categories, imagePaths, existingIds }: QuestionBuilderProps) {
    const [mode, setMode] = useState<BuilderMode>("single");
    const [categoryId, setCategoryId] = useState<Exclude<CategoryId, "all">>(defaultCategory);
    const [id, setId] = useState("");
    const [customId, setCustomId] = useState(false);
    const [title, setTitle] = useState<LocalizedDraft>(
        createLocalizedDraft("雨后的街景", "City street after rain")
    );
    const [explanation, setExplanation] = useState<LocalizedDraft>(
        createLocalizedDraft("这里填写正确答案的解释。", "Explain why the correct answer is correct.")
    );
    const [llmExplanation, setLlmExplanation] = useState<LocalizedDraft>(
        createLocalizedDraft("这里填写 LLM 为什么这样判断。", "Explain why the LLM made this call.")
    );
    const [pairA, setPairA] = useState<PairImageDraft>({
        src: "",
        alt: createLocalizedDraft("选项 A", "Option A"),
        palette: "warm"
    });
    const [pairB, setPairB] = useState<PairImageDraft>({
        src: "",
        alt: createLocalizedDraft("选项 B", "Option B"),
        palette: "cool"
    });
    const [singleImage, setSingleImage] = useState<SingleImageDraft>({
        src: "",
        alt: createLocalizedDraft("题目图片", "Question image"),
        palette: "warm"
    });
    const [aiAnswerPair, setAiAnswerPair] = useState<PairChoiceKey>("a");
    const [llmAnswerPair, setLlmAnswerPair] = useState<PairChoiceKey>("a");
    const [aiAnswerSingle, setAiAnswerSingle] = useState(false);
    const [llmAnswerSingle, setLlmAnswerSingle] = useState<SingleChoiceKey>("real");
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
    const [appendState, setAppendState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
    const [appendMessage, setAppendMessage] = useState("");
    const [usedIds, setUsedIds] = useState(existingIds);
    const [uploadStatus, setUploadStatus] = useState<Record<UploadSlot, UploadStatus>>({
        a: { state: "idle", message: "" },
        b: { state: "idle", message: "" },
        image: { state: "idle", message: "" }
    });

    const category = useMemo(
        () => categories.find((item) => item.id === categoryId) ?? categories[0],
        [categories, categoryId]
    );
    const suggestedId = useMemo(() => {
        const topicSlug = slugify(title.en);
        const prefix = `${category.id}-${topicSlug}`;
        return `${prefix}-${nextSequenceForPrefix(prefix, usedIds)}`;
    }, [category.id, title.en, usedIds]);

    const generatedCode = useMemo(() => {
        const baseLines = [
            "{",
            `    id: ${formatString(id || "new-question-id")},`,
            `    mode: ${formatString(mode)},`,
            `    categoryId: ${formatString(category.id)},`,
            `    category: ${formatLocalizedText(category.label)},`,
            `    title: ${formatLocalizedText(title)},`
        ];

        const body =
            mode === "pair"
                ? [
                      indent(formatImageChoice("a", pairA)),
                      indent(formatImageChoice("b", pairB)),
                      `    aiAnswer: ${formatString(aiAnswerPair)},`,
                      `    llmAnswer: ${formatString(llmAnswerPair)},`
                  ]
                : [
                      indent(formatSingleImage(singleImage)),
                      `    aiAnswer: ${aiAnswerSingle},`,
                      `    llmAnswer: ${formatString(llmAnswerSingle)},`
                  ];

        const tailLines = [
            `    explanation: ${formatLocalizedText(explanation)},`,
            `    llmExplanation: ${formatLocalizedText(llmExplanation)}`,
            "}"
        ];

        return [...baseLines, ...body, ...tailLines].join("\n");
    }, [
        aiAnswerPair,
        aiAnswerSingle,
        category,
        explanation,
        id,
        llmAnswerPair,
        llmAnswerSingle,
        llmExplanation,
        mode,
        pairA,
        pairB,
        singleImage,
        title
    ]);

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }
    }

    async function appendToDailyFile() {
        if (!id.trim()) {
            setAppendState("failed");
            setAppendMessage("请先填写题目 ID。");
            return;
        }

        setAppendState("saving");
        setAppendMessage("");

        try {
            const response = await fetch("/api/builder/append-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id.trim(),
                    code: generatedCode
                })
            });

            const result = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(result.error ?? "追加失败，请检查 daily.ts。");
            }

            setAppendState("saved");
            setAppendMessage("已成功追加到 data/daily.ts。");
            setUsedIds((current) =>
                current.includes(id.trim()) ? current : [...current, id.trim()]
            );
        } catch (error) {
            setAppendState("failed");
            setAppendMessage(
                error instanceof Error ? error.message : "追加失败，请稍后再试。"
            );
        }
    }

    async function uploadLocalImage(file: File, slot: UploadSlot) {
        const currentId = id.trim() || suggestedId;
        if (!currentId) {
            setUploadStatus((current) => ({
                ...current,
                [slot]: { state: "failed", message: "请先填写或生成题目 ID。" }
            }));
            return;
        }

        setUploadStatus((current) => ({
            ...current,
            [slot]: { state: "uploading", message: "上传中..." }
        }));

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("categoryId", categoryId);
            formData.append("questionId", currentId);
            formData.append("slot", slot);

            const response = await fetch("/api/builder/upload-image", {
                method: "POST",
                body: formData
            });
            const result = (await response.json()) as { error?: string; src?: string };
            if (!response.ok || !result.src) {
                throw new Error(result.error ?? "图片上传失败。");
            }

            if (slot === "a") {
                setPairA((current) => ({ ...current, src: result.src! }));
            } else if (slot === "b") {
                setPairB((current) => ({ ...current, src: result.src! }));
            } else {
                setSingleImage((current) => ({ ...current, src: result.src! }));
            }

            setUploadStatus((current) => ({
                ...current,
                [slot]: { state: "uploaded", message: `已上传并回填为 ${result.src}` }
            }));
        } catch (error) {
            setUploadStatus((current) => ({
                ...current,
                [slot]: {
                    state: "failed",
                    message: error instanceof Error ? error.message : "图片上传失败。"
                }
            }));
        }
    }

    useEffect(() => {
        setUsedIds(existingIds);
    }, [existingIds]);

    useEffect(() => {
        if (!customId || !id.trim()) {
            setId(suggestedId);
        }
    }, [customId, id, suggestedId]);

    useEffect(() => {
        setAppendState("idle");
        setAppendMessage("");
    }, [generatedCode]);

    const imageListId = "builder-image-paths";

    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
            <div className="animate-quiet-rise">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                    Question Builder
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-5xl">
                    新建题目工坊
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    选择单图或双图模式，填写文案与图片路径，右侧会实时生成可直接粘贴到
                    `daily.ts` 的题目对象。
                </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
                <section className="min-w-0 rounded-2xl border border-line bg-white/60 p-4 shadow-soft-line sm:p-6">
                    <div className="grid gap-5">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="block min-w-0">
                                <span className="mb-2 block text-sm font-medium text-ink">题目模式</span>
                                <select
                                    className={inputClassName()}
                                    value={mode}
                                    onChange={(event) => setMode(event.target.value as BuilderMode)}
                                >
                                    <option value="single">single</option>
                                    <option value="pair">pair</option>
                                </select>
                            </label>
                            <label className="block min-w-0 sm:col-span-2">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <span className="block text-sm font-medium text-ink">题目 ID</span>
                                    <button
                                        type="button"
                                        className="text-xs font-medium text-accent transition hover:opacity-75"
                                        onClick={() => {
                                            setCustomId(false);
                                            setId(suggestedId);
                                        }}
                                    >
                                        重新生成
                                    </button>
                                </div>
                                <input
                                    className={inputClassName()}
                                    value={id}
                                    onChange={(event) => {
                                        const nextId = event.target.value;
                                        setId(nextId);
                                        setCustomId(nextId.trim() !== "" && nextId.trim() !== suggestedId);
                                    }}
                                    placeholder="例如：concert-crowd-002"
                                />
                                <p className="mt-2 break-all text-xs leading-5 text-muted">
                                    自动建议：`{suggestedId}`。规则为 `categoryId-title-slug-001`，默认跟随分类和英文标题变化。
                                </p>
                            </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block min-w-0">
                                <span className="mb-2 block text-sm font-medium text-ink">分类 ID</span>
                                <select
                                    className={inputClassName()}
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(event.target.value as Exclude<CategoryId, "all">)
                                    }
                                >
                                    {categories.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.id}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="min-w-0 rounded-md border border-line bg-paper/70 px-4 py-3">
                                <p className="text-xs uppercase tracking-wide text-muted">分类文案</p>
                                <p className="mt-2 text-sm font-medium text-ink">{category.label.zh}</p>
                                <p className="break-words text-sm text-muted">{category.label.en}</p>
                            </div>
                        </div>

                        <LocalizedFields
                            label="题目标题"
                            value={title}
                            onChange={setTitle}
                            zhPlaceholder="例如：夜市小吃摊随手拍"
                            enPlaceholder="e.g. Night market snack stall"
                        />

                        <LocalizedFields
                            label="正确答案解释"
                            value={explanation}
                            onChange={setExplanation}
                            multiline
                            zhPlaceholder="解释为什么正确答案成立"
                            enPlaceholder="Explain why the correct answer is correct"
                        />

                        <LocalizedFields
                            label="LLM 判断说明"
                            value={llmExplanation}
                            onChange={setLlmExplanation}
                            multiline
                            zhPlaceholder="解释 LLM 为什么这样判断"
                            enPlaceholder="Explain why the LLM made this call"
                        />

                        {mode === "pair" ? (
                            <>
                                <PairImageSection
                                    title="图片 A"
                                    image={pairA}
                                    imageListId={imageListId}
                                    uploadStatus={uploadStatus.a}
                                    onFileSelect={(file) => uploadLocalImage(file, "a")}
                                    onChange={setPairA}
                                    inputClassName={inputClassName()}
                                    textAreaClassName={textAreaClassName()}
                                />
                                <PairImageSection
                                    title="图片 B"
                                    image={pairB}
                                    imageListId={imageListId}
                                    uploadStatus={uploadStatus.b}
                                    onFileSelect={(file) => uploadLocalImage(file, "b")}
                                    onChange={setPairB}
                                    inputClassName={inputClassName()}
                                    textAreaClassName={textAreaClassName()}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block min-w-0">
                                        <span className="mb-2 block text-sm font-medium text-ink">
                                            正确答案
                                        </span>
                                        <select
                                            className={inputClassName()}
                                            value={aiAnswerPair}
                                            onChange={(event) =>
                                                setAiAnswerPair(event.target.value as PairChoiceKey)
                                            }
                                        >
                                            <option value="a">A</option>
                                            <option value="b">B</option>
                                        </select>
                                    </label>
                                    <label className="block min-w-0">
                                        <span className="mb-2 block text-sm font-medium text-ink">
                                            LLM 选择
                                        </span>
                                        <select
                                            className={inputClassName()}
                                            value={llmAnswerPair}
                                            onChange={(event) =>
                                                setLlmAnswerPair(event.target.value as PairChoiceKey)
                                            }
                                        >
                                            <option value="a">A</option>
                                            <option value="b">B</option>
                                        </select>
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <SingleImageSection
                                    title="题目图片"
                                    image={singleImage}
                                    imageListId={imageListId}
                                    uploadStatus={uploadStatus.image}
                                    onFileSelect={(file) => uploadLocalImage(file, "image")}
                                    onChange={setSingleImage}
                                    inputClassName={inputClassName()}
                                    textAreaClassName={textAreaClassName()}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block min-w-0">
                                        <span className="mb-2 block text-sm font-medium text-ink">
                                            正确答案
                                        </span>
                                        <select
                                            className={inputClassName()}
                                            value={aiAnswerSingle ? "ai" : "real"}
                                            onChange={(event) =>
                                                setAiAnswerSingle(event.target.value === "ai")
                                            }
                                        >
                                            <option value="real">real</option>
                                            <option value="ai">ai</option>
                                        </select>
                                    </label>
                                    <label className="block min-w-0">
                                        <span className="mb-2 block text-sm font-medium text-ink">
                                            LLM 选择
                                        </span>
                                        <select
                                            className={inputClassName()}
                                            value={llmAnswerSingle}
                                            onChange={(event) =>
                                                setLlmAnswerSingle(event.target.value as SingleChoiceKey)
                                            }
                                        >
                                            <option value="real">real</option>
                                            <option value="ai">ai</option>
                                        </select>
                                    </label>
                                </div>
                            </>
                        )}

                        <datalist id={imageListId}>
                            {imagePaths.map((path) => (
                                <option key={path} value={path} />
                            ))}
                        </datalist>
                    </div>
                </section>

                <section className="min-w-0 rounded-2xl border border-line bg-[#181513] p-4 text-paper shadow-soft-line sm:p-6 lg:sticky lg:top-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-paper/60">
                                Generated Object
                            </p>
                            <p className="mt-1 text-sm text-paper/75">
                                可以复制代码，也可以直接一键追加到 `daily.ts`。
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={copyCode} variant="secondary">
                                {copyState === "copied"
                                    ? "已复制"
                                    : copyState === "failed"
                                      ? "复制失败"
                                      : "复制代码"}
                            </Button>
                            <Button
                                onClick={appendToDailyFile}
                                disabled={appendState === "saving"}
                            >
                                {appendState === "saving"
                                    ? "写入中..."
                                    : appendState === "saved"
                                      ? "已写入"
                                      : "追加到 daily.ts"}
                            </Button>
                        </div>
                    </div>

                    <pre className="mt-5 max-h-[70vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-paper/95">
                        <code>{generatedCode}</code>
                    </pre>

                    {appendMessage ? (
                        <div
                            className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
                                appendState === "failed"
                                    ? "border-[#d39a8a] bg-[#55261d]/60 text-[#ffd8cc]"
                                    : "border-white/10 bg-white/5 text-paper/80"
                            }`}
                        >
                            {appendMessage}
                        </div>
                    ) : null}

                    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-paper/75">
                        <p className="font-medium text-paper">开发建议</p>
                        <p className="mt-2">
                            有真实图的题型优先用 `pair`，没有真实图的题型先用 `single`。图片路径可以直接引用
                            `public/quiz` 下已有资源，例如 `/quiz/concert/example.webp`。
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

type LocalizedFieldsProps = {
    label: string;
    value: LocalizedDraft;
    onChange: (value: LocalizedDraft) => void;
    zhPlaceholder: string;
    enPlaceholder: string;
    multiline?: boolean;
};

function LocalizedFields({
    label,
    value,
    onChange,
    zhPlaceholder,
    enPlaceholder,
    multiline = false
}: LocalizedFieldsProps) {
    const sharedClassName = multiline ? textAreaClassName() : inputClassName();
    const InputTag = multiline ? "textarea" : "input";

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-ink">{label}（中文）</span>
                <InputTag
                    className={sharedClassName}
                    value={value.zh}
                    onChange={(event) => onChange({ ...value, zh: event.target.value })}
                    placeholder={zhPlaceholder}
                />
            </label>
            <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-ink">{label}（英文）</span>
                <InputTag
                    className={sharedClassName}
                    value={value.en}
                    onChange={(event) => onChange({ ...value, en: event.target.value })}
                    placeholder={enPlaceholder}
                />
            </label>
        </div>
    );
}

type ImageSectionProps<TImage extends { src: string; alt: LocalizedDraft; palette: ImagePalette }> = {
    title: string;
    image: TImage;
    imageListId: string;
    uploadStatus: UploadStatus;
    onFileSelect: (file: File) => void;
    onChange: (value: TImage) => void;
    inputClassName: string;
    textAreaClassName: string;
};

function PairImageSection(props: ImageSectionProps<PairImageDraft>) {
    return <ImageSection {...props} />;
}

function SingleImageSection(props: ImageSectionProps<SingleImageDraft>) {
    return <ImageSection {...props} title="题目图片" />;
}

function ImageSection<TImage extends { src: string; alt: LocalizedDraft; palette: ImagePalette }>({
    title,
    image,
    imageListId,
    uploadStatus,
    onFileSelect,
    onChange,
    inputClassName: controlClassName,
    textAreaClassName: areaClassName
}: ImageSectionProps<TImage>) {
    return (
        <div className="min-w-0 rounded-xl border border-line bg-paper/35 p-4">
            <p className="text-sm font-medium text-ink">{title}</p>
            <div className="mt-4 grid gap-4">
                <label className="block min-w-0">
                    <span className="mb-2 block text-sm font-medium text-ink">图片路径</span>
                    <input
                        className={controlClassName}
                        value={image.src}
                        onChange={(event) => onChange({ ...image, src: event.target.value })}
                        placeholder="/quiz/your-folder/your-image.webp"
                        list={imageListId}
                    />
                </label>
                <div className="rounded-lg border border-dashed border-line bg-white/45 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-line bg-white/80 px-3 py-2 text-sm font-medium text-ink transition hover:bg-white">
                            选择本机图片
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/avif"
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        onFileSelect(file);
                                    }
                                    event.currentTarget.value = "";
                                }}
                            />
                        </label>
                        <p className="text-xs leading-5 text-muted">
                            选择后会自动上传到项目 `public/quiz`，转成 `webp` 并回填路径。
                        </p>
                    </div>
                    {uploadStatus.message ? (
                        <p
                            className={`mt-3 text-xs leading-5 ${
                                uploadStatus.state === "failed"
                                    ? "text-[#a4442f]"
                                    : uploadStatus.state === "uploaded"
                                      ? "text-[#2f6b45]"
                                      : "text-muted"
                            }`}
                        >
                            {uploadStatus.message}
                        </p>
                    ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-ink">alt（中文）</span>
                        <textarea
                            className={areaClassName}
                            value={image.alt.zh}
                            onChange={(event) =>
                                onChange({
                                    ...image,
                                    alt: { ...image.alt, zh: event.target.value }
                                })
                            }
                            placeholder="例如：演唱会选项 A"
                        />
                    </label>
                    <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-ink">alt（英文）</span>
                        <textarea
                            className={areaClassName}
                            value={image.alt.en}
                            onChange={(event) =>
                                onChange({
                                    ...image,
                                    alt: { ...image.alt, en: event.target.value }
                                })
                            }
                            placeholder="e.g. Concert option A"
                        />
                    </label>
                </div>
                <label className="block min-w-0 max-w-xs">
                    <span className="mb-2 block text-sm font-medium text-ink">色板</span>
                    <select
                        className={controlClassName}
                        value={image.palette}
                        onChange={(event) =>
                            onChange({ ...image, palette: event.target.value as ImagePalette })
                        }
                    >
                        {imagePalettes.map((palette) => (
                            <option key={palette} value={palette}>
                                {palette}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
