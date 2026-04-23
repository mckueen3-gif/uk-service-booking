
import fs from 'fs';

const filePath = 'src/lib/i18n/locales/ko.ts';
let content = fs.readFileSync(filePath, 'utf8');

const target = /step1Title: "AI 진단",\s+/;
const replacement = `step1Title: "AI 진단",
      step1Desc: "즉각적인 분석과 정밀한 견적을 위해 사진을 업로드하세요.",
      step2Title: "엘리트 매칭",
      step2Desc: "영국 최고의 인증된 전문가 네트워크와 연결됩니다.",
      step3Title: "안전한 에스크로",
      step3Desc: "최종 승인 전까지 자금이 안전하게 보호됩니다.",
      step4Title: "디지털 금고",
      step4Desc: "자동화된 기록 및 전문적인 감사 준비 문서."
    },
  },
`;

if (target.test(content)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed ko.ts');
} else {
  console.log('Target not found in ko.ts');
}
