import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

export const runtime = "nodejs";

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const execFileAsync = promisify(execFile);

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
    const fileName = `${safeQuestionId}${safeSlot}.webp`;
    const outputDirectory = path.join(process.cwd(), "public", "quiz", directory);
    const outputPath = path.join(outputDirectory, fileName);
    const tempDirectory = await mkdtemp(path.join(tmpdir(), "realorfake-upload-"));
    const tempInputPath = path.join(tempDirectory, `input${extension}`);
    const tempPngPath = path.join(tempDirectory, "input.png");

    try {
        await mkdir(outputDirectory, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(tempInputPath, buffer);

        let conversionInput = tempInputPath;
        if (extension === ".avif") {
            await execFileAsync("sips", ["-s", "format", "png", tempInputPath, "--out", tempPngPath]);
            conversionInput = tempPngPath;
        }

        await execFileAsync("/opt/homebrew/bin/cwebp", [
            "-q",
            "82",
            conversionInput,
            "-o",
            outputPath
        ]);

        return NextResponse.json({
            ok: true,
            src: `/quiz/${directory}/${fileName}`
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to convert the uploaded image to webp." },
            { status: 500 }
        );
    } finally {
        await rm(tempDirectory, { recursive: true, force: true });
    }
}
