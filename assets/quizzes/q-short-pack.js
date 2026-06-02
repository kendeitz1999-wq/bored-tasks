/* Bored Tasks quiz pack - "quick hits": short 6-question personality quizzes
   (about 2 min each) on 18-24 topics (friendships, texting, dating, crushes,
   weekends) for variety. Each has 4 results; every question has one clean
   option per result, so every result is reachable and scoring stays balanced.
   Images are keyword-matched LoremFlickr photos (unique per image). */
(function () {
  BT_DATA.quizzes.push(

    /* ---------------------------------------------------------- friendships */
    {
      id: "friend-group-role",
      slug: "friend-group-role",
      title: "What's Your Role in the Friend Group?",
      category: "personality",
      type: "personality",
      image: "https://loremflickr.com/1200/675/friends,laughing?lock=10101",
      description: "Every squad has its main characters. Find out which one you actually are.",
      tagline: "Mom friend? Chaos gremlin? The glue holding it all together? Six questions and we will expose your exact role in the group chat.",
      estMinutes: 2,
      takenCount: 21430,
      questions: [
        { q: "It's a night out. What's your job?", options: [
          { text: "Holding everyone's drinks, hair and feelings", points: { mom: 2 } },
          { text: "Convincing everyone to do something we'll regret", points: { wildcard: 2 } },
          { text: "Watching it all unfold from the corner", points: { observer: 2 } },
          { text: "Actually planning where we're going", points: { glue: 2 } }
        ] },
        { q: "The group chat is blowing up. You're...", options: [
          { text: "Sending 'did everyone get home safe?'", points: { mom: 2 } },
          { text: "Sending 17 unhinged voice notes", points: { wildcard: 2 } },
          { text: "Reading every message, replying to none", points: { observer: 2 } },
          { text: "Already organizing the next hangout", points: { glue: 2 } }
        ] },
        { q: "A friend is going through it. You...", options: [
          { text: "Show up with snacks and a plan", points: { mom: 2 } },
          { text: "Take them out to forget about it", points: { wildcard: 2 } },
          { text: "Listen quietly and say the perfect thing", points: { observer: 2 } },
          { text: "Check in every single day until they're okay", points: { glue: 2 } }
        ] },
        { q: "Pick your main group chat contribution:", options: [
          { text: "Reminders and 'text me when you're home'", points: { mom: 2 } },
          { text: "Cursed memes at 3am", points: { wildcard: 2 } },
          { text: "One devastating comment a week", points: { observer: 2 } },
          { text: "The 'so are we still on for Friday?'", points: { glue: 2 } }
        ] },
        { q: "The squad is bored. You suggest...", options: [
          { text: "A cozy night in, I'll cook", points: { mom: 2 } },
          { text: "Something none of us have ever done", points: { wildcard: 2 } },
          { text: "Whatever, honestly I'm down for anything", points: { observer: 2 } },
          { text: "I already made a list of options", points: { glue: 2 } }
        ] },
        { q: "What would the group say about you?", options: [
          { text: "'They take care of all of us'", points: { mom: 2 } },
          { text: "'They are genuinely unhinged and we love them'", points: { wildcard: 2 } },
          { text: "'Quiet, but says the realest stuff'", points: { observer: 2 } },
          { text: "'Nothing happens without them'", points: { glue: 2 } }
        ] }
      ],
      results: [
        { key: "mom", title: "The Mom Friend", emoji: "🧴", image: "https://loremflickr.com/800/600/coffee,cozy?lock=10102", description: "You carry the snacks, the chargers and everyone's emotional baggage. The group would not survive a single night out without you, and honestly they know it. You are the safe one, the reliable one, the human first-aid kit.", share: "I'm the Mom Friend of the group. Someone has to carry the snacks AND the trauma. 🧴" },
        { key: "wildcard", title: "The Chaos Wildcard", emoji: "🃏", image: "https://loremflickr.com/800/600/party,confetti?lock=10103", description: "You are the reason there are stories. No plan is safe, no night is boring, and 'we should NOT but...' is basically your catchphrase. People follow you into questionable decisions and somehow never regret it.", share: "I'm the Chaos Wildcard. You're welcome for every story you have. 🃏" },
        { key: "observer", title: "The Quiet Observer", emoji: "👀", image: "https://loremflickr.com/800/600/cafe,reading?lock=10104", description: "You say five words a night and all five go viral in the group chat. You see everything, judge gently and your one-liners are legendary. Still waters, devastating wit.", share: "I'm the Quiet Observer. I said four words tonight and ended someone's whole career. 👀" },
        { key: "glue", title: "The Glue", emoji: "🫶", image: "https://loremflickr.com/800/600/friends,group?lock=10105", description: "You are the reason the group still exists. You plan the hangs, remember the birthdays and quietly hold the whole friendship together. Underappreciated? Maybe. Essential? Completely.", share: "I'm the Glue. Without me this friend group would simply cease to exist. 🫶" }
      ]
    },

    /* -------------------------------------------------------------- texting */
    {
      id: "texting-personality",
      slug: "texting-personality",
      title: "What's Your Texting Personality?",
      category: "personality",
      type: "personality",
      image: "https://loremflickr.com/1200/675/smartphone,texting?lock=20201",
      description: "Your texting habits say more about you than your star sign. Let's diagnose them.",
      tagline: "Dry texter? Double texter? Voice-note menace? We'll read your messages and then read YOU.",
      estMinutes: 2,
      takenCount: 18920,
      questions: [
        { q: "Someone sends you a long paragraph. You reply with...", options: [
          { text: "'ok'", points: { dry: 2 } },
          { text: "Three paragraphs back, immediately", points: { double: 2 } },
          { text: "A two-minute voice note", points: { voicenote: 2 } },
          { text: "A single heart reaction", points: { reactor: 2 } }
        ] },
        { q: "Your typical response time is...", options: [
          { text: "Whenever I feel like it, honestly", points: { dry: 2 } },
          { text: "0.2 seconds, always", points: { double: 2 } },
          { text: "However long the voice memo takes", points: { voicenote: 2 } },
          { text: "I react now and reply never", points: { reactor: 2 } }
        ] },
        { q: "Your crush just texted. You...", options: [
          { text: "Play it cool with a one-word reply", points: { dry: 2 } },
          { text: "Send back a small heartfelt essay", points: { double: 2 } },
          { text: "Send a voice note and instantly regret it", points: { voicenote: 2 } },
          { text: "Like the message and then panic", points: { reactor: 2 } }
        ] },
        { q: "The group chat sees you mostly as...", options: [
          { text: "The one who kills the convo with 'lol'", points: { dry: 2 } },
          { text: "The one sending 40 messages while everyone sleeps", points: { double: 2 } },
          { text: "The one whose voice notes need a summary", points: { voicenote: 2 } },
          { text: "The one who only ever reacts", points: { reactor: 2 } }
        ] },
        { q: "Autocorrect changed your word. You...", options: [
          { text: "Leave it, they'll figure it out", points: { dry: 2 } },
          { text: "Send three follow-ups correcting it", points: { double: 2 } },
          { text: "Just call them, this is faster", points: { voicenote: 2 } },
          { text: "React laughing to your own typo", points: { reactor: 2 } }
        ] },
        { q: "Pick your texting red flag:", options: [
          { text: "I make everything sound like I'm mad", points: { dry: 2 } },
          { text: "I'll text 'you up?' at 2am about a random thought", points: { double: 2 } },
          { text: "My voice notes have actual chapters", points: { voicenote: 2 } },
          { text: "I open it, react, and forget you exist", points: { reactor: 2 } }
        ] }
      ],
      results: [
        { key: "dry", title: "The Dry Texter", emoji: "🏜️", image: "https://loremflickr.com/800/600/desert,minimal?lock=20202", description: "'k'. 'lol'. 'same'. You could be having the best conversation of your life and it would still read like a hostage negotiation. Iconic, low effort, deeply mysterious. People work for your full sentences.", share: "Apparently I'm a Dry Texter. 'k'. 🏜️" },
        { key: "double", title: "The Double (Triple) Texter", emoji: "📲", image: "https://loremflickr.com/800/600/smartphone,notifications?lock=20203", description: "Why send one message when you can send eight? You text like you talk: fast, a lot and with zero chill. Your energy is unmatched and slightly exhausting in the best possible way.", share: "I'm a Double Texter and my 2am thoughts are everyone's problem. 📲" },
        { key: "voicenote", title: "The Voice-Note Menace", emoji: "🎙️", image: "https://loremflickr.com/800/600/microphone,podcast?lock=20204", description: "You hit record and send four minutes of pure stream of consciousness. Typing is for the weak. Your friends love you but also visibly brace themselves before opening the chat.", share: "I'm a Voice-Note Menace. My messages come with a runtime. 🎙️" },
        { key: "reactor", title: "The Reaction-Only Replier", emoji: "❤️", image: "https://loremflickr.com/800/600/heart,neon?lock=20205", description: "You'll heart a message before you'll ever type a word back. Why reply when a thumbs up exists? Efficient, a little chaotic and absolutely impossible to read.", share: "I'm a Reaction-Only Replier. I'll heart this, never respond. ❤️" }
      ]
    },

    /* ---------------------------------------------------------- dating apps */
    {
      id: "dating-app-persona",
      slug: "dating-app-persona",
      title: "What's Your Dating App Persona?",
      category: "love",
      type: "personality",
      image: "https://loremflickr.com/1200/675/smartphone,dating?lock=30301",
      description: "Be honest about your swiping habits and we'll reveal your dating app alter ego.",
      tagline: "We all become a slightly different person on the apps. Six questions to expose exactly who you turn into.",
      estMinutes: 2,
      takenCount: 24610,
      questions: [
        { q: "Your swiping style is...", options: [
          { text: "Swipe right on anything that moves", points: { swiper: 2 } },
          { text: "Read every word before deciding", points: { romantic: 2 } },
          { text: "Match, then immediately lose interest", points: { ghost: 2 } },
          { text: "Judge their photo dump like a critic", points: { perfectionist: 2 } }
        ] },
        { q: "First message energy?", options: [
          { text: "I don't message, I just keep matching", points: { swiper: 2 } },
          { text: "A heartfelt paragraph about their dog", points: { romantic: 2 } },
          { text: "'hey'... and then I disappear", points: { ghost: 2 } },
          { text: "A crafted, tested, perfect opener", points: { perfectionist: 2 } }
        ] },
        { q: "Why are you even on the app?", options: [
          { text: "Boredom and the dopamine, honestly", points: { swiper: 2 } },
          { text: "To find my actual soulmate", points: { romantic: 2 } },
          { text: "Not sure, I never reply anyway", points: { ghost: 2 } },
          { text: "To present my best curated self", points: { perfectionist: 2 } }
        ] },
        { q: "Your profile is...", options: [
          { text: "Two blurry pics, who cares", points: { swiper: 2 } },
          { text: "A sincere bio about my love languages", points: { romantic: 2 } },
          { text: "Barely filled out, I'm a mystery", points: { ghost: 2 } },
          { text: "A masterpiece I've edited 12 times", points: { perfectionist: 2 } }
        ] },
        { q: "A great match goes quiet. You...", options: [
          { text: "Don't notice, too busy swiping", points: { swiper: 2 } },
          { text: "Spiral and re-read the chat 40 times", points: { romantic: 2 } },
          { text: "Honestly, I probably ghosted first", points: { ghost: 2 } },
          { text: "Wonder if my opener needs tweaking", points: { perfectionist: 2 } }
        ] },
        { q: "Your dating app toxic trait?", options: [
          { text: "Quantity over absolutely everything", points: { swiper: 2 } },
          { text: "Falling in love by the second message", points: { romantic: 2 } },
          { text: "Leaving people on read forever", points: { ghost: 2 } },
          { text: "Treating my profile like a startup", points: { perfectionist: 2 } }
        ] }
      ],
      results: [
        { key: "swiper", title: "The Serial Swiper", emoji: "🔥", image: "https://loremflickr.com/800/600/fire,neon?lock=30302", description: "Swiping is your cardio. You've matched with half the city and remember roughly none of them. It is not about finding 'the one', it is about the sweet, fleeting thrill of the next swipe.", share: "Turns out I'm a Serial Swiper. Swiping is my cardio. 🔥" },
        { key: "romantic", title: "The Hopeless Romantic", emoji: "💘", image: "https://loremflickr.com/800/600/roses,romance?lock=30303", description: "You read every bio like a love letter and you're already naming the kids by match three. You came to the apps for real love, and absolutely nothing, not even the chaos, can dim your hope.", share: "I'm a Hopeless Romantic. Matched at noon, planning the wedding by 1pm. 💘" },
        { key: "ghost", title: "The Soft Ghoster", emoji: "👻", image: "https://loremflickr.com/800/600/fog,mist?lock=30304", description: "You match, you chat, you vanish like morning mist. No closure, no explanation, just vibes. You're not a bad person, you simply maintain a quiet graveyard of unfinished conversations.", share: "I'm a Soft Ghoster. My DMs are a graveyard and I am so sorry. 👻" },
        { key: "perfectionist", title: "The Profile Perfectionist", emoji: "📸", image: "https://loremflickr.com/800/600/camera,portrait?lock=30305", description: "Six photos, a witty bio and a prompt that took three hours. Your profile is a personal brand and you've genuinely A/B tested your opening line. Curated, intentional, just a little unhinged.", share: "I'm a Profile Perfectionist. My bio has been A/B tested. 📸" }
      ]
    },

    /* ------------------------------------------------------------- crushes */
    {
      id: "crush-behavior",
      slug: "crush-behavior",
      title: "How Do You Actually Act Around Your Crush?",
      category: "love",
      type: "personality",
      image: "https://loremflickr.com/1200/675/couple,coffee?lock=40401",
      description: "Cool and collected, or a malfunctioning robot? Let's find out the painful truth.",
      tagline: "Six questions to reveal what you secretly become the second your crush walks into the room.",
      estMinutes: 2,
      takenCount: 27340,
      questions: [
        { q: "Your crush walks in. You...", options: [
          { text: "Walk straight over and say hey", points: { bold: 2 } },
          { text: "Immediately drop everything you're holding", points: { glitch: 2 } },
          { text: "Act like I didn't even notice", points: { cool: 2 } },
          { text: "Watch from across the room, saying nothing", points: { secret: 2 } }
        ] },
        { q: "They text you first. You...", options: [
          { text: "Reply and suggest hanging out", points: { bold: 2 } },
          { text: "Stare at the screen for an hour, sweating", points: { glitch: 2 } },
          { text: "Wait three days to seem unbothered", points: { cool: 2 } },
          { text: "Screenshot it and send it to everyone", points: { secret: 2 } }
        ] },
        { q: "They compliment you. Your reaction?", options: [
          { text: "Compliment them right back, smoothly", points: { bold: 2 } },
          { text: "Laugh like a broken vending machine", points: { glitch: 2 } },
          { text: "'oh. thanks.' then walk away", points: { cool: 2 } },
          { text: "Replay it in my head for nine years", points: { secret: 2 } }
        ] },
        { q: "Your move to get their attention is...", options: [
          { text: "Just telling them I'm interested", points: { bold: 2 } },
          { text: "Tripping dramatically somewhere nearby", points: { glitch: 2 } },
          { text: "Pretending they don't exist at all", points: { cool: 2 } },
          { text: "Liking a photo from 2019 by accident", points: { secret: 2 } }
        ] },
        { q: "Your friends describe your crush situation as...", options: [
          { text: "'They already asked them out'", points: { bold: 2 } },
          { text: "'A walking secondhand embarrassment'", points: { glitch: 2 } },
          { text: "'Way too cool to ever admit it'", points: { cool: 2 } },
          { text: "'In love with someone who has no idea'", points: { secret: 2 } }
        ] },
        { q: "Be honest, your crush strategy is...", options: [
          { text: "Shoot my shot and see what happens", points: { bold: 2 } },
          { text: "Combust on sight and hope for the best", points: { glitch: 2 } },
          { text: "Suppress all feelings indefinitely", points: { cool: 2 } },
          { text: "Admire silently until the end of time", points: { secret: 2 } }
        ] }
      ],
      results: [
        { key: "bold", title: "The Bold Mover", emoji: "😎", image: "https://loremflickr.com/800/600/confident,sunglasses?lock=40402", description: "Crush in the room? You make a move. You shoot your shot, hold the eye contact and let them know what's up. Rejection scares you far less than spending forever wondering 'what if'.", share: "I'm the Bold Mover. I shoot my shot, win or learn. 😎" },
        { key: "glitch", title: "The Malfunctioning Robot", emoji: "🤖", image: "https://loremflickr.com/800/600/confused,nervous?lock=40403", description: "The second they look at you, your brain blue-screens. You forget your own name, laugh too loud and walk into furniture. It's painful, it's adorable and it is deeply, universally relatable.", share: "Around my crush I'm a Malfunctioning Robot. I forgot my own name once. 🤖" },
        { key: "cool", title: "The Ice Sculpture", emoji: "🕶️", image: "https://loremflickr.com/800/600/ice,cool?lock=40404", description: "You would rather perish than let them know you care. You play it so cool you basically freeze them out entirely. Inside? Total meltdown. Outside? A flawless, unbothered ice sculpture.", share: "I'm an Ice Sculpture around my crush. Dying inside, frozen outside. 🕶️" },
        { key: "secret", title: "The Secret Admirer", emoji: "📓", image: "https://loremflickr.com/800/600/notebook,diary?lock=40405", description: "You've watched their entire story, memorized their schedule and never said a single word. You love from afar with the dedication of a detective and the courage of a small, nervous mouse.", share: "I'm a Secret Admirer. They have no idea and they never will. 📓" }
      ]
    },

    /* ------------------------------------------------------------ weekends */
    {
      id: "weekend-personality",
      slug: "weekend-personality",
      title: "What's Your Weekend Personality?",
      category: "life",
      type: "personality",
      image: "https://loremflickr.com/1200/675/weekend,relax?lock=50501",
      description: "How you spend your Saturday says everything. Find your true weekend type.",
      tagline: "Out till sunrise or rotting in bed with snacks? Six questions to reveal your real weekend soul.",
      estMinutes: 2,
      takenCount: 16280,
      questions: [
        { q: "Your ideal Saturday morning is...", options: [
          { text: "Still asleep at noon", points: { gremlin: 2 } },
          { text: "Brunch with the whole group", points: { social: 2 } },
          { text: "Already on a trail somewhere", points: { adventurer: 2 } },
          { text: "Up early, list in hand", points: { productive: 2 } }
        ] },
        { q: "Friday night plans?", options: [
          { text: "Bed, snacks and a comfort show", points: { gremlin: 2 } },
          { text: "Out with everyone, obviously", points: { social: 2 } },
          { text: "Packing for tomorrow's mission", points: { adventurer: 2 } },
          { text: "Sleeping early to win Saturday", points: { productive: 2 } }
        ] },
        { q: "The group wants to make plans. You say...", options: [
          { text: "Can we just... not. Bed is calling", points: { gremlin: 2 } },
          { text: "Yes to all of it, where and when", points: { social: 2 } },
          { text: "Only if we go somewhere brand new", points: { adventurer: 2 } },
          { text: "After I finish my errands, sure", points: { productive: 2 } }
        ] },
        { q: "An unexpected free day appears. You...", options: [
          { text: "Do not move from the couch", points: { gremlin: 2 } },
          { text: "Fill it with people instantly", points: { social: 2 } },
          { text: "Plan a spontaneous day trip", points: { adventurer: 2 } },
          { text: "Finally tackle the to-do list", points: { productive: 2 } }
        ] },
        { q: "Your weekend toxic trait is...", options: [
          { text: "Cancelling plans to stay in", points: { gremlin: 2 } },
          { text: "Saying yes to everything and burning out", points: { social: 2 } },
          { text: "Never being able to just relax", points: { adventurer: 2 } },
          { text: "Turning rest into another chore", points: { productive: 2 } }
        ] },
        { q: "Sunday night, you feel...", options: [
          { text: "Cozy and fully recharged from doing nothing", points: { gremlin: 2 } },
          { text: "Happy but slightly peopled-out", points: { social: 2 } },
          { text: "Still buzzing from the weekend's adventures", points: { adventurer: 2 } },
          { text: "Accomplished and ready for Monday", points: { productive: 2 } }
        ] }
      ],
      results: [
        { key: "gremlin", title: "The Bed Rotter", emoji: "🛌", image: "https://loremflickr.com/800/600/bed,cozy?lock=50502", description: "Your weekend is a horizontal experience. Snacks, a screen and absolutely zero plans is the dream. You have earned this rot, you are thriving in this rot, and you will not be apologizing for it.", share: "I'm a Bed Rotter. My weekend is horizontal and I regret nothing. 🛌" },
        { key: "social", title: "The Social Butterfly", emoji: "🦋", image: "https://loremflickr.com/800/600/brunch,friends?lock=50503", description: "If there is a hangout, you are there. Brunch, then friends, then a third event you somehow also said yes to. Your weekend has a full itinerary and, frankly, a waitlist.", share: "I'm a Social Butterfly. My weekend has an itinerary and a waitlist. 🦋" },
        { key: "adventurer", title: "The Adventure Seeker", emoji: "🧗", image: "https://loremflickr.com/800/600/hiking,mountains?lock=50504", description: "Hikes, day trips, 'let's just drive somewhere and see'. You treat the weekend like a side quest and routine makes you itchy. New place, new plan, no time to waste.", share: "I'm an Adventure Seeker. Routine makes me itchy, let's go somewhere. 🧗" },
        { key: "productive", title: "The Productivity Machine", emoji: "✅", image: "https://loremflickr.com/800/600/checklist,desk?lock=50505", description: "Weekend? You mean catch-up time. You meal-prep, deep-clean and cross off the list while everyone else sleeps in. It is a lot, but Monday-you is always quietly grateful.", share: "I'm a Productivity Machine. I meal-prepped while you slept in. ✅" }
      ]
    }

  );
})();
