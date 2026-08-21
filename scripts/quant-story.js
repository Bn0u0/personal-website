(()=>{
  const STORY={
    en:{
      meta:'Quant research / Strategy evolution',
      hover:'A manual trading idea became a research system — then learned how to kill its own strategies.',
      hoverTags:['MT5','Research'],
      headline:'I did not start quant trading because I trusted machines. I started because I wanted to know which parts of my own judgment were real.',
      description:'The MT5 Quant Research System grew from two very different paths: SNR, a framework I had already traded manually for more than a year, and a second research line that moved from ORB to VP3 and later into BOX. The code matters, but the real project is the history of ideas being tested, challenged, kept or abandoned.',
      tags:['Python','MT5','SNR','ORB','VP3','BOX'],
      overview:'One path began with familiarity. SNR was not discovered by a search script; it came from hours of watching markets and making real discretionary decisions. Turning it into a quantitative system meant accepting an uncomfortable possibility: some things I had learned through experience might survive measurement, and some might disappear the moment they were defined precisely. That tension is what made the project worth building.',
      origin:'SNR is the personal side of the system. I had used it manually for roughly a year or longer before trying to formalize it. Its value to me is not that I can promise it is the most profitable strategy, but that I know where the intuition came from. Quantifying it is a way to ask whether that intuition contains information or only a convincing story.',
      turning:'The second path was less personal and more exploratory: ORB → VP3 → BOX. VP3 eventually reached live trading and, for a period, made money. Later it crossed the loss boundary I had decided was unacceptable, so I stopped it. That decision became part of the project too. A strategy is not kept alive because I spent time on it, because it once worked, or because I want it to be right.',
      now:'What remains is not a graveyard of failed bots. It is a research lineage. Parts of VP3 were kept as questions, BOX became a new direction, and SNR continued through a separate path of formalization. The project is now less about finding one perfect system and more about preserving a way to question, test, kill and rebuild ideas without rewriting the history afterward.',
      caseStudy:'Research story',
      labels:['Origin','Turning point','What remains']
    },
    zh:{
      meta:'量化研究 / 策略演化',
      hover:'一套從手動交易出發，最後學會連自己的策略都敢淘汰的研究系統。',
      hoverTags:['MT5','研究'],
      headline:'我不是因為相信機器才開始做量化，而是想知道：我原本相信的那些判斷，到底有多少是真的。',
      description:'MT5 Quant Research System 其實來自兩條很不一樣的路：一條是我已經手動交易超過一年左右的 SNR；另一條則從 ORB 出發，經過 VP3，最後逐漸走向 BOX。程式只是表面，這個專案真正留下來的是一連串想法被驗證、被挑戰、被保留，也被親手淘汰的歷史。',
      tags:['Python','MT5','SNR','ORB','VP3','BOX'],
      overview:'其中一條路是從熟悉開始的。SNR 不是某個搜尋腳本從資料裡挖出來的東西，而是我長時間看盤、做判斷，真的拿來手動交易過的框架。把它量化，等於逼自己接受一件不太舒服的事：那些靠經驗學會的東西，有些可能真的存在，有些也可能在被精確定義的那一刻就消失。也正因為如此，我才覺得它值得被研究。',
      origin:'SNR 是這套系統裡最個人的一條線。在開始正式量化以前，我已經手動使用它大約一年或更久。我沒有辦法宣稱它一定是最會賺錢的策略，但我知道那些判斷是怎麼形成的。量化它，不只是為了自動下單，而是想確認那些直覺裡究竟有資訊，還是只是人很擅長替過去編出合理的故事。',
      turning:'另一條路則更像探索：ORB → VP3 → BOX。VP3 後來真的進過實盤，而且有一段時間曾經獲利；但之後它跨過了我事先設定、不能接受的虧損邊界，所以我把它停掉。這件事後來反而變成整個專案很重要的一部分：一套策略不會因為我花了很多時間、曾經賺過錢，或我希望自己是對的，就獲得繼續活下去的資格。',
      now:'留下來的不是一堆失敗機器人的墓碑，而是一條研究血統。VP3 的部分機制被保留下來繼續問問題，BOX 成為新的研究方向，SNR 則沿著另一條路持續被正式化。現在這個專案對我來說，已經不只是尋找一套完美策略，而是建立一種不竄改歷史的能力：提出問題、驗證、淘汰，再從留下來的東西重新開始。',
      caseStudy:'研究故事',
      labels:['起點','轉折','留下來的東西']
    }
  };

  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuant=()=>document.querySelector('.project-detail__media')?.dataset.project==='quant';

  function renderRow(){
    const s=STORY[lang()];
    const item=document.querySelector('.project-item[data-project="quant"]');
    if(!item)return;
    const meta=item.querySelector('.project-row__meta');
    const hover=item.querySelector('.project-hover-info__text');
    const tags=item.querySelector('.project-hover-info__tags');
    if(meta)meta.textContent=s.meta;
    if(hover)hover.textContent=s.hover;
    if(tags)tags.innerHTML=s.hoverTags.map(x=>`<span>${esc(x)}</span>`).join('');
  }

  function renderDetail(){
    if(!isQuant())return;
    const s=STORY[lang()];
    const headline=document.querySelector('.project-detail__headline');
    const description=document.querySelector('.project-detail__description');
    const tags=document.querySelector('.project-detail__tags');
    const belowLabel=document.querySelector('.project-detail__below-label');
    let below=document.querySelector('.detail-below-copy');
    if(headline)headline.textContent=s.headline;
    if(description)description.textContent=s.description;
    if(tags)tags.innerHTML=s.tags.map(x=>`<span>${esc(x)}</span>`).join('');
    if(belowLabel)belowLabel.textContent=`${s.caseStudy} / ${document.querySelector('.detail-number')?.textContent||'02'}`;
    if(below?.tagName==='P'){
      const div=document.createElement('div');
      div.className='detail-below-copy';
      below.replaceWith(div);
      below=div;
    }
    if(below){
      below.innerHTML=`
        <p class="detail-overview">${esc(s.overview)}</p>
        <div class="detail-facts">
          <section class="detail-fact"><span class="detail-fact__label">${esc(s.labels[0])}</span><p class="detail-fact__copy">${esc(s.origin)}</p></section>
          <section class="detail-fact"><span class="detail-fact__label">${esc(s.labels[1])}</span><p class="detail-fact__copy">${esc(s.turning)}</p></section>
          <section class="detail-fact"><span class="detail-fact__label">${esc(s.labels[2])}</span><p class="detail-fact__copy">${esc(s.now)}</p></section>
        </div>`;
    }
  }

  function apply(){
    renderRow();
    if(isQuant())renderDetail();
  }

  document.querySelector('.project-item[data-project="quant"] .project-row')?.addEventListener('click',()=>{
    setTimeout(renderDetail,10);
    setTimeout(renderDetail,120);
  });

  const media=document.querySelector('.project-detail__media');
  if(media)new MutationObserver(()=>setTimeout(apply,0)).observe(media,{attributes:true,attributeFilter:['data-project']});
  new MutationObserver(()=>setTimeout(apply,0)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  apply();
  setTimeout(apply,220);
  setTimeout(apply,900);
})();