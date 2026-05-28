"use client";

import Link from "next/link";
import { BookOpen, Cpu, Settings, ArrowRight, CheckCircle2, FileText, Code2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col justify-between">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="no-print w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              DX FACTORY ERP LECTURE
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Ver 1.0.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 py-12 z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none mb-6">
            프로젝트 기획안 작성법 강의
            <span className="block mt-2 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-300 bg-clip-text text-transparent">
              수기 관리 공장의 DX ERP 실무 사례
            </span>
          </h1>
          <p className="text-slate-400 sm:text-lg leading-relaxed">
            약 50명 규모 공장의 수기 업무 프로세스를 디지털 전환(DX)하여 사내 경영 시스템(ERP)으로 단계별 고도화하는 과정을 배웁니다.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card 1: Slides */}
          <Link href="/slides" className="group">
            <div className="glass-card h-full p-8 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors">
                  1. 강의 교안 및 슬라이드
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  프로젝트 초안, 기획의도, 개발 목표 및 예상 결과 작성을 위한 교육 자료입니다. 브라우저 인쇄 기능을 통해 전문적인 A4 PDF 파일로 변환 및 출력이 가능합니다.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    기획의도 및 DX의 필요성 논리 전개
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    1~3단계별 기능 범위 설계 및 한계 설정
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    예상 정량적/정성적 DX 도입 결과
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between text-brand-400 text-sm font-semibold">
                슬라이드 뷰어 및 PDF 인쇄
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: ERP Prototype */}
          <Link href="/prototype" className="group">
            <div className="glass-card h-full p-8 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  <Code2 className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors">
                  2. DX ERP 라이브 프로토타입
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Next.js, TailwindCSS, Axios 기반의 CSR 실습 데모입니다. 1단계 인사관리, 2단계 모니터링 대시보드, 3단계 OpenAI GPT-4o-mini 연동 기능을 실제 구동해보며 소스 코드를 확인할 수 있습니다.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    Next.js CSR 기반의 부드러운 SPA 화면 구현
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    실시간 가동 현황 SVG 대시보드 그래프
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    OpenAI API를 활용한 맞춤형 AI 인사 평가 보고서
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between text-brand-400 text-sm font-semibold">
                시스템 프로토타입 체험하기
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Tech Stack Info */}
        <div className="mt-16 w-full max-w-4xl p-6 rounded-xl border border-slate-900 bg-slate-900/20 text-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4">
            실습 강의 개발 스택
          </h3>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            <span>💻 Framework: <strong>Next.js (App Router, CSR)</strong></span>
            <span>🎨 CSS: <strong>TailwindCSS (Premium theme)</strong></span>
            <span>⚡ HTTP Client: <strong>Axios (Async/Await)</strong></span>
            <span>🧠 AI Integration: <strong>OpenAI GPT-4o-mini</strong></span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print w-full py-6 border-t border-slate-950 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 DX Factory ERP Lecture Platform. Designed for Professional Software Architecture Education.</p>
      </footer>
    </div>
  );
}
