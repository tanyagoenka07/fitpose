import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get("video") as File;

    if (!video) {
      return NextResponse.json({ error: "Video or email not provided." }, { status: 400 });
    }

    const videoBuffer = await video.arrayBuffer();

    const backendFormData = new FormData();
    backendFormData.append("file", new Blob([videoBuffer]), video.name);

    const backendResponse = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ error: "Backend analysis failed." }, { status: 500 });
    }

    const videoBlob = await backendResponse.blob();

    // Assuming the response is a video file
    return new NextResponse(videoBlob.stream(), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="processed_video.mp4"',
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { Readable } from "stream";

// export async function POST(req: NextRequest) {
//   try {
//     // Retrieve FormData from the incoming request
//     const formData = await req.formData();
//     const video = formData.get("video") as File;

//     // Ensure video file is provided
//     if (!video) {
//       return NextResponse.json({ error: "No video uploaded." }, { status: 400 });
//     }

//     // Convert video to ArrayBuffer for uploading
//     const videoBuffer = await video.arrayBuffer();

//     // Create a new FormData to forward the file to the backend
//     const backendFormData = new FormData();
//     backendFormData.append("file", new Blob([videoBuffer]), video.name);

//     // Send the file as multipart/form-data to the FastAPI backend
//     const backendResponse = await fetch("http://127.0.0.1:8000/analyze", {
//       method: "POST",
//       body: backendFormData,
//       headers: {
//         // Do not manually set Content-Type as FormData will handle it
//       },
//     });

//     // Check if the backend analysis is successful
//     if (!backendResponse.ok) {
//       return NextResponse.json({ error: "Backend analysis failed." }, { status: 500 });
//     }

//     // Get the PDF blob from the backend response
//     const pdfBlob = await backendResponse.blob();

//     // Stream the PDF file back to the client
//     const stream = pdfBlob.stream() as ReadableStream;

//     return new NextResponse(stream, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="report.pdf"',
//       },
//     });
//   } catch (err) {
//     console.error("API error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


