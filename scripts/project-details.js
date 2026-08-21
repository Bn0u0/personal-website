(()=>{
  const D={
    picnest:{
      en:{
        meta:'3D social world / Life simulation',
        hover:'Autonomous Peeps, persistent worlds and hardened multiplayer.',
        hoverTags:['R3F','Supabase'],
        headline:'A social world where the residents have lives of their own.',
        description:'PicNest 2.0 is a browser-based 3D social and life-simulation experiment built around exploration, collection, building and living with autonomous Peeps. The goal is not simply to move an avatar through a map, but to make the island, its residents and other players feel like one persistent place.',
        tags:['React','R3F','Three.js','Supabase','FSM','Realtime'],
        overview:'The project combines a living-world simulation with multiplayer persistence. Peeps can make their own decisions, the world can change through building and resource systems, and multiple players are expected to share the same state without the simulation collapsing when a host disconnects or a save conflicts.',
        core:'Peep behavior is driven by a decoupled finite-state machine and a score-based candidate system. Survival, work, logistics and social or leisure actions compete using hunger, energy, traits, distance and current world state. Failed paths are temporarily blacklisted so an agent can fall back to the next viable intent instead of freezing.',
        engineering:'React 18, React Three Fiber and Three.js form the 3D client, with Zustand, GSAP, Supabase and PeerJS in the stack. Multiplayer hardening adds RLS role boundaries, revisioned save RPCs, private Realtime channels, host-lease generation fencing, reconnect replay and validation around persisted world changes.',
        status:'Alpha-stage. The repository separates reliability work from product completeness: save recovery, onboarding, progression clarity, multiplayer UX, mobile performance and closed-alpha feedback are explicit release workstreams rather than being treated as finished features.'
      },
      zh:{
        meta:'3D 社交世界 / 生活模擬',
        hover:'自主 Peep、持久世界與強化後的多人同步。',
        hoverTags:['R3F','Supabase'],
        headline:'一個讓居民真的有自己生活的社交世界。',
        description:'PicNest 2.0 是一個瀏覽器上的 3D 社交與生活模擬實驗，核心圍繞探索、收集、建造，以及和具有自主行為的 Peep 一起生活。它想做的不是單純讓玩家控制角色走過地圖，而是讓島嶼、居民與其他玩家共同形成一個持續存在的地方。',
        tags:['React','R3F','Three.js','Supabase','FSM','Realtime'],
        overview:'這個專案把生命世界模擬和多人持久化放在同一個系統裡。Peep 會自行決策，世界會因建造與資源流動而改變，而多人玩家必須在同一份狀態中共存，即使主機斷線、重連或存檔發生衝突，世界也不能直接失去一致性。',
        core:'Peep 的行為由解耦的有限狀態機與評分候選池驅動。生存、工作、物流、社交與休閒行為會依飢餓、精力、個性特質、距離與世界狀態互相競爭；若尋路失敗，目標會暫時進入黑名單，Agent 會改嘗試下一個可行意圖，而不是卡死。',
        engineering:'3D 客戶端以 React 18、React Three Fiber、Three.js 為核心，並使用 Zustand、GSAP、Supabase 與 PeerJS。多人可靠性層則包含 RLS 權限邊界、revision 存檔 RPC、Private Realtime、Host Lease generation fencing、斷線重播與世界資料驗證。',
        status:'目前仍屬 Alpha 階段。Repo 明確把「可靠性」和「產品完整度」分開處理，存檔復原、新手引導、進度回饋、多人 UX、行動裝置效能與 Closed Alpha 回饋都被視為正式發佈工作流，而不是假裝已經完成。'
      }
    },
    quant:{
      en:{
        meta:'Quant research / Validation system',
        hover:'V8 replay governance, mechanism registry, cost and shock diagnostics.',
        hoverTags:['Python','MT5'],
        headline:'A research system designed to reject weak strategies before money sees them.',
        description:'The MT5 Quant Trading System is not presented as a trading bot showcase. It is a governed research environment for turning market ideas into auditable mechanisms, replaying them under controlled data, execution and cost assumptions, and separating research evidence from anything that could be called production.',
        tags:['Python','MT5','Replay','Governance','Parity','Validation'],
        overview:'The current research line is V8 Unified Research Replay. Its purpose is to put different mechanisms through the same data roles, matching logic, cost model and governance rules so a good-looking backtest cannot quietly gain an advantage from different assumptions. Live records, historical evidence and current V8 outputs are deliberately stored in separate domains.',
        core:'V8 defines a 28-FX mother universe, G0–G5 gates, Parity, Dataset Seal, Access Guard and explicit time-role separation. The mechanism registry tracks canonical sources such as M13–M20 instead of allowing adapters to recreate strategy logic. Shock, year contribution, top-day removal, top-1% trade removal, volatility buckets and rolling 6/12-month diagnostics are part of the research standard.',
        engineering:'The repository is organized around canonical Python mechanism sources, V8 adapters, auditable replay outputs, execution and cost evidence, and a decision trail for candidate triage. Research status and deployment status are separate concepts: a candidate can be interesting, recent or replay-ready without being allowed to claim formal gate passage.',
        status:'There is currently no approved automated live strategy. VP3 V8.0 is disabled and V8 Unified Research Replay is the active line. M20 is signal-ready, but trade and performance replay is still blocked until empirical 28-FX cost evidence and a role-specific Dataset Seal are frozen.'
      },
      zh:{
        meta:'量化研究 / 驗證系統',
        hover:'V8 重播治理、機制註冊表、成本與 Shock 診斷。',
        hoverTags:['Python','MT5'],
        headline:'一套在資金碰到策略之前，先把弱策略淘汰掉的研究系統。',
        description:'MT5 Quant Trading System 並不是拿來展示「會賺錢的機器人」，而是一個受治理的研究環境：把市場想法轉成可稽核機制，在固定的資料、撮合、成本與驗證規則下重新重播，並且把研究證據和任何可稱為 Production 的東西嚴格分離。',
        tags:['Python','MT5','Replay','治理','Parity','驗證'],
        overview:'目前主研究線是 V8 Unified Research Replay。它的目的，是讓不同機制都接受同一套資料角色、撮合邏輯、成本模型與治理規則，避免某個漂亮回測其實只是因為使用了不同假設。Live Records、歷史證據與目前 V8 研究輸出也被刻意拆成不同資料域。',
        core:'V8 定義了 28 個 FX 母宇宙、G0～G5 Gate、Parity、Dataset Seal、Access Guard 與明確的時間角色隔離。Mechanism Registry 追蹤 M13～M20 等 canonical source，不允許 Adapter 自己重新發明策略。年份貢獻、Shock、最佳日移除、Top 1% 交易移除、波動分桶與 Rolling 6/12M 都是研究標準的一部分。',
        engineering:'Repo 以 canonical Python 機制、V8 Adapter、可稽核 replay 輸出、execution/cost evidence 與 candidate decision history 為核心。研究狀態和部署資格被拆成兩個完全不同的概念：一個 Candidate 可以值得研究、近期有效或 Replay Ready，但不代表它通過正式 Gate。',
        status:'目前沒有任何核准中的自動實盤策略。VP3 V8.0 已停用，主線是 V8 Unified Research Replay。M20 已到 Signal Ready，但在 28-FX 的實證成本證據與角色專屬 Dataset Seal 凍結前，仍不能宣稱完成 Trade / Performance Replay。'
      }
    },
    grass:{
      en:{
        meta:'Mobile action / Extraction prototype',
        hover:'Three-minute runs with classes, affixes, equipment and mobile deployment.',
        hoverTags:['Phaser','Capacitor'],
        headline:'A three-minute action loop built around loot, pressure and immediate feedback.',
        description:'Grass Cutting 3min is a mobile-oriented action and extraction prototype built around very short runs. The design asks how much combat feel, equipment choice and progression can be compressed into a session that becomes readable almost immediately instead of requiring a long tutorial before it becomes fun.',
        tags:['Phaser','React','TypeScript','ECS','Capacitor','Mobile'],
        overview:'The codebase already models a much larger structure than a simple arena shooter: multiple player classes, tiered equipment, prefix and suffix affixes, persistent stash and loadout data, backpacks, licenses and different enemy behavior families. The broader loop points toward surviving pressure, collecting value and returning to a persistent layer where that value matters.',
        core:'The item system supports T0–T5 gear, class affinity, five equipment slots and behavior-driven weapons ranging from melee sweeps and rifles to grenades, drones, homing orbs, shockwaves and lasers. Enemy definitions support chase, ranged, charge and swarm behaviors. The design roadmap deliberately puts knockback, hit-stop, hit flash and functional weapon variety ahead of adding more content.',
        engineering:'React and TypeScript sit around a Phaser runtime, with bitecs ECS, Capacitor/iOS packaging, Appwrite, PeerJS and local compression utilities in the stack. The repository also contains static, architecture, boot and gameplay checks alongside Vitest and Puppeteer tooling, reflecting an attempt to keep the prototype testable while it grows.',
        status:'Active MVP iteration. The architecture and mobile foundation are already substantial, while the roadmap still prioritizes combat juice, shop or gacha economy sinks, meta-progression, map dynamics, audio and smoother multiplayer interpolation before the loop can be considered complete.'
      },
      zh:{
        meta:'行動動作 / 撤離原型',
        hover:'三分鐘短局、職業、詞條、裝備與行動端部署。',
        hoverTags:['Phaser','Capacitor'],
        headline:'一個把戰利品、壓力與打擊回饋壓進三分鐘裡的動作循環。',
        description:'Grass Cutting 3min 是一個偏行動裝置的動作／撤離原型，核心是非常短的單局體驗。它在測試一件事：能不能把戰鬥體感、裝備選擇與成長壓縮到幾分鐘內，而且玩家不需要先看完一大段教學才開始覺得好玩。',
        tags:['Phaser','React','TypeScript','ECS','Capacitor','Mobile'],
        overview:'這個 codebase 已經不只是簡單的 Arena Shooter。系統裡有多種玩家職業、分 Tier 裝備、Prefix / Suffix 詞條、持久化 Stash 與 Loadout、Backpack、License，以及不同敵人行為家族。整體方向是讓玩家在壓力中存活與獲取價值，再把收穫帶回長期成長層。',
        core:'裝備系統支援 T0～T5、職業相性、五個裝備槽，以及從近戰揮擊、步槍到手榴彈、無人機、追蹤球、Shockwave、Laser 等行為型武器。敵人則有 Chase、Ranged、Charge、Swarm 等模型。Roadmap 刻意把 Knockback、Hit-stop、Hit Flash 和武器功能差異放在「繼續加內容」之前。',
        engineering:'外層使用 React + TypeScript，遊戲 Runtime 以 Phaser 為主，並結合 bitecs ECS、Capacitor / iOS、Appwrite、PeerJS 與壓縮工具。Repo 另外設計了 Static、Architecture、Boot、Gameplay 檢查，再搭配 Vitest 與 Puppeteer，讓原型擴張時不完全依賴手動試玩。',
        status:'目前屬於持續迭代中的 MVP。行動端與系統架構已經有相當基礎，但 Roadmap 仍把打擊感、商店／抽取的經濟出口、局外成長、地圖動態、音效與多人差值同步列為核心缺口。'
      }
    },
    doodle:{
      en:{
        meta:'Merge rogue-lite / Systems game',
        hover:'Trigger × modifier × element builds feed short wave combat.',
        hoverTags:['React','Rogue-lite'],
        headline:'A merge game where build grammar matters more than clean drawings.',
        description:'Doodle Tyrant is a portrait-oriented rogue-lite merge experiment that treats deliberately rough doodle visuals as part of the system identity. Before and during combat, the interesting question is not just how strong a unit is, but what combination of trigger, modifier and element it represents.',
        tags:['React 19','TypeScript','Motion','Merge','Synergy','Elements'],
        overview:'The prototype mixes merge slots, wave combat, elemental status effects, set bonuses, currencies and an offline factory-income loop. Its visual language is intentionally closer to messy crayon drawings than polished fantasy art, so the project can test whether system clarity and exaggerated feedback can carry an intentionally imperfect look.',
        core:'The underlying grammar defines trigger types such as tick, collide, death, merge and aura; modifiers such as projectile, nova, chain, orbit and vacuum; and five elements: kinetic, ignite, frost, volt and corrode. Entities can accumulate burn, slow, volt and corrosion states, while the current app assembles heroes, merges them and deploys them into timed waves.',
        engineering:'Built with React 19, TypeScript, Vite, Motion and Lucide. The current combat loop runs at a fixed 30 Hz and is sized around a 390 px portrait battlefield, with particles, damage numbers, screen shake and localStorage-backed offline rewards used to prototype mobile feedback and retention loops quickly.',
        status:'MVP1 / systems prototype. Repository metadata explicitly frames the current focus as combat math, synergy logic, trash-crayon visuals and monetization hooks rather than a finished content-complete rogue-lite.'
      },
      zh:{
        meta:'合成 Rogue-lite / 系統遊戲',
        hover:'Trigger × Modifier × Element 的組合直接進入短波次戰鬥。',
        hoverTags:['React','Rogue-lite'],
        headline:'一個比起畫得漂亮，更在意「組合語法」的合成遊戲。',
        description:'Doodle Tyrant 是一個直式 Rogue-lite 合成實驗，刻意把粗糙塗鴉當成系統識別的一部分。它關心的不只是某個單位有多強，而是這個單位由什麼 Trigger、Modifier 與 Element 組合而成，以及這些語法進入戰鬥後會產生什麼連鎖反應。',
        tags:['React 19','TypeScript','Motion','合成','協同','元素'],
        overview:'目前原型把合成槽、波次戰鬥、元素狀態、Set Bonus、貨幣與離線工廠收益放在同一個循環中。美術刻意更接近亂畫的蠟筆，而不是精緻奇幻風格，用來測試清楚的系統與誇張回饋，是否能讓「不完美」本身變成辨識度。',
        core:'底層語法包含 Tick、Collide、Death、Merge、Aura 等 Trigger，Projectile、Nova、Chain、Orbit、Vacuum 等 Modifier，以及 Kinetic、Ignite、Frost、Volt、Corrode 五種元素。Entity 可以累積燃燒、緩速、Volt 與腐蝕狀態，而目前 App 會生成 Hero、合成並部署到限時 Wave 中。',
        engineering:'使用 React 19、TypeScript、Vite、Motion 與 Lucide。現在的戰鬥 Loop 以固定 30 Hz 執行，戰場尺寸以 390px 直式手機為基準，同時利用粒子、傷害數字、Screen Shake 與 localStorage 離線收益快速測試行動遊戲的回饋與留存循環。',
        status:'目前是 MVP1／系統原型。Repo metadata 明確把現階段重點放在戰鬥數學、Synergy Logic、Trash-crayon 視覺與 Monetization Hooks，而不是宣稱它已經是一款內容完整的 Rogue-lite。'
      }
    },
    learning:{
      en:{
        meta:'Hakka learning / Collection game',
        hover:'Audio quizzes feed a token → gacha → sticker collection loop.',
        hoverTags:['Hakka','Gacha'],
        headline:'A Hakka learning loop that turns listening practice into a sticker collection.',
        description:'Learning Games is a Hakka-language learning prototype that tries to make repetition feel like progression. Vocabulary, pronunciation and listening questions are connected to tokens, gacha and a sticker album so the reward for practicing is visible and collectible instead of being only a score.',
        tags:['Hakka','Audio','Quiz','Gacha','Collection','Python'],
        overview:'The current loop includes a learn mode with image vocabulary cards and auto-played pronunciation, a four-option listening quiz, five-round sessions, token rewards, a 50-token gacha and a persistent sticker collection. Locked entries appear as silhouettes, while unlocked stickers can replay their pronunciation when clicked.',
        core:'The content is organized by level and each word carries its Chinese label, Hakka pinyin, image and audio file. Correct quiz answers give tokens; tokens are spent on the gacha; gacha results unlock entries in the collection. Progress and currency are stored locally so the collection survives a refresh.',
        engineering:'The front end is deliberately simple HTML, CSS and JavaScript, while Python scripts handle the heavier content pipeline: Selenium / webdriver automation, audio downloading, image processing and silhouette generation. The original plan uses Taiwan Ministry of Education dictionary data as the pronunciation source rather than manually assembling every asset.',
        status:'MVP learning-loop prototype. Learning, quiz, gacha, collection and local persistence are represented in the codebase; the larger opportunity is expanding the vocabulary/content pipeline and validating whether the collection loop actually improves repeated listening practice.'
      },
      zh:{
        meta:'客語學習 / 收集遊戲',
        hover:'聽音題目串成代幣 → 扭蛋 → 貼紙圖鑑的循環。',
        hoverTags:['客語','扭蛋'],
        headline:'把客語聽力練習變成一套貼紙收集循環。',
        description:'Learning Games 是一個客語學習原型，想把「重複練習」改造成「持續累積」。詞彙、發音與聽音題目會連到代幣、扭蛋與貼紙圖鑑，讓練習的回報不是只有分數，而是看得見、可以持續收集的東西。',
        tags:['客語','音訊','測驗','扭蛋','收集','Python'],
        overview:'目前循環包含圖片詞彙與自動播放發音的學習模式、四選一聽音測驗、每次五題、答對獲得代幣、50 代幣一次的扭蛋，以及會持久保存的貼紙圖鑑。未解鎖項目以黑影呈現，已解鎖貼紙點擊後還能再次播放發音。',
        core:'內容依 Level 分組，每個單字都有中文、客語拼音、圖片與 Audio。答對題目獲得 Token，Token 拿去抽扭蛋，扭蛋再解鎖圖鑑；進度與貨幣透過 localStorage 保存，所以重新整理後收集結果仍然存在。',
        engineering:'前端刻意維持簡單的 HTML / CSS / JavaScript，而較重的素材流程交給 Python：包含 Selenium / webdriver 自動化、音訊下載、圖片處理與 Silhouette 生成。初始規劃也以台灣教育部辭典資料作為發音素材來源，而不是每個資產都人工整理。',
        status:'目前是 MVP 學習循環原型。學習、Quiz、扭蛋、Collection 與本地持久化都已經出現在 codebase 中，後續真正值得驗證的是擴充詞彙內容後，這套收集機制是否真的能提高重複聽力練習的意願。'
      }
    },
    pixel:{
      en:{
        meta:'Canvas engine / Physics lab',
        hover:'Vanilla Canvas physics, modular game loop and sprite digitization tools.',
        hoverTags:['Canvas','Physics'],
        headline:'A small engine lab for learning what pixels feel like when they have physics.',
        description:'Pixel Lab is less a single finished game than a compact technical playground for pixel rendering, movement and physics. It uses a deliberately small vanilla-JavaScript stack so individual systems can be inspected and changed without a large framework hiding the mechanics underneath.',
        tags:['Canvas','Vanilla JS','Physics','Renderer','Sprites','Tools'],
        overview:'The repository separates the runtime into a GameLoop, PhysicsWorld, InputHandler, MapManager, renderer and entity layer. The current entry point can run in a clean-gym mode with extra items and enemies disabled, which makes the project useful for isolating movement, collisions, rendering and camera behavior before more gameplay is layered on top.',
        core:'Each frame updates the player and entities, advances the physics world, then renders physics, entities and the player through a dedicated PixelRenderer. Maps are loaded through a MapManager and game entities are kept modular, turning the project into a reusable test bed for strike boxes, collision response and pixel-scale motion.',
        engineering:'The runtime is vanilla JavaScript and Canvas with ESLint and Prettier rather than a large game framework. Separate Python utilities digitize sprites and extract image layers, so the repository also doubles as an asset-processing lab instead of treating pixel art as a purely manual input.',
        status:'Experimental / clean-gym phase. The package describes the direction as a high-fidelity pixel-physics roguelite, but the current value of the repository is the engine sandbox itself: renderer, physics, entity interaction and reusable sprite-processing experiments.'
      },
      zh:{
        meta:'Canvas 引擎 / 物理實驗室',
        hover:'原生 Canvas 物理、模組化 Game Loop 與 Sprite 數位化工具。',
        hoverTags:['Canvas','物理'],
        headline:'一個用來研究「像素有了物理之後會是什麼感覺」的小型引擎實驗室。',
        description:'Pixel Lab 與其說是一款已完成遊戲，更像一個專門研究像素渲染、移動與物理的技術遊樂場。它刻意使用很小的 Vanilla JavaScript Stack，讓每個系統都能被直接拆開觀察與修改，不需要穿過大型框架才能看到真正發生了什麼。',
        tags:['Canvas','Vanilla JS','物理','Renderer','Sprite','工具'],
        overview:'Repo 把 Runtime 拆成 GameLoop、PhysicsWorld、InputHandler、MapManager、Renderer 與 Entity 層。現在的入口甚至可以用 Clean Gym 模式啟動，把額外敵人與物品關掉，先單獨測試移動、碰撞、渲染與 Camera 行為，再決定要疊多少玩法。',
        core:'每一幀會先更新 Player 與 Entity，再推進 PhysicsWorld，最後透過獨立 PixelRenderer 繪製物理背景、Entity 與 Player。地圖由 MapManager 載入，Entity 也保持模組化，因此這個專案可以反覆拿來測 Strike Box、碰撞回應與像素尺度下的動態。',
        engineering:'Runtime 是 Vanilla JavaScript + Canvas，搭配 ESLint / Prettier，而不是大型遊戲引擎。另外還有 Python 工具負責 Sprite 數位化與圖層抽取，所以這個 Repo 同時也是一個素材處理實驗室，而不是把 Pixel Art 當成完全手工作業。',
        status:'目前偏 Experimental／Clean Gym 階段。package 將方向描述為高擬真 Pixel Physics Roguelite，但這個 Repo 現階段真正有價值的是引擎沙盒本身：Renderer、Physics、Entity interaction 與可重用的 Sprite Processing 實驗。'
      }
    }
  };

  const labels={en:{overview:'Overview',core:'Core system',engineering:'Engineering',status:'Current state',caseStudy:'Case study'},zh:{overview:'概述',core:'核心系統',engineering:'工程實作',status:'目前狀態',caseStudy:'專案脈絡'}};
  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function ensureBelow(){
    let el=document.querySelector('.detail-below-copy');
    if(!el)return null;
    if(el.tagName==='P'){
      const div=document.createElement('div');
      div.className='detail-below-copy';
      el.replaceWith(div);
      el=div;
    }
    return el;
  }

  function currentKey(){return document.querySelector('.project-detail__media')?.dataset.project||'picnest'}

  function renderRows(){
    const l=lang();
    document.querySelectorAll('.project-item').forEach(item=>{
      const key=item.dataset.project,p=D[key]?.[l];
      if(!p)return;
      const meta=item.querySelector('.project-row__meta');
      const hover=item.querySelector('.project-hover-info__text');
      const tags=item.querySelector('.project-hover-info__tags');
      if(meta)meta.textContent=p.meta;
      if(hover)hover.textContent=p.hover;
      if(tags)tags.innerHTML=p.hoverTags.map(x=>`<span>${esc(x)}</span>`).join('');
    });
  }

  function renderDetail(key=currentKey()){
    const l=lang(),p=D[key]?.[l],lab=labels[l];
    if(!p)return;
    const headline=document.querySelector('.project-detail__headline');
    const description=document.querySelector('.project-detail__description');
    const tags=document.querySelector('.project-detail__tags');
    const belowLabel=document.querySelector('.project-detail__below-label');
    const below=ensureBelow();
    if(headline)headline.textContent=p.headline;
    if(description)description.textContent=p.description;
    if(tags)tags.innerHTML=p.tags.map(x=>`<span>${esc(x)}</span>`).join('');
    if(belowLabel)belowLabel.textContent=`${lab.caseStudy} / ${document.querySelector('.detail-number')?.textContent||''}`;
    if(below){
      below.innerHTML=`
        <p class="detail-overview">${esc(p.overview)}</p>
        <div class="detail-facts">
          <section class="detail-fact"><span class="detail-fact__label">${esc(lab.core)}</span><p class="detail-fact__copy">${esc(p.core)}</p></section>
          <section class="detail-fact"><span class="detail-fact__label">${esc(lab.engineering)}</span><p class="detail-fact__copy">${esc(p.engineering)}</p></section>
          <section class="detail-fact"><span class="detail-fact__label">${esc(lab.status)}</span><p class="detail-fact__copy">${esc(p.status)}</p></section>
        </div>`;
    }
  }

  function apply(){renderRows();renderDetail();}

  document.querySelectorAll('.project-item').forEach(item=>{
    item.querySelector('.project-row')?.addEventListener('click',()=>setTimeout(()=>renderDetail(item.dataset.project),0));
  });

  new MutationObserver(()=>setTimeout(apply,0)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  apply();
  setTimeout(apply,180);
  setTimeout(apply,800);
})();
