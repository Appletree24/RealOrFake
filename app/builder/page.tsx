import { QuestionBuilder } from "@/components/question-builder";
import { dailyChallenge } from "@/data/daily";
import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Question Builder",
    description: "Create quiz question objects for local development."
};

async function collectImagePaths(
    rootDirectory: string,
    currentDirectory = rootDirectory
): Promise<string[]> {
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    const files: string[][] = await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(currentDirectory, entry.name);
            if (entry.isDirectory()) {
                return collectImagePaths(rootDirectory, fullPath);
            }

            if (!/\.(png|jpe?g|webp|avif)$/i.test(entry.name)) {
                return [];
            }

            return [fullPath];
        })
    );

    return files
        .flat()
        .map((file: string) => file.replace(rootDirectory, "").replaceAll(path.sep, "/"))
        .map((file: string) => `/quiz${file}`)
        .sort((left: string, right: string) => left.localeCompare(right));
}

export default async function BuilderPage() {
    const imageRoot = path.join(process.cwd(), "public", "quiz");
    const imagePaths = await collectImagePaths(imageRoot);
    const existingIds = dailyChallenge.questions.map((question) => question.id);

    return <QuestionBuilder imagePaths={imagePaths} existingIds={existingIds} />;
}
