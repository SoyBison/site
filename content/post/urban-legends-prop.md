---
author: Coen D. Needell
title: Research Proposal on Urban Legends and the Internet
tags: ["Digital Archaeology", "Cultural Patterns", 'Urban Legends']
draft: false
math: true
date: 2020-04-09T00:56:04-05:00
---

# Research Proposal on Urban Legends and the Internet

## Introduction

"Urban Legends" is a genre we often confer to fictional and semi-fictional stories that circulate through modern communities. Generally this describes stories that few people truly believe, but are still told and retold time and time again. These stories often have common features, they leverage the unintuitiveness of modern life, a sense of distant credibility ("This happened to a friend of a friend"), and in some cases a sociopolitical call-to-action. Prototypical Urban Legends include the story about a man meeting a woman in a hotel bar and waking up the next day missing a kidney in a bathtub full of ice, or the story where your uncle's friend went down into the sewers and encountered a bask of exotic crocodiles that had been flushed down by irresponsible pet owners. 

Despite their ubiquity, there is a relatively small amount of academic research on these stories. Most of the sources I've been able to find about them are either highly biased toward interpreting urban legends in the same way that one would interpret ancient mythology, or are written in a dismissive tone, treating these stories as unworthy of study. What books and articles I've found that aren't dismissive have been from the last five years or so. In short, this seems like an emerging area of research. The research I've found has been approaching questions of the genre: "what does it mean?". I'd like to instead ask about the dynamics of urban legends, why do some spread farther than others? Can we identify internal features that are associated with 'success' in this context? Or is it all about the substrate that they spread through? What about some combination of both?

## Possible Methodology

### Data Acquisition

This might be difficult. A lot of the internet early on was on Usenet, which is fairly well preserved by Google at this point, but this excludes the millions of private email chains that gave us hoaxes like the Neiman Marcus Cookie Recipe[^1], as well as a lot of the more conspiracy-theory leaning urban legends.

Another option is to utilize some of the wonderful digital archeology resources out there, like the internet archive as well as smaller servers that have been built to store troves of old forum posts and discussions.

### Data Analysis

The analysis of this data will have to be split into two stages. First, an identification stage. I need to get some way to decompose instances of the urban legend into core components. There are a number of Natural Language Processing techniques that are built specifically for this. Part of the challenge will be identifying both the type-instances of these stories, and then studying how the token-instances differ over time, and how that relates to the environment in which they're observed. For example, we might expect the _Slenderman_ story to adopt different characteristics on the sub-reddit "/r/nosleep", a forum of scary stories, than if it instantiates on a forum focused on forest management.

There's some concern about how to construct an actual network to analyze. While it's true that on the internet a lot of people use the same handle across different platforms, this isn't universal. However, it is a fairly good assumption to say that two users having the same handle is _sufficient_ to say that they're the same person. Since the urban legend spread is mostly going to be handled by the most active users, the odds of two highly active users on different platforms having the same handle is low. Another option is to consider the posts that actually tell the urban legend, and identify posts that just make reference to the legend. Most of these stories have keywords that would serve as a sign to the reader that represents the legendary story as a whole, identifying those keywords using the story itself could be used to better identify network propagation.

Identifying the urban legends on-the-whole shouldn't be too difficult. I can get "canonical" versions of these stories off of sites like Snopes.com or other sites that are devoted to compiling these sort of stories. www.creepypasta.org, especially archived, early versions of the site would be a good place to get canonical versions of stories like "The Russian Sleep Experiment"[^2] or "Suicidemouse.avi"[^3].

The second stage of analysis will be focused on dynamics. We need to see how the features that we identified in the first stage relate to how the story spreads, it's level of "success" and how it mutates over time. This will likely take the form of some sort of tensor modeling. We can model an online community as a set of individual neurons, and see how the network mutates the story as it passes through the community, and between communities.

## Possible Challenges

