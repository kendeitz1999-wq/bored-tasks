/* dares.js - the Daily Dare pool. One dare is featured each day, picked
   deterministically from the date in app.js (dareOfDay), so everyone sees the
   same one and it refreshes at local midnight.

   These are DARES, not chill tasks - truth-or-dare energy: bold, social, a
   little unhinged, the kind of thing you would screenshot and send to the group
   chat. Still clean: no profanity, NSFW, alcohol, drugs, or anything unsafe or
   mean. Difficulty escalates the nerve required: Easy (silly) -> Medium (a
   little brave) -> Spicy (real social risk) -> Legendary (full send).

   Keep `id` order stable - it seeds the daily pick and the saved "completed"
   list (bt_dares_done). Append new dares at the end. */
(function () {
  if (!window.BT_DATA) return;
  BT_DATA.dares = (BT_DATA.dares || []).concat([

    /* ----- Easy: silly, low stakes, mostly solo nerve ----- */
    { id: "d1", emoji: "🎤", title: "Sing your next text as a voice note", description: "Instead of typing your next reply, sing it out loud as a voice note and hit send. No deleting, no second take.", difficulty: "Easy", time: "2 min", tags: ["Solo", "Bold"] },
    { id: "d2", emoji: "🤳", title: "Make your worst photo your profile pic", description: "Set the most cursed, unflattering photo on your phone as your profile picture for the next hour. Commit to the chaos.", difficulty: "Easy", time: "1 hr", tags: ["Online", "Chaotic"] },
    { id: "d3", emoji: "😎", title: "Wear sunglasses indoors for an hour", description: "Put your shades on inside and wear them like a celebrity dodging the paparazzi. Full main character energy, no explanation given.", difficulty: "Easy", time: "1 hr", tags: ["Solo", "Bold"] },
    { id: "d4", emoji: "💬", title: "Text a friend just the word 'confess'", description: "Send one friend the single word 'confess' and absolutely nothing else. Watch how fast they panic and start spiraling.", difficulty: "Easy", time: "2 min", tags: ["Prank", "Social"] },
    { id: "d5", emoji: "🪞", title: "Give yourself a hype speech in the mirror", description: "Stand in front of the mirror and deliver a genuinely over the top pep talk to yourself, out loud, like a coach at halftime.", difficulty: "Easy", time: "3 min", tags: ["Solo", "Confidence"] },
    { id: "d6", emoji: "🕺", title: "Do a dance move every time you stand up", description: "For the rest of the day you owe the universe a little dance move every single time you get up. No skipping, no exceptions.", difficulty: "Easy", time: "All day", tags: ["Solo", "Chaotic"] },
    { id: "d7", emoji: "📢", title: "Narrate your life like a nature doc", description: "For the next 10 minutes narrate everything you do out loud in a documentary voice. 'Here we observe the human, locating a snack.'", difficulty: "Easy", time: "10 min", tags: ["Solo", "Chaotic"] },
    { id: "d8", emoji: "🍿", title: "Eat your next snack with zero hands", description: "Whatever you eat next, you have to do it completely hands free. Dignity optional, commitment to the bit absolutely mandatory.", difficulty: "Easy", time: "10 min", tags: ["Solo", "Chaotic"] },

    /* ----- Medium: a little brave, low-key social risk ----- */
    { id: "d9", emoji: "📸", title: "Post the no filter selfie right now", description: "One photo, zero edits, straight to your story this second. Raw and unbothered is the entire assignment.", difficulty: "Medium", time: "5 min", tags: ["Online", "Bold"] },
    { id: "d10", emoji: "🔥", title: "Send your crush a fire emoji, nothing else", description: "Send the person you like a single flame emoji with zero context, then put the phone face down and let it cook.", difficulty: "Medium", time: "2 min", tags: ["Online", "Brave"] },
    { id: "d11", emoji: "📲", title: "DM a mutual you have never spoken to", description: "Slide into the DMs of someone you follow but have somehow never messaged, and start an actual real conversation.", difficulty: "Medium", time: "10 min", tags: ["Online", "Brave"] },
    { id: "d12", emoji: "🎶", title: "Reply only in song lyrics for one chat", description: "For your next text conversation, every single reply has to be a line from a song. Do not break character once.", difficulty: "Medium", time: "15 min", tags: ["Social", "Chaotic"] },
    { id: "d13", emoji: "👶", title: "Recreate a cringe throwback and post it", description: "Dig up an old photo of yourself, recreate the exact pose today, and post the two side by side for everyone to see.", difficulty: "Medium", time: "15 min", tags: ["Online", "Cringe"] },
    { id: "d14", emoji: "🎭", title: "Talk in an accent for a whole convo", description: "Pick an accent and fully commit through your next real conversation. Whatever happens, you are not allowed to break it.", difficulty: "Medium", time: "10 min", tags: ["IRL", "Chaotic"] },
    { id: "d15", emoji: "🃏", title: "Text a friend 'I'm outside' when you are not", description: "Hit a friend with a casual 'I'm outside' even though you are very much not, then keep a completely straight face.", difficulty: "Medium", time: "5 min", tags: ["Prank", "Social"] },
    { id: "d16", emoji: "📊", title: "Post a chaotic, oddly specific poll", description: "Put a ridiculous poll on your story, like 'do my eyebrows look even today,' and then actually obey the winning answer.", difficulty: "Medium", time: "15 min", tags: ["Online", "Bold"] },

    /* ----- Spicy: real social risk, strangers involved ----- */
    { id: "d17", emoji: "👋", title: "Compliment a total stranger out loud", description: "Give one genuine, specific compliment to a stranger today, then keep walking like the icon you are.", difficulty: "Spicy", time: "1 min", tags: ["IRL", "Brave"] },
    { id: "d18", emoji: "🙋", title: "Get a stranger to take your photoshoot", description: "Ask someone in public to take a full photoshoot of you. Give direction. Demand at least three different angles.", difficulty: "Spicy", time: "5 min", tags: ["IRL", "Bold"] },
    { id: "d19", emoji: "💌", title: "DM a creator you love and tell them why", description: "Message someone whose content you genuinely love and tell them exactly what you appreciate. No expectations, just nerve.", difficulty: "Spicy", time: "5 min", tags: ["Online", "Brave"] },
    { id: "d20", emoji: "🎙️", title: "Sing out loud where strangers can hear", description: "Belt one full chorus at real volume somewhere at least one stranger will definitely hear you. Stage fright is temporary.", difficulty: "Spicy", time: "3 min", tags: ["IRL", "Bold"] },
    { id: "d21", emoji: "🤝", title: "Get high fives from three strangers", description: "Collect three genuine high fives from three different strangers today. Leave each one slightly more confused and happy.", difficulty: "Spicy", time: "Varies", tags: ["IRL", "Brave"] },
    { id: "d22", emoji: "☕", title: "Ask for a free upgrade or a discount", description: "Next time you buy something, confidently and politely ask for a freebie, an upgrade, or a discount. Worst case they say no.", difficulty: "Spicy", time: "Mealtime", tags: ["IRL", "Confidence"] },
    { id: "d23", emoji: "💃", title: "Bust a 10 second dance in public", description: "Headphones in, somewhere public-ish, give a fully committed 10 seconds of dancing. The witnesses are the entire point.", difficulty: "Spicy", time: "2 min", tags: ["IRL", "Bold"] },
    { id: "d24", emoji: "📞", title: "Call a friend, speak only in questions", description: "Ring a friend and hold a whole conversation using nothing but questions. First one to make a statement loses.", difficulty: "Spicy", time: "10 min", tags: ["Social", "Chaotic"] },

    /* ----- Legendary: full send, maximum nerve ----- */
    { id: "d25", emoji: "🎬", title: "Film a TikTok dance in public and post it", description: "Pick a trending dance, film the entire thing somewhere public, and actually post it. Deleting it later is not an option.", difficulty: "Legendary", time: "20 min", tags: ["Public", "Bold"] },
    { id: "d26", emoji: "🛍️", title: "Strut a public aisle like a runway", description: "Turn a shop aisle or a long hallway into a catwalk and strut it like it is fashion week. End on a dramatic pose.", difficulty: "Legendary", time: "2 min", tags: ["IRL", "Bold"] },
    { id: "d27", emoji: "📣", title: "Post a harmless but embarrassing confession", description: "Put one genuinely cringe but totally harmless confession on your story for everyone to see, and own it completely.", difficulty: "Legendary", time: "10 min", tags: ["Online", "Brave"] },
    { id: "d28", emoji: "🔟", title: "Ask a stranger to rate your outfit", description: "Walk up to someone in public and confidently ask them to rate your outfit out of 10. Take the score like a champion.", difficulty: "Legendary", time: "2 min", tags: ["IRL", "Brave"] },
    { id: "d29", emoji: "💐", title: "Pull off a full rom com grand gesture", description: "Do one over the top, romantic comedy style gesture for someone you appreciate, in front of other people. Go embarrassingly big.", difficulty: "Legendary", time: "Varies", tags: ["IRL", "Bold"] },
    { id: "d30", emoji: "✅", title: "Say yes to the next 3 dares you are given", description: "For the rest of today, say an enthusiastic yes to the next three things anyone invites, suggests, or dares you to do.", difficulty: "Legendary", time: "All day", tags: ["Social", "Brave"] }

  ]);
})();
