"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft, Users, Activity, Brain, Code2, Play, Plus, Trash2, Calendar, FileText, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Key, Shield, Sparkles
} from "lucide-react";

// Types matching database schema
interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string;
  status: string;
  attendanceRate: number;
  monthlyOutput: number;
  defectRate: number;
  safetyScore: number;
  logs: string;
  
  // AI Evaluations stored in DB
  aiRating?: string | null;
  aiScores?: string | null; // JSON string: {"diligence": 4.5, "productivity": 4.0, ...}
  aiSummary?: string | null;
  aiImprovement?: string | null;
}

interface AIEvaluation {
  rating: string;
  scores: {
    diligence: number;
    productivity: number;
    teamwork: number;
    safety: number;
  };
  summary: string;
  improvement: string;
}

export default function PrototypePage() {
  const [activeTab, setActiveTab] = useState<"hr" | "monitoring" | "ai" | "tutorial">("hr");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 인사 신규 등록 상태
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("생산 1팀");
  const [newRole, setNewRole] = useState("사원");
  const [newLogs, setNewLogs] = useState("");

  // AI 평가 관련 상태
  const [apiKey, setApiKey] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [evalResult, setEvalResult] = useState<AIEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evalError, setEvalError] = useState("");

  // 1. 컴포넌트 마운트 시 SQLite 데이터베이스로부터 직원 목록 가져오기 (GET)
  const fetchEmployees = async () => {
    setIsDataLoading(true);
    try {
      const response = await axios.get("/api/employees");
      setEmployees(response.data);
      if (response.data.length > 0 && !selectedEmpId) {
        setSelectedEmpId(response.data[0].id);
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. 선택된 직원이 변경되거나 직원 목록이 갱신되었을 때, DB에 저장된 AI 평가가 있다면 파싱해서 보여주기
  useEffect(() => {
    if (selectedEmpId) {
      const emp = employees.find(e => e.id === selectedEmpId);
      if (emp && emp.aiRating) {
        try {
          const scores = emp.aiScores ? JSON.parse(emp.aiScores) : { diligence: 0, productivity: 0, teamwork: 0, safety: 0 };
          setEvalResult({
            rating: emp.aiRating,
            scores: scores,
            summary: emp.aiSummary || "",
            improvement: emp.aiImprovement || ""
          });
        } catch (e) {
          console.error("AI 점수 파싱 실패:", e);
          setEvalResult(null);
        }
      } else {
        setEvalResult(null);
      }
      setEvalError("");
    }
  }, [selectedEmpId, employees]);

  // 1단계: 인사 등록 핸들러 (POST -> DB 저장)
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const response = await axios.post("/api/employees", {
        name: newName,
        department: newDept,
        role: newRole,
        joinDate: new Date().toISOString().split("T")[0],
        status: "근무중",
        attendanceRate: 95 + Math.floor(Math.random() * 6), // 95~100% 랜덤 생성
        monthlyOutput: newDept.includes("인사") ? 0 : 800 + Math.floor(Math.random() * 700), // 800~1500개
        defectRate: newDept.includes("인사") ? 0.0 : Number((0.1 + Math.random() * 2.5).toFixed(1)), // 0.1~2.6%
        safetyScore: 80 + Math.floor(Math.random() * 21), // 80~100점
        logs: newLogs || "현장 관찰기록이 존재하지 않습니다.",
      });

      setEmployees([...employees, response.data]);
      setSelectedEmpId(response.data.id);
      setNewName("");
      setNewLogs("");
      alert("사원이 데이터베이스에 등록되었습니다.");
    } catch (err: any) {
      console.error(err);
      alert("사원 추가에 실패했습니다: " + err.message);
    }
  };

  // 1단계: 사원 삭제 핸들러 (DELETE -> DB 삭제)
  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("정말 이 사원 정보를 데이터베이스에서 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      if (selectedEmpId === id) {
        setSelectedEmpId(employees.length > 1 ? employees[0].id : "");
      }
      alert("사원 정보가 DB에서 제거되었습니다.");
    } catch (err: any) {
      console.error(err);
      alert("삭제 실패: " + err.message);
    }
  };

  // 3단계: OpenAI API 활용 AI 인사평가 구동 & DB 영구 저장 (PUT)
  const runAIEvaluation = async (emp: Employee) => {
    setIsLoading(true);
    setEvalError("");
    setEvalResult(null);

    const promptText = `
    다음은 공장 직원의 정보 및 한 달 동안 축적된 현장 업무 로그입니다.
    이 데이터를 바탕으로 인사 평가를 진행하고 결과를 지정된 JSON 포맷으로 응답해 주세요.

    [직원 정보]
    이름: ${emp.name}
    부서: ${emp.department}
    직급: ${emp.role}
    근태율: ${emp.attendanceRate}%
    월간 생산량: ${emp.monthlyOutput}개 (생산 부서가 아닐 경우 0)
    불량률: ${emp.defectRate}%
    안전 점수: ${emp.safetyScore}점 (100점 만점)

    [현장 업무 로그]
    "${emp.logs}"

    [필수 응답 JSON 포맷]
    반드시 마크다운 코드 블록이나 설명 텍스트 없이 아래 형식의 완벽한 JSON 오브젝트 하나만 반환해줘:
    {
      "rating": "최종 등급 (S, A, B, C, D 중 택 1)",
      "scores": {
        "diligence": 근태 점수 (1.0 ~ 5.0 실수),
        "productivity": 생산성 점수 (1.0 ~ 5.0 실수, 비생산 부서는 4.0 기본 부여),
        "teamwork": 협업 점수 (1.0 ~ 5.0 실수),
        "safety": 안전 점수 (1.0 ~ 5.0 실수)
      },
      "summary": "종합 평가 요약 (한글 2줄 이내)",
      "improvement": "업무 성과 및 태도 개선을 위한 구체적 제안 (한글 2줄 이내)"
    }
    `;

    let generatedEval: AIEvaluation;

    // API Key가 없으면 시뮬레이션 모드로 작동 (교육용 및 결제 리스크 방지)
    if (!apiKey.trim()) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      generatedEval = {
        rating: emp.attendanceRate > 95 && emp.safetyScore > 90 ? "A" : emp.attendanceRate < 90 ? "C" : "B",
        scores: {
          diligence: Number((emp.attendanceRate / 20).toFixed(1)),
          productivity: emp.monthlyOutput > 1200 ? 4.8 : emp.monthlyOutput > 900 ? 4.2 : 3.5,
          teamwork: emp.logs.includes("협업") || emp.logs.includes("완수") || emp.logs.includes("우수") ? 4.5 : 3.8,
          safety: Number((emp.safetyScore / 20).toFixed(1)),
        },
        summary: `[시뮬레이션] ${emp.name}님은 성실하게 직무에 임하고 있으며, 근태 ${emp.attendanceRate}% 및 불량률 ${emp.defectRate}%의 안정적 기록을 보여줍니다.`,
        improvement: `안전 규칙 준수를 강화하고 동료들과의 조율 능력을 발전시키면 차기 리더급으로 성장이 가능합니다.`
      };
    } else {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "당신은 한국의 제조 공장 전문 인사 평가원입니다. 데이터에 근거해 객관적이고 건설적인 피드백을 제공합니다."
              },
              {
                role: "user",
                content: promptText
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        const jsonStr = response.data.choices[0].message.content;
        generatedEval = JSON.parse(jsonStr) as AIEvaluation;
      } catch (err: any) {
        console.error(err);
        setEvalError("AI 인사 평가 요청 중 오류가 발생했습니다. API Key를 다시 확인해주세요.");
        setIsLoading(false);
        return;
      }
    }

    // AI 평가 결과를 SQLite 데이터베이스에 영구 보존하기 위해 PUT API 호출
    try {
      const response = await axios.put(`/api/employees/${emp.id}`, {
        ...emp,
        aiRating: generatedEval.rating,
        aiScores: JSON.stringify(generatedEval.scores),
        aiSummary: generatedEval.summary,
        aiImprovement: generatedEval.improvement
      });

      // 로컬 사원 리스트 상태 업데이트
      setEmployees(employees.map(e => e.id === emp.id ? response.data : e));
      setEvalResult(generatedEval);
    } catch (dbErr: any) {
      console.error("평가 데이터 DB 저장 실패:", dbErr);
      setEvalError("AI 분석은 완료되었으나, 데이터베이스 저장에 실패했습니다: " + dbErr.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentEmp = employees.find(emp => emp.id === selectedEmpId) || employees[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-heading font-bold text-slate-200">DX ERP 실습 프로토타입</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("hr")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "hr" ? "bg-brand-500 text-white" : "border border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              1단계: 인사관리 (DB)
            </button>
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "monitoring" ? "bg-brand-500 text-white" : "border border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              2단계: 업무현황
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "ai" ? "bg-brand-500 text-white" : "border border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              3단계: AI 평가 (DB저장)
            </button>
            <button
              onClick={() => setActiveTab("tutorial")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "tutorial" ? "bg-brand-600 text-white" : "border border-slate-800 text-brand-400 hover:bg-slate-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              실습 가이드 & DB 코드
            </button>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col justify-start">
        
        {/* Loader while fetching from DB */}
        {isDataLoading && activeTab !== "tutorial" && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mb-4" />
            <p className="text-xs text-slate-500">SQLite 파일 데이터베이스에서 직원 데이터를 불러오는 중...</p>
          </div>
        )}

        {/* Tab 1: 인사관리 (HR) */}
        {!isDataLoading && activeTab === "hr" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold">1단계: 디지털 인사관리 (SQLite DB 연동)</h1>
                <p className="text-xs text-slate-400 mt-1">
                  SQLite 테이블 데이터베이스에 연동된 실시간 근로자 리스트입니다.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Employee Input Form */}
              <div className="glass-panel p-6 rounded-xl h-fit">
                <h3 className="font-heading text-sm font-bold text-brand-400 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> 신규 사원 등록
                </h3>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">이름</label>
                    <input
                      type="text"
                      placeholder="예: 홍길동"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full glass-input text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">부서</label>
                      <select
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="w-full glass-input text-xs font-sans"
                      >
                        <option value="생산 1팀">생산 1팀</option>
                        <option value="생산 2팀">생산 2팀</option>
                        <option value="품질 검사팀">품질 검사팀</option>
                        <option value="인사 총무팀">인사 총무팀</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">직급</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full glass-input text-xs"
                      >
                        <option value="사원">사원</option>
                        <option value="대리">대리</option>
                        <option value="조장">조장</option>
                        <option value="팀장">팀장</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">근무 및 실적 로그 (AI 평가 대상)</label>
                    <textarea
                      placeholder="근태 상태, 생산 실적, 동료 협업 성향 등을 기록해주세요."
                      value={newLogs}
                      onChange={(e) => setNewLogs(e.target.value)}
                      rows={4}
                      className="w-full glass-input text-xs resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/10"
                  >
                    DB에 사원 등록
                  </button>
                </form>
              </div>

              {/* Employees List */}
              <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-900 bg-slate-900/30 flex justify-between items-center">
                  <h3 className="font-heading text-sm font-bold text-slate-200">데이터베이스 인원 ({employees.length}명)</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-mono">SQLite: dev.db</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400">
                        <th className="py-3 px-4">이름</th>
                        <th className="py-3 px-4">부서 / 직급</th>
                        <th className="py-3 px-4">입사일</th>
                        <th className="py-3 px-4">AI 평가여부</th>
                        <th className="py-3 px-4 text-center">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            {emp.name}
                            <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{emp.id}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-200">{emp.department}</span>
                            <span className="text-slate-500 text-[10px] ml-1.5">[{emp.role}]</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{emp.joinDate}</td>
                          <td className="py-3.5 px-4">
                            {emp.aiRating ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-500/10 text-brand-400">
                                완료 (등급: {emp.aiRating})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-500">
                                미평가
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 업무현황 & 모니터링 (Monitoring) */}
        {!isDataLoading && activeTab === "monitoring" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="font-heading text-2xl font-bold">2단계: 실시간 현장 가동률 및 모니터링 (DB 기반)</h1>
              <p className="text-xs text-slate-400 mt-1">데이터베이스에서 실시간으로 집계된 생산 관련 시각화 데이터입니다.</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">전체 등록 인원</span>
                <div className="text-2xl font-heading font-black text-brand-400 mt-1">{employees.length}명</div>
                <span className="text-[9px] text-slate-400">DB 실시간 연동 중</span>
              </div>
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">평균 가동률</span>
                <div className="text-2xl font-heading font-black text-emerald-400 mt-1">
                  {(employees.reduce((acc, emp) => acc + emp.attendanceRate, 0) / (employees.length || 1)).toFixed(1)}%
                </div>
                <span className="text-[9px] text-emerald-500/70">근태율 환산 평균</span>
              </div>
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">총 생산 실적</span>
                <div className="text-2xl font-heading font-black text-brand-400 mt-1">
                  {employees.reduce((acc, emp) => acc + emp.monthlyOutput, 0).toLocaleString()}개
                </div>
                <span className="text-[9px] text-brand-500/70">생산부서 전체 누계</span>
              </div>
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">평균 불량률</span>
                <div className="text-2xl font-heading font-black text-red-400 mt-1">
                  {(employees.reduce((acc, emp) => acc + emp.defectRate, 0) / (employees.filter(e => e.monthlyOutput > 0).length || 1)).toFixed(1)}%
                </div>
                <span className="text-[9px] text-red-500/70">허용 오차 범위 2.0%</span>
              </div>
            </div>

            {/* Interactive SVG charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Graph */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="font-heading text-sm font-bold text-slate-200 mb-4">DB 등록 사원 생산량 비교 (개)</h3>
                <div className="h-60 flex flex-col justify-end gap-3 pt-6 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-y-0 left-10 right-0 border-b border-slate-800 flex flex-col justify-between py-6 text-[9px] text-slate-500 pointer-events-none">
                    <span>1,500</span>
                    <span>1,000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex justify-around items-end h-full pl-10 z-10">
                    {employees.filter(emp => emp.monthlyOutput > 0).slice(0, 7).map((emp) => {
                      const percent = (emp.monthlyOutput / 1500) * 100;
                      return (
                        <div key={emp.id} className="flex flex-col items-center gap-2 group w-12">
                          <div className="text-[9px] font-mono text-brand-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {emp.monthlyOutput}
                          </div>
                          <div
                            style={{ height: `${percent}%` }}
                            className="w-8 rounded-t bg-gradient-to-t from-brand-600 to-brand-400 group-hover:from-brand-500 group-hover:to-brand-300 transition-all duration-500 shadow-md shadow-brand-500/10"
                          />
                          <span className="text-[10px] text-slate-300 font-bold">{emp.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quality & Safety Map */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="font-heading text-sm font-bold text-slate-200 mb-4">품질-안전 산포도 (불량률 vs 안전점수)</h3>
                <div className="h-60 flex items-center justify-center relative p-4 border border-slate-800/50 rounded-lg">
                  <div className="absolute left-6 bottom-6 right-6 top-6 flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-full border-l border-b border-slate-800 flex justify-between items-start text-[8px] text-slate-500 p-2">
                      <span className="transform -rotate-90 origin-left mt-2">← 불량률 (%)</span>
                      <span>안전 점수 (점) →</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 m-12 z-10">
                    {employees.map((emp) => {
                      const yVal = Math.max(0, Math.min(100, 100 - (emp.defectRate / 3) * 100));
                      const xVal = Math.max(0, Math.min(100, ((emp.safetyScore - 70) / 30) * 100));

                      return (
                        <div
                          key={emp.id}
                          style={{ bottom: `${yVal}%`, left: `${xVal}%` }}
                          className="absolute group transform -translate-x-1/2 translate-y-1/2"
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-white hover:scale-125 transition-transform cursor-pointer shadow-lg flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 border border-slate-800 text-[10px] rounded p-2 whitespace-nowrap z-50 shadow-2xl">
                            <div className="font-bold text-white">{emp.name} ({emp.role})</div>
                            <div className="text-slate-400">안전: {emp.safetyScore}점 | 불량: {emp.defectRate}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI 인사평가 (AI Evaluation) */}
        {!isDataLoading && activeTab === "ai" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="font-heading text-2xl font-bold">3단계: AI 경영 및 인사평가 (결과 DB 자동 누적)</h1>
              <p className="text-xs text-slate-400 mt-1">
                OpenAI GPT 모델을 통해 추출한 평가서를 SQLite DB에 영구 저장하여, 다른 직원을 보고 돌아와도 기록이 보존됩니다.
              </p>
            </div>

            {/* API Key configuration */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">OpenAI API Key 설정</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">키가 없어도 시뮬레이션 모드로 평점이 자동으로 DB에 세이브됩니다.</p>
                </div>
              </div>
              <div className="w-full md:w-80 flex gap-2">
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 glass-input text-xs h-9"
                />
                <span className="px-2.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold flex items-center justify-center">
                  {apiKey.trim() ? "실제 API 연동" : "시뮬레이션"}
                </span>
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="p-10 border border-slate-900 bg-slate-900/10 rounded-xl text-center text-xs text-slate-500">
                인사관리 탭에서 먼저 사원을 등록해주세요.
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Employee Selection List */}
                <div className="glass-panel rounded-xl overflow-hidden h-fit">
                  <div className="px-5 py-3 border-b border-slate-900 bg-slate-900/30">
                    <h3 className="font-heading text-xs font-bold text-slate-400 uppercase">평가 대상 사원 선택</h3>
                  </div>
                  <div className="divide-y divide-slate-900 max-h-96 overflow-y-auto">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => setSelectedEmpId(emp.id)}
                        className={`w-full p-4 flex items-center justify-between transition-colors text-left ${
                          selectedEmpId === emp.id ? "bg-brand-500/10" : "hover:bg-slate-900/40"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{emp.department} • {emp.role}</div>
                        </div>
                        {emp.aiRating ? (
                          <span className="text-[9px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full shadow shadow-brand-500/30">
                            {emp.aiRating}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">미등록</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evaluation Detail & Execute */}
                {currentEmp && (
                  <div className="lg:col-span-2 space-y-6">
                    {/* Employee Info Detail */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded">
                            {currentEmp.id}
                          </span>
                          <h2 className="font-heading text-xl font-bold mt-2">{currentEmp.name} {currentEmp.role}</h2>
                          <p className="text-slate-400 text-xs mt-0.5">{currentEmp.department} • 입사일: {currentEmp.joinDate}</p>
                        </div>
                        <button
                          onClick={() => runAIEvaluation(currentEmp)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold rounded-lg text-white shadow-lg shadow-brand-500/15 flex items-center gap-1.5 transition-all"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          AI 인사 평가 실행 및 DB저장
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-900 text-xs">
                        <div>
                          <div className="text-slate-500 text-[10px]">근태율</div>
                          <div className="font-bold text-white mt-0.5">{currentEmp.attendanceRate}%</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">월 생산량</div>
                          <div className="font-bold text-white mt-0.5">{currentEmp.monthlyOutput > 0 ? `${currentEmp.monthlyOutput}개` : "-"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">불량률</div>
                          <div className="font-bold text-white mt-0.5">{currentEmp.monthlyOutput > 0 ? `${currentEmp.defectRate}%` : "-"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">현장 안전 점수</div>
                          <div className="font-bold text-white mt-0.5">{currentEmp.safetyScore}점</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">관찰 로그 (AI 프롬프트 인풋)</h4>
                        <p className="p-4 rounded-lg bg-slate-950/60 border border-slate-900 text-xs text-slate-300 leading-relaxed font-mono">
                          "{currentEmp.logs}"
                        </p>
                      </div>
                    </div>

                    {/* AI Analysis Result Board */}
                    {isLoading && (
                      <div className="glass-panel p-10 rounded-xl flex flex-col items-center justify-center text-center">
                        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mb-4" />
                        <h4 className="text-sm font-bold text-white">AI 인사평가 보고서 분석 중...</h4>
                        <p className="text-[11px] text-slate-500 mt-1">OpenAI gpt-4o-mini 모델을 사용하여 DB 레코드에 평가 보고서를 갱신하고 있습니다.</p>
                      </div>
                    )}

                    {evalError && (
                      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {evalError}
                      </div>
                    )}

                    {evalResult && (
                      <div className="glass-panel p-6 rounded-xl border-l-4 border-brand-500 animate-fadeIn space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading text-sm font-bold text-slate-200 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-brand-400" />
                            공식 AI 인사평가서 (SQLite DB 연동 완료)
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">최종 등급:</span>
                            <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-heading font-black text-sm flex items-center justify-center shadow-lg shadow-brand-500/30">
                              {evalResult.rating}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3.5">
                            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">평점 오각형 지표 (5.0 만점)</h4>
                            
                            <div className="space-y-3">
                              {/* diligence */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                  <span>근태 성실성</span>
                                  <span className="font-bold">{evalResult.scores.diligence} / 5.0</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800">
                                  <div style={{ width: `${(evalResult.scores.diligence / 5) * 100}%` }} className="h-full bg-brand-500 rounded-full" />
                                </div>
                              </div>

                              {/* productivity */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                  <span>생산 효율성</span>
                                  <span className="font-bold">{evalResult.scores.productivity} / 5.0</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800">
                                  <div style={{ width: `${(evalResult.scores.productivity / 5) * 100}%` }} className="h-full bg-brand-500 rounded-full" />
                                </div>
                              </div>

                              {/* teamwork */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                  <span>협업 및 소통</span>
                                  <span className="font-bold">{evalResult.scores.teamwork} / 5.0</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800">
                                  <div style={{ width: `${(evalResult.scores.teamwork / 5) * 100}%` }} className="h-full bg-brand-500 rounded-full" />
                                </div>
                              </div>

                              {/* safety */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                  <span>안전 수칙 준수</span>
                                  <span className="font-bold">{evalResult.scores.safety} / 5.0</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800">
                                  <div style={{ width: `${(evalResult.scores.safety / 5) * 100}%` }} className="h-full bg-brand-500 rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">종합 요약</h5>
                              <p className="text-xs text-slate-300 leading-relaxed font-mono p-3 bg-slate-950/40 rounded-lg border border-slate-900">
                                {evalResult.summary}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">개선 제안 사항</h5>
                              <p className="text-xs text-brand-300 leading-relaxed font-mono p-3 bg-brand-500/5 rounded-lg border border-brand-500/10">
                                {evalResult.improvement}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: 실습 실무 가이드 & DB 코드 (Tutorial) */}
        {activeTab === "tutorial" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="font-heading text-2xl font-bold">4단계: Prisma ORM 및 SQLite DB 연동 강의 실습 가이드</h1>
              <p className="text-xs text-slate-400 mt-1">학생들이 직접 프로젝트에 데이터베이스를 장착하고 CRUD 라우트를 구축할 수 있도록 핵심 코드 스니펫을 순서대로 제시합니다.</p>
            </div>

            <div className="space-y-6">
              {/* Database Step 1 */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 font-heading">
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  Prisma schema.prisma 테이블 정의
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed pl-7">
                  SQLite 데이터베이스 파일에 연결되도록 스키마를 구성합니다. 사원의 수치 데이터와 AI 평가 정보(Rating, Scores, Summary, Improvement)를 저장할 필드를 설정합니다.
                </p>
                <div className="pl-7">
                  <code className="text-[10px] text-brand-300 block overflow-x-auto whitespace-pre font-mono bg-slate-950/80 p-4 rounded-lg border border-slate-900">
{`// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Employee {
  id             String   @id @default(uuid())
  name           String
  department     String
  role           String
  joinDate       String
  status         String
  attendanceRate Float
  monthlyOutput  Int
  defectRate     Float
  safetyScore    Float
  logs           String
  
  // AI 인사평가 보존용 테이블 필드 추가
  aiRating       String?
  aiScores       String?  // JSON string
  aiSummary      String?
  aiImprovement  String?
}`}
                  </code>
                </div>
              </div>

              {/* Database Step 2 */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 font-heading">
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  Next.js 백엔드 API Routes 설정 (GET / POST)
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed pl-7">
                  Next.js App Router 백엔드를 사용해 데이터베이스 CRUD를 담당할 API 라우트를 개설합니다. 최초 DB 실행 시 데이터가 비어있으면 기본 사원 리스트를 자동으로 밀어 넣는(Seed) 교육용 자가 시딩 코드도 구현합니다.
                </p>
                <div className="pl-7">
                  <code className="text-[10px] text-brand-300 block overflow-x-auto whitespace-pre font-mono bg-slate-950/80 p-4 rounded-lg border border-slate-900">
{`// src/app/api/employees/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 싱글톤 클라이언트

export async function GET() {
  const count = await prisma.employee.count();
  if (count === 0) {
    // DB가 비어있으면 초기 5인 사원 자동 시딩
    await prisma.employee.createMany({ data: DEFAULT_MOCK_DATA });
  }
  const employees = await prisma.employee.findMany({ orderBy: { joinDate: "asc" } });
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEmp = await prisma.employee.create({
    data: {
      name: body.name,
      department: body.department,
      role: body.role,
      attendanceRate: body.attendanceRate,
      logs: body.logs,
      // ...나머지 필드 추가
    }
  });
  return NextResponse.json(newEmp);
}`}
                  </code>
                </div>
              </div>

              {/* Database Step 3 */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 font-heading">
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  Axios 프론트엔드 연동 및 DB 갱신
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed pl-7">
                  클라이언트 사이드(`use client`)에서 컴포넌트 마운트 시 `useEffect`를 사용해 Axios로 GET 요청을 날려 사원 정보를 가져오고, AI 평가 결과를 돌려받는 즉시 `axios.put`을 사용해 SQLite DB에 업그레이드합니다.
                </p>
                <div className="pl-7">
                  <code className="text-[10px] text-brand-300 block overflow-x-auto whitespace-pre font-mono bg-slate-950/80 p-4 rounded-lg border border-slate-900">
{`// src/app/prototype/page.tsx (클라이언트 연동 핵심 스니펫)
useEffect(() => {
  // DB 로드
  axios.get("/api/employees").then(res => setEmployees(res.data));
}, []);

// AI 평가 완료 후 DB에 누적 저장
const saveEvaluation = async (empId, aiResult) => {
  const res = await axios.put(\`/api/employees/\${empId}\`, {
    aiRating: aiResult.rating,
    aiScores: JSON.stringify(aiResult.scores),
    aiSummary: aiResult.summary,
    aiImprovement: aiResult.improvement
  });
  
  // 로컬 상태 동기화
  setEmployees(prev => prev.map(e => e.id === empId ? res.data : e));
};`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-950 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 DX Factory ERP. Built with Next.js, Prisma, SQLite, and OpenAI.</p>
      </footer>
    </div>
  );
}