The identification stage will be relatively difficult. I will likely need to write bespoke algorithms and utilize unconventional feature extraction methods. Luckily, the dynamics stage is better off. Network analysis and contagion theory are well developed, and have a lot of packages available for use to speed up that process. I'll also need some sort of algorithm that goes through the posts and identifies keywords that link a reference post to a source post.


## Annotated Bibliography
---
Frank, Russell, author. _Newslore: Contemporary Folklore on the Internet_. University Press of Mississippi, 2011. EBSCOhost, doi:10.14325/mississippi/9781604739282.001.0001.

- This will probably be fairly tangential to my research. He defines a subset of internet folklore that's built around "important" topics, the news, and so-on. This is definitely a subset of folklore that's worth discussion, especially when this was written in 2011, well before these stories were rebranded by the media as "fake news".

_Slender Man Is Coming : Creepypasta and Contemporary Legends on the Internet_. 2018. EBSCOhost, search.ebscohost.com/login.aspx?direct=true&db=edsbas&AN=edsbas.2F8D4139&site=eds-live&scope=site.

- I'm in the process of getting ahold of this, but based off of the abstract and title, this is probably going to form the bulk of by background. It is, however, a focus on the mythological analysis of these stories, but that may inform a memetic model of urban legend dynamics.
 
Dawkins, Richard. _The Selfish Gene_. New ed. Oxford ; New York: Oxford University Press, 1989.

- If I'm going to consider memetics I have to cite this. A re-read is probably in order. Even though it isn't an academic text, it is the origin of this conception of ideas spreading in a darwinian way.

Kronfeldner, Maria E. _Darwinian Creativity and Memetics_, 2014. http://proxy.uqtr.ca/login.cgi?action=login&u=uqtr&db=ebsco&ezurl=http://search.ebscohost.com/login.aspx?direct=true&scope=site&db=nlebk&AN=846618.

- This is a more modern and academic treatment of a Darwinian model of ideas. Ideally my model will lean more towards this than Dawkins' original.


“Internet Archive: Digital Library of Free & Borrowable Books, Movies, Music & Wayback Machine.” Accessed April 10, 2020. https://archive.org/.

- This will be used as a primary source. The Wayback machine has stored copies of major forums going back as far as 1996. Big forums will be covered more completely, and the stored version of the websites can be used to leverage data even further back in time, using the site's own stored data. Archive.org also has stored a large amount of posts on Usenet. Usenet was a sort of early social network built around constructing forums and IRC chat. It operated somewhere between Reddit, Email, RSS, and an actual Chatroom. They also include IRC logs, which could be a huge asset, but the IRC logs that are stored on archive.org don't even come close to the total amount of discussion that ocurred on public IRC chats during the peak of their usage.

### Footnotes:

[^1]: A woman goes to Neiman Marcus and eats some cookies, she asks the waitress for the recipe for said cookies. The waitress cites a high price ($250). I tend to interpret this story as a corporate satire. The email chains usually are accompanied by the alleged recipe. Neiman Marcus has never sold cookies that even remotely resemble the recipe. 
Ostensibly, the secret is to subtly flavor the dough with chocolate in a similar way to brownie batter. I'm not a fan. 

[^2]: A story about human experimentation during the cold war. It's not pleasant, however it is so over-the-top that it really highlights the feature that nobody really believes these urban legends are real, but they still get passed around as if they were. I interpret this as anti-russian anxieties coming through.

[^3]: Supposedly there was a Mickey Mouse Short that got locked in disney's vault for causing a couple suicides. Much like [^2], it has some anti-russian propaganda mixed in for good measure, but with less historical validity. This one actually spawned a whole genre of creepy urban legends. The "lost episode" genre. This kind of horror even made its way into mainstream media, for example the first season of _Channel Zero_ is based off of this concept. As an aside, the idea of a "lost episode" existed for years before this, but nobody ever really did anything with the concept until the early 2000s. For example, there was once a television company, the DuMont Television Network, whose entire existence was before television was filmed. Every last image that was broadcast over DuMont's airwaves was destroyed, nothing remains but a slightly creepy jingle and a handful of episodes stored in the library of congress.
