const NOTION_VERSION = "2022-06-28";
const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
const dryRun = process.argv.includes("--dry-run");

if (!dryRun && (!token || !databaseId)) {
  throw new Error("NOTION_TOKEN secret and NOTION_DATABASE_ID variable are required.");
}

const workouts = [
  {
    pattern: "Squat",
    name: "스쿼트 & 로우",
    strength: "백스쿼트 5회 × 4세트 · RPE 7 · 세트 간 2분",
    strengthLink: ["백스쿼트", "CrossFit back squat points of performance"],
    strengthStandard: [
      "입문: 체중의 60~80% · 체중 70kg 가정 시 42~56kg",
      "권장: 체중의 80~100% · 체중 70kg 가정 시 56~70kg",
      "상급: 체중의 100~120% · 체중 70kg 가정 시 70~84kg",
      "성공: 4세트 모두 5회 완료, 마지막 세트 RPE 8 이하",
    ],
    warmup: [
      ["로잉", "Concept2 rowing technique", "3분"],
      ["에어스쿼트", "CrossFit air squat technique", "12회"],
      ["리버스 런지", "reverse lunge proper form", "좌우 8회"],
    ],
    wodType: "13분 AMRAP",
    wod: [
      ["덤벨 고블릿 스쿼트", "dumbbell goblet squat proper form", "12회 · 15kg"],
      ["덤벨 푸시프레스", "CrossFit dumbbell push press technique", "10회 · 한 손 15kg"],
      ["버피", "CrossFit burpee technique", "8회"],
      ["로잉", "Concept2 rowing technique", "200m"],
    ],
    wodStandard: ["입문: 4~5라운드", "권장: 5~6라운드", "상급: 7라운드 이상", "최소 페이스: 라운드당 2분 30초 이내"],
  },
  {
    pattern: "Hinge/Pull",
    name: "데드리프트 & 로잉",
    strength: "데드리프트 5회 × 4세트 · RPE 7 · 세트 간 2분",
    strengthLink: ["데드리프트", "CrossFit deadlift points of performance"],
    strengthStandard: [
      "입문: 체중의 70~90% · 체중 70kg 가정 시 49~63kg",
      "권장: 체중의 100~125% · 체중 70kg 가정 시 70~87.5kg",
      "상급: 체중의 130~160% · 체중 70kg 가정 시 91~112kg",
      "성공: 4세트 모두 5회 완료, 마지막 세트 RPE 8 이하",
    ],
    warmup: [
      ["로잉", "Concept2 rowing technique", "2분"],
      ["글루트 브리지", "glute bridge proper form", "15회"],
      ["굿모닝", "barbell good morning proper form", "빈 봉 10회 × 2세트"],
    ],
    wodType: "13분 AMRAP",
    wod: [
      ["덤벨 루마니안 데드리프트", "dumbbell Romanian deadlift proper form", "12회 · 한 손 15kg"],
      ["랫풀다운", "lat pulldown proper form", "10회"],
      ["로잉", "Concept2 rowing technique", "250m"],
    ],
    wodStandard: ["입문: 4라운드", "권장: 5라운드", "상급: 6라운드 이상", "최소 페이스: 라운드당 2분 35초 이내"],
  },
  {
    pattern: "Press",
    name: "프레스 & 계단",
    strength: "벤치프레스 5회 × 4세트 · RPE 7 · 세트 간 2분",
    strengthLink: ["벤치프레스", "bench press proper form"],
    strengthStandard: [
      "입문: 체중의 45~60% · 체중 70kg 가정 시 32~42kg",
      "권장: 체중의 65~80% · 체중 70kg 가정 시 45~56kg",
      "상급: 체중의 85~100% · 체중 70kg 가정 시 60~70kg",
      "성공: 4세트 모두 5회 완료, 마지막 세트 RPE 8 이하",
    ],
    warmup: [
      ["천국의 계단", "StairMaster proper form", "2분"],
      ["푸시업", "CrossFit push up technique", "10회"],
      ["밴드 풀어파트", "band pull apart proper form", "15회"],
    ],
    wodType: "13분 EMOM",
    wod: [
      ["덤벨 푸시프레스", "CrossFit dumbbell push press technique", "1분: 10회 · 한 손 12.5kg"],
      ["버피", "CrossFit burpee technique", "2분: 8회"],
      ["천국의 계단", "StairMaster proper form", "3분: 40초"],
    ],
    wodStandard: ["입문: 10분 이상 성공", "권장: 13분 전체 성공", "상급: 반복을 2회씩 추가", "매 분 최소 15초 휴식 확보"],
  },
  {
    pattern: "Mixed full-body",
    name: "전신 덤벨 치퍼",
    strength: "덤벨 프론트 스쿼트 8회 × 4세트 · RPE 7 · 세트 간 90초",
    strengthLink: ["덤벨 프론트 스쿼트", "dumbbell front squat proper form"],
    strengthStandard: [
      "입문: 한 손 7.5~10kg",
      "권장: 한 손 12.5~15kg",
      "상급: 한 손 17.5~20kg",
      "성공: 4세트 모두 8회 완료, 마지막 세트 RPE 8 이하",
    ],
    warmup: [
      ["로잉", "Concept2 rowing technique", "2분"],
      ["인치웜", "inchworm exercise proper form", "6회"],
      ["덤벨 데드리프트", "dumbbell deadlift proper form", "가볍게 10회"],
    ],
    wodType: "13분 For Time · 타임캡 13분",
    wod: [
      ["로잉", "Concept2 rowing technique", "500m"],
      ["덤벨 워킹 런지", "dumbbell walking lunge proper form", "총 24회 · 한 손 12.5kg"],
      ["덤벨 행 파워클린", "dumbbell hang power clean technique", "총 20회 · 한 손 12.5kg"],
      ["버피", "CrossFit burpee technique", "15회"],
      ["로잉", "Concept2 rowing technique", "500m"],
    ],
    wodStandard: ["입문: 12~13분", "권장: 9~11분", "상급: 8분 이내", "13분에서 종료하고 완료 지점을 기록"],
  },
];

function seoulDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function youtube(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function text(content, link) {
  return { type: "text", text: { content, ...(link ? { link: { url: link } } : {}) } };
}

function paragraph(parts) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: parts } };
}

function heading(content, level = 2) {
  const type = `heading_${level}`;
  return { object: "block", type, [type]: { rich_text: [text(content)] } };
}

function bullet(parts) {
  return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: parts } };
}

function linkedExercise([name, query, prescription]) {
  return bullet([text(name, youtube(query)), text(` — ${prescription}`)]);
}

function plainBullets(lines) {
  return lines.map((line) => bullet([text(line)]));
}

async function notion(path, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`Notion ${response.status}: ${await response.text()}`);
  return response.json();
}

async function alreadyExists(date) {
  const result = await notion(`/databases/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify({ filter: { property: "운동일", date: { equals: date } }, page_size: 1 }),
  });
  return result.results.length > 0;
}

function buildPage(date, workout) {
  const children = [
    heading("오늘의 목표"),
    paragraph([text("총 40분 · RPE 7~8 · 정확한 자세와 일정한 페이스를 우선합니다.")]),
    heading("40분 타임라인"),
    paragraph([text("워밍업 6분 → Strength 16분 → WOD 13분 → 쿨다운 5분")]),
    heading("워밍업 — 6분"),
    ...workout.warmup.map(linkedExercise),
    heading("Strength — 16분"),
    paragraph([text(workout.strengthLink[0], youtube(workout.strengthLink[1]))]),
    paragraph([text(workout.strength)]),
    heading("Strength 기준 기록", 3),
    ...plainBullets(workout.strengthStandard),
    paragraph([text("비교용 훈련 기준이며 공식 표준이 아닙니다. 복귀 초기에는 중량보다 RPE와 자세를 우선합니다.")]),
    heading(`WOD — ${workout.wodType}`),
    ...workout.wod.map(linkedExercise),
    heading("WOD 기준 기록", 3),
    ...plainBullets(workout.wodStandard),
    heading("스케일링 및 기구 대체"),
    paragraph([text("RPE 8을 넘거나 자세가 무너지면 중량 또는 반복 수를 10~20% 낮춥니다. 로잉은 천국의 계단 45초로 대체할 수 있습니다.")]),
    heading("쿨다운 — 5분"),
    paragraph([text("천천히 걷고 오늘 사용한 부위를 가볍게 스트레칭합니다.")]),
    heading("내 운동 기록"),
    ...plainBullets([
      "Strength 사용 중량: ___ kg",
      "세트별 완료 횟수: ___",
      workout.wodType.includes("AMRAP") ? "WOD 결과: ___ 라운드 + ___회" : "WOD 결과: ___분 ___초 / 성공한 분 ___개",
      "내 RPE: ___ / 10",
      "사용한 덤벨/바벨 중량: ___ kg",
      "메모: ___",
    ]),
    paragraph([text("운동 후 데이터베이스의 내 Strength(kg), 내 WOD 기록, 내 RPE, 완료 속성에도 입력합니다.")]),
    paragraph([text("통증, 어지럼증 또는 가슴 불편감이 있으면 즉시 중단합니다.")]),
  ];

  return {
    parent: { database_id: databaseId },
    icon: { type: "emoji", emoji: "🔥" },
    properties: {
      "WOD 이름": { title: [text(`${date} | ${workout.name}`)] },
      운동일: { date: { start: date } },
      유형: { select: { name: "Strength + Metcon" } },
      "예상시간(분)": { number: 40 },
      "강도 RPE": { number: 7 },
      완료: { checkbox: false },
      기록: { rich_text: [] },
      "생성 기준": { select: { name: "자동" } },
      "내 Strength(kg)": { number: null },
      "내 WOD 기록": { rich_text: [] },
      "내 RPE": { number: null },
    },
    children,
  };
}

const date = seoulDate();
const dayNumber = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
const workout = workouts[dayNumber % workouts.length];
const page = buildPage(date, workout);

if (dryRun) {
  console.log(JSON.stringify({ date, workout: workout.name, page }, null, 2));
} else if (await alreadyExists(date)) {
  console.log(`WOD already exists for ${date}; skipping.`);
} else {
  const created = await notion("/pages", { method: "POST", body: JSON.stringify(page) });
  console.log(`Created ${date} WOD: ${created.url}`);
}

