(()=>{
  const story={
    en:{
      journeyTitle:'PicNest did not begin as PicNest 2.0.',
      journeyIntro:'The current 3D world is the latest form of a much longer line. The first PicNest repository began on 2025-10-16. Within days it accumulated persistence, currency, authentication, camera capture, a gameplay loop and multiplayer rooms. That speed was useful, but it also exposed the central pattern that would define the project: every new capability created a deeper question about what kind of place PicNest was actually trying to become. PicNest 2.0 was not simply a version bump; it was the point where we accepted that the old answers were no longer enough.',
      journey:[
        ['01 / 2025.10.16 / ORIGIN','The first commit was small. The ambition was already larger.','The Git history starts with the original PicNest repository on 2025-10-16. At that point there was no fully formed “living world” thesis. The important thing was simpler: make a digital space that could hold persistent things and give people a reason to interact with them. The final shape was still unknown.'],
        ['02 / 2025.10.17–18 / ACCELERATION','Persistence, identity, capture and a game loop arrived almost at once.','The next commits added persistent currency and purchases, Google and guest authentication, device-camera capture with upload fallback, and then a “Core gameplay loop MVP.” In retrospect, this was the first important tension: PicNest was already mixing utility, collection, creation and game structure before we had decided which one should lead.'],
        ['03 / 2025.10.19–11 / SHARED SPACE','The project stopped being only about one person using one screen.','Multiplayer routing, data rules, invite UI and separate room/user identities arrived immediately after the first gameplay loop. By November, friend requests and collaboration invites were being moved behind backend validation. The technical work revealed a product truth early: as soon as a space is shared, identity, ownership, permissions and trust become part of the experience.'],
        ['04 / 2026.05.11 / RESET','PicNest 2.0 was a rebuild, not a cosmetic upgrade.','The second repository begins with “Initial commit: PicNest 2.0 MVP1” on 2026-05-11. Starting a new codebase mattered psychologically as much as technically: it meant accepting that time already spent on the first form was not a reason to preserve its architecture or assumptions. The project had permission to become something else.'],
        ['05 / 2026.05–07 / WORLD','The room became an island, and the island needed a life of its own.','The new direction moved toward a browser-based 3D room and world: terrain, movement, resources, building, saves, weather and residents began to connect. Collection remained important, but the question changed from “what can the player place here?” to “what keeps happening here when the player is not directly pressing a button?”'],
        ['06 / 2026.07 / BRAKE','Learning to stop adding features became part of learning to build.','By July the project already had enough visible systems to keep expanding indefinitely. We deliberately chose the opposite. P0 → P1 → P2 hardening made security, save integrity, multiplayer consistency, testing and release gates more important than another content system. This was a major shift in how progress was measured: restraint could now count as progress.'],
        ['07 / 2026.08 / DISCOVERY','The world stopped asking the player to be its hero.','The design moved toward discovery-first play: gathering, building, collecting, weather, ecology and stories should make the world feel larger than what the player already understands. The player is not here to “save” the world or control every resident. The player arrives, notices, learns and gradually forms a relationship with a place that already has its own rules.'],
        ['08 / 2026.08 / AUTONOMY','Peeps stopped being content and started becoming inhabitants.','A Peep that only waits for a player trigger is still a prop. Behavior therefore moved toward decoupled FSM logic and scored candidates, with needs, traits, distance and world state competing to decide the next viable action. Different Peeps can produce different events, and those events can become conversation material between players. Autonomy became part of the social design.'],
        ['09 / 2026.08 / JOURNEY','Onboarding became a story about entering a place, not reading a tutorial.','The initial journey, Dazhi mentor dialogue and Peep small-talk work marked another change. Instead of explaining every system through static UI, the project began treating the first minutes as an encounter with the world itself. Guidance should reveal the rules without making the world feel like a checklist.'],
        ['10 / NOW / TRUST','The hardest feature became trust.','A persistent social world can survive missing content; it cannot survive players believing their world may be lost, overwritten or behave differently after a reconnect. Revisioned saves, recovery paths, private Realtime boundaries, host ownership and lifecycle rules therefore became part of the game design. The current PicNest is judged less by how many systems it contains and more by whether players can understand it, return to it and trust it.']
      ],
      systemEvidence:[
        ['SAVE','Revisioned persistence + recovery','Conflicting writes, recovery and reconnect are treated as first-class behavior.'],
        ['NETWORK','Private Realtime + lifecycle ownership','Room access, reconnect and critical writes have explicit ownership boundaries.'],
        ['AGENTS','FSM + scored candidates','Peeps select viable intents using needs, traits, distance and world state.']
      ],
      evidenceTitle:'The architecture records the change in priorities.',
      evidenceIntro:'These are not decorative technical details. Each one exists because the product eventually exposed a class of failure that had to become explicit.',
      evidence:[
        ['P0 / ACCESS','Role-bounded security','Room ownership, editor boundaries, guest/share access and private data rules are treated as product constraints rather than an afterthought.'],
        ['P1 / RECOVERY','Persistence + session recovery','Revisioned writes, backup/recovery paths and reconnect handling exist because losing or overwriting a living world is a product failure, not merely a storage bug.'],
        ['P1 / LIFECYCLE','One owner for critical writes','Unload, autosave, reconnect and multiple tabs or devices need explicit ownership so several “helpful” paths do not silently fight each other.'],
        ['P2 / ONBOARDING','Understand before expanding','The release plan explicitly asks whether a first-time player knows what to do and can operate the core loop before more systems are allowed to hide that problem.'],
        ['P2 / SOCIAL','Friends must survive the edge cases','Join, late-join, reconnect and shared-state behavior are part of the multiplayer experience; success is not defined by two clients merely appearing in one room.'],
        ['AI / SCHEDULING','Autonomy needs fairness','Later work moved into cadence, scheduler fairness and presentation caching because believable agents also have to remain fair, observable and affordable to run.']
      ],
      reflectionTitle:'The technical history is easy to list. The personal change underneath it was harder.',
      reflection:'At the beginning, progress was easy to confuse with velocity: another system, another interaction, another visible capability. PicNest gradually forced a different discipline. I had to accept that working code could still represent the wrong direction, that sunk cost was not a reason to preserve an architecture, and that sometimes the most important development decision was to stop. The move from the first PicNest to PicNest 2.0 changed the project from a collection of things I could build into a question I keep returning to: can I make a small digital place that feels worth returning to even when nothing is asking the player to perform? That is why the current focus is not “more features.” It is a world with enough autonomy to surprise, enough structure to be understood, and enough reliability to be trusted.'
    },
    zh:{
      journeyTitle:'PicNest 並不是從 PicNest 2.0 才開始。',
      journeyIntro:'現在看到的 3D 世界，其實只是這條演化線目前最新的一個形態。Git 紀錄裡，第一個 PicNest repository 從 2025-10-16 開始；接下來短短幾天內，就陸續出現持久化、貨幣、登入、相機拍攝、核心遊戲循環與多人房間。那種高速推進很有價值，但也很快暴露出 PicNest 後來一直反覆面對的核心問題：每多做一個功能，就會逼我們重新回答一次——這個地方到底想成為什麼。PicNest 2.0 因此不是單純升版，而是承認舊答案已經不夠之後的一次重建。',
      journey:[
        ['01 / 2025.10.16 / 起點','第一個 Commit 很小，但野心其實已經比它大。','Git 歷史從 2025-10-16 的第一代 PicNest 開始。當時還沒有今天這套「活著的世界」論述，真正清楚的只有一件事：先做出一個能保存東西、能讓人和內容互動的數位空間。至於它最後究竟是工具、收藏空間、遊戲，還是社交世界，當時其實沒有答案。'],
        ['02 / 2025.10.17–18 / 加速','持久化、身份、拍攝與遊戲循環幾乎同時出現。','接下來的 Commit 很快加入貨幣與購買持久化、Google／Guest 登入、裝置相機拍攝與檔案上傳備援，然後直接出現「Core gameplay loop MVP」。現在回頭看，這是第一個很重要的訊號：PicNest 很早就同時混合了工具、收藏、創作與遊戲結構，但當時還沒有決定誰才是主角。'],
        ['03 / 2025.10.19–11 / 共享空間','它很快就不再只是「一個人對著一個畫面使用」。','第一個遊戲循環完成後，馬上出現 Multiplayer routing、資料規則、邀請 UI，以及 Room ID／User ID 分離；到了 11 月，好友請求與協作邀請又逐步搬到後端驗證。技術問題很早就揭露了一個產品事實：只要一個空間開始被共享，身份、所有權、權限與信任就會直接變成體驗的一部分。'],
        ['04 / 2026.05.11 / 重置','PicNest 2.0 是重做，不是換皮。','第二個 repository 在 2026-05-11 以「Initial commit: PicNest 2.0 MVP1」重新開始。這件事的意義不只在技術：它代表我們願意承認，前面已經投入的時間不是繼續沿用舊架構與舊假設的理由。PicNest 可以把沉沒成本留在後面，重新決定自己要成為什麼。'],
        ['05 / 2026.05–07 / 世界','房間慢慢變成一座島，而島需要自己的生活。','新的方向逐步轉向瀏覽器 3D 房間與世界：地形、移動、資源、建造、存檔、天氣與居民開始互相連動。收藏仍然重要，但問題已經從「玩家能在這裡放什麼？」變成「當玩家沒有直接按下一個按鈕時，這裡還有什麼事情正在發生？」'],
        ['06 / 2026.07 / 煞車','學會停止加功能，也成為學會做產品的一部分。','到了 7 月，PicNest 已經有足夠多可見系統，完全可以無止盡地繼續擴張。但我們刻意做了相反選擇：P0 → P1 → P2 Hardening，把安全、存檔完整性、多人一致性、測試與 Release Gate 排在新內容之前。這是一個很大的心態轉變——從這裡開始，「忍住不做」有時也算真正的進度。'],
        ['07 / 2026.08 / 發現','世界不再要求玩家當它的英雄。','設計開始明確轉向 Discovery-first：採集、建造、收藏、天氣、生態與故事應該讓世界感覺比玩家已知的東西更大。玩家不是來拯救世界，也不是來控制每一個居民；玩家只是抵達、觀察、理解，然後逐漸和一個本來就有自己規則的地方建立關係。'],
        ['08 / 2026.08 / 自主性','Peep 不再只是內容，而開始像真正住在這裡的居民。','只會等待玩家觸發的 Peep，本質上仍然比較像道具。因此行為系統逐步走向解耦 FSM 與候選評分，由需求、個性、距離和世界狀態一起競爭下一個可行行動。不同 Peep 會製造不同事件，而事件又能成為玩家彼此之間值得討論的內容；自主性因此也變成了社交設計的一部分。'],
        ['09 / 2026.08 / 初始旅程','新手引導開始變成「進入一個地方」，而不是「閱讀教學」。','Initial Journey、大智導師對話與 Peep small-talk 的加入，代表另一個設計轉折。我們不再只想用靜態 UI 把每一條規則念給玩家聽，而是希望最初幾分鐘本身就是一次遇見這個世界的過程：引導要讓人理解規則，但不能把世界壓縮成待辦清單。'],
        ['10 / 現在 / 信任','最後變成最難做的功能，其實是「信任」。','持久型社交世界可以暫時缺內容，卻不能讓玩家懷疑自己的世界會不會遺失、被覆寫，或重連之後變成另一套狀態。因此 Revision 存檔、Recovery、Private Realtime、Host Ownership 與 Lifecycle 規則最後都成了 Game Design 的一部分。現在衡量 PicNest 的標準，已經不是裡面塞了多少系統，而是玩家能不能看懂它、離開後回得來，而且願意相信它。']
      ],
      systemEvidence:[
        ['存檔','Revision 持久化 + 復原','衝突寫入、復原與重連都被視為一級系統行為。'],
        ['多人','Private Realtime + Lifecycle Ownership','房間權限、重連與關鍵寫入都有明確 ownership 邊界。'],
        ['Agent','FSM + 候選評分','Peep 依需求、個性、距離與世界狀態選擇可行意圖。']
      ],
      evidenceTitle:'架構本身，記錄了我們優先順序的改變。',
      evidenceIntro:'這些技術項目不是為了讓介紹看起來厲害。它們幾乎都來自某一類實際會破壞體驗的失敗，最後才被迫變成明確的系統邊界。',
      evidence:[
        ['P0 / 權限','角色與房間安全邊界','Room owner、editor、guest/share access 與 private data 的界線被當成產品規則，而不是最後才補的安全設定。'],
        ['P1 / 復原','持久化與 Session Recovery','Revision 寫入、備份／復原與重連處理存在的原因很直接：把一個活著的世界弄丟或覆寫掉，是產品失敗，不只是 Storage Bug。'],
        ['P1 / 生命週期','關鍵寫入只有一個 Owner','Unload、Autosave、Reconnect 與多分頁／多裝置必須有明確 ownership，避免好幾條「為你好」的路徑最後彼此覆蓋。'],
        ['P2 / 新手理解','先看懂，再繼續擴張','Release Plan 直接要求先回答：第一次進來的人知不知道要做什麼、能不能操作核心循環，而不是用更多系統把這個問題蓋掉。'],
        ['P2 / 多人','朋友加入後也要撐得住','Join、Late Join、Reconnect 與 Shared State 都屬於多人 UX；成功不只是兩個 Client 同時出現在一個房間。'],
        ['AI / 排程','自主性也需要公平與成本','後期工作進入 cadence、scheduler fairness 與 presentation cache，因為 Agent 要像活著，不只要會做決定，也必須公平、可觀測，而且不能讓效能成本失控。']
      ],
      reflectionTitle:'技術上的歷史很好列；真正比較難寫的，是我自己在這個專案裡面的改變。',
      reflection:'一開始很容易把「速度」誤認成「進度」：多一個系統、多一個互動、多一個看得到的能力，好像就代表專案正在往前。PicNest 後來逼我建立另一套紀律。我必須接受：可以正常運作的程式碼仍然可能代表錯的方向；已經投入的時間不是保留舊架構的理由；而有時最重要的開發決策，就是先停止。從第一代 PicNest 到 PicNest 2.0，真正改變的不只是技術棧，而是問題本身——它不再只是「我還能做出什麼」，而是「我能不能做出一個即使沒有任務逼著玩家表現，玩家仍然願意回來的小型數位世界」。所以現在的核心不是更多功能，而是足夠的自主性去產生意外、足夠的結構讓人理解，以及足夠的可靠性讓人願意相信這個世界。'
    }
  };
  window.__portfolioCaseStudies=window.__portfolioCaseStudies||{};
  window.__portfolioCaseStudies.picnest=story;
})();
