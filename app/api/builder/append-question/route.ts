import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type AppendQuestionBody = {
    id?: string;
    code?: string;
};

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function indentBlock(code: string, spaces: number) {
    const prefix = " ".repeat(spaces);
    return code
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n");
}

export async function POST(request: Request) {
    const body = (await request.json()) as AppendQuestionBody;
    const id = body.id?.trim();
    const code = body.code?.trim();

    if (!id || !code) {
        return NextResponse.json(
            { error: "Missing question id or generated code." },
            { status: 400 }
        );
    }

    const dailyPath = path.join(process.cwd(), "data", "daily.ts");
    const source = await readFile(dailyPath, "utf8");

    const idPattern = new RegExp(`id:\\s*["']${escapeRegExp(id)}["']`);
    if (idPattern.test(source)) {
        return NextResponse.json(
            { error: `A question with id "${id}" already exists in daily.ts.` },
            { status: 409 }
        );
    }

    const questionsStart = source.indexOf("questions: [");
    const closingMarker = "\n    ]\n};";
    const closingIndex = source.lastIndexOf(closingMarker);

    if (questionsStart === -1 || closingIndex === -1 || closingIndex <= questionsStart) {
        return NextResponse.json(
            { error: "Could not locate the questions array in daily.ts." },
            { status: 500 }
        );
    }

    const arrayContents = source
        .slice(questionsStart + "questions: [".length, closingIndex)
        .trim();
    const indentedCode = indentBlock(code, 8);

    let updatedSource: string;
    if (arrayContents.length === 0) {
        updatedSource =
            source.slice(0, closingIndex) + `\n${indentedCode}` + source.slice(closingIndex);
    } else {
        updatedSource =
            source.slice(0, closingIndex).trimEnd() +
            `,\n${indentedCode}` +
            source.slice(closingIndex);
    }

    await writeFile(dailyPath, updatedSource);

    return NextResponse.json({ ok: true });
}
