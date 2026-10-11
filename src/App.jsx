import React, { useEffect, useState } from "react";
import { Shield, Zap, Puzzle, Home, ArrowRight, RotateCcw, CheckCircle2, XCircle, Trophy, Timer } from "lucide-react";

/* ============ DỮ LIỆU ============ */
const SHELTER = [
  { t: "Đứng dưới gốc cây to khi trời có sấm sét", safe: false, why: "Cây cao dễ bị sét đánh. Hãy vào trong nhà hoặc nhà kiên cố." },
  { t: "Chui xuống gầm bàn chắc chắn khi động đất", safe: true, why: "Gầm bàn che đầu khỏi vật rơi. Nhớ giữ chặt chân bàn!" },
  { t: "Ở trong nhà kiên cố khi có bão", safe: true, why: "Nhà kiên cố, đóng kín cửa là nơi trú ẩn an toàn khi bão." },
  { t: "Chơi gần bờ sông khi nước lũ dâng cao", safe: false, why: "Nước lũ chảy xiết có thể cuốn người đi. Hãy tránh xa bờ sông." },
  { t: "Chạy lên nơi cao khi có cảnh báo sóng thần", safe: true, why: "Sóng thần rất nhanh, phải di chuyển lên cao càng sớm càng tốt." },
  { t: "Dùng thang máy khi có động đất", safe: false, why: "Thang máy có thể kẹt hoặc rơi. Hãy đi cầu thang bộ." },
  { t: "Đứng ngoài ban công ngắm bão", safe: false, why: "Gió bão có thể làm vỡ kính, thổi bay vật nặng rất nguy hiểm." },
  { t: "Ra bãi đất trống, xa nhà cao tầng và dây điện khi động đất", safe: true, why: "Nơi thoáng đãng giúp tránh gạch đá, kính vỡ và dây điện rơi." },
  { t: "Lội qua dòng nước lũ để đi học cho kịp giờ", safe: false, why: "Không bao giờ lội qua dòng nước chảy xiết. An toàn quan trọng hơn!" },
  { t: "Rút phích cắm thiết bị điện và vào nhà khi có giông sét", safe: true, why: "Giảm nguy cơ bị điện giật và hư hỏng đồ dùng do sét." },
];

const REFLEX = [
  { q: "Động đất! Em chạy đến đâu để trú?", left: "GẦM BÀN CHẮC CHẮN", right: "CỬA KÍNH LỚN", answer: "left", why: "Cửa kính có thể vỡ, gầm bàn chắc chắn bảo vệ đầu." },
  { q: "Sấm sét đùng đùng! Em nên ở đâu?", left: "TRONG NHÀ", right: "DƯỚI GỐC CÂY", answer: "left", why: "Cây cao dễ hút sét, hãy vào trong nhà." },
  { q: "Nước lũ đang dâng! Em chạy đi đâu?", left: "XUỐNG BỜ SÔNG", right: "LÊN NƠI CAO", answer: "right", why: "Lên nơi cao để tránh nước lũ dâng." },
  { q: "Có cảnh báo sóng thần! Em phải làm gì?", left: "RA XEM BIỂN", right: "CHẠY LÊN CAO", answer: "right", why: "Sóng thần rất nhanh, hãy rời khỏi bờ biển ngay!" },
  { q: "Bão đến gần! Em chọn cách nào?", left: "ĐÓNG KÍN CỬA NHÀ", right: "RA SÂN CHƠI", answer: "left", why: "Đóng chặt cửa, ở trong nhà cho đến khi bão tan." },
  { q: "Đang trong nhà cao tầng, động đất xảy ra!", left: "ĐI CẦU THANG BỘ", right: "ĐI THANG MÁY", answer: "left", why: "Thang máy dễ bị kẹt khi mất điện hoặc rung lắc." },
  { q: "Cần chuẩn bị gì cho mùa bão lũ?", left: "ĐÈN PIN, NƯỚC, LƯƠNG KHÔ", right: "ĐỒ CHƠI, KẸO BÁNH", answer: "left", why: "Chuẩn bị đồ thiết yếu để tự bảo vệ khi cần." },
  { q: "Gặp dây điện đứt rơi xuống đường ngập nước!", left: "ĐI LẠI GẦN XEM", right: "TRÁNH XA & BÁO NGƯỜI LỚN", answer: "right", why: "Dây điện đứt rất nguy hiểm, nước dẫn điện." },
];

