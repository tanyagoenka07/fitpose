import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Correct import
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request, { params }: { params: { reportId: string } }) {
  const user = await currentUser(); // Fetch the logged-in user

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Report file path
  const { reportId } = params;
  const reportPath = path.join(process.cwd(), "src/app/protected/reports", `${reportId}.pdf`);

  try {
    const fileBuffer = await fs.readFile(reportPath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

