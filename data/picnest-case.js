(()=>{
  const story={
    en:{
      journeyTitle:'We did not know the final shape at the beginning.',
      journeyIntro:'PicNest became more interesting each time the project forced us to give up an easier answer. What began with exploration and collection gradually became a question about whether a small digital world could feel alive, remain coherent when shared, and still respect the player’s time when something goes wrong.',
      journey:[
        ['01 / ORIGIN','Collection was the door, not the destination.','The early loop was easy to describe: explore, collect, unlock and build. It gave the world a reason to be touched, but not yet a reason to be cared about. As the prototype grew, the more important question became what would still be happening when the player was not directly pressing a button.'],
        ['02 / AUTONOMY','Peeps stopped being decoration.','Residents could not feel alive if they only waited for the player to trigger them. Their behavior moved toward a decoupled FSM and scored candidate model: needs, traits, distance and world state compete to decide what is worth doing, with fallback paths when an intent is no longer viable.'],
        ['03 / SOCIAL','Autonomy became part of the social design.','The project gradually moved away from treating multiplayer as only “players standing in the same room.” Different Peeps, different needs and different decisions can create situations worth noticing and talking about. The resident is not just content inside the world; it can become a bridge between the people sharing it.'],
        ['04 / PERSISTENCE','A shared world made failure expensive.','Once the island had to persist across sessions and multiple players, a feature that looked correct on one screen was no longer enough. Disconnects, reconnects, host changes, conflicting writes, multi-tab or multi-device sessions and access boundaries all became part of the game’s behavior.'],
        ['05 / BRAKE','We deliberately stopped adding things.','The v0.5 release plan made a difficult choice explicit: major gameplay expansion was blocked until security and save integrity were hardened. P1 went further and defined a reliability phase with no gameplay-content work, focusing instead on recovery, lifecycle ownership and the situations most likely to destroy trust in a persistent world.'],
        ['06 / PRODUCT','After “can it exist?” came “can people understand it?”','P2 reframed completeness around the player: a new player should know what to do, be able to operate the world, recover from interruption, play with friends and have a reason to return. That shifted the definition of progress from feature count toward clarity, continuity and confidence.']
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
      reflectionTitle:'What PicNest changed in the way we build.',
      reflection:'The biggest lesson was that a “living world” is not created by stacking more systems on top of one another. The more autonomous and persistent the world became, the more important boundaries, recovery and legibility became. The project taught us to treat reliability as part of game design: if a player cannot trust that the world will remember, recover and behave consistently, the fantasy of a living place collapses no matter how many features it contains.'
    },
    zh:{
      journeyTitle:'我們並不是一開始就知道它最後會長成什麼樣子。',
      journeyIntro:'PicNest 真正變得有意思的地方，往往發生在我們必須放棄比較簡單答案的時候。它最初可以被描述成探索、收集與建造，但一路往下做，問題慢慢變成：一個小小的數位世界能不能真的像活著一樣、多人共享後仍然保持一致，而且在出錯時不浪費玩家投入其中的時間。',
      journey:[
        ['01 / 起點','收集是進入世界的入口，不是世界本身。','早期循環很容易說清楚：探索、收集、解鎖、建造。它讓玩家有理由去碰這個世界，卻還不足以讓人對世界產生牽掛。原型越往後，我們越在意另一個問題：當玩家沒有直接按下一個按鈕時，這座島上還有什麼事情正在發生？'],
        ['02 / 自主性','Peep 不再只是等玩家觸發的 NPC。','如果居民永遠只在玩家靠近後才開始演戲，就很難真的像「住在這裡」。因此 Peep 的行為逐步走向解耦 FSM 與候選評分：需求、個性、距離和世界狀態一起競爭下一個值得做的事情，意圖失效時也必須能退回其他可行選項，而不是卡死。'],
        ['03 / 社交','Peep 的自主性，後來也變成社交設計的一部分。','我們慢慢不再把多人理解成「兩個玩家站在同一個房間裡」而已。不同 Peep 的個性、需求與選擇，本身就能製造值得注意、值得討論的事件。居民不只是世界裡的內容，也有機會成為共享這個世界的人之間的一座橋。'],
        ['04 / 持久世界','世界一旦被共享，錯誤就開始有代價。','當島嶼必須跨 Session 保存，又要被多位玩家共同操作時，「我這台電腦看起來正常」已經不夠。斷線、重連、Host 切換、衝突寫入、多分頁／多裝置，以及誰有權改變什麼，都開始變成遊戲本身的一部分。'],
        ['05 / 煞車','我們曾經刻意停止繼續加東西。','v0.5 的 Release Plan 把一個不太直覺的決定寫成硬規則：P0 的安全與存檔完整性沒有完成以前，不再擴張大型玩法。到了 P1 更直接定義成「不做 gameplay content」的可靠性階段，先處理復原、Lifecycle ownership，以及最可能讓玩家失去對持久世界信任的情況。'],
        ['06 / 產品','在「它能不能存在」之後，問題變成「玩家能不能理解它」。','P2 重新定義了完整度：第一次進來的人要知道自己能做什麼、操作得了核心循環、被中斷後回得來、真的能和朋友一起玩，而且有理由再次回到這個世界。從這裡開始，「進度」不再等同於功能數量，而是清楚、連續與可信任。']
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
      reflectionTitle:'PicNest 最後改變的，其實也包括我們做產品的方式。',
      reflection:'最大的體會是：「活著的世界」不是把更多系統一層一層疊上去就會出現。世界越自主、越持久，邊界、復原與可理解性反而越重要。PicNest 讓我們開始把可靠性本身視為 Game Design：如果玩家不能相信這個世界會記得、會恢復、會一致地運作，那麼不管裡面塞了多少功能，「這是一個活著的地方」這個幻想都會先崩掉。'
    }
  };
  window.__portfolioCaseStudies=window.__portfolioCaseStudies||{};
  window.__portfolioCaseStudies.picnest=story;
})();
