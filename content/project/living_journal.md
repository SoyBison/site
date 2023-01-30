---
Title: The Living Journal
icons: ["feather", "book", "server-cog", "cloud"]
date: 2023-01-01
summary: The Living Journal is a new way for social scientists to communicate findings with the public.
---

The Living Journal is an attempt to make it easier for scientists to communicate with the public. 
It consists of a couple of distinct parts.

1. The Living Journal Website
    - This is a repository for all of the entries into the Living Journal.
    - Dashboards: Constantly updating, visually appealing representations of social scientific data.
    - Publications: Longer form, heavily edited and carefully crafted web-first scientific writing. Includes a DOI.
    - Blog: Shorter, non-peer reviewed communications with the public, not unlike the practice of Development Logs.

2. The Living Journal Visualization Library
    - A library of html snippets that can be chained together to make visualizations from data, right in markdown!
    - By utilizing DOM properties and Hugo shortcodes we can construct a functional language for data manipulation.
    - Allows authors to draw beautiful, performant charts which properly inherit the site's overall style, unlike plugins like observable or plotly which often appear jarring.

3. The Watts Lab Data Access Program
    - A system of AWS hooks which can be queries by the public using a Domain Specific, lisp-like language.
    - Allows authors to make interesting visualizations on privately held data.
    - Allows first class access to open projects like the [News Observatory.]({{< ref "project/news_observatory.md" >}})
