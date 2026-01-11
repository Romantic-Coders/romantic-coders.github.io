---
layout: compress
---

// Mermaid 다크 테마 초기화
document.addEventListener('DOMContentLoaded', function() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',  // base 테마로 모든 색상 직접 제어
      themeVariables: {
        // 다크 모드 기본 설정
        darkMode: true,
        background: '#0d1117',

        // 노드 배경색 - 어두운 색상으로 통일
        primaryColor: '#1e3a8a',      // 진한 파란색
        secondaryColor: '#065f46',    // 진한 초록색
        tertiaryColor: '#4c1d95',     // 진한 보라색

        // 모든 텍스트를 흰색으로 - 최고 대비
        primaryTextColor: '#ffffff',
        secondaryTextColor: '#ffffff',
        tertiaryTextColor: '#ffffff',
        textColor: '#ffffff',

        // 테두리 - 밝은 색상으로 구분
        primaryBorderColor: '#3b82f6',   // 밝은 파란색
        secondaryBorderColor: '#10b981', // 밝은 초록색
        tertiaryBorderColor: '#8b5cf6',  // 밝은 보라색
        border1: '#3b82f6',
        border2: '#10b981',

        // 선과 화살표
        lineColor: '#6b7280',
        arrowheadColor: '#9ca3af',

        // 노드 배경색
        mainBkg: '#1e3a8a',
        secondBkg: '#065f46',
        tertiaryBkg: '#4c1d95',

        // 클러스터/서브그래프 - 어두운 배경, 밝은 테두리
        clusterBkg: 'rgba(30, 41, 59, 0.3)',
        clusterBorder: '#475569',

        // 화살표 라벨
        edgeLabelBackground: '#1f2937',
        edgeLabelText: '#ffffff',

        // 액터 (시퀀스 다이어그램)
        actorBkg: '#1e3a8a',
        actorBorder: '#3b82f6',
        actorTextColor: '#ffffff',
        actorLineColor: '#6b7280',

        // 시그널 (시퀀스 다이어그램)
        signalColor: '#ffffff',
        signalTextColor: '#ffffff',

        // 노트
        noteBkgColor: '#374151',
        noteTextColor: '#ffffff',
        noteBorderColor: '#6b7280',

        // 레이블 배경
        labelBackgroundColor: '#1f2937',
        labelTextColor: '#ffffff',

        // Git 그래프
        git0: '#3b82f6',
        git1: '#10b981',
        git2: '#8b5cf6',
        git3: '#f59e0b',
        git4: '#ef4444',
        git5: '#ec4899',
        git6: '#06b6d4',
        git7: '#84cc16',

        gitBranchLabel0: '#ffffff',
        gitBranchLabel1: '#ffffff',
        gitBranchLabel2: '#ffffff',
        gitBranchLabel3: '#ffffff',
        gitBranchLabel4: '#ffffff',
        gitBranchLabel5: '#ffffff',
        gitBranchLabel6: '#ffffff',
        gitBranchLabel7: '#ffffff',

        commitLabelColor: '#ffffff',
        commitLabelBackground: '#1f2937',

        // 기타
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        fontSize: '16px'
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 15
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        numberSectionStyles: 4
      }
    });
  }
});
