(()=>{
  const story={
    en:{
      journeyTitle:'Wasteland Rush is new. The idea underneath it is not.',
      journeyIntro:'The current repository belongs to 2026, but the design line reaches further back. The 2024–2025 entries below come from the personal design archive rather than this Git history; the 2026 entries are grounded in the current Wasteland Rush repository. The recurring idea is unusually stable: economy should create territory, territory should create population and deployment options, and those choices should become visible pressure on a frontline.',
      journey:[
        ['01 / 2024.10 / ATTRACTION','The first pull was not a genre label. It was a structure.','An early reference point was fortress-expedition style play: gather resources, build a base, defend it and push outward. At this stage the interest was exploratory rather than a formal codebase, but the attraction to economy + construction + pressure was already present.'],
        ['02 / 2025.07 / FIRST PROTOTYPE','Territory, houses and population became code.','An earlier Pygame prototype, 領域征服：卡牌領主, connected card-slot deployment, energy, houses, population, territorial expansion, automatic troop movement and fort destruction. It was rough, but the loop already resembled the skeleton that Wasteland Rush would later recover.'],
        ['03 / 2025.08 / VISION','Territory stopped being only a border.','The next conceptual step was to treat owned land as information: structures should expand what the player can control and eventually what the player can see. That distinction matters because a territory system becomes strategic only when it changes available actions.'],
        ['04 / 2026.09 / REBUILD','The old loop returned under a stricter product constraint.','Wasteland Rush rebuilds the idea as a portrait-first 2D PvP RTS with a 5–7 minute target. The question is no longer whether the systems can exist, but whether economy, production, technology and frontline momentum can all remain readable on a phone.'],
        ['05 / 2026.09.22 / MASS','Army scale became the emotional target.','The product direction explicitly rejected becoming a small-unit card-counter game. Cheap T1 units, specialists, technology and surviving troop mass are meant to create a visible feeling of momentum. The paper-unit art standard was locked so dozens of units can move without requiring expensive frame animation.'],
        ['06 / 2026.09.22 / PROGRESSION','Long-term growth was separated from permanent stat grinding.','The meta design moved away from “draw the same card until its HP is higher.” Units unlock once; mastery, specialization and blueprints are expected to create strategic identity, while T1–T3 technology remains an in-match resource decision.'],
        ['07 / 2026.09.23 / BATTLEFIELD','The battlefield became longer than the phone screen.','The world was locked to 720 × 2340 logical pixels — exactly 1.5× the 720 × 1560 phone viewport. The player enters from the bottom and manually scrolls upward, making spatial progress visible without turning the game into a tiny zoomed-out board.'],
        ['08 / 2026.09.23 / TERRITORY','A building now changes land, population and resource access at once.','Placeable barracks now cost crystal, expand owned territory, add population capacity and preview a larger vision radius. Forward crystal sources become buildable only when territory reaches them. Fog-of-war remains deferred on purpose: first prove that expanding land is already worth doing.']
      ],
      systemEvidence:[
        ['BATTLE','5–7 minute portrait RTS','The product is constrained around short mobile matches and top-vs-bottom pressure.'],
        ['MAP','1.5× phone-height world','The current battlefield is 720 × 2340 with manual vertical scroll from the player side.'],
        ['ARMY','Paper-unit mass combat','Shared code-driven motion lets unit count grow without multiplying animation cost.'],
        ['TERRITORY','Barracks-driven expansion','One structure currently links placement rules, population, forward resources and future vision.']
      ],
      evidenceTitle:'The current prototype turns the old idea into measurable rules.',
      evidenceIntro:'The important change from the early prototype is not visual polish. Territory now has explicit mechanical consequences and the next steps are gated instead of being added all at once.',
      evidence:[
        ['ECONOMY','Mine: 50 crystal → +2.5 / sec','Resource investment creates an explicit payback decision instead of passive background income.'],
        ['POPULATION','20 base + 10 per barracks','Territorial infrastructure directly changes how large an army can become.'],
        ['CONTROL','280 px territory radius','A barracks expands where the player is allowed to build and reach forward resources.'],
        ['VISION','360 px preview radius','Vision is already modeled as a separate radius before enemy hiding is enabled.'],
        ['ORDER','Territory before fog, fog before networking','The implementation sequence deliberately proves the local rule first, then adds information denial, then multiplayer state.']
      ],
      reflectionTitle:'This project is less a return to an old game than a return to an old question.',
      reflection:'The earliest prototype already had the ingredients: energy, houses, population, territory and units moving toward an enemy base. What it did not yet have was product discipline. Wasteland Rush is the same question under harder constraints: what is the minimum set of systems required for economy to become geography, geography to become army scale, and army scale to become visible pressure? The goal is not to preserve the old prototype because it existed. The goal is to recover the part that still survives after a year of other projects: expanding control should visibly change what the player can build, see, afford and push.'
    },
    zh:{
      journeyTitle:'Wasteland Rush 是新的，但底下那個想法其實很早就出現了。',
      journeyIntro:'現在這個 repository 屬於 2026，但設計血統可以往前追。下面 2024～2025 的段落來自個人設計紀錄，不冒充成 Wasteland Rush 的 Git 歷史；2026 的段落則以目前 repo 為依據。一路反覆出現的核心其實很穩定：經濟應該創造領地，領地應該創造人口與部署選擇，而這些選擇最後要變成戰線上肉眼看得見的壓力。',
      journey:[
        ['01 / 2024.10 / 吸引力','一開始吸引我的不是「RTS」三個字，而是一種結構。','很早的參考點就是《要塞遠征》式的資源、基地、防守與向外推進。當時比較接近探索玩法來源，還不是正式 codebase，但「經濟 + 建造 + 壓力」這個組合已經出現。'],
        ['02 / 2025.07 / 第一個原型','領地、房屋與人口第一次真的變成程式。','早期 Pygame 原型《領域征服：卡牌領主》已經把卡槽出兵、能量、房屋、人口、領地擴張、自動推線與摧毀主堡接在一起。它很粗糙，但現在回頭看，Wasteland Rush 的骨架其實已經在裡面。'],
        ['03 / 2025.08 / 視野','領地開始不只是地上的一圈線。','下一個概念轉折，是把 Owned Land（己方領地）視為資訊與行動權：建築不只擴張邊界，也應該逐步決定玩家能控制哪裡、最後能看見哪裡。領地只有在它改變可做的事情時，才真正有戰術價值。'],
        ['04 / 2026.09 / 重建','舊循環回來了，但這次被套上更嚴格的產品限制。','Wasteland Rush 把這條想法重做成直式手機 2D PvP RTS，單局目標 5～7 分鐘。問題已經不是「這些系統能不能寫出來」，而是經濟、生產、科技與戰線動能能不能同時在手機上維持可讀。'],
        ['05 / 2026.09.22 / 軍勢','大量軍隊本身被定義成情緒獎勵。','產品方向正式拒絕變成小隊卡牌互剋。廉價 T1、專業兵、科技與存活下來的軍勢，應該共同形成肉眼可見的 Momentum（推進動能）。Paper Unit（紙片兵）美術標準也因此鎖定，讓大量單位不用靠昂貴逐格動畫才能成立。'],
        ['06 / 2026.09.22 / 成長','長期成長和永久數值碾壓被拆開。','場外設計不走「一直抽同一張卡，把 HP 疊高」這條路。兵種解鎖一次，Mastery（熟練度）、Specialization（專精）與 Blueprint（藍圖）負責戰術身份；T1～T3 科技則留在單局內，繼續和出兵共用資源、形成機會成本。'],
        ['07 / 2026.09.23 / 戰場','戰場正式長過手機本身。','世界被鎖成 720 × 2340 邏輯像素，剛好是 720 × 1560 手機視窗的 1.5 倍。玩家從底部進場，手動往上滑到敵方，讓空間推進可以被感受到，而不是把整張地圖縮成一個小棋盤。'],
        ['08 / 2026.09.23 / 領地','現在一棟建築會同時改變土地、人口與資源權。','可放置 Barracks（兵營）現在會消耗水晶、擴張己方領地、增加人口上限，並顯示更大的 Vision Preview（視野預覽）。前線水晶點只有領地碰到後才能開採。Fog of War（戰爭迷霧）刻意還不做：先證明「擴張土地」本身就值得玩家做。']
      ],
      systemEvidence:[
        ['戰鬥','5～7 分鐘直式 RTS','產品從一開始就被限制在短局、手機、上下對推。'],
        ['地圖','1.5× 手機高度世界','目前戰場為 720 × 2340，從玩家側底部手動往上捲動。'],
        ['軍隊','Paper Unit 大量戰鬥','共用程式動態讓單位數可以增加，而不讓動畫成本一起爆炸。'],
        ['領地','兵營驅動擴張','目前一棟建築已經同時連到放置規則、人口、前線資源與未來視野。']
      ],
      evidenceTitle:'現在的原型，開始把早期想法壓成可以驗證的規則。',
      evidenceIntro:'和早期原型最大的差別不是畫面變漂亮，而是領地已經有明確的機械後果，而且下一步被刻意 Gate 起來，不再一次把所有系統堆上去。',
      evidence:[
        ['經濟','礦井：50 Crystal → +2.5 / 秒','資源投資有明確回收決策，不只是背景自動加錢。'],
        ['人口','20 基礎 + 每兵營 10','領地基礎建設會直接改變軍隊最多能長到多大。'],
        ['控制','280 px 領地半徑','兵營真正擴張玩家可放建築與接觸前線資源的區域。'],
        ['視野','360 px 視野預覽','在真正隱藏敵軍以前，Vision 已經先被拆成獨立半徑。'],
        ['順序','先領地 → 再迷霧 → 再多人','實作順序刻意先證明本地規則，再加入資訊遮蔽，最後才處理 Multiplayer State。']
      ],
      reflectionTitle:'這比較不像「回去做以前那款遊戲」，更像重新回到以前沒有回答完的問題。',
      reflection:'最早的原型其實已經有所有原料：能量、房屋、人口、領地，以及自動往敵方主堡推進的單位。當時缺的不是功能，而是產品紀律。Wasteland Rush 現在用更嚴格的方式問同一件事：最少需要哪些系統，才能讓經濟變成地理、地理變成軍隊規模，而軍隊規模最後變成玩家看得見的戰線壓力？我們不是因為舊原型存在就保存它，而是因為隔了一年、做過其他專案之後，仍然有一個部分沒有消失——擴張控制範圍，應該真的改變玩家能蓋什麼、看見什麼、負擔什麼，以及能把戰線推到哪裡。'
    }
  };
  window.__portfolioCaseStudies=window.__portfolioCaseStudies||{};
  window.__portfolioCaseStudies.wasteland=story;
})();