const PUZZLE = {
  title: "BÃO",
  message: "Khi có bão: ở trong nhà kiên cố, đóng chặt cửa, chuẩn bị đèn pin – nước uống – lương khô và nghe theo cảnh báo của chính quyền!",
  pieces: [
    { q: "Khi có bão, nơi an toàn nhất là:", o: ["Ngoài bờ biển", "Trong nhà kiên cố", "Dưới gốc cây", "Trên mái nhà"], a: 1 },
    { q: "Trước bão, em nên chuẩn bị:", o: ["Đèn pin, nước uống", "Pháo hoa", "Diều giấy", "Bóng đá"], a: 0 },
    { q: "Khi bão đến, cửa sổ nên:", o: ["Mở toang", "Đóng chặt, gia cố", "Tháo ra", "Dán hình"], a: 1 },
    { q: "Em nên theo dõi thông tin bão từ:", o: ["Tin đồn", "Bạn bè đoán", "Đài khí tượng, loa phường", "Trò chơi điện tử"], a: 2 },
    { q: "Khi mất điện do bão, em nên dùng:", o: ["Nến để cạnh rèm", "Đèn pin", "Bật lửa trong phòng kín", "Đèn dầu để sát giường"], a: 1 },
    { q: "Sau bão, em không nên:", o: ["Chạm vào dây điện đứt", "Nghe người lớn dặn", "Giữ vệ sinh nước", "Báo người lớn nếu thấy nguy hiểm"], a: 0 },
  ],
};

/* ============ TIỆN ÍCH CHUNG ============ */
const Styles = () => (
  <style>{`
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-14px)}40%{transform:translateX(14px)}60%{transform:translateX(-10px)}80%{transform:translateX(10px)}}
    .shake{animation:shake .5s}
    @keyframes fall{0%{transform:translateY(-10vh) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:.9}}
    .confetti{position:fixed;top:0;font-size:2.5rem;animation:fall 2.2s linear forwards;pointer-events:none;z-index:50}
    @keyframes pop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    .pop{animation:pop .45s}
  `}</style>
);

