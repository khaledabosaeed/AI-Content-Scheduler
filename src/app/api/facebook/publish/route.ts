//يستقبل postId من الطلب، ويعيد ردًا بنجاح النشر على فيسبوك
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function publishToFacebookPage(postId: string): Promise<boolean> {
  return true;
}
