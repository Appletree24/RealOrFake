import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function sanitizeSegment(value: string) {
    const normalized = value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return normalized || "question";
}

function assetDirectoryFor(categoryId: string) {
    if (categoryId === "photo-booth") return "city-street";
    return sanitizeSegment(categoryId);
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file");
    const categoryId = String(formData.get("categoryId") ?? "").trim();
    const questionId = String(formData.get("questionId") ?? "").trim();
    const slot = String(formData.get("slot") ?? "").trim();

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "No image file received." }, { status: 400 });
    }

    if (!categoryId || !questionId || !slot) {
        return NextResponse.json(
            { error: "Missing category, question id, or image slot." },
            { status: 400 }
        );
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(extension)) {
        return NextResponse.json(
            { error: "Only png, jpg, jpeg, webp, and avif files are supported." },
            { status: 400 }
        );
    }

    const directory = assetDirectoryFor(categoryId);
    const safeQuestionId = sanitizeSegment(questionId);
    const safeSlot = slot === "image" ? "" : `-${sanitizeSegment(slot)}`;
    const fileName = `${safeQuestionId}${safeSlot}${extension}`;
    const outputDirectory = path.join(process.cwd(), "public", "quiz", directory);
    const outputPath = path.join(outputDirectory, fileName);

    await mkdir(outputDirectory, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(outputPath, buffer);

    return NextResponse.json({
        ok: true,
        src: `/quiz/${directory}/${fileName}`
    });
}
