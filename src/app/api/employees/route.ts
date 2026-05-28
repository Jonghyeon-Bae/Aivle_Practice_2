import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 기본 Mockup 데이터 (최초 실행 시 DB에 자동 Seed)
const DEFAULT_EMPLOYEES = [
  {
    name: "김동주",
    department: "생산 1팀",
    role: "조장",
    joinDate: "2021-03-12",
    status: "근무중",
    attendanceRate: 98,
    monthlyOutput: 1450,
    defectRate: 0.8,
    safetyScore: 95,
    logs: "10년 숙련공으로 조장 역할을 훌륭히 수행함. 항상 출근 시간 20분 전에 도착하며, 안전 수칙을 모범적으로 준수하여 생산 라인 무재해 달성에 기여함. 다만 후배 직원들에 대한 기술 전수 교육 시 성격이 급한 면이 있음.",
  },
  {
    name: "이수민",
    department: "품질 검사팀",
    role: "대리",
    joinDate: "2023-05-18",
    status: "근무중",
    attendanceRate: 95,
    monthlyOutput: 1200,
    defectRate: 0.2,
    safetyScore: 92,
    logs: "꼼꼼한 성격으로 미세한 조립 불량 검출율이 전 부서 중 가장 높음. 수기 기록의 디지털 마감을 솔선수범하여 데이터 누락을 크게 줄임. 생산 부서와의 불량 판정 마찰 시 유연한 커뮤니케이션 능력이 다소 아쉬움.",
  },
  {
    name: "박태영",
    department: "생산 2팀",
    role: "사원",
    joinDate: "2024-01-05",
    status: "근무중",
    attendanceRate: 88,
    monthlyOutput: 950,
    defectRate: 2.5,
    safetyScore: 78,
    logs: "근태 기복이 간혹 발생하며, 장비 오작동 시 매뉴얼에 따르지 않고 자체적으로 처리하려다 안전 경고를 1회 받은 바 있음. 작업 일지 작성 누락이 잦아 현황 파악에 혼선 유발. 작업 숙련도 상승을 위한 집중 지도가 요구됨.",
  },
  {
    name: "최지아",
    department: "인사 총무팀",
    role: "대리",
    joinDate: "2022-07-22",
    status: "근무중",
    attendanceRate: 96,
    monthlyOutput: 0,
    defectRate: 0.0,
    safetyScore: 99,
    logs: "기존 수기 작성 근태 및 실적 데이터를 웹 ERP로 이전하는 본 DX 프로젝트의 행정 실무를 도맡아 완수함. 급여 정산 업무를 디지털화하여 기존 5일 걸리던 마감 업무를 단 하루로 단축함. 부서 간 업무 조율 능력이 아주 우수함.",
  },
  {
    name: "정현우",
    department: "생산 1팀",
    role: "사원",
    joinDate: "2025-02-10",
    status: "근무중",
    attendanceRate: 92,
    monthlyOutput: 780,
    defectRate: 1.8,
    safetyScore: 90,
    logs: "신입사원으로서 매사에 질문이 많고 열정적임. 기계 조작 실력은 아직 미숙하여 생산 속도는 평균 이하이나, 안전 교육 점수가 높고 선배 조장의 피드백을 귀담아듣고 교정하고자 노력함. 성장 가능성이 돋보임.",
  }
];

export async function GET() {
  try {
    // 1. DB의 사원 수 조회
    const count = await prisma.employee.count();
    
    // 2. 사원이 하나도 없으면 기본 데이터 자동 시딩(Seed)
    if (count === 0) {
      await prisma.employee.createMany({
        data: DEFAULT_EMPLOYEES,
      });
    }

    // 3. 전체 직원 리스트 가져오기
    const employees = await prisma.employee.findMany({
      orderBy: { joinDate: "asc" },
    });

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("API GET Employees Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, department, role, joinDate, status, attendanceRate, monthlyOutput, defectRate, safetyScore, logs } = body;

    if (!name) {
      return NextResponse.json({ error: "이름은 필수 항목입니다." }, { status: 400 });
    }

    // 신규 직원 추가
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        department,
        role,
        joinDate: joinDate || new Date().toISOString().split("T")[0],
        status: status || "근무중",
        attendanceRate: attendanceRate !== undefined ? Float32Array.of(attendanceRate)[0] : 100,
        monthlyOutput: monthlyOutput || 0,
        defectRate: defectRate || 0.0,
        safetyScore: safetyScore || 100,
        logs: logs || "",
      },
    });

    return NextResponse.json(newEmployee);
  } catch (error: any) {
    console.error("API POST Employee Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
