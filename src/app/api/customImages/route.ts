import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {uploadImageToCloudinary} from "@/utils/uploadImageToCloudinary";

// GET all custom images (with optional filtering by type)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type");

  try {
    const customImages = await prisma.customImage.findMany({
      where: typeParam ? { type: Number(typeParam) } : undefined,
      orderBy: { type: "asc" },
      select: {
        id: true,
        image: true,
        type: true,
        name: true,
      },
    });

    return NextResponse.json(customImages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch custom images." },
      { status: 500 }
    );
  }
}

// POST create a custom image
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name")
  const type = parseInt(formData.get("type")?.toString() ?? "", 10);
  const file = formData.get("file") as File;

  if (isNaN(type) || !file || !(file instanceof File) || file.size === 0) {
      
      
     return NextResponse.json(
      { error: "Invalid image or type" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadImageToCloudinary(buffer);

    console.log(buffer);
    console.log(imageUrl);
    const customImage = await prisma.customImage.create({
      data: {
        name: typeof name === "string" ? name : undefined,
        image: imageUrl,
        type,
      },
    });

    return NextResponse.json(customImage, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not upload custom image." },
      { status: 500 }
    );
  }
}
