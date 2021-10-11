---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Video Game Economies"
subtitle: "How do game designers make the aspects of games that are neither seen nor heard?"
summary: ""
authors: []
tags: []
categories: []
date: 2021-06-27 
featured: false
draft: true 

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Video games get bigger every year. Designers are stuffing more and more into these games to stimulate our senses. Rightfully, most of the attention is pointed at the visuo-spatial part of the experience, and the auditory part of the experience. These are the pieces which are close to the player, and make up the most of the content. But it's not all the game is, there is also a feeling that comes from the mechanics, which is the less well understood part of games development. Unlike the art style which is seen and the sound design which is heard, we don't really have a word for the sensation of mechanics. The best we can do is _feel_ these things.

The mechanics of a game can be generally split into two parts. The structure, and some sort of tuning. Imagine we have a fictional game, say it's an action hack-and-slash style game, and we'll call it _Snoot Quest_. Let's examine the __Primary Gameplay Loop__ or sometimes __Core Gameplay Loop__[^1]. The primary loop is thee thing that the player does in any part of the game, doing primary loop actions will be the majority of the time the player spends. For our hack-and-slasher, this is the combat. The structure of this might be: the __Player Character__, an anthropomorphic weasel named "Snoot", has a sword/axe/mace and they swing it, and it hits things, ideally bad guys. For our game, this is the structure of the primary loop.

Now let's examine and compare two games that have a similar primary gameplay loop to _Snoot Quest_. Look at _Dark Souls_ in contrast with _Monster Hunter: World_. They both consist largely of a player character running around and hitting people and things with varying blunt and sharp instruments. But, they have very different feelings to the combat. This different feeling comes from the tuning. How long do swings take to wind up, how much damage do they do, how much health does the player character have, etc. The tuning in _Dark Souls_ is designed to make combat encounters feel dangerous, but also makes most opponents fall easily, in a few hits. _Monster Hunter_ takes the opposing tact, enemies take a long time to fell, and combat feels more like a marathon than a sprint.

We can also imagine this in the case of the __Secondary Gameplay Loop__. This is usually used to describe the more high-level part of the game. These are the mechanics that control how the player character is outfitted with equipment, how they increase in power, how they traverse through the world, and how they are assigned new tasks by the game. This is where the video game economy falls. It's role is obviously dependent on genre, a game like _Victoria III_ will have the economy be a much larger part of the game than a game like _The Witcher 3: Wild Hunt_ or _The Elder Scrolls V: Skyrim_. But that's not to say it isn't important for these open world RPGs. 

# RPGs

Games that are furthest away from society-level topics will have no economic simulation aspect. Games where the player never buys any items, for example. To an extent though, the economic simulation is just a way to decide how expensive items should be. The simplest form would be fiat. Cases where the developer has decided what the prices will be. This is not algorithmic, and is determined by the designer's best bet. The prices may change over the course of testing as it becomes apparent that an item's usefulness doesn't match the price (or maybe they'll change parameters of the item, if that's possible). The best signifier that a developer has done this is that the prices will end in a zero or a five. This is the choice that developers often take for games that don't need an algorithmic way to determine prices: games like _Hollow Knight_, _Hades_, _Sekiro: Shadows Die Twice_. 

Then we have games that use algorithms to determine prices. Consider _The Elder Scrolls V: Skyrim_. Prices paid in gold are determined by the player character's barter ability score, and the quality of equipment/consumables, combined with a base price which was determined by a developer. There are also trade-able items in _Skyrim_, which do not have a quality score, they have a base price, which is then modified based on "economic conditions"

<!-- TODO: Figure out what the economic conditions are in skyrim, or if that was just hearsay -->

This is *technically* algorithmic, but it still feels pretty fiat. This is a little bit of a spectrum, of course, any strategy where prices aren't __hard coded__, written directly into the game code in some way, 
is algorithmic, but _Skyrim_ still has base prices which are hard coded. For a more complicated story, see _The Witcher 3: Wild Hunt_. _The Witcher_'s price algorithm is one of my personal favorites. A mechanics designer thought of the idea of using data science to determine the prices of items. As the story goes, this was one of the last parts of the game to slot into place. The game was largely done, but they were still having trouble figuring out a good way to price the items in the game, the parameters of which were generated basically at random. In the end, they would load up the game, create two __Non-Player Characters__, and equip them with random items. 

<!-- TODO: Find this guy's name/title. -->

[^1]: For this discussion, I'm going to bold the first time I use a jargon word. This is to differentiate between concepts I'm making up, and concepts that are accepted by the community.
