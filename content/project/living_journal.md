---
Title: Data Viz in Hugo
icons: ["feather", "book", "server-cog", "cloud"]
date: 2023-01-01
summary: Searching for a better way to write data-driven articles for the web.
---

This is a collection of small projects which attempt to make social scientific writing easier.
It consists of a couple of distinct parts.

1. The Visualization Library
    - A library of html snippets that can be chained together to make visualizations from data, right in Markdown!
    - By utilizing DOM properties and Hugo shortcodes we can construct a functional language for data manipulation.
    - Allows authors to draw beautiful, performant charts which properly inherit the site's overall style, unlike plugins like observable or plotly which often appear jarring.

2. The Watts Lab Data Access Program
    - A system of AWS hooks which can be queries by the public using a Domain Specific, lisp-like language.
    - Allows authors to make interesting visualizations on privately held data.
    - Allows first class access to open projects like the [News Observatory.]({{< ref "project/news_observatory.md" >}})