const Confetti = () => (
  <>
    {Array.from({ length: 30 }, (_, i) => (
      <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.12}s` }}>
        {["🎉", "⭐", "🎊", "✨"][i % 4]}
      </span>
    ))}
  </>
);

const Shell = ({ title, icon, onBack, right, children }) => (
  <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <button onClick={onBack} className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 transition px-6 py-4 rounded-2xl text-2xl font-bold">
        <Home size={32} /> Quay lại Menu
      </button>
      <h1 className="text-4xl font-black flex items-center gap-3">{icon} {title}</h1>
      <div className="text-3xl font-bold min-w-[12rem] text-right">{right}</div>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center">{children}</div>
  </div>
);

const Result = ({ score, total, onRestart }) => (
  <div className="text-center pop">
    <Trophy size={160} className="mx-auto text-yellow-400 animate-bounce" />
    <p className="text-6xl font-black mt-6">Hoàn thành!</p>
    <p className="text-5xl mt-6">Đúng <span className="text-green-400">{score}/{total}</span> câu</p>
    <button onClick={onRestart} className="mt-10 bg-blue-600 hover:bg-blue-500 hover:scale-105 transition p-8 rounded-3xl text-4xl font-black inline-flex items-center gap-4">
      <RotateCcw size={40} /> Chơi lại
    </button>
  </div>
);

const NextBtn = ({ onClick, last }) => (
  <button onClick={onClick} className="mt-8 bg-yellow-400 text-slate-900 hover:scale-105 transition p-8 rounded-3xl text-3xl font-black inline-flex items-center gap-3 animate-pulse">
    {last ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight size={36} />
  </button>
);

/* ============ GAME 1 ============ */
function ShelterGame({ onBack }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [fb, setFb] = useState(null); // null | "ok" | "bad"
  const done = i >= SHELTER.length;
  const cur = SHELTER[i];

  const pick = (safe) => {
    if (fb) return;
    const ok = safe === cur.safe;
    setFb(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
  };
  const next = () => { setFb(null); setI(i + 1); };
  const restart = () => { setI(0); setScore(0); setFb(null); };

  return (
    <Shell title="Thử Thách Tìm Nơi Trú Ẩn" icon={<Shield size={44} />} onBack={onBack}
      right={!done && `Câu ${i + 1}/${SHELTER.length} • ⭐ ${score}`}>
      {fb === "ok" && <Confetti />}
      {done ? <Result score={score} total={SHELTER.length} onRestart={restart} /> : (
        <div className="w-full max-w-6xl text-center">
          <div className={`rounded-3xl p-12 text-5xl font-black leading-snug border-8 ${fb === "ok" ? "border-green-400 bg-green-900/40" : fb === "bad" ? "border-red-500 bg-red-900/40 shake" : "border-slate-600 bg-slate-800"}`}>
            {cur.t}
          </div>
          {fb ? (
            <div className="pop mt-8">
              <p className={`text-5xl font-black flex items-center justify-center gap-4 ${fb === "ok" ? "text-green-400" : "text-red-400"}`}>
                {fb === "ok" ? <><CheckCircle2 size={56} /> Chính xác! 🎉</> : <><XCircle size={56} /> Chưa đúng rồi!</>}
              </p>
              <p className="text-3xl mt-4 text-slate-200">Đáp án: <b>{cur.safe ? "AN TOÀN" : "NGUY HIỂM"}</b>. {cur.why}</p>
              <NextBtn onClick={next} last={i === SHELTER.length - 1} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 mt-10">
              <button onClick={() => pick(true)} className="bg-green-500 hover:bg-green-400 hover:scale-105 transition p-12 rounded-3xl text-6xl font-black shadow-2xl">✅ AN TOÀN</button>
              <button onClick={() => pick(false)} className="bg-red-600 hover:bg-red-500 hover:scale-105 transition p-12 rounded-3xl text-6xl font-black shadow-2xl">⚠️ NGUY HIỂM</button>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}

/* ============ GAME 2 ============ */
const SECONDS = 10;
function ReflexGame({ onBack }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [res, setRes] = useState(null); // null | "ok" | "bad" | "timeout"
  const done = i >= REFLEX.length;
  const cur = REFLEX[i];

  useEffect(() => {
    if (done || res) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, +(l - 0.1).toFixed(1))), 100);
    return () => clearInterval(t);
  }, [done, res, i]);

  useEffect(() => { if (left === 0 && !res) setRes("timeout"); }, [left, res]);

  const pick = (side) => {
    if (res) return;
    const ok = side === cur.answer;
    setRes(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
  };
  const next = () => { setRes(null); setLeft(SECONDS); setI(i + 1); };
  const restart = () => { setI(0); setScore(0); setLeft(SECONDS); setRes(null); };
  const pct = (left / SECONDS) * 100;

  return (
    <Shell title="Phản Xạ Sinh Tồn" icon={<Zap size={44} />} onBack={onBack}
      right={!done && `Câu ${i + 1}/${REFLEX.length} • ⭐ ${score}`}>
      {res === "ok" && <Confetti />}
      {done ? <Result score={score} total={REFLEX.length} onRestart={restart} /> : (
        <div className="w-full max-w-7xl text-center">
          <div className="flex items-center gap-4 mb-6">
            <Timer size={48} className={left <= 3 && !res ? "text-red-400 animate-bounce" : ""} />
            <div className="flex-1 h-10 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-100 ease-linear ${left <= 3 ? "bg-red-500 animate-pulse" : left <= 6 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-5xl font-black w-24">{Math.ceil(left)}s</span>
          </div>
          <p className={`text-5xl font-black mb-10 ${res === "bad" || res === "timeout" ? "shake" : ""}`}>{cur.q}</p>
          <div className="grid grid-cols-2 gap-8">
            {[["left", "BÊN TRÁI", "bg-blue-600 hover:bg-blue-500", cur.left], ["right", "BÊN PHẢI", "bg-orange-500 hover:bg-orange-400", cur.right]].map(([side, label, color, text]) => {
              const reveal = res && side === cur.answer;
              return (
                <button key={side} onClick={() => pick(side)} disabled={!!res}
                  className={`${color} p-10 rounded-3xl transition hover:scale-105 shadow-2xl min-h-[22rem] flex flex-col items-center justify-center gap-6 ${reveal ? "ring-[16px] ring-green-400" : ""} ${res && !reveal ? "opacity-40" : ""}`}>
                  <span className="text-4xl font-bold text-yellow-200">{side === "left" ? "⬅️" : ""} {label} {side === "right" ? "➡️" : ""}</span>
                  <span className="text-6xl font-black leading-tight">{text}</span>
                </button>
              );
            })}
          </div>
          {res && (
            <div className="pop mt-8">
              <p className={`text-5xl font-black ${res === "ok" ? "text-green-400" : "text-red-400"}`}>
                {res === "ok" ? "🎉 Chính xác!" : res === "timeout" ? "⏰ Hết giờ rồi!" : "❌ Sai rồi!"}
              </p>
              <p className="text-3xl mt-3 text-slate-200">{cur.why}</p>
              <NextBtn onClick={next} last={i === REFLEX.length - 1} />
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}

/* ============ GAME 3 ============ */
const LETTERS = ["A", "B", "C", "D"];
const OPT_COLORS = ["bg-rose-600 hover:bg-rose-500", "bg-sky-600 hover:bg-sky-500", "bg-emerald-600 hover:bg-emerald-500", "bg-amber-500 hover:bg-amber-400"];

// Cảnh "bão" vẽ bằng emoji + gradient để chạy không cần ảnh ngoài
const Scene = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-500 to-sky-800 overflow-hidden select-none">
    <span className="absolute text-[9rem] top-2 left-6">☁️</span>
    <span className="absolute text-[9rem] top-0 right-10">⛈️</span>
    <span className="absolute text-[14rem] top-[18%] left-[38%] animate-pulse">🌀</span>
    <span className="absolute text-[8rem] bottom-[22%] left-[8%]">🌴</span>
    <span className="absolute text-[8rem] bottom-[20%] right-[10%]">🏠</span>
    <span className="absolute text-[7rem] top-[40%] right-[30%]">💨</span>
    <span className="absolute bottom-0 inset-x-0 h-[22%] bg-sky-900 text-6xl flex items-center justify-around">🌊🌊🌊🌊🌊🌊</span>
  </div>
);

function PuzzleGame({ onBack }) {
  const P = PUZZLE.pieces;
  const [open, setOpen] = useState([]);
  const [sel, setSel] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [okMsg, setOkMsg] = useState(false);
  const finished = open.length === P.length;

  const answer = (k) => {
    if (k === P[sel].a) {
      setOpen([...open, sel]); setSel(null); setOkMsg(true);
      setTimeout(() => setOkMsg(false), 2200);
    } else {
      setWrong(true); setTimeout(() => setWrong(false), 500);
    }
  };
  const restart = () => { setOpen([]); setSel(null); };

  return (
    <Shell title={`Mảnh Ghép Thiên Tai: ${PUZZLE.title}`} icon={<Puzzle size={44} />} onBack={onBack}
      right={`🧩 ${open.length}/${P.length}`}>
      {okMsg && <Confetti />}
      <div className="w-full max-w-7xl grid grid-cols-2 gap-8 items-center">
        {/* Bức ảnh + mảnh ghép */}
        <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border-8 border-slate-600 shadow-2xl">
          <Scene />
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
            {P.map((_, n) => !open.includes(n) && (
              <button key={n} onClick={() => !finished && setSel(n)}
                className={`border-4 border-slate-900 text-7xl font-black transition hover:brightness-125 ${sel === n ? "bg-yellow-400 text-slate-900 animate-pulse" : "bg-indigo-700"}`}>
                {n + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Câu hỏi / thông điệp */}
        <div className="text-center">
          {finished ? (
            <div className="pop">
              <p className="text-6xl font-black text-yellow-300">🎉 Bức tranh: {PUZZLE.title}!</p>
              <p className="text-3xl mt-6 leading-relaxed">{PUZZLE.message}</p>
              <button onClick={restart} className="mt-8 bg-blue-600 hover:bg-blue-500 hover:scale-105 transition p-8 rounded-3xl text-3xl font-black inline-flex items-center gap-3">
                <RotateCcw size={36} /> Chơi lại
              </button>
            </div>
          ) : sel === null ? (
            <p className="text-5xl font-black leading-snug animate-pulse">👈 Chọn một mảnh ghép để mở câu hỏi!</p>
          ) : (
            <div className={wrong ? "shake" : ""}>
              <p className="text-4xl font-black mb-6">Mảnh {sel + 1}: {P[sel].q}</p>
              {wrong && <p className="text-3xl font-bold text-red-400 mb-4">❌ Chưa đúng, thử lại nhé!</p>}
              <div className="grid grid-cols-2 gap-4">
                {P[sel].o.map((t, k) => (
                  <button key={k} onClick={() => answer(k)} className={`${OPT_COLORS[k]} p-8 rounded-2xl text-3xl font-bold hover:scale-105 transition text-left`}>
                    <span className="text-4xl font-black mr-3">{LETTERS[k]}.</span>{t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ============ APP ============ */
const GAMES = [
  { id: "shelter", name: "Thử Thách Tìm Nơi Trú Ẩn", desc: "An toàn hay nguy hiểm?", icon: Shield, color: "from-green-500 to-emerald-700", C: ShelterGame },
  { id: "reflex", name: "Phản Xạ Sinh Tồn", desc: "Nhanh tay – hô to đáp án!", icon: Zap, color: "from-orange-500 to-red-600", C: ReflexGame },
  { id: "puzzle", name: "Mảnh Ghép Thiên Tai", desc: "Trả lời đúng để mở bức tranh", icon: Puzzle, color: "from-indigo-500 to-purple-700", C: PuzzleGame },
];

export default function App() {
  const [activeGame, setActiveGame] = useState(null);
  const game = GAMES.find((g) => g.id === activeGame);
  const back = () => setActiveGame(null);

  return (
    <>
      <Styles />
      {game ? <game.C onBack={back} /> : (
        <div className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-center mb-4">🌪️ PHÒNG TRÁNH THIÊN TAI 🌊</h1>
          <p className="text-3xl text-slate-300 mb-12">Chọn một trò chơi để bắt đầu!</p>
          <div className="grid grid-cols-3 gap-10 w-full max-w-7xl">
            {GAMES.map(({ id, name, desc, icon: Icon, color }) => (
              <button key={id} onClick={() => setActiveGame(id)}
                className={`bg-gradient-to-br ${color} p-10 rounded-3xl shadow-2xl hover:scale-105 hover:-rotate-1 transition flex flex-col items-center gap-6`}>
                <Icon size={140} className="animate-bounce" />
                <span className="text-4xl font-black leading-tight">{name}</span>
                <span className="text-2xl opacity-90">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
