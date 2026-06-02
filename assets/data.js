/* data.js - all site content lives here: categories, activities, blog
   metadata, vibes and (pushed in from assets/quizzes/*.js) the quizzes.

   To add a quiz: copy QUIZ_TEMPLATE at the bottom and push it.
     - personality: each option has points:{resultKey:n}; highest tally wins.
     - trivia: each option has correct:true/false; results use minPct bands.
   To add an activity: copy ACTIVITY_TEMPLATE, push to activities.
   To add a blog post: create blog/<slug>.html, then add a blogPosts entry
   with the same slug.
   U(id) builds an Unsplash URL; app.js sizes it and ui.js shows a fallback
   if an image fails. */

function U(id) { return "https://images.unsplash.com/photo-" + id; }

window.BT_DATA = {

  /* ===== CATEGORIES ====================================================== */
  categories: [
    /* color = the tile's accent gradient. All within the indigo→violet→fuchsia
       family so the grid is cohesive (no rainbow) but each category still varies. */
    { id: "personality", name: "Personality",          emoji: "🧠", blurb: "Who are you, really? Let's find out.",          color: "from-indigo-500 to-violet-500" },
    { id: "love",        name: "Love & Relationships",  emoji: "💘", blurb: "Crushes, red flags & love languages.",          color: "from-violet-500 to-fuchsia-500" },
    { id: "popculture",  name: "Pop Culture",           emoji: "🎬", blurb: "Movies, music, celebs & the internet.",         color: "from-purple-500 to-fuchsia-500" },
    { id: "challenges",  name: "Fun Challenges",        emoji: "🎯", blurb: "Silly, chaotic, totally addictive.",            color: "from-indigo-500 to-purple-500" },
    { id: "life",        name: "Life & Future",         emoji: "🔮", blurb: "Your vibe, your path, your destiny.",           color: "from-violet-500 to-indigo-500" },
    { id: "trivia",      name: "Trivia",                emoji: "🏆", blurb: "Prove how much you actually know.",             color: "from-indigo-600 to-violet-400" },
    { id: "memes",       name: "Memes & Internet",      emoji: "😂", blurb: "Extremely online energy only.",                 color: "from-fuchsia-500 to-purple-600" }
  ],

  /* ===== ACTIVITIES (Boredom Busters) ==================================== */
  /* moods: "5-Minute Fixes" | "Indoor" | "Outdoor" | "Creative" | "Lazy" | "Social" | "Energetic" */
  activities: [
    {"id":"a1","title":"Build a 'comfort show' rewatch list","description":"Pick 5 episodes of a show you've seen a million times and queue your ultimate cozy marathon for tonight.","difficulty":"Easy","time":"10 min","moods":["Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37"},
    {"id":"a2","title":"Learn a card trick","description":"Find one beginner sleight-of-hand trick online and practice until you can fool one unsuspecting friend.","difficulty":"Medium","time":"30 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1511193311914-0346f16efe90"},
    {"id":"a3","title":"Rearrange one corner of your room","description":"Don't redo the whole room - just transform a single corner into a reading nook, plant shelf, or vibe zone.","difficulty":"Medium","time":"45 min","moods":["Indoor","Creative","Energetic"],"image":"https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37"},
    {"id":"a4","title":"Do a 7-minute HIIT workout","description":"No gym, no equipment. One short, sweaty circuit that turns 'bored' into 'accomplished' fast.","difficulty":"Hard","time":"10 min","moods":["Indoor","Energetic","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"},
    {"id":"a5","title":"Write a letter to your future self","description":"Use a free 'future email' service and send a message to yourself one year from now. Brutally honest encouraged.","difficulty":"Easy","time":"15 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"},
    {"id":"a6","title":"Make the fanciest drink you can with what you have","description":"Mocktail, fancy coffee, or weird soda combo - garnish it, photograph it, feel briefly elite.","difficulty":"Easy","time":"10 min","moods":["Indoor","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"},
    {"id":"a7","title":"Go for a 'no-destination' walk","description":"Walk out the door and turn whichever way feels interesting. No phone navigation. Just wander.","difficulty":"Easy","time":"30 min","moods":["Outdoor","Energetic"],"image":"https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b"},
    {"id":"a8","title":"Start a 30-second daily journal","description":"One sentence about today. That's it. Future-you will love having a record of this random afternoon.","difficulty":"Easy","time":"5 min","moods":["Indoor","Lazy","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"},
    {"id":"a9","title":"Teach yourself to draw one thing well","description":"Pick a single object - a coffee cup, a hand, a cat - and draw it 10 times until it looks great.","difficulty":"Medium","time":"40 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d"},
    {"id":"a10","title":"Plan your dream trip (that you can't afford yet)","description":"Build the full itinerary - flights, food, hotels, the works. Dreaming is free and weirdly motivating.","difficulty":"Easy","time":"30 min","moods":["Indoor","Lazy","Creative"],"image":"https://images.unsplash.com/photo-1488646953014-85cb44e25828"},
    {"id":"a11","title":"Cook something using only 5 ingredients","description":"Open the fridge, grab five things, and challenge yourself to make them edible (or even good).","difficulty":"Medium","time":"30 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"},
    {"id":"a12","title":"Have a solo dance party","description":"Three songs, lights low, zero judgement. Scientifically proven to reset a bored brain.","difficulty":"Easy","time":"10 min","moods":["Indoor","Energetic","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1538805060514-97d9cc17730c"},
    {"id":"a13","title":"Text three people you haven't talked to in a while","description":"A simple 'you popped into my head today' message can turn a dull day into a great conversation.","difficulty":"Easy","time":"10 min","moods":["Social","5-Minute Fixes","Lazy"],"image":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7"},
    {"id":"a14","title":"Build a blanket fort like you're 8 again","description":"Cushions, fairy lights, snacks. Climb in with a movie. Nostalgia is a powerful boredom cure.","difficulty":"Easy","time":"20 min","moods":["Indoor","Lazy","Creative"],"image":"https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37"},
    {"id":"a15","title":"Try a 10-minute guided meditation","description":"Follow a free guided session. Even ten minutes can flip your mood from restless to calm.","difficulty":"Easy","time":"10 min","moods":["Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1518609878373-06d740f60d8b"},
    {"id":"a16","title":"Make a themed playlist","description":"Pick an oddly specific vibe - 'main character walking in the rain' - and build the perfect 20-song soundtrack.","difficulty":"Easy","time":"25 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"},
    {"id":"a17","title":"Do a closet 'capsule' challenge","description":"Pull 10 items and style 5 different outfits from just those. Free shopping spree, technically.","difficulty":"Medium","time":"40 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d"},
    {"id":"a18","title":"Photograph 10 tiny beautiful things","description":"Go on a mini photo hunt for textures, shadows, and details you usually walk past. Edit your favorite.","difficulty":"Easy","time":"30 min","moods":["Outdoor","Creative","Indoor"],"image":"https://images.unsplash.com/photo-1452587925148-ce544e77e70d"},
    {"id":"a19","title":"Learn 5 phrases in a new language","description":"Hello, thank you, where's the bathroom, and two fun ones. Future-traveler-you says thanks.","difficulty":"Easy","time":"15 min","moods":["Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1606503153255-59d8b8b82176"},
    {"id":"a20","title":"Try the 'deep clean one drawer' method","description":"Don't clean the whole room - just obliterate one junk drawer. Disproportionately satisfying.","difficulty":"Easy","time":"20 min","moods":["Indoor","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1581578731548-c64695cc6952"},
    {"id":"a21","title":"Sketch your dream apartment floor plan","description":"Grab paper and design your fantasy space, room by room. Bonus points for a reading nook and a slide.","difficulty":"Medium","time":"30 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a22","title":"Start a tiny windowsill garden","description":"One pot, one seed (herbs are easy). Watching something grow is the slow-burn boredom cure.","difficulty":"Medium","time":"30 min","moods":["Indoor","Creative","Outdoor"],"image":"https://images.unsplash.com/photo-1416879595882-3373a0480b5b"},
    {"id":"a23","title":"Beat your own step record","description":"Pick a number and walk laps, dance, or pace through a podcast until you smash it.","difficulty":"Medium","time":"45 min","moods":["Outdoor","Energetic","Indoor"],"image":"https://images.unsplash.com/photo-1538805060514-97d9cc17730c"},
    {"id":"a24","title":"Make a 'bucket list' of 25 things","description":"Big, small, silly, scary. Writing them down makes them feel real - and gives you a to-do list for life.","difficulty":"Easy","time":"20 min","moods":["Indoor","Lazy","Creative"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a25","title":"Try origami with one sheet of paper","description":"Follow a beginner tutorial - a crane, a box, a jumping frog. Quiet, meditative, and weirdly addictive.","difficulty":"Medium","time":"20 min","moods":["Indoor","Creative","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1606761568499-6d2451b23c66"},
    {"id":"a26","title":"Do a blind taste test with snacks","description":"Get a friend to blindfold you and test how well you really know your favorite chips and chocolate.","difficulty":"Easy","time":"20 min","moods":["Social","Indoor"],"image":"https://images.unsplash.com/photo-1599490659213-e2b9527bd087"},
    {"id":"a27","title":"Write the first page of a story","description":"Just one page. Start with 'The lights went out at exactly 3:00 AM...' and see where it goes.","difficulty":"Medium","time":"25 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a28","title":"Reorganize your phone home screen","description":"Aesthetic icons, fresh wallpaper, ruthless app cleanup. A tiny digital glow-up for a bored afternoon.","difficulty":"Easy","time":"20 min","moods":["Indoor","Lazy","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7"},
    {"id":"a29","title":"Have a 20-minute 'reset' tidy","description":"Set a timer and speed-clean your space to a hype playlist. Stop when it dings. Instant mood lift.","difficulty":"Easy","time":"20 min","moods":["Indoor","Energetic"],"image":"https://images.unsplash.com/photo-1527515637462-cff94eecc1ac"},
    {"id":"a30","title":"Plan a themed movie night","description":"Pick a theme - '2000s rom-coms', 'so bad they're good' - line up the snacks and invite people over.","difficulty":"Easy","time":"20 min","moods":["Social","Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"},
    {"id":"a31","title":"Try a 5-minute cold shower challenge","description":"End your shower with 30 seconds of cold and build up. Instant alertness and a tiny dopamine hit.","difficulty":"Hard","time":"5 min","moods":["Indoor","Energetic","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1507120878965-54b2d3939100"},
    {"id":"a32","title":"Make a vision board","description":"Cut from magazines or build a digital collage of the life you're chasing. Pin it where you'll see it daily.","difficulty":"Medium","time":"45 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1513151233558-d860c5398176"},
    {"id":"a33","title":"Go stargazing (or cloud-gazing)","description":"Head outside, lie back, and just look up. Find one constellation or one cloud that looks like a dog.","difficulty":"Easy","time":"20 min","moods":["Outdoor","Lazy"],"image":"https://images.unsplash.com/photo-1416879595882-3373a0480b5b"},
    {"id":"a34","title":"Cook a recipe from a random country","description":"Spin a globe (or a list), pick a country, and make one classic dish from there tonight.","difficulty":"Hard","time":"60 min","moods":["Indoor","Creative","Energetic"],"image":"https://images.unsplash.com/photo-1466637574441-749b8f19452f"},
    {"id":"a35","title":"Learn to juggle","description":"Start with two balls (or rolled socks). It's frustrating for ten minutes, then suddenly clicks.","difficulty":"Medium","time":"30 min","moods":["Indoor","Energetic"],"image":"https://images.unsplash.com/photo-1538805060514-97d9cc17730c"},
    {"id":"a36","title":"Do a digital declutter","description":"Delete 50 old photos, unsubscribe from 10 emails, and clear your downloads folder. Feels like a deep breath.","difficulty":"Easy","time":"30 min","moods":["Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a37","title":"Try a one-line-a-day drawing diary","description":"Draw your day as a single doodle. Keep them in one notebook and watch your year illustrate itself.","difficulty":"Easy","time":"5 min","moods":["Indoor","Creative","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d"},
    {"id":"a38","title":"Host a tiny game tournament","description":"Cards, console, or board games - bracket-style, dramatic trophy optional. Loser does the dishes.","difficulty":"Easy","time":"60 min","moods":["Social","Indoor","Energetic"],"image":"https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09"},
    {"id":"a39","title":"Bake something from scratch","description":"Cookies, banana bread, brownies - the house smells amazing and you get a snack. Pure win.","difficulty":"Medium","time":"60 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1486427944299-d1955d23e34d"},
    {"id":"a40","title":"Map out a 'someday' skill tree","description":"List skills you want one day, then break the first one into a tiny first step you can do this week.","difficulty":"Easy","time":"20 min","moods":["Indoor","Lazy","Creative"],"image":"https://images.unsplash.com/photo-1549465220-1a8b9238cd48"},
    {"id":"a41","title":"Take yourself on a solo café date","description":"Book, journal, or just people-watching. Order the fancy drink. Romanticize your own company.","difficulty":"Easy","time":"60 min","moods":["Outdoor","Lazy","Social"],"image":"https://images.unsplash.com/photo-1445116572660-236099ec97a0"},
    {"id":"a42","title":"Try a 100-rep bodyweight challenge","description":"100 squats, spread across the day or in one go. Tiny commitment, big sense of 'I did a thing.'","difficulty":"Hard","time":"15 min","moods":["Indoor","Energetic"],"image":"https://images.unsplash.com/photo-1518611012118-696072aa579a"},
    {"id":"a43","title":"Write a fake five-star review for your day","description":"Review today like it's a product. '3 stars - great snacks, weak plot.' Surprisingly funny and clarifying.","difficulty":"Easy","time":"5 min","moods":["Indoor","Creative","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a44","title":"Build the ultimate snack board","description":"Arrange whatever you've got like a fancy charcuterie spread. Eating is more fun when it looks intentional.","difficulty":"Easy","time":"15 min","moods":["Indoor","Lazy","Social"],"image":"https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab"},
    {"id":"a45","title":"Do a 'yes day' for small things","description":"For one afternoon, say yes to every small harmless impulse. Ice cream for lunch? Yes. Detour? Yes.","difficulty":"Easy","time":"Half day","moods":["Social","Outdoor","Energetic"],"image":"https://images.unsplash.com/photo-1599490659213-e2b9527bd087"},
    {"id":"a46","title":"Recreate a restaurant meal at home","description":"Pick a dish you love from a restaurant and try to copy it. Even a flawed attempt is a fun mission.","difficulty":"Hard","time":"75 min","moods":["Indoor","Creative"],"image":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"},
    {"id":"a47","title":"Make a 'top 5 of everything' list","description":"Top 5 movies, snacks, songs, memories, fictional crushes. Text it to a friend and compare instantly.","difficulty":"Easy","time":"15 min","moods":["Social","Lazy","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1503174971373-b1f69850bded"},
    {"id":"a48","title":"Try a new route home","description":"If you're out, take the long, scenic, never-tried-before way back. Tiny adventures hide in routine.","difficulty":"Easy","time":"20 min","moods":["Outdoor","Energetic"],"image":"https://images.unsplash.com/photo-1502301197179-65228ab57f78"},
    {"id":"a49","title":"Do a puzzle or a sudoku","description":"Jigsaw, crossword, or a quick sudoku. Low-key focus is a great antidote to the doom-scroll itch.","difficulty":"Medium","time":"30 min","moods":["Indoor","Lazy"],"image":"https://images.unsplash.com/photo-1606503153255-59d8b8b82176"},
    {"id":"a50","title":"Learn a 30-second magic-ish skill","description":"Whistle louder, wiggle your ears, do a coin roll. Pointless party tricks are pure boredom fuel.","difficulty":"Medium","time":"15 min","moods":["Indoor","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1511193311914-0346f16efe90"},
    {"id":"a51","title":"Plan a budget picnic","description":"Pack whatever's in the kitchen, grab a blanket, and eat outside. Food just tastes better on grass.","difficulty":"Easy","time":"40 min","moods":["Outdoor","Social","Lazy"],"image":"https://images.unsplash.com/photo-1416879595882-3373a0480b5b"},
    {"id":"a52","title":"Try the 'draw your favorite song' challenge","description":"Pick a song and sketch whatever it makes you see. No skill required - just vibes on paper.","difficulty":"Easy","time":"25 min","moods":["Indoor","Creative","Lazy"],"image":"https://images.unsplash.com/photo-1513151233558-d860c5398176"},
    {"id":"a53","title":"Do a random act of kindness","description":"Leave a kind note, pay it forward, compliment a stranger. The mood boost is sneaky and instant.","difficulty":"Easy","time":"10 min","moods":["Social","Outdoor","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"},
    {"id":"a54","title":"Build a personal 'hype' folder","description":"Screenshot every nice text, win, and good memory into one folder. Bored-day fuel and rough-day medicine.","difficulty":"Easy","time":"15 min","moods":["Indoor","Lazy","5-Minute Fixes"],"image":"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"},
    {"id":"a55","title":"Try a sunrise or sunset mission","description":"Set an alarm, grab a drink, and go watch the sky change. Free, beautiful, and weirdly emotional.","difficulty":"Medium","time":"40 min","moods":["Outdoor","Lazy","Energetic"],"image":"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8"},
    {"id":"a56","title":"Invent a signature mocktail","description":"Mix, taste, adjust, name it after yourself. Bottle the recipe for your next hangout.","difficulty":"Medium","time":"25 min","moods":["Indoor","Creative","Social"],"image":"https://images.unsplash.com/photo-1486427944299-d1955d23e34d"},
  ],

  /* ===== BLOG POST METADATA ============================================== */
  /* Full article content lives in blog/<slug>.html. Keep slugs in sync. */
  blogPosts: [
    {"slug":"why-we-get-brain-freezes","title":"Why Do We Get Brain Freezes and Can We Stop Them?","category":"Science","readMinutes":5,"date":"2026-01-13","excerpt":"That stab of pain from eating ice cream too fast has a real name and a real cause. The science of brain freeze, and how to actually stop one in seconds.","image":"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f"},
    {"slug":"ocean-scarier-than-space","title":"The Ocean Is Actually Scarier Than Outer Space","category":"Science","readMinutes":6,"date":"2026-02-07","excerpt":"We have mapped the surface of Mars in more detail than our own deep sea. Why the ocean is genuinely scarier, and stranger, than outer space.","image":"https://images.unsplash.com/photo-1559825481-12a05cc00344"},
    {"slug":"scientific-facts-that-sound-fake","title":"10 Scientific Facts That Sound Completely Fake","category":"Science","readMinutes":6,"date":"2026-03-06","excerpt":"Bananas are radioactive, sharks are older than trees, and a day on Venus outlasts its year. 10 real scientific facts that sound completely made up.","image":"https://images.unsplash.com/photo-1464802686167-b939a6910659"},
    {"slug":"what-happens-to-your-body-when-bored","title":"What Actually Happens to Your Body When You're Bored","category":"Science","readMinutes":6,"date":"2026-04-04","excerpt":"Boredom is not just a mood, it is a measurable physical state. What actually happens inside your body and brain when you are bored, and why it can be good.","image":"https://images.unsplash.com/photo-1554188572-9d184b57d8e2"},
    {"slug":"money-truths-for-your-20s","title":"Things No One Tells You About Money in Your 20s","category":"Money","readMinutes":6,"date":"2026-01-20","excerpt":"School taught you the quadratic formula but not how money works. The real things no one tells you about money in your 20s, minus the finance bro energy.","image":"https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf"},
    {"slug":"make-extra-money-without-burnout","title":"How to Make Extra Money Without Burning Yourself Out","category":"Money","readMinutes":5,"date":"2026-02-18","excerpt":"A side hustle should add to your life, not replace your soul. How to make extra money without burning yourself out chasing the grind to nowhere.","image":"https://images.unsplash.com/photo-1624953901718-e24ee7200b85"},
    {"slug":"broke-vs-bad-with-money","title":"The Difference Between Being Broke and Being Bad With Money","category":"Money","readMinutes":5,"date":"2026-03-16","excerpt":"Being broke and being bad with money are not the same thing, and confusing them keeps people stuck. The real difference, and why it changes everything.","image":"https://images.unsplash.com/photo-1553729459-efe14ef6055d"},
    {"slug":"small-money-habits-that-add-up","title":"Small Money Habits That Actually Add Up Over Time","category":"Money","readMinutes":5,"date":"2026-04-09","excerpt":"You do not need a finance degree or a huge salary to get ahead. Small, almost effortless money habits that quietly add up to a lot over time.","image":"https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9"},
    {"slug":"why-we-doomscroll","title":"The Psychology Behind Why We Doomscroll","category":"Psychology","readMinutes":6,"date":"2026-02-27","excerpt":"You know it makes you feel worse, and you keep going anyway. The psychology behind why we doomscroll, and how to finally break the late-night spiral.","image":"https://images.unsplash.com/photo-1480694313141-fce5e697ee25"},
    {"slug":"busy-but-unproductive","title":"How Your Brain Tricks You Into Feeling Busy But Unproductive","category":"Psychology","readMinutes":5,"date":"2026-03-31","excerpt":"You were busy all day and somehow got nothing important done. The psychology of how your brain confuses motion with progress, and how to escape it.","image":"https://images.unsplash.com/photo-1603515161074-3206aaeb03f2"},
    {"slug":"underrated-shows-worth-watching","title":"Underrated Shows That Deserve Way More Attention","category":"Movies & TV","readMinutes":5,"date":"2026-01-09","excerpt":"Everyone has seen the big hits. The underrated shows that flew under the radar but earned a devoted cult following, and absolutely deserve your next binge.","image":"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c"},
    {"slug":"why-movies-hit-different-alone-at-night","title":"Why Some Movies Hit Different When You Watch Them Alone at Night","category":"Movies & TV","readMinutes":6,"date":"2026-02-15","excerpt":"The same film can feel ordinary in the afternoon and devastating at 1am alone. The psychology of why movies hit so much harder late at night, by yourself.","image":"https://images.unsplash.com/photo-1573868604761-a57bc87cb0c7"},
    {"slug":"comfort-movies-vs-thinking-movies","title":"Comfort Movies vs Movies That Actually Make You Think","category":"Movies & TV","readMinutes":5,"date":"2026-03-19","excerpt":"Sometimes you need a warm hug of a film, sometimes one that rewires you. The difference between comfort movies and thinking movies, and when to pick each.","image":"https://images.unsplash.com/photo-1536440136628-849c177e76a1"},
    {"slug":"why-we-rewatch-the-same-shows","title":"The Psychology of Why We Rewatch the Same Shows","category":"Movies & TV","readMinutes":6,"date":"2026-04-18","excerpt":"You have seen it nine times and you are about to watch it again, especially when stressed. The comforting psychology of why we rewatch the same shows on loop.","image":"https://images.unsplash.com/photo-1485846234645-a62644f84728"},
    {"slug":"historical-events-that-sound-fake","title":"Historical Events That Sound Fake But Actually Happened","category":"History","readMinutes":6,"date":"2026-01-16","excerpt":"A war that lasted under an hour, a town that danced itself to death, and an army that lost to birds. Real historical events that sound completely made up.","image":"https://images.unsplash.com/photo-1507475380673-1246fa72eeea"},
    {"slug":"how-everyday-things-were-invented","title":"How Normal Everyday Things Were Actually Invented","category":"History","readMinutes":5,"date":"2026-02-20","excerpt":"The microwave, Velcro, and penicillin all share a secret: they were basically accidents. How some of the most normal everyday things were really invented.","image":"https://images.unsplash.com/photo-1513120052856-2b18c0d4f696"},
    {"slug":"forgotten-jobs-from-history","title":"Forgotten Jobs From History That Were Surprisingly Important","category":"History","readMinutes":5,"date":"2026-03-24","excerpt":"Before alarm clocks, someone was paid to wake you up. Forgotten jobs from history that quietly kept the world running before technology replaced them.","image":"https://images.unsplash.com/photo-1522787345986-d5c7885a889e"},
    {"slug":"weirdest-laws-around-the-world","title":"The Weirdest Laws That Still Exist in Some Countries","category":"History","readMinutes":5,"date":"2026-04-22","excerpt":"From a ban on lonely guinea pigs to a law against handling salmon suspiciously, some of the weirdest real laws still reportedly on the books today.","image":"https://images.unsplash.com/photo-1600547151285-075e218ada49"},
    {"slug":"how-ai-is-changing-everyday-life","title":"How AI Is Quietly Changing Everyday Life (Without Us Noticing)","category":"Technology","readMinutes":6,"date":"2026-01-23","excerpt":"You used AI a dozen times today without thinking about it. How artificial intelligence has quietly woven itself into everyday life, mostly invisibly.","image":"https://images.unsplash.com/photo-1535303311164-664fc9ec6532"},
    {"slug":"tech-that-helps-vs-distracts","title":"Technology That Actually Makes Life Better vs Just Distracting Us","category":"Technology","readMinutes":6,"date":"2026-02-25","excerpt":"Not all screen time is equal. How to tell the technology that genuinely improves your life apart from the stuff that is just quietly eating it.","image":"https://images.unsplash.com/photo-1601034913836-a1f43e143611"},
    {"slug":"future-of-entertainment","title":"What the Future of Entertainment Might Actually Look Like","category":"Technology","readMinutes":5,"date":"2026-03-29","excerpt":"Personalized, interactive, and a little uncanny. A grounded look at what the future of entertainment might actually look like, beyond the hype.","image":"https://images.unsplash.com/photo-1603145733146-ae562a55031e"},
    {"slug":"why-apps-feel-addictive","title":"Why Some Apps Make You Feel Addicted","category":"Technology","readMinutes":6,"date":"2026-04-27","excerpt":"It is not a lack of willpower, it is a billion-dollar design job. The psychological tricks that make some apps feel addictive, and how to fight back.","image":"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"},
    {"slug":"interesting-sports-youve-never-heard-of","title":"The Most Interesting Sports You've Probably Never Heard Of","category":"Sports & Fitness","readMinutes":6,"date":"2026-01-30","excerpt":"Beyond football and basketball is a whole world of gloriously weird sports. From kabaddi to chess boxing, the most interesting ones you have never heard of.","image":"https://images.unsplash.com/photo-1530549387789-4c1017266635"},
    {"slug":"low-effort-ways-to-enjoy-working-out","title":"Low-Effort Ways to Actually Enjoy Working Out","category":"Sports & Fitness","readMinutes":6,"date":"2026-03-03","excerpt":"If you hate the gym, you are not broken, you just have not found your thing yet. Genuinely low-effort ways to make working out something you enjoy.","image":"https://images.unsplash.com/photo-1517836357463-d25dfeac3438"},
    {"slug":"watching-sports-mental-health","title":"Why Watching Sports Is Surprisingly Good for Your Mental Health","category":"Sports & Fitness","readMinutes":6,"date":"2026-04-02","excerpt":"Yelling at a screen with strangers might be better for you than you think. The psychology of why being a sports fan is good for your mental health.","image":"https://images.unsplash.com/photo-1565992441121-4367c2967103"},
    {"slug":"strangest-rules-in-professional-sports","title":"The Strangest Rules in Professional Sports","category":"Sports & Fitness","readMinutes":5,"date":"2026-05-02","excerpt":"Some sporting rules sound completely made up and are absolutely real. From the infield fly rule to the back-pass rule, the strangest rules in pro sports.","image":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211"},
    {"slug":"how-to-get-into-a-sport","title":"How to Get Into a Sport Without Feeling Like an Outsider","category":"Sports & Fitness","readMinutes":6,"date":"2026-05-14","excerpt":"Want to start a sport but feel like everyone already knows the unwritten rules? How to get into any sport, as a total beginner, without the outsider dread.","image":"https://images.unsplash.com/photo-1571902943202-507ec2618e8f"},
    {"slug":"best-singleplayer-games-to-lose-yourself-in","title":"Best Singleplayer Games to Completely Lose Yourself In","category":"Gaming","readMinutes":7,"date":"2026-02-04","excerpt":"The kind of games that swallow a whole weekend before you notice. The best singleplayer worlds to disappear into when you need to escape your own brain.","image":"https://images.unsplash.com/photo-1542751371-adc38448a05e"},
    {"slug":"why-video-games-feel-like-therapy","title":"Why Some Video Games Feel Like Therapy","category":"Gaming","readMinutes":6,"date":"2026-03-08","excerpt":"Sometimes a game does more for your stress than anything else all week. The real psychology behind why certain video games genuinely feel like therapy.","image":"https://images.unsplash.com/photo-1511512578047-dfb367046420"},
    {"slug":"games-to-turn-your-brain-off","title":"Games Perfect for When You Want to Turn Your Brain Off","category":"Gaming","readMinutes":5,"date":"2026-04-07","excerpt":"No stress, no story to follow, no skill required. The best games for switching your brain fully off and just vibing after a long, draining day.","image":"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8"},
    {"slug":"most-beautiful-video-games","title":"The Most Beautiful Video Games You Can Play Right Now","category":"Gaming","readMinutes":6,"date":"2026-05-06","excerpt":"Games quietly became one of the most stunning art forms around. The most beautiful ones to play when you just want to stare at something gorgeous.","image":"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf"},
    {"slug":"why-we-get-attached-to-game-characters","title":"Why We Get So Attached to Video Game Characters","category":"Gaming","readMinutes":6,"date":"2026-05-19","excerpt":"You cried over a fictional companion and you would do it again. Here is the psychology of why we get so deeply attached to video game characters.","image":"https://images.unsplash.com/photo-1550745165-9bc0b252726f"},
    {"slug":"why-time-feels-faster-with-age","title":"Why Time Feels Faster As You Get Older (The Real Science)","category":"Science","readMinutes":6,"date":"2026-02-11","excerpt":"Summers used to last forever and now a whole year vanishes. Here is the actual science behind why time speeds up as you age, and how to slow it back down.","image":"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8"},
    {"slug":"how-to-make-friends-as-an-adult","title":"How to Actually Make Friends as an Adult","category":"Relationships","readMinutes":7,"date":"2026-03-13","excerpt":"Making friends was easy at 7 and feels impossible at 22. Here is why adult friendship is so hard, and a real, low-cringe plan to build your people.","image":"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"},
    {"slug":"budgeting-50-30-20-rule","title":"The 50/30/20 Rule: Budgeting When You Are Basically Broke","category":"Money","readMinutes":6,"date":"2026-04-11","excerpt":"No finance bro, no spreadsheet from hell. The 50/30/20 rule is the simplest way to handle your money in your twenties, broke or not.","image":"https://images.unsplash.com/photo-1544377193-33dcf4d68fb5"},
    {"slug":"why-we-love-true-crime","title":"Why We Cannot Stop Watching True Crime (The Psychology)","category":"Psychology","readMinutes":7,"date":"2026-05-10","excerpt":"You fell asleep to a murder documentary again. You are not broken, and you are definitely not alone. Here is the psychology behind our true crime obsession.","image":"https://images.unsplash.com/photo-1502301197179-65228ab57f78"},
    {"slug":"green-flags-healthy-relationships","title":"Green Flags: What a Healthy Relationship Actually Looks Like","category":"Relationships","readMinutes":6,"date":"2026-05-22","excerpt":"We spend so long hunting for red flags that we forget what good looks like. Here are the green flags that quietly signal a relationship worth keeping.","image":"https://images.unsplash.com/photo-1519681393784-d120267933ba"},
    {"slug":"science-of-music-goosebumps","title":"The Science of Why Music Gives You Goosebumps","category":"Science","readMinutes":6,"date":"2026-05-28","excerpt":"That shiver down your spine when the song hits just right has a name and a neuroscience. Here is why music gives roughly two-thirds of us goosebumps.","image":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"},
    {"slug":"healing-era-explained","title":"Why Everyone Is in Their Healing Era Right Now","category":"Culture","readMinutes":7,"date":"2026-05-31","excerpt":"From matcha mornings to therapy-speak, here's what the healing era trend really means, and how to do the work for real.","image":"https://images.unsplash.com/photo-1518609878373-06d740f60d8b"},
    {"slug":"situationship-psychology","title":"The Situationship Epidemic: Why Nobody Wants to Define It","category":"Love","readMinutes":7,"date":"2026-05-29","excerpt":"Everyone's in one, nobody will name it, and the gray area is quietly wrecking us. Here's why, and how to get clarity without losing your cool.","image":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"},
    {"slug":"loud-budgeting-trend","title":"Loud Budgeting: The Money Trend That Actually Makes Sense","category":"Money","readMinutes":7,"date":"2026-05-27","excerpt":"Saying \"I can't afford it\" out loud is the flex of the year. Here is why loud budgeting works and how to start.","image":"https://images.unsplash.com/photo-1523398002811-999ca8dec234"},
    {"slug":"dopamine-detox-truth","title":"Dopamine Detox: What It Really Does to Your Brain","category":"Wellbeing","readMinutes":7,"date":"2026-05-25","excerpt":"You can't fast from a chemical your brain makes on purpose. Here's what a \"dopamine detox\" actually does, and what helps you feel less fried.","image":"https://images.unsplash.com/photo-1499750310107-5fef28a66643"},
    {"slug":"bed-rotting-self-care","title":"Bed Rotting: Self-Care or Self-Sabotage?","category":"Wellbeing","readMinutes":7,"date":"2026-05-23","excerpt":"Lying in bed all day can be the rest you need or the thing keeping you stuck. Here's how to tell, and how to do it right.","image":"https://images.unsplash.com/photo-1541781774459-bb2af2f05b55"},
    {"slug":"why-personality-quizzes-are-addictive","title":"Why Personality Quizzes Are So Addictive (The Psychology)","category":"Psychology","readMinutes":7,"date":"2026-05-21","excerpt":"Dopamine, identity and the irresistible pull of 'this is so me'. Here's the real science behind why you can't stop tapping.","image":"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"},
    {"slug":"what-your-quiz-results-say-about-dating","title":"What Your Quiz Results Say About Your Dating Life","category":"Love","readMinutes":8,"date":"2026-05-18","excerpt":"Attachment styles, love languages and red flags - how the quizzes you love secretly mirror how you date.","image":"https://images.unsplash.com/photo-1519681393784-d120267933ba"},
    {"slug":"100-ways-to-cure-boredom","title":"100 Genius Ways to Cure Boredom Right Now","category":"Lifestyle","readMinutes":11,"date":"2026-05-15","excerpt":"The ultimate no-fluff list of things to do when you're bored - indoors, outdoors, alone, broke or with friends.","image":"https://images.unsplash.com/photo-1496843916299-590492c751f4"},
    {"slug":"psychology-of-procrastination","title":"The Psychology Behind Procrastination (And How to Beat It)","category":"Psychology","readMinutes":9,"date":"2026-05-11","excerpt":"Procrastination isn't laziness - it's emotional regulation gone sideways. Here's what's really happening and how to fix it.","image":"https://images.unsplash.com/photo-1616594039964-ae9021a400a0"},
    {"slug":"science-of-sharing-quiz-results","title":"The Science of Why We Love Sharing Quiz Results","category":"Psychology","readMinutes":7,"date":"2026-05-07","excerpt":"Why does getting 'The Hopeless Romantic' make you instantly screenshot it? A look at identity, status and the share button.","image":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7"},
    {"slug":"50-cheap-things-to-do-when-broke","title":"50 Cheap Things To Do When You're Bored and Broke","category":"Lifestyle","readMinutes":10,"date":"2026-05-03","excerpt":"Empty wallet, restless brain? Fifty genuinely fun, genuinely free ways to beat boredom without spending a cent.","image":"https://images.unsplash.com/photo-1526401485004-46910ecc8e51"},
    {"slug":"beat-boredom-at-work","title":"How to Beat Boredom at Work Without Getting Caught","category":"Lifestyle","readMinutes":6,"date":"2026-04-29","excerpt":"Stuck at a desk and slowly losing it? Sneaky, productive and genuinely refreshing ways to survive the dull stretch.","image":"https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"},
    {"slug":"mental-health-benefits-of-boredom","title":"The Surprising Mental Health Benefits of Being Bored","category":"Wellbeing","readMinutes":8,"date":"2026-04-24","excerpt":"Boredom feels like the enemy, but your brain might actually need it. The science of doing nothing - and why it works.","image":"https://images.unsplash.com/photo-1567016432779-094069958ea5"},
    {"slug":"are-you-a-main-character","title":"Are You a Main Character? The Rise of Internet Personality Tropes","category":"Internet","readMinutes":7,"date":"2026-04-19","excerpt":"Main character, NPC, golden retriever boyfriend - how the internet turned personality into a meme, and why we love it.","image":"https://images.unsplash.com/photo-1455390582262-044cdead277a"},
    {"slug":"30-day-boredom-busting-challenge","title":"The 30-Day Boredom-Busting Challenge","category":"Lifestyle","readMinutes":9,"date":"2026-04-14","excerpt":"One tiny, fun, brain-tickling task a day for a month. A full 30-day plan to never have a boring day again.","image":"https://images.unsplash.com/photo-1549465220-1a8b9238cd48"},
  ],

  /* ===== VIBE CHECK (mood machine) ======================================
     Each mood maps to a recommended quiz id, activity id, blog slug + a
     wildcard line. "grad" is the mood card / result accent gradient. */
  vibes: [
    { key: "lazy",        label: "Lazy & Chill",        emoji: "😴", grad: "from-sky-400 to-indigo-500",
      title: "Ah, we see you're in Lazy Gremlin Mode", desc: "No notes. The couch is calling, the snacks are within reach, and ambition can wait until tomorrow. Let's lean all the way in.",
      quiz: "comfort-foods-attachment-style", activity: "a1", blog: "mental-health-benefits-of-boredom",
      wildcard: "Build the ultimate snack pile, put on a comfort show, and refuse to move for three hours. This is self-care." },
    { key: "energetic",   label: "Hyper & Energetic",   emoji: "⚡", grad: "from-amber-400 to-orange-500",
      title: "Certified Main Character Energy", desc: "You've got electricity in your veins and nowhere to put it. Let's burn some of that off before you reorganise the whole house.",
      quiz: "night-out-party-personality", activity: "a12", blog: "100-ways-to-cure-boredom",
      wildcard: "Put on one loud song and do the most unhinged dance of your life. Nobody is watching. Go." },
    { key: "romantic",    label: "Romantic",            emoji: "💘", grad: "from-rose-400 to-pink-500",
      title: "Someone's feeling soft today", desc: "Your heart is doing the most. Whether it's a crush, a partner, or just the idea of love, we're leaning into the butterflies.",
      quiz: "perfect-date-love-language", activity: "a51", blog: "what-your-quiz-results-say-about-dating",
      wildcard: "Make a playlist of every song that reminds you of them. Yes, them. You know who." },
    { key: "chaotic",     label: "Chaotic / Unhinged",  emoji: "🔥", grad: "from-fuchsia-500 to-red-500",
      title: "Goblin mode: fully activated", desc: "Logic has left the building. You're running on pure impulse and we respect it. Let's channel the chaos into something fun (and mostly harmless).",
      quiz: "build-burger-red-flag", activity: "a45", blog: "are-you-a-main-character",
      wildcard: "Rearrange your entire room at the least convenient time possible. The vibe demands it." },
    { key: "creative",    label: "Creative",            emoji: "🎨", grad: "from-violet-500 to-fuchsia-500",
      title: "Your brain is buzzing with ideas", desc: "The inspiration is flowing and your hands want a job. Let's make something, even if it's a beautiful mess.",
      quiz: "spend-10k-hidden-talent", activity: "a9", blog: "why-personality-quizzes-are-addictive",
      wildcard: "Write the first dramatic sentence of a novel you'll probably never finish. Make it iconic." },
    { key: "sad",         label: "Sad / Melancholic",   emoji: "🌧️", grad: "from-slate-500 to-blue-600",
      title: "It's a soft, tender kind of day", desc: "Feelings are big right now, and that's allowed. Let's be gentle with you and find something comforting and low-pressure.",
      quiz: "build-playlist-emotional-age", activity: "a8", blog: "mental-health-benefits-of-boredom",
      wildcard: "Text one person 'thinking of you' with zero context. Watch it quietly make both your days." },
    { key: "stressed",    label: "Stressed",            emoji: "😮‍💨", grad: "from-teal-400 to-emerald-500",
      title: "Okay. Deep breath. We've got you.", desc: "Your brain has 47 tabs open and they're all on fire. Let's close a few. Something calming, grounding, and genuinely doable.",
      quiz: "dream-life-aesthetic", activity: "a15", blog: "psychology-of-procrastination",
      wildcard: "Set a 20-minute timer, tidy one small space to a hype playlist, then stop. Instant sense of control." },
    { key: "curious",     label: "Curious",             emoji: "🧐", grad: "from-cyan-400 to-blue-500",
      title: "Ooh, a curious little mind today", desc: "You want to learn something, figure something out, or just feed the part of your brain that loves a good 'huh, interesting.'",
      quiz: "general-knowledge-gauntlet", activity: "a49", blog: "science-of-sharing-quiz-results",
      wildcard: "Open a random Wikipedia article and let yourself fall all the way down the rabbit hole." },
    { key: "bored",       label: "Bored Out of My Mind", emoji: "🥱", grad: "from-indigo-500 to-violet-500",
      title: "The classic. Let's fix this immediately.", desc: "Pure, soul-crushing boredom. The good news: this is literally our whole personality. Consider it handled.",
      quiz: "which-decade-belong", activity: "a7", blog: "100-ways-to-cure-boredom",
      wildcard: "Smash the random task button until something actually sounds fun. It always works eventually." },
    { key: "existential", label: "Existential",         emoji: "🌌", grad: "from-purple-600 to-indigo-700",
      title: "Staring into the void today, huh?", desc: "Big thoughts, small human. When the universe feels a little too vast, let's make it cosy with something meaningful but light.",
      quiz: "are-you-actually-an-adult", activity: "a5", blog: "30-day-boredom-busting-challenge",
      wildcard: "Write down three things you want to do before you turn 30. Then go do the easiest one today." }
  ],

  /* ===== DAILY DARE + STORY MODE ========================================= */
  /* Filled by assets/dares.js and assets/stories.js (loaded after this file).
     dares: one fresh challenge per day, picked deterministically by date.
     stories: choose-your-own-adventure graphs (see STORY_TEMPLATE below). */
  dares: [],
  stories: [],

  /* ===== QUIZZES ========================================================= */
  /* Authored below via BT_DATA.quizzes.push(...) - see the additional script
     blocks loaded after this file. Starts empty; content scripts fill it. */
  quizzes: []
};

/* ==========================================================================
   TEMPLATES - copy/paste to add your own content (kept as JS objects so an
   AI can generate them and you can paste straight in).
   ========================================================================== */

/* eslint-disable no-unused-vars */
var QUIZ_TEMPLATE = {
  id: "unique-quiz-id",                 // url-safe, unique
  slug: "unique-quiz-id",               // (optional) same as id is fine
  title: "Build a ___ and We'll Guess Your ___",
  category: "personality",              // must match a categories[].id
  type: "personality",                  // "personality" | "trivia"
  image: "https://images.unsplash.com/photo-...",
  description: "One-line hook shown on cards (keep it punchy).",
  tagline: "A slightly longer, funnier hook for the quiz intro page.",
  estMinutes: 4,
  takenCount: 12000,                    // fake social proof
  questions: [
    {
      q: "Pick a question here.",
      image: "",                        // optional per-question image
      options: [
        // PERSONALITY: give each option points toward result keys
        { text: "Option A", points: { resultKeyOne: 2, resultKeyTwo: 1 } },
        { text: "Option B", points: { resultKeyTwo: 2 } }
        // TRIVIA instead: { text: "Paris", correct: true }, { text: "Rome", correct: false }
      ]
    }
    // ...add 25-40 questions
  ],
  results: [
    // PERSONALITY: key must match the points keys above
    { key: "resultKeyOne", title: "The Result Name", emoji: "✨", image: "https://images.unsplash.com/photo-...", description: "A fun, meme-worthy paragraph describing this result.", share: "A short punchy line people will want to screenshot." }
    // TRIVIA instead: use minPct bands, e.g.
    // { key: "genius", minPct: 80, title: "Certified Genius", emoji: "🧠", image: "...", description: "...", share: "..." }
  ]
};

var ACTIVITY_TEMPLATE = {
  id: "unique-activity-id",
  title: "Do the thing",
  description: "A vivid one or two sentence description of the activity.",
  difficulty: "Easy",                   // "Easy" | "Medium" | "Hard"
  time: "15 min",
  moods: ["Indoor", "Creative"],        // reuse existing mood labels
  image: "https://images.unsplash.com/photo-..."
};

var BLOG_TEMPLATE = {
  slug: "my-new-post",                  // create blog/my-new-post.html with the same slug
  title: "My New Post Title",
  category: "Lifestyle",
  readMinutes: 7,
  date: "2026-06-01",
  excerpt: "A one-line summary used on blog cards and search.",
  image: "https://images.unsplash.com/photo-..."
};

/* DARE_TEMPLATE - add to assets/dares.js. Keep id order stable: the "today"
   pick and the saved-completed list both key off it. */
var DARE_TEMPLATE = {
  id: "d31",                            // url-safe, unique, append to the end
  emoji: "🎯",
  title: "The dare in one punchy line.",
  description: "A sentence or two of friendly instructions and why it is fun.",
  difficulty: "Easy",                   // "Easy" | "Medium" | "Spicy" | "Legendary"
  time: "5 min",
  tags: ["Solo", "Quick"]               // short category tags
};

/* STORY_TEMPLATE - add to assets/stories.js. A node is an ENDING iff it has
   `ending` and no `choices`. `start` must be a key in `nodes`, and every
   choice `to` must point at an existing node. */
var STORY_TEMPLATE = {
  id: "s6",
  title: "Your Story Title",
  blurb: "A one-line hook for the hub card.",
  // Images: keyword-matched LoremFlickr photos (so the picture fits the scene).
  // assets/stories.js has an IMG() helper that builds these from a keyword pool.
  image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  accent: "from-indigo-500 to-violet-500", // hub + hero gradient
  start: "n0",
  nodes: {
    n0: { text: "Set the scene.", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      choices: [ { label: "Do this", to: "n1" }, { label: "Do that", to: "n2" } ] },
    n1: { text: "A branch.", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      choices: [ { label: "Left", to: "end_a" }, { label: "Right", to: "end_b" } ] },
    end_a: { text: "How it wraps up.", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
      ending: { title: "The Ending Name", emoji: "🌟", description: "A fun paragraph.", share: "A screenshot-worthy line." } }
  }
};
/* eslint-enable no-unused-vars */
