"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Printer, LayoutGrid, BookOpen, Monitor, Award, FileText, Activity } from "lucide-react";

interface Slide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"presentation" | "document">("presentation");

  const slides: Slide[] = [
    {
      id: 1,
      category: "INTRO",
      title: "성공적인 프로젝트 초안 및 기획서 작성법",
      subtitle: "수기 관리 공장의 디지털 전환(DX) 사례 분석",
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed text-lg">
            새로운 시스템을 도입하거나 신규 프로젝트를 기획할 때, 첫 문서인 <strong className="text-brand-400">초안(Draft Proposal)</strong>은 이해관계자를 설득하고 프로젝트의 나침반 역할을 하는 핵심 문서입니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-heading text-brand-400 font-bold mb-2">1. 타당성 검토</h4>
              <p className="text-slate-400 text-xs leading-relaxed">왜 이 프로젝트를 해야 하는가에 대한 명확한 기획의도와 비즈니스 당위성 제시</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-heading text-brand-400 font-bold mb-2">2. 단계적 목표 설정</h4>
              <p className="text-slate-400 text-xs leading-relaxed">현실적인 예산과 리소스를 고려하여 개발 단계를 구체적으로 로드맵화</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-heading text-brand-400 font-bold mb-2">3. 예상 결과 정량화</h4>
              <p className="text-slate-400 text-xs leading-relaxed">도입 후 얻게 될 정량적 시간/비용 절감 효과와 정성적 신뢰도 상승 예측</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm">
            💡 <strong>본 강의 교안의 특징:</strong> 50명 규모의 아날로그 수기식 제조 공장을 디지털 웹 ERP 시스템으로 바꾸는 실무 예제를 바탕으로, 한눈에 들어오는 기획서의 핵심 요소를 학습합니다.
          </div>
        </div>
      )
    },
    {
      id: 2,
      category: "BACKGROUND",
      title: "사례 연구: 50인 규모 공장의 현황과 DX 필요성",
      subtitle: "수기 관리의 한계와 비즈니스 리스크 분석",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              아날로그 수기 관리의 4대 페인 포인트
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-900 flex gap-3">
                <span className="text-red-400 font-bold text-sm">01</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">인력 손실 및 데이터 누락</h4>
                  <p className="text-slate-400 text-xs mt-0.5">출퇴근 및 근태 정보를 종이 대장에 적어 매달 수기로 엑셀에 옮기는 비효율</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-900 flex gap-3">
                <span className="text-red-400 font-bold text-sm">02</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">실시간 생산성 모니터링 불가능</h4>
                  <p className="text-slate-400 text-xs mt-0.5">당일의 제품 불량률, 작업 실적을 퇴근 후에야 집계하여 현황 파악 지연</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-900 flex gap-3">
                <span className="text-red-400 font-bold text-sm">03</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">인사 평가 기준의 주관성</h4>
                  <p className="text-slate-400 text-xs mt-0.5">객관적인 수치 데이터가 축적되지 않아 직관에 의존하는 불투명한 평가제도</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-brand-950/40 to-slate-900 border border-brand-500/10 flex flex-col justify-center">
            <h4 className="text-brand-400 font-bold mb-3 font-heading">💡 DX(Digital Transformation) 의뢰 요건</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              "50명의 공장 직원 관리와 매일 작성하는 생산 일지, 가동률 등의 데이터를 한 곳에서 통합 관리할 수 있는 웹 기반 사내 시스템을 구축해주세요."
            </p>
            <div className="border-t border-slate-800 pt-4 flex gap-4 text-center">
              <div className="flex-1">
                <div className="text-brand-400 text-lg font-black">50명</div>
                <div className="text-slate-500 text-[10px]">인원 관리 대상</div>
              </div>
              <div className="flex-1 border-x border-slate-800">
                <div className="text-brand-400 text-lg font-black">100%</div>
                <div className="text-slate-500 text-[10px]">종이 대장 대체</div>
              </div>
              <div className="flex-1">
                <div className="text-brand-400 text-lg font-black">AI 도입</div>
                <div className="text-slate-500 text-[10px]">객관적 실적 평가</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      category: "STRUCTURE",
      title: "기획안 작성 1단계: 기획의도 및 프로젝트 목표 수립",
      subtitle: "Why와 What을 명확히 하고 구체적인 목표(KPI) 정의",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-brand-400 font-bold mb-3 flex items-center gap-2 text-sm font-heading">
                <FileText className="w-4 h-4" /> 1. 기획의도 (Intent) 작성 양식
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• <strong>현실 분석:</strong> 수기 관리로 인해 발생하는 비용 누수와 업무 병목 설명</li>
                <li>• <strong>해결 방안:</strong> Next.js 웹 기술을 이용한 실시간 사내 관리 허브 구축</li>
                <li>• <strong>가치 제안:</strong> 단순 기록 탈피, 데이터를 기반으로 경영 최적화 기반 조성</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-brand-400 font-bold mb-3 flex items-center gap-2 text-sm font-heading">
                <Activity className="w-4 h-4" /> 2. 핵심 프로젝트 목표 (Goals)
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• <strong>인사 관리 디지털화:</strong> 수기 출퇴근 기록의 100% 디지털 전환</li>
                <li>• <strong>생산 모니터링:</strong> 실시간 가동률 분석을 통해 고장 및 지연 대응 단축</li>
                <li>• <strong>AI 데이터 의사결정:</strong> 누적된 근태/실적을 평가하는 AI 심사 모듈 탑재</li>
              </ul>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 mb-2">📌 기획자 가이드: 구체적 목표의 SMART 법칙 적용</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              기획서의 목표는 "업무 개선"처럼 모호해선 안 됩니다. <strong>"종이 문서 보관 비용 100% 절감, 월 마감 정산 시간 5일에서 1시간으로 단축"</strong>과 같이 측정 가능하고 구체적(Specific, Measurable)으로 서술해야 경영진의 승인을 얻을 수 있습니다.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      category: "ROADMAP",
      title: "기획안 작성 2단계: 단계별 고도화 로드맵 설계",
      subtitle: "리소스 부족과 비즈니스 연속성을 고려한 3단계 개발 로드맵",
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 text-xs">
            한 번에 거대한 시스템을 개발하는 것(빅뱅 방식)은 리스크가 큽니다. 따라서 현업에 부담이 덜 가도록 단계적으로 확장하는 개발 로드맵 기획이 중요합니다.
          </p>
          <div className="relative flex flex-col md:flex-row items-stretch gap-4">
            {/* Phase 1 */}
            <div className="flex-1 p-4 rounded-xl bg-slate-900/60 border-l-4 border-brand-500 border border-slate-800/80">
              <div className="text-[10px] font-bold text-brand-400 tracking-wider">PHASE 1</div>
              <h4 className="font-heading font-bold text-slate-200 text-sm mt-1 mb-2">인사 관리 디지털화</h4>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• 50인 직원 데이터베이스화</li>
                <li>• 부서 및 역할 부여</li>
                <li>• 일별 출근/퇴근 수기 입력 자동화</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="flex-1 p-4 rounded-xl bg-slate-900/60 border-l-4 border-emerald-500 border border-slate-800/80">
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider">PHASE 2</div>
              <h4 className="font-heading font-bold text-slate-200 text-sm mt-1 mb-2">실적 모니터링</h4>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• 일일 작업 실적 등록</li>
                <li>• 설비 가동 현황 실시간 그래프</li>
                <li>• 공장 병목 구간 경보 기능</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="flex-1 p-4 rounded-xl bg-slate-900/60 border-l-4 border-amber-500 border border-slate-800/80">
              <div className="text-[10px] font-bold text-amber-400 tracking-wider">PHASE 3</div>
              <h4 className="font-heading font-bold text-slate-200 text-sm mt-1 mb-2">AI 경영 시스템화</h4>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• 누적 생산 로그 데이터 분석</li>
                <li>• GPT 기반 직원 종합 역량 평가</li>
                <li>• AI가 제안하는 생산성 피드백</li>
              </ul>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/30 border border-slate-900 text-xs text-slate-400 leading-relaxed text-center">
            🚧 <strong>기획서 작성 Tip:</strong> 단계별로 정의된 경계선은 요구사항 변경 시 프로젝트 일정이 파괴되는 것을 방지하는 법적 보호선이 됩니다.
          </div>
        </div>
      )
    },
    {
      id: 5,
      category: "FUNCTIONS",
      title: "기획안 작성 3단계: 예상 기능 및 기술 스택 상세화",
      subtitle: "구축하고자 하는 기능의 구체적 메커니즘과 스택 바인딩",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">개발 범위</th>
                  <th className="py-2.5 px-3">예상 핵심 기능</th>
                  <th className="py-2.5 px-3">기술 및 연동 방식 (Prisma 연동)</th>
                  <th className="py-2.5 px-3">상세 사양</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold text-brand-400">1차: 인사 관리</td>
                  <td className="py-3 px-3">직원 목록 조회, 사원 카드 등록, 근태 기록</td>
                  <td className="py-3 px-3">Next.js CSR, Prisma ORM, SQLite DB</td>
                  <td className="py-3 px-3">직원 데이터 영구 보존, 새로고침 시 데이터 유지</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-emerald-400">2차: 공장 현황</td>
                  <td className="py-3 px-3">실시간 라인 가동률, 개별 누적 실적 SVG 차트</td>
                  <td className="py-3 px-3">Tailwind CSS 동적 컴포넌트, Prisma API 집계</td>
                  <td className="py-3 px-3">모니터링 대시보드 내 실시간 불량률 시각화</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-amber-400">3차: AI 인사평가</td>
                  <td className="py-3 px-3">실적 로그 종합분석, 평가 피드백, 오각형 역량평가</td>
                  <td className="py-3 px-3">OpenAI gpt-4o-mini + Prisma 평가서 보존</td>
                  <td className="py-3 px-3">생성된 AI 평가 등급/줄글 보고서를 SQLite DB에 영구 저장</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <div className="mt-0.5 text-brand-400">⚙️</div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">왜 Prisma ORM + SQLite 연동인가?</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                수기 업무의 디지털 전환 핵심은 **데이터의 신뢰성과 영속성**입니다. 로컬 파일 기반 SQLite 데이터베이스와 Prisma ORM을 연동하여, 도커나 별도 DB 서버 설치 부담 없이 학생들이 백엔드 영구 저장 메커니즘을 즉시 실습할 수 있도록 설계했습니다.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      category: "AI ARCHITECTURE",
      title: "기획안 작성 4단계: AI 인사평가 메커니즘 기획",
      subtitle: "OpenAI gpt-4o-mini를 적용한 실질적 AI 평가 시스템의 설계도",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-xs">
            단순히 "인공지능 도입"이라고 적으면 개발자가 구현할 수 없습니다. AI에게 입력되는 <strong>Input 데이터</strong>와 요구하는 <strong>Output 포맷</strong>을 명확히 명시해야 합니다.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">INPUT</span>
                <h4 className="text-xs font-bold text-slate-200 mt-2 mb-1">근태 & 실적 로그 수집</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  "홍길동: 출근율 98%, 금월 생산량 1,200개, 불량률 1.2%, 교대근무 20회"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/20 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400">AI PROMPT</span>
                <h4 className="text-xs font-bold text-slate-200 mt-2 mb-1">평가 기준 전달 (Prompt)</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  "다음 공장 실적 데이터를 분석하여 5점 만점 기준의 점수(근태, 협업, 생산성, 안전성)와 줄글 총평을 반환해줘."
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">OUTPUT</span>
                <h4 className="text-xs font-bold text-slate-200 mt-2 mb-1">인사평가서 출력</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  "성실성이 우수하며, 평균 대비 불량률이 낮음. 최종 A 등급 부여 및 생산성 관리 4.8점 책정."
                </p>
              </div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <code className="text-[10px] text-brand-300 block overflow-x-auto whitespace-pre font-mono">
{`// API Request 구조
const response = await axios.post("https://api.openai.com/v1/chat/completions", {
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: promptText }],
  response_format: { type: "json_object" } // 정확히 기획된 구조로 반환받기
});`}
            </code>
          </div>
        </div>
      )
    },
    {
      id: 7,
      category: "EXPECTED RESULTS",
      title: "기획안 작성 5단계: 예상 결과 및 도입 효과 도출",
      subtitle: "기획서 통과를 위한 핵심 - 비즈니스 임팩트 수치화",
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-400 font-heading">📊 도입 전 vs 도입 후 예측 비교</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">인사 마감 및 급여 산출 소요 시간</span>
                <span className="font-bold text-red-400">매월 5일 → 2시간</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">설비 고장 시 대처 속도</span>
                <span className="font-bold text-emerald-400">현장 무전 20분 → 알림 즉시 (1분)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">인사 고과 산출 신뢰성</span>
                <span className="font-bold text-amber-400">주관성 80% → AI 데이터 기반 객관성 확보</span>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-2">🍀 기대 효과 서술 템플릿</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>정량적 효과:</strong> 사내 DX 도입으로 수기 문서 작성 시간 88% 감소, 매년 관리 부자재 및 인건비 약 1,500만원 절감 효과를 기대할 수 있습니다.
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-2.5">
                <strong>정성적 효과:</strong> 업무 투명성 강화로 직원의 직무 만족도가 상승하고, 실시간 가동률 분석을 통해 사전 안전 사고 및 설비 결함을 미연에 예방하여 한 차원 높은 안전 공장을 구현합니다.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded bg-brand-500/10 border border-brand-500/20 text-[10px] text-brand-300">
              📌 효과 분석 시 단순히 '좋아짐'이 아닌 구체적인 기대 수치를 보수적으로 적는 것이 실무 기획의 노하우입니다.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      category: "SUMMARY",
      title: "성공하는 기획서 작성을 위한 5대 핵심 체크리스트",
      subtitle: "작성을 완료하기 전, 검토해야 할 마지막 완성도 단계",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-xs">
            강의를 수강하는 학생들이 스스로 작성한 기획서를 피드백할 수 있도록 제공하는 체크리스트 템플릿입니다.
          </p>
          <div className="space-y-2">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500 shrink-0" readOnly />
              <div>
                <h4 className="text-xs font-bold text-slate-200">대상 독자(결재권자)가 이해할 수 있는 비기술적 언어를 사용했는가?</h4>
                <p className="text-[10px] text-slate-500">불필요하게 어려운 기술적 약어는 기획서의 가독성을 해칩니다.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500 shrink-0" readOnly />
              <div>
                <h4 className="text-xs font-bold text-slate-200">목표가 SMART 법칙에 따라 구체적이고 정량적으로 수치화되었는가?</h4>
                <p className="text-[10px] text-slate-500">수치는 신뢰성을 부여하며 경영진을 설득하는 가장 강력한 무기입니다.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500 shrink-0" readOnly />
              <div>
                <h4 className="text-xs font-bold text-slate-200">프로젝트 범위(Scope)와 한계(Constraints)를 분명히 설정했는가?</h4>
                <p className="text-[10px] text-slate-500">인수 테스트 조건과 불포함 사항을 명시해야 추후 분쟁이 예방됩니다.</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-center text-xs text-brand-300">
            🎓 <strong>강사 코멘트:</strong> "완벽한 코드보다 완벽한 방향성을 정의한 초안 기획서가 프로젝트의 예산과 생명을 결정합니다."
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100">
      {/* Header (No print) */}
      <header className="no-print w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-heading font-bold text-slate-200">프로젝트 기획서 작성 가이드</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "presentation" ? "document" : "presentation")}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {viewMode === "presentation" ? "인쇄용 전체 보기" : "프레젠테이션 모드"}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-brand-500/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              PDF 인쇄 (Ctrl+P)
            </button>
          </div>
        </div>
      </header>

      {/* Main Slides Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl w-full mx-auto">
        {viewMode === "presentation" ? (
          // Presentation View (Slide by Slide)
          <div className="no-print w-full max-w-4xl aspect-[16/10] bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-2xl relative">
            {/* Top Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono tracking-wider text-brand-400 font-bold bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                {slides[currentSlide].category}
              </span>
              <span className="font-mono">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Header */}
            <div className="my-6">
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-2">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Slide Body */}
            <div className="flex-1 flex flex-col justify-center min-h-[220px]">
              {slides[currentSlide].content}
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-6 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950/40 disabled:hover:text-slate-400 flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </button>

              {/* Progress dots */}
              <div className="hidden sm:flex gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-6 bg-brand-500" : "w-2.5 bg-slate-800 hover:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              {currentSlide === slides.length - 1 ? (
                <Link
                  href="/prototype"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
                >
                  프로토타입 체험하기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-all"
                >
                  다음
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          // Document View (Stacked vertical list for printing)
          <div className="w-full max-w-4xl space-y-12">
            <div className="no-print p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 text-center mb-6">
              🖨️ <strong>인쇄 팁:</strong> 아래 화면은 PDF 인쇄용 레이아웃입니다. <strong>[PDF 인쇄]</strong> 버튼이나 <strong>Ctrl + P</strong>를 눌러 인쇄 옵션에서 용지 방향을 <strong>[가로 (Landscape)]</strong>로 설정하여 저장하세요.
            </div>

            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="print-page-break bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-lg relative min-h-[500px]"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                  <span className="font-mono tracking-wider text-brand-400 font-bold bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                    {slide.category}
                  </span>
                  <span className="font-mono">
                    Slide {idx + 1} / {slides.length}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center my-6">
                  {slide.content}
                </div>

                <div className="border-t border-slate-900/60 pt-4 mt-6 text-center text-[10px] text-slate-500">
                  © 2026 DX Factory ERP Lecture Series. All Rights Reserved.
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer (No print) */}
      <footer className="no-print w-full py-4 border-t border-slate-950 bg-slate-950 text-center text-xs text-slate-500">
        <p>키보드 방향키 좌우 버튼으로 슬라이드를 넘길 수 있습니다.</p>
      </footer>
    </div>
  );
}
