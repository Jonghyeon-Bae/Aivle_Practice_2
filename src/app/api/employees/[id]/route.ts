import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deleted = await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error("API DELETE Employee Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // 이 API는 일반 인적 사항 정보 수정과 AI 평가 데이터 업데이트를 모두 처리합니다.
    const updated = await prisma.employee.update({
      where: { id },
      data: {
        name: body.name,
        department: body.department,
        role: body.role,
        status: body.status,
        attendanceRate: body.attendanceRate,
        monthlyOutput: body.monthlyOutput,
        defectRate: body.defectRate,
        safetyScore: body.safetyScore,
        logs: body.logs,
        
        // AI 평가 데이터 (있을 경우만 업데이트)
        aiRating: body.aiRating,
        aiScores: body.aiScores,
        aiSummary: body.aiSummary,
        aiImprovement: body.aiImprovement,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("API PUT Employee Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
