/* stories.js - Story Mode: choose-your-own-adventure graphs. The player in
   app.js reads `start`, then walks `nodes` one choice at a time, saving the
   current node + path to localStorage (bt_story_<id>).

   Each story: { id, title, blurb, image, accent, start, nodes }.
   A node is an ENDING iff it has `ending` and no `choices`. Otherwise it has
   `choices: [{ label, to }]` where every `to` is a key in `nodes`.
   Tone: humorous, chaotic, relatable for 18-25. No dashes or ellipses.
   Images are deterministic picsum seeds (unique per node) so they never break
   and the scene changes as you progress. Easy to expand - copy STORY_TEMPLATE. */
(function () {
  if (!window.BT_DATA) return;

  // Topical scene photos via LoremFlickr (keyword-matched real photos, so the
  // image actually fits the story instead of being random). Each story has a
  // small keyword pool; the seed (e.g. "bts1cover", "bts1n3", "bts2eghost")
  // selects the story's pool and a stable, on-theme image per node. Covers use
  // the pool's headline keyword; other nodes are hashed across the pool.
  var SCENES = {
    bts1: ["money,cash", "luxury,gold", "mansion,villa", "jet,travel", "skyline,city", "sunset,ocean", "party,celebration", "shopping,luxury"],
    bts2: ["smartphone,selfie", "socialmedia,phone", "influencer,camera", "concert,crowd", "microphone,studio", "neon,city", "laptop,desk", "spotlight,stage"],
    bts3: ["couple,romance", "texting,night", "coffee,date", "sunset,silhouette", "rain,window", "city,night", "love,hearts", "park,walking"],
    bts4: ["friends,smartphone", "friends,phones", "map,travel", "airport,luggage", "confetti,party", "laptop,planning", "party,friends", "popcorn,watching"],
    bts5: ["smartphone,notification", "city,street", "coffee,morning", "crowd,city", "sunrise,rooftop", "shopping,bags", "meditation,calm", "neon,night"]
  };
  function IMG(seed) {
    var m = /^(bts\d+)(.*)$/.exec(seed) || [];
    var pool = SCENES[m[1]] || ["lifestyle,aesthetic"];
    var suffix = m[2] || seed;
    var h = 2166136261 >>> 0;
    for (var i = 0; i < suffix.length; i++) { h ^= suffix.charCodeAt(i); h = Math.imul(h, 16777619); }
    h = h >>> 0;
    var kw = /cover$/.test(seed) ? pool[0] : pool[h % pool.length];
    return "https://loremflickr.com/1200/700/" + kw + "?lock=" + (h % 100000);
  }

  BT_DATA.stories = (BT_DATA.stories || []).concat([

    /* ================================================================== s1 */
    {
      id: "s1",
      title: "You Woke Up a Millionaire (For One Day)",
      blurb: "Ten million hits your account at sunrise and vanishes at midnight. No rollover. Spend wisely, or do not.",
      image: IMG("bts1cover"),
      accent: "from-indigo-500 to-fuchsia-500",
      start: "n0",
      nodes: {
        n0: { text: "You open your banking app out of habit and nearly drop your phone. The balance reads ten million. A single notification glows underneath it: this money disappears at midnight, no questions asked. The clock is already ticking.", image: IMG("bts1n0"),
          choices: [ { label: "Check if it is actually real", to: "n1" }, { label: "Do not think, just start spending", to: "n2" } ] },

        n1: { text: "You transfer one dollar to a friend and it goes through. You buy a coffee and it clears. It is real, it is yours, and you have roughly eighteen hours before it evaporates. Your heartbeat is doing something unholy.", image: IMG("bts1n1"),
          choices: [ { label: "Make a calm, smart plan", to: "n3" }, { label: "Summon the group chat immediately", to: "n4" } ] },

        n2: { text: "No plan, no spreadsheet, no notes. You open every shopping app you own at once and crack your knuckles like a movie hacker. The cart awaits.", image: IMG("bts1n2"),
          choices: [ { label: "Buy the one dream thing", to: "n5" }, { label: "Treat everyone you love", to: "n6" } ] },

        n3: { text: "You make tea, sit down, and breathe. If this is only for a day, the smart move is to make it count past midnight somehow. You open a fresh notes page titled simply: the plan.", image: IMG("bts1n3"),
          choices: [ { label: "Pay off your family's debts", to: "e_legacy" }, { label: "Quietly invest every last cent", to: "n7" } ] },

        n7: { text: "You find an app, take a deep breath, and start moving money into things that grow. The cash will vanish at midnight, but maybe what it becomes will not. Future you is watching.", image: IMG("bts1n7"),
          choices: [ { label: "Vanish and tell absolutely no one", to: "e_ghost" }, { label: "Fund the company you always talk about", to: "e_founder" } ] },

        n4: { text: "You type WHO IS FREE TODAY in all caps and your phone detonates with replies. Within four minutes someone has suggested a private jet and someone else has suggested a goat. This is the energy.", image: IMG("bts1n4"),
          choices: [ { label: "Charter a jet and chase the sunset", to: "e_trip" }, { label: "Throw the party of the century", to: "e_party" } ] },

        n5: { text: "There is one thing you have wanted for years, the thing you pretend you do not think about. It is finally within reach and the buy button has never looked so beautiful.", image: IMG("bts1n5"),
          choices: [ { label: "The forever home with the big windows", to: "e_house" }, { label: "Blow it all on one unforgettable trip", to: "e_trip" } ] },

        n6: { text: "You think about every person who ever covered your coffee, every friend who showed up. Spending it on yourself suddenly feels small compared to this.", image: IMG("bts1n6"),
          choices: [ { label: "Surprise your whole family", to: "e_legacy" }, { label: "Leave anonymous gifts for strangers", to: "e_ghost" } ] },

        e_legacy: { text: "Midnight comes. The balance blinks back to normal. But the relief on the faces of the people you love does not.", image: IMG("bts1elegacy"),
          ending: { title: "The Family Hero", emoji: "👑", description: "You wiped out the debt your people had been carrying for years and set them up before the clock ran out. The money is gone but the weight you lifted off their shoulders is permanent. You will never be the villain in anyone's story.", share: "Had ten million for one day and spent it making my whole family cry happy tears. 👑" } },

        e_ghost: { text: "By sunrise, no one knows your name. Somewhere, strangers are telling a story about a miracle they cannot explain.", image: IMG("bts1eghost"),
          ending: { title: "The Anonymous Legend", emoji: "🕶️", description: "You moved in total silence, left gifts with no name attached, and vanished before anyone could say thank you. You did not need the credit. The mystery is the whole point, and honestly it is the most iconic thing you have ever done.", share: "Spent my one millionaire day as an anonymous fairy godparent. No notes, no name. 🕶️" } },

        e_founder: { text: "The cash disappears at midnight, but the company you funded is already breathing on its own.", image: IMG("bts1efounder"),
          ending: { title: "The Empire Builder", emoji: "🚀", description: "You poured every cent into the idea you have whispered about for years. Tomorrow you are technically broke again, but you are broke with a launched company and a fire under you. Legends start over on purpose.", share: "Turned my one rich day into an actual empire. Risky? Yes. Worth it? Obviously. 🚀" } },

        e_trip: { text: "You chase daylight across three time zones and laugh until your face genuinely aches. The clock hits twelve while you are mid air, grinning.", image: IMG("bts1etrip"),
          ending: { title: "The One Perfect Day", emoji: "✈️", description: "No house, no investments, no plan. Just one absolutely unrepeatable day of sunsets, food you cannot pronounce, and your favorite people along for the ride. Some memories are worth more than a balance.", share: "Blew a fortune on the single best day of my life. Worth every imaginary dollar. ✈️" } },

        e_party: { text: "The venue, the impossible lineup, every person you love in one room. The clip will outlive us all.", image: IMG("bts1eparty"),
          ending: { title: "The Night They Still Talk About", emoji: "🎉", description: "You rented the place, booked the act nobody believed you could, and threw open the doors. People who were not even there claim they were. That is how you know it was historic.", share: "Threw the party of the century on a millionaire budget. You simply had to be there. 🎉" } },

        e_house: { text: "Midnight strikes and the money is gone, but the keys are still warm in your hand.", image: IMG("bts1ehouse"),
          ending: { title: "The Forever Home", emoji: "🏡", description: "You bought the place with the big windows and the soft morning light, the one you have decorated in your head a hundred times. The fortune vanished. The porch did not. You chose peace and you chose right.", share: "Had money for 24 hours and bought myself peace and a porch. Settled and unbothered. 🏡" } }
      }
    },

    /* ================================================================== s2 */
    {
      id: "s2",
      title: "You Accidentally Became TikTok Famous",
      blurb: "You posted a dumb 12 second video before bed. You wake up to eight million views and a very different life.",
      image: IMG("bts2cover"),
      accent: "from-fuchsia-500 to-pink-500",
      start: "n0",
      nodes: {
        n0: { text: "The video was nothing. You filming yourself tripping over a cat while explaining your skincare routine. Now it has eight million views, forty thousand new followers, and a comment section that has fully adopted you as their child.", image: IMG("bts2n0"),
          choices: [ { label: "Lean all the way in, post again now", to: "n1" }, { label: "Panic and consider going private", to: "n2" } ] },

        n1: { text: "You crack your knuckles. If the internet wants you, the internet gets you. You open the camera and the little red light feels like a spotlight now.", image: IMG("bts2n1"),
          choices: [ { label: "Start a daily series", to: "n3" }, { label: "Cash in with brand deals", to: "n4" } ] },

        n2: { text: "Eight million people watched you eat carpet. Your thumb hovers over the privacy settings. Your stomach is somewhere near your shoes.", image: IMG("bts2n2"),
          choices: [ { label: "Read every single comment first", to: "n5" }, { label: "Log off completely for a week", to: "n6" } ] },

        n3: { text: "You promise the internet a video every day, which felt brave at 2am and feels insane at 7am. Day one performs. Day two performs. The algorithm is purring.", image: IMG("bts2n3"),
          choices: [ { label: "Stay exactly, authentically you", to: "e_authentic" }, { label: "Start chasing whatever the algorithm wants", to: "n7" } ] },

        n7: { text: "You study the trends like a final exam. Your content gets sharper, faster, louder. So does the pressure behind your eyes.", image: IMG("bts2n7"),
          choices: [ { label: "Burn bright and burn out", to: "e_burnout" }, { label: "Sign with a management team", to: "e_mogul" } ] },

        n4: { text: "Your inbox is suddenly full of brands who two days ago did not know you existed. One of them is offering more than your rent. Several times over.", image: IMG("bts2n4"),
          choices: [ { label: "Sign the biggest deal on the table", to: "e_mogul" }, { label: "Keep it small, real, and yours", to: "e_authentic" } ] },

        n5: { text: "You scroll. Most of it is love, some of it is unhinged, a little of it stings. The human brain was not built to be perceived by eight million people at once.", image: IMG("bts2n5"),
          choices: [ { label: "Find and reply to your real ones", to: "e_community" }, { label: "Let the noise scare you off for good", to: "e_ghosted" } ] },

        n6: { text: "You put the phone in a drawer and walk away. For seven whole days you are just a person again, and it feels like taking off shoes that were two sizes too small.", image: IMG("bts2n6"),
          choices: [ { label: "Come back refreshed and casual", to: "e_balance" }, { label: "Realize you never want to come back", to: "e_ghosted" } ] },

        e_authentic: { text: "You keep posting like nobody is watching, even though millions are. Somehow that is exactly why they stay.", image: IMG("bts2eauthentic"),
          ending: { title: "The Realest in the Game", emoji: "💛", description: "You never let the numbers change the assignment. No fake voice, no chasing, just you being weird and warm on camera. Your followers can smell the authenticity and they would riot for you. Slow, steady, and beloved.", share: "Got famous overnight and refused to become a different person. Still me, just louder. 💛" } },

        e_burnout: { text: "You hit a wall at full speed. The likes kept climbing while you quietly ran on empty.", image: IMG("bts2eburnout"),
          ending: { title: "The Cautionary Tale", emoji: "🔥", description: "You gave the algorithm everything it asked for and it asked for everything. The good news is you learned, the hard way, that no view count is worth your whole nervous system. You log off, rest, and come back human.", share: "Went viral, chased it too hard, learned the lesson. Your peace is the real follower count. 🔥" } },

        e_mogul: { text: "You sign the papers and the internet you stumbled into becomes a career you built.", image: IMG("bts2emogul"),
          ending: { title: "The Accidental Mogul", emoji: "💼", description: "A team, a contract, a brand. The cat video became a launchpad and you actually stuck the landing. You turned 12 random seconds into something with a logo and a future. Business mode unlocked.", share: "Tripped over a cat on camera and somehow built a whole career out of it. Manifested. 💼" } },

        e_community: { text: "You stop performing for the millions and start talking to the few thousand who actually get you.", image: IMG("bts2ecommunity"),
          ending: { title: "The Group Chat Founder", emoji: "🫶", description: "Out of eight million strangers you found your actual people, replied to them, learned their names, built a little corner of the internet that feels safe. The fame fades but the community you grew is forever.", share: "Went viral and used it to find my actual people. Best comment section on the app. 🫶" } },

        e_balance: { text: "You come back posting once in a while, purely for the joy of it, and never let it run your life again.", image: IMG("bts2ebalance"),
          ending: { title: "The Touch-Grass Champion", emoji: "🌿", description: "You took the break, remembered who you are offline, and returned to posting as a hobby instead of a hostage situation. Casual, healthy, and somehow still beloved. You won the internet by needing it the least.", share: "Got TikTok famous, logged off for a week, came back completely unbothered. Balance is the flex. 🌿" } },

        e_ghosted: { text: "You let the moment pass like weather. The internet moves on, and so, peacefully, do you.", image: IMG("bts2eghosted"),
          ending: { title: "The One Who Walked Away", emoji: "👻", description: "Eight million views and you simply chose silence. No follow up, no cash in, no main character arc. Somewhere there is a legendary video and an empty account, and the mystery of you. Iconic in a quiet way.", share: "Went viral and ghosted the entire internet. Sometimes the power move is the disappearing act. 👻" } }
      }
    },

    /* ================================================================== s3 */
    {
      id: "s3",
      title: "Your Situationship Got Extremely Weird",
      blurb: "It is 1am and the person you are definitely not dating just texted four words that change everything.",
      image: IMG("bts3cover"),
      accent: "from-rose-500 to-violet-500",
      start: "n0",
      nodes: {
        n0: { text: "Your phone lights up at 1am. It is them, the one you have spent four months insisting is just a friend. The message reads: we need to talk. Your soul briefly leaves your body.", image: IMG("bts3n0"),
          choices: [ { label: "Reply right now, no thoughts", to: "n1" }, { label: "Leave them on read and sleep on it", to: "n2" } ] },

        n1: { text: "You type back instantly. Three dots appear, vanish, appear again. Then it lands: they caught feelings. Real ones. The kind with a capital F. Your room is suddenly very warm.", image: IMG("bts3n1"),
          choices: [ { label: "Say it back, you feel it too", to: "n3" }, { label: "Deflect with a perfectly timed joke", to: "n4" } ] },

        n2: { text: "You stare at the ceiling until sunrise running the message through every possible filter. By morning you have constructed eleven scenarios and zero conclusions. Classic.", image: IMG("bts3n2"),
          choices: [ { label: "Show up at their place in person", to: "n5" }, { label: "Make an unhinged pros and cons list", to: "n6" } ] },

        n3: { text: "You tell the truth. The whole embarrassing, hopeful truth. The reply comes back fast and warm and it turns out you were both terrified of the exact same thing.", image: IMG("bts3n3"),
          choices: [ { label: "Define the relationship right now", to: "e_official" }, { label: "Keep it floaty but finally honest", to: "n7" } ] },

        n7: { text: "No labels yet, but no more pretending either. It is soft and undefined and somehow the most honest thing either of you has done in months.", image: IMG("bts3n7"),
          choices: [ { label: "Let it slow burn beautifully", to: "e_slowburn" }, { label: "Embrace the chaos and see what happens", to: "e_chaos" } ] },

        n4: { text: "You crack a joke so fast it surprises both of you. There is a pause. You can feel the moment teetering on the edge of a knife.", image: IMG("bts3n4"),
          choices: [ { label: "Double down, jokes are your armor", to: "e_friendzone" }, { label: "Drop the act before it is too late", to: "e_official" } ] },

        n5: { text: "You are standing outside their door before your brain fully signs off on the plan. You knock. They open it in pajamas, hair chaos, eyes wide. Rom com lighting, somehow.", image: IMG("bts3n5"),
          choices: [ { label: "Give the big honest speech", to: "e_moviemoment" }, { label: "Chicken out and suggest coffee", to: "e_friendzone" } ] },

        n6: { text: "You open a fresh note and title it with their name and a question mark. The pros column fills up alarmingly fast. The cons column says: what if it ruins everything.", image: IMG("bts3n6"),
          choices: [ { label: "Logic says protect yourself and walk", to: "e_walkaway" }, { label: "Logic says some risks are worth it", to: "e_official" } ] },

        e_official: { text: "You stop circling the truth and just land on it together. No more not dating. Just dating.", image: IMG("bts3eofficial"),
          ending: { title: "Finally, Officially Something", emoji: "💞", description: "Four months of maybe and almost, and you finally said the brave thing out loud. Turns out defining it did not break the magic, it gave it a foundation. The group chat owes you all twenty dollars.", share: "Made the situationship official and the group chat is losing their entire minds. 💞" } },

        e_slowburn: { text: "You let it unfold at its own unhurried pace, and somehow that makes every small moment hit harder.", image: IMG("bts3eslowburn"),
          ending: { title: "The Slow Burn", emoji: "🔥", description: "No rush, no labels yet, just two people being honest and letting the good thing grow on its own clock. It is the most patient you have ever been and the most sure you have ever felt. Worth the wait.", share: "Chose the slow burn over the panic. Best plot pacing of my entire life. 🔥" } },

        e_chaos: { text: "You both decide to stop overthinking and just see what happens, which is either visionary or a disaster, possibly both.", image: IMG("bts3echaos"),
          ending: { title: "The Beautiful Disaster", emoji: "🌪️", description: "You leaned fully into the chaos and now your life is a thrilling, slightly unhinged blur of mixed signals you both secretly enjoy. Is it healthy? Unclear. Is it boring? Never. Buckle up.", share: "We chose chaos over closure and honestly the plot has never been better. 🌪️" } },

        e_friendzone: { text: "The joke lands, the moment passes, and you both quietly file the feelings away. The friendship survives. The maybe does not.", image: IMG("bts3efriendzone"),
          ending: { title: "Saved by the Bit", emoji: "🃏", description: "You armored up with humor and dodged the vulnerable thing entirely. The friendship is intact and safe, which is either very wise or the great what if of your twenties. Only time will tell, and time is petty.", share: "Had the chance to say it and made a joke instead. The friendship lives, the what if haunts. 🃏" } },

        e_moviemoment: { text: "You give the speech. The real one, no jokes, on their doorstep, heart fully out. The pause afterward lasts a small eternity.", image: IMG("bts3emovie"),
          ending: { title: "The Main Character Moment", emoji: "🎬", description: "You showed up unannounced and said the brave, cinematic, terrifying thing. However it lands, you will never wonder what would have happened if you had spoken up. You are the protagonist and you acted like it.", share: "Showed up at their door and gave the whole movie speech. No regrets, full main character. 🎬" } },

        e_walkaway: { text: "You close the note, take a breath, and choose your own peace. It is not the fun ending. It might be the right one.", image: IMG("bts3ewalkaway"),
          ending: { title: "The Self-Respect Arc", emoji: "🚪", description: "You looked at the months of mixed signals and decided you deserve someone who is sure. Walking away from a maybe to make room for a definitely is the most underrated power move there is. Growth looks good on you.", share: "Walked away from the situationship and straight into my self-respect era. Healing. 🚪" } }
      }
    },

    /* ================================================================== s4 */
    {
      id: "s4",
      title: "Trapped in the Group Chat From Hell",
      blurb: "You got added to a 47 person chat called TRIP PLANNING and there is no known way out.",
      image: IMG("bts4cover"),
      accent: "from-violet-500 to-indigo-500",
      start: "n0",
      nodes: {
        n0: { text: "A notification appears: you were added to 🔥 TRIP PLANNING 🔥. There are 47 members. Within ninety seconds there are 200 unread messages, three polls, and someone has already suggested a destination that requires a passport you do not have.", image: IMG("bts4n0"),
          choices: [ { label: "Engage and seize control", to: "n1" }, { label: "Stay silent and lurk in the shadows", to: "n2" } ] },

        n1: { text: "You decide chaos needs a leader and that leader is apparently you. You start typing. Forty seven people go quiet, sensing a main character has entered.", image: IMG("bts4n1"),
          choices: [ { label: "Drop a color coded spreadsheet", to: "n3" }, { label: "Become the designated funny one", to: "n4" } ] },

        n2: { text: "You mute your microphone, metaphorically. You will simply observe this disaster from the back row. The chat does not need your voice, only your witness.", image: IMG("bts4n2"),
          choices: [ { label: "Mute the chat forever", to: "n5" }, { label: "Screenshot the chaos to your bestie", to: "n6" } ] },

        n3: { text: "You post a spreadsheet so clean it makes three people emotional. Tabs for budget, dates, dietary needs, and one ominous tab labeled drama. The chat falls in love with you instantly.", image: IMG("bts4n3"),
          choices: [ { label: "Lead the entire trip yourself", to: "e_planner" }, { label: "Delegate like a true boss", to: "n7" } ] },

        n7: { text: "You hand out roles like a general. You on flights, you on snacks, you on vibes. For one shining moment, the system works.", image: IMG("bts4n7"),
          choices: [ { label: "It actually comes together", to: "e_legend" }, { label: "Everyone flakes within an hour", to: "e_chaos" } ] },

        n4: { text: "You abandon all logistics and commit to being hilarious instead. Your first joke gets fourteen laughing reactions. A dangerous power is awakening.", image: IMG("bts4n4"),
          choices: [ { label: "Carry the entire vibe", to: "e_iconic" }, { label: "Take one joke slightly too far", to: "e_chaos" } ] },

        n5: { text: "You hit mute and feel a wave of peace. Out of sight, out of mind, out of 600 unread messages about whether to rent a van.", image: IMG("bts4n5"),
          choices: [ { label: "Miss the entire trip", to: "e_ghost" }, { label: "Get peer pressured right back in", to: "e_planner" } ] },

        n6: { text: "You start narrating the chaos to your best friend in a private chat, complete with commentary. This second chat is immediately funnier than the first.", image: IMG("bts4n6"),
          choices: [ { label: "Start a breakaway side group chat", to: "e_messy" }, { label: "Stay neutral and just enjoy the show", to: "e_ghost" } ] },

        e_planner: { text: "The trip happens. It happens because of you, your spreadsheet, and your refusal to let 47 people descend into anarchy.", image: IMG("bts4eplanner"),
          ending: { title: "The Trip Mom", emoji: "📋", description: "You held the whole thing together with color coding and sheer will. Everyone had the time of their lives and not a single one of them knows how close it came to collapsing. You are exhausted, beloved, and never doing this again. Until next year.", share: "Single handedly saved a 47 person group trip with one spreadsheet. They do not deserve me. 📋" } },

        e_legend: { text: "The delegation holds. Against every law of group chat physics, the plan actually comes together.", image: IMG("bts4elegend"),
          ending: { title: "The Logistics Legend", emoji: "🧠", description: "You gave everyone a job and somehow they all did it. Historians will not believe this happened. You proved that a group chat can be tamed, briefly, by one organized person with a vision and zero patience.", share: "Got 47 people to actually follow through on a group plan. I should be studied in a lab. 🧠" } },

        e_chaos: { text: "It all comes apart spectacularly, and you watch the trip dissolve into a legendary mess of canceled plans and passive aggressive polls.", image: IMG("bts4echaos"),
          ending: { title: "The Agent of Chaos", emoji: "🔥", description: "Whether you flaked, joked too hard, or just lit the match, the trip is officially dead and the chat is a war zone. Honestly though, the drama is more entertaining than any vacation could have been. No notes.", share: "The group trip collapsed into total chaos and I am not saying it was me but the timeline is suspicious. 🔥" } },

        e_iconic: { text: "You never plan a single thing, yet somehow become the most important person in the chat purely through comedic talent.", image: IMG("bts4eiconic"),
          ending: { title: "The Comic Relief", emoji: "🎤", description: "You did zero logistics and contributed everything that mattered: morale. The trip may or may not happen, but your one liners will be quoted for years. Some people build the itinerary. You built the legend.", share: "Did absolutely no planning and somehow became the main character of the group chat. Talent. 🎤" } },

        e_ghost: { text: "You drift away from the chaos entirely and let the storm pass without you. Peace, perfect and unbothered.", image: IMG("bts4eghost"),
          ending: { title: "The Phantom Member", emoji: "👻", description: "You said nothing, planned nothing, and quietly vanished into the role of the person everyone forgets is even in the chat. You missed the trip, sure, but you also missed the breakdown, the budgeting, and the betrayal. Worth it.", share: "Got added to the group trip chat and achieved total ghost mode. Never seen, never stressed. 👻" } },

        e_messy: { text: "You spin off a secret side chat and accidentally create a second, funnier, far messier universe.", image: IMG("bts4emessy"),
          ending: { title: "The Side Chat Architect", emoji: "🍿", description: "The breakaway chat you started is now where the real conversation lives, full of commentary, screenshots, and chaos the main chat will never see. You are the puppet master of a shadow group, and the popcorn is endless.", share: "Started a secret side chat to talk about the main chat and now I run a whole underground empire. 🍿" } }
      }
    },

    /* ================================================================== s5 */
    {
      id: "s5",
      title: "You Said Yes to Every Notification for 24 Hours",
      blurb: "One rule for one day: whatever your phone tells you to do, you do it. What could possibly go wrong.",
      image: IMG("bts5cover"),
      accent: "from-sky-500 to-indigo-500",
      start: "n0",
      nodes: {
        n0: { text: "The experiment is simple. For 24 hours, every notification is a command and you obey it. Your phone buzzes for the first time. It is a friend's story captioned: anyone awake and down for something stupid?", image: IMG("bts5n0"),
          choices: [ { label: "Reply yes and head out to meet them", to: "n1" }, { label: "An ad fires first, obey the ad instead", to: "n2" } ] },

        n1: { text: "You meet your friend on a corner at an unreasonable hour. They have that look, the one that means the next few hours are about to become a story you tell forever.", image: IMG("bts5n1"),
          choices: [ { label: "Let them drag you on a spontaneous mission", to: "n3" }, { label: "A calendar alert hijacks the plan", to: "n4" } ] },

        n2: { text: "An ad for a wildly specific product takes over your screen. The rules are the rules. You buy it without question and await your fate.", image: IMG("bts5n2"),
          choices: [ { label: "It turns out weirdly amazing", to: "n5" }, { label: "It pulls you into a scammy rabbit hole", to: "n6" } ] },

        n3: { text: "The mission has no clear goal and no clear end. You are following pings, vibes, and your friend's terrible sense of direction across the entire city.", image: IMG("bts5n3"),
          choices: [ { label: "Follow the chaos all the way", to: "e_adventure" }, { label: "A DM redirects you at the last second", to: "n7" } ] },

        n7: { text: "Your phone buzzes with a DM from a name you were not expecting to see today. The rules say you have to respond. Your thumb hovers.", image: IMG("bts5n7"),
          choices: [ { label: "It is someone you genuinely missed", to: "e_connection" }, { label: "Film the whole thing, it could go viral", to: "e_viral" } ] },

        n4: { text: "A calendar alert you forgot you set goes off: do the scary thing. You stare at it. Your phone, somehow, knows.", image: IMG("bts5n4"),
          choices: [ { label: "Rebel and mute absolutely everything", to: "e_zen" }, { label: "Obey every ping until you are fried", to: "e_burnout" } ] },

        n5: { text: "The random product is, against all odds, genuinely great. Your phone has better taste than you do and you are a little disturbed by that.", image: IMG("bts5n5"),
          choices: [ { label: "Say yes to every single upsell", to: "e_broke" }, { label: "It connects you to a whole community", to: "e_connection" } ] },

        n6: { text: "One tap leads to another and suddenly you are nine pages deep into something you do not fully understand, with three new apps and a vague sense of regret.", image: IMG("bts5n6"),
          choices: [ { label: "Spiral all the way down", to: "e_burnout" }, { label: "Snap out of it and log off", to: "e_zen" } ] },

        e_adventure: { text: "You follow the pings to the very end and the day unfolds into something you could never have planned on purpose.", image: IMG("bts5eadventure"),
          ending: { title: "The Best Day You Did Not Plan", emoji: "🌅", description: "You let your phone steer and it drove you straight into the most spontaneous, ridiculous, unforgettable day of the year. Rooftops, strangers who became friends, a sunrise you did not expect. Sometimes surrender is the adventure.", share: "Let my phone plan my whole day and accidentally had the best one of the year. Chaos works. 🌅" } },

        e_connection: { text: "One notification you almost ignored turns into a conversation you did not know you needed.", image: IMG("bts5econnection"),
          ending: { title: "The Reconnection", emoji: "🫂", description: "A random ping reconnected you with someone you had drifted from, and the experiment quietly became the reason you have your person back. The phone was just the messenger. The reaching out was all you.", share: "Said yes to a random notification and it reconnected me with someone I missed. Universe move. 🫂" } },

        e_viral: { text: "You hit record at exactly the right moment and the internet does the rest while you sleep.", image: IMG("bts5eviral"),
          ending: { title: "The Accidental Viral Moment", emoji: "📈", description: "You filmed the chaos, posted it on a whim, and woke up to numbers that do not look real. The notification experiment generated the exact content the algorithm was starving for. Your phone basically made you famous on a dare.", share: "Said yes to every notification for a day and one of them turned me viral. My phone runs my life now. 📈" } },

        e_zen: { text: "You break the rule on purpose, silence the noise, and remember what your own thoughts sound like.", image: IMG("bts5ezen"),
          ending: { title: "The Great Unplug", emoji: "🧘", description: "Somewhere mid experiment you realized the healthiest thing you could do was disobey. You muted everything, looked up, and felt the quiet hit different. You lost the dare and won the whole day.", share: "Tried to obey every notification and ended up rage quitting into total peace. Touch grass supremacy. 🧘" } },

        e_burnout: { text: "You obey every last ping until your brain is a browser with 90 tabs open and a phone at one percent.", image: IMG("bts5eburnout"),
          ending: { title: "Fried by the Feed", emoji: "🔋", description: "You followed the rules to the bitter, buzzing end and your nervous system filed a formal complaint. The experiment proved one thing beautifully: your phone will absolutely run you into the ground if you let it. Lesson learned, deeply.", share: "Obeyed every notification for 24 hours and my brain is now a single spinning loading icon. 🔋" } },

        e_broke: { text: "Every yes costs a little more than the last, and by sundown your bank app is the one sending the scary notifications.", image: IMG("bts5ebroke"),
          ending: { title: "The Impulse Buy Champion", emoji: "🛒", description: "You said yes to every upsell, every add to cart, every limited time offer, and now you own things you cannot name and a payment plan you do not remember agreeing to. Iconic financial decisions all around. The boxes are still arriving.", share: "Said yes to every notification and my bank account said absolutely not. Worth it? The boxes keep coming. 🛒" } }
      }
    }

  ]);
})();
