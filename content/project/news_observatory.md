---
Title: News Observatory
icons: ["newspaper", "trash-2", "flame"]
date: 2022-08-15
summary: An automated News-Media watchdog for the modern age!
---

Using modern cloud computing techniques and other data scraping and sniffing systems, we can monitor the mainstream news' output.
Prior work has shown that despite the panic about "Fake News", mainstream media may actually have a larger overall effect on political polarization.
Through methods like selection and framing bias, mainstream, traditional news sources are creating echo chambers much stronger than the naturally occurring ones on social media.
By creating a large dataset of past news articles' text, headlines, and apparent ranking on the home page, we can infer the mainstream media's agenda at an arbitrary point in time.

The news observatory consists of two parts.

1. Backward
    - Through a partnership with the Internet Archive, we have catalogued, parsed, and recorded the front page news articles from every major news source in the United States, at one-hour intervals, since 2015.
    - We have available samples going back to 2007, although not enough recordings exist to parse to a resolution of 1 hour.

2. Forward
    - Every US business hour going forward, we record desktop and mobile screenshots of every major news source and many minor and local news sources in the country.
    - These screenshots are later matched up to Internet Archive entries to record article text and other metadata.

Even in it's half-finished state, data from the news observatory has contributed to multiple research projects at the University of Pennsylvania Computational Social Science lab and Microsoft Research, NYC.
